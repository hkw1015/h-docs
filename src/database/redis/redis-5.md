---
title: 发布与订阅
date: 2021-12-11
category: Redis
tag:
 - Redis
---

## 1. 什么是发布和订阅

- Redis 发布订阅（pub/sub）是一种消息通信模式：发送者（pub）发送消息，订阅者（sub）接收消息
- Redis 客户端可以订阅任意数量的频道

## 2. Redis 的发布和订阅

**（1）客户端可以订阅频道如下图**

![image-20211117214435263](http://img.hl1015.top/blog/image-20211117214435263.png)

**（2）当给这个频道发布消息后，消息就会发送给订阅的客户端**

![image-20211117214504786](http://img.hl1015.top/blog/image-20211117214504786.png)

## 3. 发布订阅命令行实现

**（1）打开一个客户端 channel1**

```shell
subscribe channel1
```

![image-20211117221144871](http://img.hl1015.top/blog/image-20211117221144871.png)

**（2）打开另一个客户端，给 channel1 发布消息**

```shell
publish channel1 "hello hkw"
```

![image-20211117222109708](http://img.hl1015.top/blog/image-20211117222109708.png)

返回的 1 是订阅者数量

**（3）打开第一个客户端可以看到的发送的消息**

![image-20211117221214886](http://img.hl1015.top/blog/image-20211117221214886.png)

注：发布的消息没有持久化，如果在订阅的客户端收不到 hello，只能收到订阅后发布的消息