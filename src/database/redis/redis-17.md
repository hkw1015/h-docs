---
title: 6.0 新功能
date: 2021-12-11
category: Redis
tag:
 - Redis
---

## 1. ACL

### 1.1 简介

Redis ACL 是 Access Control List（访问控制列表）的缩写，该功能允许根据可以执行的命令和可以访问的键来限制某些连接。

在 Redis 5 版本之前，Redis 安全规则只有密码控制，还有通过 rename 来调整高危命令比如 flushdb，keys *，shutdown 等。Redis 6 则提供 ACL 的功能对用户进行更细粒度的权限控制：

（1）接入权限：用户名和密码

（2）可以执行的命令

（3）可以操作的 key

参考官网：[https://redis.io/topics/acl](https://redis.io/topics/acl)

### 1.2 命令

1、使用 acl list 命令展现用户权限列表

![image-20211126222413742](http://img.hl1015.top/blog/image-20211126222413742.png)

2、使用 acl cat 命令

①查看添加权限指令类别

![image-20211126221645257](http://img.hl1015.top/blog/image-20211126221645257.png)

②加参数类型名可以查看类型下的具体命令

![image-20211126221502169](http://img.hl1015.top/blog/image-20211126221502169.png)

3、使用 acl whoami 命令查看当前用户

![image-20211126221420086](http://img.hl1015.top/blog/image-20211126221420086.png)

4、使用 aclsetuser 命令创建和编辑用户 ACL

（1）ACL 规则

下面是有效 ACL 规则的列表。某些规则只是用于激活或删除标志，或对用户 ACL 执行给定更改的单个单词，其他规则是字符前缀，它们与命令或类别名称、键模式等连接在一起。

|         类型         |     参数      |                             说明                             |
| :------------------: | :-----------: | :----------------------------------------------------------: |
|       启动用户       |      on       |                        激活某用户账号                        |
|       禁用用户       |      off      | 禁用某用户账号。注意，已验证的连接仍然可以工作。如果默认用户被标记 off，则新连接将在未进行身份验证的情况下启动，并要求用户使用 AUTH 选项发送 AUTH 或 HELLO，以便以某种方式进行身份验证。 |
|      权限的添加      | +\<command\>  |             将指令添加到用户可以调用的指令列表中             |
|      权限的删除      | -\<command\>  |                 从用户可执行指令列表移除指令                 |
|      权限的添加      | +\<category\> | 添加该类别中用户要调用的所有指令，有效类别为 @admin、@set、@sortedset 等，通过调用 ACL CAT 命令查看完整列表。特殊类型 @all 表示所有命令，包括当前存于服务器中的命令，以及将来将通过模块加载的命令 |
|      权限的删除      | -\<category\> |                  从用户可调用指令中移除类别                  |
|      权限的添加      |  allcommands  |                         +@all 的别名                         |
|      权限的删除      |   nocommand   |                         -@all 的别名                         |
| 可操作键的添加或删除 | ~\<pattern\>  |     添加可作为用户可操作的键的模式，例如：~*允许所有的键     |

（2）通过命令创建新用户默认权限

```shell
acl setuser user1
```

![image-20211126224137534](http://img.hl1015.top/blog/image-20211126224137534.png)

在上面的示例中，我根本没有指定任何规则。如果用户不存在，这将使用 just created 的默认属性来创建用户。如果用户已经存在，则上面的命令将不执行任何操作。

（3）设置有用户名、密码、ACL 权限、并启用的用户

```shell
acl setuser user2 on >password ~cached:* +get
```

![image-20211126224700020](http://img.hl1015.top/blog/image-20211126224700020.png)

（4）切换用户、验证权限

![image-20211126224851117](http://img.hl1015.top/blog/image-20211126224851117.png)

## 2. IO 多线程

### 2.1 简介

Redis 6 终于支持多线程了，告别单线程了吗？

IO 多线程其实指的是 **客户端交互部分的网络 IO** 交互处理模块**多线程**，**而非执行命令多线程**。Redis 6 执行命令依然是单线程。

### 2.2 原理架构

Redis 6 加入多线程，但跟 Memcached 这种从 IO 处理到数据访问多线程的实现模式有些差异。Redis 的多线程部分只是用来处理网络数据的读写和协议解析，执行命令仍然是单线程。之所以这么设计是不想因为多线程而变得复杂，需要去控制 key、lua、事务、LPUSH/LPOP 等等的并发问题，整体的设计大体如下：

![image-20211126225315181](http://img.hl1015.top/blog/image-20211126225315181.png)

另外，多线程 IO 默认也是不开启的，需要在配置文件中配置：

```shell
io-thread-do-read yes
io-thread 4
```

## 3. 工具支持 Cluster

之前老版 Redis 想要搭建集群需要单独安装 ruby 环境，Redis 5 将 redis-trib.rb 的功能集成到 redis-cli。另外官方 redis-benchmark 工具开始支持 cluster 模式了，通过多线程的方式对多个分片进行压测。

![image-20211126225706031](http://img.hl1015.top/blog/image-20211126225706031.png)

## 4. Redis 新功能持续关注

1. RESP 3 新的 Redis 通信协议：优化服务端与客户端之间通信
2. Client side caching 客户端缓存：基于 RESP 3 协议实现的客户端缓存功能。为了进一步提升缓存的性能，将客户端经常访问的数据 cache 到客户端，减少 TCP 网络交互。
3. Proxy 集群代理模式：Proxy 功能，让 Cluster 拥有像单实例一样的接入方式，降低大家使用 cluster 的门槛，不过需要注意的是代理不改变 Cluster 的功能限制，不支持的命令还是会不支持，比如跨 slot 的多 key 操作
4. Modules API：Redis 6 中模块 API 开发进展非常大，因为 Redis Labs 为了开发复杂的功能，从一开始就用上 Redis 模块。Redis 可以变成一个框架，利用 Modules 来构建不同系统，而不需要从头开始写然后还要 BSD 许可。Redis 一开始就是一个向编写各种系统开放的平台。