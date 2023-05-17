---
title: JDBC 概述
date: 2021-09-14
category: Java
tag:
 - JDBC
---

## 1. 数据的持久化

（1）持久化（peristence）：**把数据保存到可掉电式的存储设置中供之后使用。**大多数情况下，特别是企业级应用**，数据持久化意味着将内存中的数据保存到磁盘上加以 "固化"**，而持久化的实现过程大多通过各种关系型数据库来完成。

（2）持久化的主要应用是将内存中的数据存储在关系型数据库中，当然也可以存储在磁盘文件、XML 数据文件中。

![image-20210914151526458](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914151526458.png)

## 2. Java 中的数据存储技术

（1）在 Java 中，数据库存储技术分为如下几类：

- **JDBC** 直接访问数据库
- JDO（Java Data Object）技术
- **第三方 O/R 工具**，如Hibernate、MyBatis等

（2）JDBC 是 Java 访问数据库的基石，JDO、Hibernate、MyBatis 等只是更好地封装了 JDBC

## 3. JDBC 介绍

（1）JDBC（Java Database Connectivity）是一个**独立于特定数据库管理系统、通用的SQL数据库存取和操作的公共接口(一组 API)**，定义了用来访问数据库的标准 Java 类库，（java.sql、javax.sql）使用这些类库可以以一种标准的方法、方便地访问数据库资源。

（2）JDBC 为访问不同的数据库提供了一种 **统一的途径**，为开发者屏蔽了一些细节问题。

（3）JDBC 的目标是使 Java 程序员使用 JDBC 可以连接任何**提供了 JDBC 驱动程序**的数据库系统，这样使得程序员无需对特定的数据库系统的特点有过多的了解，从而大大简化和加快了开发过程。

（4）如果没有 JDBC，那么 Java 程序员访问数据库时是这样的（**我们认为的连接**）：

![image-20210914151858981](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914151858981.png)

有了JDBC，Java 访问数据库时是这样的（**真实的连接**）：

![image-20210914151952350](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914151952350.png)

总结如下：

![image-20210914152113472](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914152113472.png)

## 4. JDBC 体系结构

> JDBC 是 sun 公司提供的一套用于数据库操作的接口，java 程序员只需要面向这套接口编程即可。
>
> 不同的数据库厂商，需要针对这套接口，提供不同的实现。不同的实现的集合，即为不同数据库的驱动。
>
> ------------面向接口编程

**JDBC 接口（API）包括两个层次**

①**面向应用的 API**：Java API，抽象接口，供应用程序开发人员使用（连接数据库，执行SQL语句，获取结果）

②**面向数据的 API**：Java Driver，供开发商开发数据库驱动程序使用

## 5. JDBC 程序编写步骤

![image-20210914152409717](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914152409717.png)

> **补充**：ODBC(Open Database Connectivity，开放式数据库连接)，是微软在 Windows 平台下推出的。使用者在程序中只需要调用 ODBC API，由 ODBC 驱动程序将调用转换成为对特定的数据库的调用请求。