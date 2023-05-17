---
title: 持久化之 AOF
date: 2021-12-11
category: Redis
tag:
 - Redis
---

## 1. AOF（Append Only File）

### 1.1 AOF 是什么

<span style="color:red">以**日志**的形式来记录每个写操作（增量保存）</span>，将 Redis 执行过的所有写指令记录下来（<span style="color:red">**读操作不会记录**</span>），<span style="color:red">**只许追加文件但不可以改写文件**</span>，Redis 启动之初会读取该文件重新构建数据，换言之，Redis 重启的话就根据日志文件的内容将写指令从前到后执行一次以完成数据的恢复工作

### 1.2 AOF 持久化流程

（1）客户端的请求写命令会被 append 追加到 AOF 缓冲区内

（2）AOF 缓冲区根据 AOF 持久化策略 [always, everysec, no]  将操作 sync 同步到磁盘的 AOF 文件中

（3）AOF 文件大小超过重写策略或手动重写时，会对 AOF 文件 rewrite 重写，压缩 AOF 文件容量

（4）Redis 服务重启时，会重新 load 加载 AOF 文件中的写操作达到数据恢复的目的

![image-20211122165808404](http://img.hl1015.top/blog/image-20211122165808404.png)

### 1.3 AOF 默认不开启

可以在 redis.conf 中配置文件名称，默认为 <span style="color:red">appendobly.aof</span>

AOF 文件的保存路径，同 RDB 的路径一致

### 1.4 AOF 和 RDB 同时开启，redis 听谁的？

AOF 和 RDB 同时开启，系统默认取 AOF 的数据（数据不会存在丢失）

### 1.5 AOF 启动/修复/恢复

- AOF 的备份机制和性能虽然和 RDB 不同，但是备份和恢复的操作同 RDB 一样，都是拷贝备份文件，需要恢复时再拷贝到 Redis 的工作目录下，启动系统即加载。
- 正常恢复
  - 修改默认的 appendonly no，改为 yes
  - 将有数据的 aof 文件复制一份保存到对应目录（查看目录：config get dir）
  - 恢复：重启 redis 然后重新加载
- 异常恢复
  - 修改默认的 appendonly no，改为 yes
  - 如遇到 <span style="color:red">**AOF 文件损坏**</span>，通过 /usr/local/bin/<span style="color:red">redis-check-aof --fix appendonly.aof</span> 进行恢复
  - 备份被写坏的 AOF 文件
  - 恢复：重启 redis，然后重新加载

### 1.6 AOF 同步频率设置

- **appendfsync always**：始终同步，每次 Redistribution的写操作都会立即记入日志

- **appendfsync everysec**：每秒同步，每秒记入日志一次，如果宕机，本秒的数据可能丢失

- **appendfsync no**：redis 不主动进行同步，把<span style="color:red">同步时机交给操作系统</span>

### 1.7 Rewrite 压缩

**（1）是什么**

AOF 采用文件追加方式，文件会越来越大，为避免出现此种情况，新增了重写机制，当 AOF 文件的大小超过所设定的阈值时，Redis 就会启动 AOF 文件的内容压缩，只保留可以恢复数据的最小指令集，可以使用命令 bgrewriteaof

**（2）重写原理【如何重写】**

AOF 文件持续增长而过大时，会 fork 出一条新进程来将文件重写（也是先写临时文件最后再 rename），<span style="color:red">redis 4.0 版本后的重写，实质上就是把 rdb 的快照，以二进制的形式附在新的 aof 头部，作为已有的历史数据，替换掉原来的流水账操作</span>。

no-appendfsync-on-rewrite：

- 如果 no-appendfsync-on-rewrite=yes，不写入 aof 文件只写入缓存，用户请求不会阻塞，但是这段时间如果宕机会丢失这段时间的缓存数据（降低数据安全性，提高性能）
- 如果 no-appendfsync-on-rewrite=no，还是会把数据往磁盘里刷，但是遇到重写操作，可能会发生阻塞（数据安全，但是性能降低）

触发机制，何时重写？

- Redis 会记录上次重写时的 AOF 文件大小，默认配置是当 AOF 文件大小是上次 rewrite 后大小的一倍且文件大于 64 M 时触发
- <span style="color:blue">重写虽然可以节约大量磁盘空间，减少恢复时间，但是每次重写还是有一定的负担的，因此设定 Redis 要满足一定条件才会进行重写</span>
  - auto-aof-rewrite-percetage：设置重写的基准值，文件达到 100% 时开始重写（文件是原来重写后文件的 2 倍时触发） 
  - auto-aof-rewrite-min-size：设置重写的基准值，最小文件 64 MB，达到这个值开始重写
    - 例如：文件达到 70 MB 开始重写，降到 50 MB，下次什么时候开始重写？100 MB
    - 系统载入时或者上次重写完毕时，Redis 会记录此时 AOF 大小，设为 base_size，如果 Redis 的 <span style="color:red">AOF 当前大小 >= base_size + base_size * 100%（默认）且当前大小 >= 64 MB（默认）</span>的情况下，Redis 会对 AOF 进行重写

**（3）重写流程**

- bgrewriteaof 触发重写，判断是否当前有 bgsave 或 bgrewriteaof 在运行，如果有，则等待该命令结束后再继续执行
- 主进程 fork 出子进程执行重写操作，保证主进程不会阻塞
- 子进程遍历 redis 内存中数据到临时文件，客户端的写请求同时写入 aof_buf 缓冲区和 aof_rewrite_buf 重写缓冲区保证原  AOF 文件完整以及新 AOF 文件生成期间的新的数据修改动作不会丢失
- ①子进程写完新的 AOF 文件后，向主进程发信号，父进程更新统计信息；②主进程把 aof_rewrite_buf 中的数据写入到新的 AOF 文件
- 使用新的 AOF 文件覆盖旧的 AOF 文件，完成 AOF 重写

![image-20211122230208026](http://img.hl1015.top/blog/image-20211122230208026.png)

### 1.8 优势

![image-20211123090449641](http://img.hl1015.top/blog/image-20211123090449641.png)

- 备份机制更稳健，丢失数据概率更低
- 可读的日志文本，通过操作 AOF 稳健，可以处理误操作

### 1.9 劣势

- 比起 RDB 占用更多的磁盘空间
- 恢复备份速度要慢
- 每次读写都同步的话，有一定的性能压力
- 存在个别 bug，造成不能恢复

### 1.10 小总结

- AOF 文件是一个只进行追加的日志文件
- Redis 可以在 AOF 文件体积变得过大时，自动地在后台对 AOF 进行重写
- AOF 文件有序地保存了对数据库执行的所有写入操作，这些写入操作以 Redis 协议的格式保存，因此 AOF 文件的内容非常容易被人读懂，对文件进行分析也很轻松
- 对于相同的数据集来说，AOF 文件的体积通常要大于 RDB 文件的体积
- 根据所使用的 fsync 策略，AOF 的速度可能会慢于 RDB

## 2. 总结（which one）

### 2.1 用哪个好

官方推荐两个都启用。

- 如果对数据不敏感，可以单独用 RDB
- 不建议单独用 AOF，因为可能会出现 bug
- 如果只是做纯内存缓存，可以都不用

### 2.2 官网建议

![image-20211123091822859](http://img.hl1015.top/blog/image-20211123091822859.png)

![image-20211123095519154](http://img.hl1015.top/blog/image-20211123095519154.png)

- RDB 持久化方式能够在指定的时间间隔对你的数据进行快照存储
- AOF 持久化方式记录每次对服务器的写操作，当服务器重启的时候会重新执行这些命令来恢复原始的数据，AOF 命令以 Redis 协议追加保存每次写的操作到文件末尾，Redis 还能对 AOF 文件进行后台重写，使得 AOF 文件的体积不至于过大
- 只做缓存：如果你只希望你的数据在服务器运行的时候存在，你也可以不适用任何持久化方式
- 同时开启两种持久化方式，在这种情况下，当 Redis 重启的时候会优先载入 AOF 文件来恢复原始的数据，因为在通常情况下 AOF 文件保存的数据集要比 RDB 文件保存的数据集要完整
- RDB 的数据不实时，同时使用两者时服务器重启也只会找 AOF 文件，那要不要只使用 AOF？建议不要，因为 RDB 更适合用于备份数据库（AOF 在不断变化不好备份），快速重启，而且不会有 AOF 可能潜在的 bug，留着作为一个万一的手段
- 性能建议
  - 因为 RDB 文件只用作后备用途，建议只在 <span style="color:red">Slave 上持久化 RDB 文件</span>，而且只要 15 分钟备份一次就够了，只保留 save 900 1 这条规则。
  - 如果使用 AOF，好处是在最恶劣的情况下也只会丢失不超过两秒数据，启动脚本较简单，只需 load 自己的 AOF 文件就可以了
    - 代价：一是带来了持续的 IO，二是 AOF rewrite 的最后将 rewrite 过程中产生的新数据写到新文件造成的阻塞几乎是不可避免的
    - 只要硬盘许可，应该尽量减少 AOF rewrite 的频率，AOF 重写的基础大小默认值 64 M 大小了，可以设到 5 G 以上
    - 默认超过原大小 100% 大小时重写可以改到适当的数值
