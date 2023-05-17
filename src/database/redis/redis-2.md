---
title: 概述 & 安装
date: 2021-12-11
category: Redis
tag:
 - Redis
---

- Redis 是一个开源的 key-value 存储系统
- 和 Memcache 相比，它支持存储的 value 类型相对更多，包括 string（字符串）、list（链表）、set（集合）、zset（sorted set --- 有序集合）和 hash（哈希类型），这些数据类型都支持 push/pop、add/remove、取交集、并集和差集以及更丰富的操作，而且这些操作都是原子性的，在此基础上，Redis 支持各种不同方式的排序
- 与 Memcached 一样，为了保证效率，数据都是缓存在内存中，不同的是 Redis 会周期性地把更新的数据写入磁盘或者把修改操作写入追加的记录文件，并且在此基础上实现了 master-slave（主从）同步

## 1. 应用场景

### 1.1 配合关系型数据库做高速缓存

- 高频次、热门访问的数据，降低数据库 IO
- 分布式架构，做 session 共享

![image-20211116143030593](http://img.hl1015.top/blog/image-20211116143030593.png)

### 1.2 多样的数据结构存储持久化数据

- <span style="color:blue">**最新 N 个数据**</span> ===》 通过 list 实现自然时间排序的数据
- <span style="color:blue">**排行榜，Top N**</span> ===》 利用 zset（有序集合）
- <span style="color:blue">**时效性数据，比如手机验证码**</span> ===》 Expire 过期
- <span style="color:blue">**计数器，秒杀**</span> ===》 原子性，自增方法 INCR、DECR
- <span style="color:blue">**去除大量数据中的重复数据**</span> ===》 利用 set 集合
- <span style="color:blue">**构建队列**</span> ===》 利用 list 集合
- <span style="color:blue">**发布订阅消息系统**</span> ===》 pub/sub 模式

## 2. Redis 安装

- Redis 官方网址：[https://redis.io](https://redis.io)
![image-20211116143859716](http://img.hl1015.top/blog/image-20211116143859716.png)
- Redis 中文官方网址：[https://redis.cn](http://redis.cn)
![image-20211116143918022](http://img.hl1015.top/blog/image-20211116143918022.png)

### 2.1 安装版本

- 6.2.1 for Linux（redis-6.2.1.tar.gz）
- 不用考虑在 windows 环境下对 Redis 的支持

### 2.2 安装步骤

**（1）准备工作：下载安装最新版的 gcc 编译器**

- 安装 C 语言的编译环境（如果没有）

  ```shell
  # 有网的情况下
  yum install gcc-c++
  ```

- 查看 gcc 版本

  ```shell
  [root@iZbp1he64xoa8bsarsqawsZ ~]# gcc --version
  gcc (GCC) 8.4.1 20200928 (Red Hat 8.4.1-1)
  Copyright (C) 2018 Free Software Foundation, Inc.
  This is free software; see the source for copying conditions.  There is NO
  warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  ```

**（2）下载 redis-6.2.1.tar.gz 放到 /opt/module 目录**

- 链接：[https://pan.baidu.com/s/1klr1yO7CRe3ERRRRuFFDzg](https://pan.baidu.com/s/1klr1yO7CRe3ERRRRuFFDzg) 提取码：tefs

```shell
[root@iZbp1he64xoa8bsarsqawsZ module]# pwd
/opt/module
[root@iZbp1he64xoa8bsarsqawsZ module]# ll
total 951360
drwxr-xr-x 6 root root       134 Sep 27 13:08 apache-zookeeper-3.5.7-bin
-rw-r--r-- 1 root root 971743744 Nov 15 10:58 gitlab-ce-14.4.2-ce.0.el8.x86_64.rpm
-rwxr-xr-x 1 root root       409 Nov 15 10:59 gitlab-install.sh
-rw-r--r-- 1 root root   2438367 Nov 16 15:03 redis-6.2.1.tar.gz
```

**（3）解压安装包**

```shell
[root@iZbp1he64xoa8bsarsqawsZ module]# tar -zxvf redis-6.2.1.tar.gz -C /opt/software/
redis-6.2.1/
redis-6.2.1/.github/
redis-6.2.1/.github/ISSUE_TEMPLATE/
...
redis-6.2.1/utils/whatisdoing.sh
[root@iZbp1he64xoa8bsarsqawsZ module]# 
```

**（4）解压完成后进入目录**

```shell
[root@iZbp1he64xoa8bsarsqawsZ module]# cd /opt/software
[root@iZbp1he64xoa8bsarsqawsZ software]# ll
total 11508
-rw-r--r--  1 root root  9311744 Sep 27 13:02 apache-zookeeper-3.5.7-bin.tar.gz
drwxr-xr-x 10 8980 users     258 Oct  8 09:17 FastDFS
-rw-r--r--  1 root root    17510 Oct  8 08:42 fastdfs-nginx-module_v1.16.tar.gz
-rw-r--r--  1 root root   345400 Oct  8 08:42 FastDFS_v5.05.tar.gz
drwxrwxr-x  3 root root      102 Oct  8 08:48 libfastcommon-1.0.7
-rw-r--r--  1 root root    73148 Oct  8 08:42 libfastcommonV1.0.7.tar.gz
lrwxrwxrwx  1 root root       38 Oct  8 16:08 ltmain.sh -> /usr/share/libtool/build-aux/ltmain.sh
-rw-r--r--  1 root root   981687 Oct  8 08:42 nginx-1.12.2.tar.gz
-rw-r--r--  1 root root  1039530 Oct  8 13:52 nginx-1.18.0.tar.gz
drwxrwxr-x  7 root root     4096 Mar  2  2021 redis-6.2.1 # 解压后的文件
```

**（5）在 redis-6.2.1 目录下执行 make 命令（只是编译好）**

```shell
[root@iZbp1he64xoa8bsarsqawsZ redis-6.2.1]# make
cd src && make all
make[1]: Entering directory '/opt/software/redis-6.2.1/src'
    CC Makefile.dep
...
Hint: It's a good idea to run 'make test' ;)

make[1]: Leaving directory '/opt/software/redis-6.2.1/src'
[root@iZbp1he64xoa8bsarsqawsZ redis-6.2.1]# 
```

注意：如果没有准备好 C 语言编译环境，make 会报错—Jemalloc/jemalloc.h：没有那个文件

**（6）跳过 make test，执行 make install**

```shell
[root@iZbp1he64xoa8bsarsqawsZ redis-6.2.1]# make install
cd src && make install
make[1]: Entering directory '/opt/software/redis-6.2.1/src'
...
Hint: It's a good idea to run 'make test' ;)

    INSTALL install
    INSTALL install
    INSTALL install
make[1]: Leaving directory '/opt/software/redis-6.2.1/src'
[root@iZbp1he64xoa8bsarsqawsZ redis-6.2.1]# 
```

### 2.3 安装目录 /usr/local/bin

查看默认安装目录：

|       文件       |                          描述                          |
| :--------------: | :----------------------------------------------------: |
| redis-benchmark  | 性能测试工具，可以在自己本子运行，看看自己本子性能如何 |
| redis-check-aof  |                 修复有问题的 AOF 文件                  |
| redis-check-dump |               修复有问题的 dump.rdb 文件               |
|  redis-sentinel  |                     Redis 集群使用                     |
|   redis-server   |                  Redis 服务器启动命令                  |
|    redis-cli     |                    客户端，操作入口                    |

### 2.4 前台启动（不推荐）

前台启动，命令行窗口不能关闭，否则服务器停止

![image-20211116152620601](http://img.hl1015.top/blog/image-20211116152620601.png)

### 2.5 后台启动（<span style="color:red">推荐</span>）

**（1）备份 redis.conf**

拷贝一份 redis.conf 到其他目录

```shell
cp /opt/software/redis-6.2.1/redis.conf /myredis/
```

**（2）后台启动设置 daemonize no 改成 yes**

修改 /myredis/redis.conf 文件，将里面的 daemonize no 改成 yes，让服务在后台启动

**（3）Redis 启动**

```shell
[root@iZbp1he64xoa8bsarsqawsZ bin]# redis-server /myredis/redis.conf
[root@iZbp1he64xoa8bsarsqawsZ bin]# ps -ef | grep redis
root      812851       1  0 15:41 ?        00:00:00 redis-server 127.0.0.1:6379
root      812965  803067  0 15:42 pts/1    00:00:00 grep --color=auto redis
```

**（4） 使用客户端访问**

```shell
[root@iZbp1he64xoa8bsarsqawsZ bin]# redis-cli
127.0.0.1:6379> 
```

**（5）存在多个端口时，可以指定端口访问**

```shell
redis-cli -p 6379
```

**（6）测试验证：ping**

```shell
127.0.0.1:6379> ping
PONG
```

**（7）Redis 关闭**

- 单实例关闭

  ```shell
  [root@iZbp1he64xoa8bsarsqawsZ bin]# redis-server /myredis/redis.conf 
  [root@iZbp1he64xoa8bsarsqawsZ bin]# ps -ef | grep redis
  root      814164       1  0 15:53 ?        00:00:00 redis-server 127.0.0.1:6379
  root      814186  803067  0 15:54 pts/1    00:00:00 grep --color=auto redis
  [root@iZbp1he64xoa8bsarsqawsZ bin]# redis-cli shutdown
  [root@iZbp1he64xoa8bsarsqawsZ bin]# ps -ef | grep redis
  root      814204  803067  0 15:54 pts/1    00:00:00 grep --color=auto redis
  ```

  也可以进入终端后再关闭

  ```shell
  127.0.0.1:6379> shutdown
  not connected> 
  ```

- 多实例关闭，指定端口关闭

  ```shell
  [root@iZbp1he64xoa8bsarsqawsZ bin]# redis-server /myredis/redis.conf 
  [root@iZbp1he64xoa8bsarsqawsZ bin]# ps -ef | grep redis
  root      814164       1  0 15:53 ?        00:00:00 redis-server 127.0.0.1:6379
  root      814186  803067  0 15:54 pts/1    00:00:00 grep --color=auto redis
  [root@iZbp1he64xoa8bsarsqawsZ bin]# redis-cli -p 6379 shutdown
  [root@iZbp1he64xoa8bsarsqawsZ bin]# ps -ef | grep redis
  root      814204  803067  0 15:54 pts/1    00:00:00 grep --color=auto redis
  ```

**（8）使用 Another Redis Desktop Manager 客户端 连接**

- 在配置文件中设置密码，找到 requirepass 参数，后面跟的就是我们想要设置的密码

  - ![image-20211116171830478](http://img.hl1015.top/blog/image-20211116171830478.png)

- 注释掉配置文件中的 `bind 127.0.0.1 -::1`

  - ![image-20211116172637721](http://img.hl1015.top/blog/image-20211116172637721.png)

- 重启 Redis

- 打开 Another Redis Desktop Manager，新建连接

  - ![image-20211116173120046](http://img.hl1015.top/blog/image-20211116173120046.png)

  - 连接成功

    ![image-20211116173153286](http://img.hl1015.top/blog/image-20211116173153286.png)

### 2.6 Redis 相关知识介绍

**（1）端口 6379 从何而来**

下面这张图可以解释一下，Merz 全名 Alessia Merz，是意大利的一位广告女郎，对应的当时手机上的按键数字

<img src="http://img.hl1015.top/blog/image-20211116160221355.png" alt="image-20211116160221355" style="zoom:50%;" />

**（2）默认 16 个数据库，类似数组下标从 0 开始，初始默认使用 0 号库**

- 可以使用命令 `select <dbid>` 来切换数据库，如：select 8
- 统一密码管理，所有库同样密码
- `dbsize` 查看当前数据库的 key 的数量
- `flushdb` 清空当前库
- `flushall` 通杀全部库

**（3）Redis 是单线程 + 多路 IO 复用技术**

多路复用是指使用一个线程来检查多个文件描述符（Socket）的就绪状态，比如调用 select 和 poll 函数，传入多个文件描述符，如果有一个文件描述符就绪，就返回，否则阻塞直到超时。得到就绪状态后进行真正的操作可以在同一个线程里执行，也可以启动线程执行（比如使用线程池）。

> 串行 vs 多线程 + 锁（memcached） vs 单线程 + 多路 IO 复用（Redis）
>
> 【与 Memcached 三点不同：支持多数据类型，支持持久化，单线程 + 多线程 IO 复用】
>
> ![image-20211116161649500](http://img.hl1015.top/blog/image-20211116161649500.png)