---
title: 持久化之 RDB
date: 2021-12-11
category: Redis
tag:
 - Redis
---

## 1. 总体介绍

官网介绍：[https://www.redis.io](https://www.redis.io)

![image-20211122131838716](http://img.hl1015.top/blog/image-20211122131838716.png)

![image-20211122133004091](http://img.hl1015.top/blog/image-20211122133004091.png)

Redis 提供了 2 种不同形式的持久化方式

- RDB（Redis DataBase）
- AOF（Append Of File）

## 2. RDB（Redis DataBase）

### 2.1 官网介绍

![image-20211122132057544](http://img.hl1015.top/blog/image-20211122132057544.png)

![image-20211122133024368](http://img.hl1015.top/blog/image-20211122133024368.png)

### 2.2 RDB 是什么

在<span style="color:red">指定的时间间隔</span>内将内存中的数据集<span style="color:red">快照</span>写入磁盘，也就是行话讲的 Snapshot 快照，它恢复时是将快照文件直接读到内存里。

### 2.3 备份是如何执行的

Redis 会单独创建（fork）一个子进程来进行持久化，会<span style="color:red">先将数据写入到一个临时文件</span>中，待持久化过程都结束了，再用这个<span style="color:red">临时文件替换上次持久化好的文件</span>。整个过程中，主进程是不进行任何 IO 操作的，这就确保了极高的性能，如果需要进行大规模数据的恢复，且对于数据恢复的完整性不是非常敏感，那 RDB 方式要比 AOF 方式更加的高效。<span style="color:red">**RDB 的缺点是最后一次持久化后的数据可能丢失**</span>。

### 2.4 Fork

- Fork 的作用是复制一个与当前进程一样的进程。新进程的所有数据（变量、环境变量、程序计数器等）数值和原进程一致，但是是一个全新的进程，并作为原进程的子进程。
- 在 Linux 程序中，fork() 会产生一个和父进程完全相同的子进程，但子进程在此后多会被 exec 系统调用，出于效率考虑，Linux 中引入了 "<span style="color:red">**写时复制技术**</span>"
- **一般情况父进程和子进程会共用同一段物理内存**，只有进程空间的各段内容要发生变化时，才会将父进程的内容复制一份给子进程。

### 2.5 RDB 持久化流程

![image-20211122135032453](http://img.hl1015.top/blog/image-20211122135032453.png)

### 2.6 dump.rdb 文件

在 redis.conf 中配置文件名称，默认为 dump.rdb

![image-20211122135510277](http://img.hl1015.top/blog/image-20211122135510277.png)

### 2.7 配置位置

rdb 文件的保存路径，也可以修改，默认为 Redis 启动时命令行所在的目录下

```shell
dir /myredis/
```

![image-20211122135658693](http://img.hl1015.top/blog/image-20211122135658693.png)

### 2.8 如何触发 RDB 快照，保持策略

#### 2.8.1 配置文件中默认的快照配置

![image-20211122140104563](http://img.hl1015.top/blog/image-20211122140104563.png)

#### 2.8.2 命令 save VS bgsave

- **save**：save 时只管保存，其它不管，全部阻塞，手动保存，不建议
- <span style="color:red">**bgsave**：Redis 会在后台异步进行快照操作，快照同时还可以响应客户端请求</span>

> 可以通过 **lastsave** 命令获取最后一次成功执行快照的时间

#### 2.8.3 flushall 命令

执行 flushall 命令，也会产生 dump.rdb 文件，但里面是空的，无意义

#### 2.8.4 save

格式：`save 秒钟 写操作次数`

RDB 是整个内存的压缩过的 Snapshot，RDB 的数据结构，可以配置复合的快照触发条件，<span style="color:red">**默认是 1 分钟内改了 1 万次，或 5 分钟内改了 100 次，或 60 分钟内改了 1 次**</span>

<span style="color:red">禁用：不设置 save 指令，或者给 save 传入空字符串</span>

#### 2.8.5 stop-writes-on-bgsave-error

![image-20211122142526415](http://img.hl1015.top/blog/image-20211122142526415.png)

当 Redis 无法写入磁盘的话，直接关掉 Redis 的写操作，推荐 yes

#### 2.8.6 rdbcompression 压缩文件

![image-20211122142621430](http://img.hl1015.top/blog/image-20211122142621430.png)

对于存储到磁盘中的快照，可以设置是否进行压缩存储，如果是的话，Redis 会采用 <span style="color:red">LZF 算法</span> 进行压缩

如果你不想消耗 CPU 来进行压缩的话，可以设置为关闭此功能，推荐 yes

#### 2.8.7 rdbchecksum 检查完整性

![image-20211122143103765](http://img.hl1015.top/blog/image-20211122143103765.png)

在存储快照后，还可以让 Redis 使用 CRC64 算法来进行数据校验，但是这样做会增加大约 10% 的性能消耗，如果希望获取到最大的性能提升，可以关闭此功能，推荐 yes

#### 2.8.8 rdb 的备份与恢复

备份：

- 先通过 `config get dir` 查询 rdb 文件的目录
- 将 *.rdb 的文件拷贝到别的地方

恢复：

- 关闭 Redis
- 先把备份的文件拷贝到工作目录下 cp dump2.rdb dump.rdb
- 启动 Redis，备份数据会直接加载

### 2.9 优势

- 适合大规模的数据恢复
- 对数据完整性和一致性要求不高更适合使用
- 节省磁盘空间
- 恢复速度快

![image-20211122144110172](http://img.hl1015.top/blog/image-20211122144110172.png)

### 2.10 劣势

- Fork 的时候，内存中的数据被克隆了一份，大致 2 倍的膨胀性需要考虑
- 虽然 Redis 在 fork 时使用了<span style="color:red">**写时拷贝技术**</span>，但是如果数据庞大时还是比较消耗性能
- 在备份周期在一定间隔时间做一次备份，所以如果 Redis 意外 down 掉的话，就会丢失最后一次快照后的所有修改

### 2.11 如何停止

动态停止 RDB：

```shell
redis-cli config set save "" # save 后给空值，表示禁用保存策略
```

### 2.12 小总结

- RDB 是一个非常紧凑的文件
- RDB 在保存 RDB 文件时父进程唯一需要做的就是 fork 出一个子进程，接下来的工作全部由子进程来做，父进程不需要再做其他 IO 操作，所以 RDB 持久化方式可以最大化 Redis 的性能
- 与 AOF 相比，在恢复大的数据集的时候，RDB 方式会更快一些
- 数据丢失风险大
- RDB 需要经常 fork 子进程来保存数据集到硬盘上，当数据集比较大的时候，fork 的过程是非常耗时的，可能会导致 Redis 在一些毫秒级不能响应客户端请求

