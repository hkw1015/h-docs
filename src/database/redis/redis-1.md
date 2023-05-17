---
title: NoSQL 数据库简述
date: 2021-12-11
category: Redis
tag:
 - Redis
---

## 1. 技术发展

技术的分类

1. 解决功能性的问题：Java、Jsp、RDBMS、Tomcat、Linux、JDBC、SVN
2. 解决扩展性的问题：Struts、Spring、SpringMVC、Hibernate、MyBatis
3. 解决性能的问题：NoSQL、Java 多线程、Hadoop、Nginx、MQ、Elasticsearch

### 1.1 Web 1.0 时代

Web 1.0 的时代，数据访问量很有限，用一夫当关的高性能单点服务器可以解决大部分问题。

![image-20211116130728895](http://img.hl1015.top/blog/image-20211116130728895.png)

### 1.2 Web 2.0 时代

随着 Web 2.0 的时代的到来，用户访问量大幅度提升，同时产生了大量的用户数据，加上后来的智能移动设备的普及，所有的互联网平台都面临了巨大的性能挑战。

![image-20211116130937899](http://img.hl1015.top/blog/image-20211116130937899.png)

### 1.3 解决 CPU 及内存压力

![image-20211116131047366](http://img.hl1015.top/blog/image-20211116131047366.png)

### 1.4 解决 IO 压力

![image-20211116131220704](http://img.hl1015.top/blog/image-20211116131220704.png)

## 2. NoSQL 数据库

### 2.1 NoSQL 数据库概述

NoSQL（Not Only SQL），意即 "不仅仅是 SQL"，泛指 <span style="color:red">**非关系型数据库**</span>。

NoSQL 不依赖业务逻辑方式存储，而以简单的 key-value 模式存储，因此大大增加了数据库的扩展能力。

- 不遵循 SQL 标准
- 不支持 ACID
- 远超于 SQL 的性能

### 2.2 NoSQL 适用场景

- 对数据高并发的读写
- 海量数据的读写
- 对数据的高可扩展性
- <span style="color:red">用不着 sql 和用了 sql 也不行的情况，请考虑用 NoSQL</span>

### 2.3 NoSQL 不适用场景

- 需要事务支持
- 基于 sql 的结构化存储，处理复杂的关系，需要<span style="color:red">即席</span>查询

> 即席查询（Ad Hoc）是用户根据自己的需求，灵活的选择查询条件，系统能够根据用户的选择生成相应的统计报表。即席查询与普通应用查询最大的不同是普通的应用查询是定制开发的，而即席查询是由用户自定义查询条件的。

### 2.4 Memcache

![image-20211116132841708](http://img.hl1015.top/blog/image-20211116132841708.png)

- 很<span style="color:red">早</span>出现的 NoSQL 数据库
- 数据都在内存中，一般<span style="color:red">不持久化</span>
- 支持简单的 key-value 模式，<span style="color:red">支持类型单一</span>
- 一般是作为<span style="color:red">缓存数据库</span>辅助持久化的数据库

### 2.5 Redis

![image-20211116133337548](http://img.hl1015.top/blog/image-20211116133337548.png)

- 几乎覆盖了 Memcached 的绝大部分功能
- 数据都在内存中，<span style="color:red">支持持久化</span>，主要用作备份恢复
- 除了支持简单的 key-value 模式，还<span style="color:red">支持多种数据结构的存储</span>，比如 <span style="color:red">list、set、hash、zset</span> 等
- 一般是作为<span style="color:red">缓存数据库</span>辅助持久化的数据库

### 2.6 MongoDB

![image-20211116133421104](http://img.hl1015.top/blog/image-20211116133421104.png)

- 高性能、开源、模式自由（schema free）的<span style="color:red">文档型数据库</span>
- 数据都在内存中，如果内存不足，把不常用的数据保存到硬盘
- 虽然是 key-value 模式，但是对 value（尤其是 <span style="color:red">json</span>）提供了丰富的查询功能
- 支持二进制数据及大型对象
- 可以根据数据的特点<span style="color:red">替代 RDBMS</span>，成为独立的数据库，或者配置 RDBMS，存储特定的数据

## 3. 行列式存储数据库（大数据时代）

### 3.1 行式数据库

![image-20211116135536474](http://img.hl1015.top/blog/image-20211116135536474.png)

### 3.2 列式数据库

![image-20211116135600259](http://img.hl1015.top/blog/image-20211116135600259.png)

（1）Hbase

![image-20211116134404633](http://img.hl1015.top/blog/image-20211116134404633.png)

Hbase 是 Hadoop 项目中的数据库。它用于需要对大量的数据进行随机、实时地读写操作的场景中。

Hbase 的目标就是处理数据量<span style="color:red">非常庞大</span>的表，可以用<span style="color:red">普通的计算机</span>处理超过 <span style="color:red">10 亿行数据</span>，还可以处理有数百万<span style="color:red">列</span>元素的数据表。

（2）Cassandra

![image-20211116134507949](http://img.hl1015.top/blog/image-20211116134507949.png)

Apache Cassandra 是一款免费的开源的 NoSQL 数据库，其设计的目的在于管理由大量商用服务器构建起来的庞大集群上的<span style="color:red">海量数据集（数据量通常达到 PB 级别）</span>。在众多显著特性当中，Cassandra 最为卓越的长处是对写入及读取操作进行规模调整，而且其不强调主集群的设计思路能够以相对直观的方式简化各集群的创建与扩展流程。

> 计算机存储单位一般用 B，KB，MB，GB，TB，EB，ZB，YB，BB 来表示，它们之间的关系是：
> 位 bit（比特，Binary Digits）：存放一位二进制数，即 0 或 1，最小的存储单位。
> 字节 byte：8 个二进制位为一个字节(B)，最常用的单位。
> 1KB (Kilobyte 千字节) = 1024B，
> 1MB (Megabyte 兆字节 简称 "兆") = 1024 KB，
> 1GB (Gigabyte 吉字节 又称 "千兆") = 1024 MB，
> 1TB (Trillionbyte 万亿字节 太字节) = 1024 GB，其中 1024 = 2^10 ( 2 的10次方)，
> <span style="color:red">1PB</span>（Petabyte 千万亿字节 拍字节）= 1024 TB，
> 1EB（Exabyte 百亿亿字节 艾字节）= 1024 PB，
> 1ZB (Zettabyte 十万亿亿字节 泽字节) = 1024 EB,
> 1YB (Jottabyte 一亿亿亿字节 尧字节) = 1024 ZB,
> 1BB (Brontobyte 一千亿亿亿字节) = 1024 YB.
> 注："兆" 为百万级数量单位。

## 4. 图关系型数据库

![image-20211116140531993](http://img.hl1015.top/blog/image-20211116140531993.png)

主要应用：社会关系、公共交通网络、地图及网络拓扑（n * (n - 1) / 2）

![image-20211116141436654](http://img.hl1015.top/blog/image-20211116141436654.png)

## 5. DB-Engines 数据库排名

[https://db-engines.com/en/ranking](https://db-engines.com/en/ranking)

![image-20211116141700322](http://img.hl1015.top/blog/image-20211116141700322.png)