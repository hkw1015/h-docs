---
title: 配置文件介绍
date: 2021-12-11
category: Redis
tag:
 - Redis
---

## 1. Units 单位

- 配置大小单位，开头定义了一些基本的度量单位，只支持 bytes，不支持 bit
- 大小写不敏感

![image-20211117191027942](http://img.hl1015.top/blog/image-20211117191027942.png)

## 2. INCLUDES 包含

类似于 jsp 中的 include，多实例的情况下可以把公用的配置文件提取出来

![image-20211117191141188](http://img.hl1015.top/blog/image-20211117191141188.png)

## 3. 网络相关配置

### 3.1 bind

- 默认情况 bind=127.0.0.1 只能接受本机的访问请求，不写的情况下，无限制接收任何 ip 地址的访问
- 生产环境肯定要写你应用服务器的地址，服务器是需要远程访问的，所以需要将其注释掉
- <span style="color:red">如果开启了 protected-mode，那么在没有设定 bind ip 且没有设密码的情况下，Redis 只允许接受本机的响应</span>

![image-20211117193127958](http://img.hl1015.top/blog/image-20211117193127958.png)

保存配置，停止服务，重新启动查看进程，不再是本机访问了

![image-20211117193431679](http://img.hl1015.top/blog/image-20211117193431679.png)

### 3.2 protected-mode

将本机访问保护模式设置 no

![image-20211117193639739](http://img.hl1015.top/blog/image-20211117193639739.png)

### 3.3 port

端口号，默认 6379

![image-20211117195843479](http://img.hl1015.top/blog/image-20211117195843479.png)

### 3.4 tcp-backlog

- 设置 tcp 的 backlog，backlog 其实是一个连接队列，backlog 队列总和 = 未完成三次握手队列 + 已经完成三次握手队列
- 在高并发环境下你需要一个高 backlog 值来避免慢客户端连接问题
- 注意 Linux 内核会将这个值减小到 /proc/sys/net/core/somaxconn 的值（128），所以需要确认增大 /proc/sys/net/core/somaxconn 和 /proc/sys/net/ipv4/tcp_max_syn_backlog（128），两个值来达到想要的效果

![image-20211117200353451](http://img.hl1015.top/blog/image-20211117200353451.png)

### 3.5 timeout

一个空闲的客户端维持多少秒会关闭，0 表示关闭该功能，即<span style="color:red">永不关闭</span>

![image-20211117200711480](http://img.hl1015.top/blog/image-20211117200711480.png)

### 3.6 tcp-keepalive

- 对访问客户端的一种<span style="color:red">心跳检测</span>，每隔 n 秒检测一次
- 单位为秒，如果设置为 0，则不会进行 Keepalive 检测，建议设置成 60

![image-20211117201034413](http://img.hl1015.top/blog/image-20211117201034413.png)

## 4. GENERAL 通用

### 4.1 daemonize

是否为后台进程，设置为 yes（守护进程，后台启动）

![image-20211117201332021](http://img.hl1015.top/blog/image-20211117201332021.png)

### 4.2 pidfile

存放 pid 文件的位置，每个实例会产生一个不同的 pid 文件

![image-20211117201513982](http://img.hl1015.top/blog/image-20211117201513982.png)

### 4.3 loglevel

指定日志记录级别，Redis 总共支持四个级别：debug、verbose、notice、warning，默认为 <span style="color:red">**notice**</span>

四个级别根据使用阶段来选择，生产环境 notice 或者 warning

![image-20211117202016878](http://img.hl1015.top/blog/image-20211117202016878.png)

### 4.4 logfile

日志文件名称

![image-20211117202208048](http://img.hl1015.top/blog/image-20211117202208048.png)

### 4.5 databases 16

设定库的数量，默认 16，默认数据库为 0，可以使用 SELECT \<dbid\> 命令在连接上指定数据库 id

![image-20211117202427870](http://img.hl1015.top/blog/image-20211117202427870.png)

## 5. SECURITY 安全

### 设置密码

- 访问密码的查看、设置和取消
- 在命令中设置密码，只是临时的，重启 redis 服务器，密码就还原了
- 永久设置，需要在配置文件中进行设置

![image-20211117203247312](http://img.hl1015.top/blog/image-20211117203247312.png)

![image-20211117203633134](http://img.hl1015.top/blog/image-20211117203633134.png)

## 6. LIMITS 限制

### 6.1 maxclients

- 设置 redis 同时可以与多少个客户端进行连接
- 默认情况下为 10000 个客户端
- 如果达到了此限制，redis 则会拒绝新的连接请求，并且向这些连接请求方发出 "max number for clients reached" 以作回应

![image-20211117204024967](http://img.hl1015.top/blog/image-20211117204024967.png)

### 6.2 maxmemory

- 建议<span style="color:red">**必须设置**</span>，否则，会导致内存占满，造成服务器宕机
- 设置 redis 可以使用的内存量，一旦到达内存使用上限，redis 将会试图移除内部数据，移除规则可以通过 maxmemory-policy 来指定
- 如果 redis 无法根据移除规则来移除内存中的数据，或者设置了 "不允许移除"，那么 redis 则会针对那些需要申请内存的指令返回错误信息，比如 SET、LPUSH 等
- 但是对于无内存申请的指令，仍然会正常响应，比如 GET 等。如果你的 redis 是主 redis（说明你的 redis 有从 redis），那么在设置内存使用上限时，需要在系统中留出一些内存空间给同步队列缓存，只有在你设置的是 "不移除" 的情况下，才不用考虑这个因素。

![image-20211117210710238](http://img.hl1015.top/blog/image-20211117210710238.png)

### 6.3 maxmemory-policy

- volatile-lru：使用 LRU 算法移除 key，只对设置了<span style="color:red">过期时间</span>的键（最近最少使用）
- allkeys-lru：在所有集合 key 中，使用 LRU 算法移除 key
- volatile-random：在过期集合中移除随机的 key，只对设置了过期时间的键
- allkeys-random：在所有集合 key 中，移除随机的 key
- volatile-ttl：移除那些 TTL 值最小的 key，即那些最近要过期的 key
- noevicton：不进行移除，针对写操作，只是返回错误信息

![image-20211117212618200](http://img.hl1015.top/blog/image-20211117212618200.png)

### 6.4 maxmemory-samples

- 设置样本数量，LRU 算法和最小 TTL 算法都并非是精确的算法，而是估算值，所以你可以设置样本的大小，redis 默认会检查这么多个 key 并选择其中 LRU 的那个
- 一般设置 3 到 7 的数字，数值越小样本越不准确，但性能消耗越小

![image-20211117212952920](http://img.hl1015.top/blog/image-20211117212952920.png)