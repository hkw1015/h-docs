---
title: 数据库概述
date: 2021-09-11
category: MySQL
tag:
 - MySQL 基础
---

## 1. 数据库的好处

- 实现数据持久化
- 使用完整的管理系统统一管理，易于查询

## 2. 数据库的相关概念

- **DB**
  - 数据库（database）：存储数据的 "仓库"，它保存了一系列有组织的数据
- **DBMS**
  - 数据库管理系统（Database Manager System），又称为数据库软件（产品）：数据库是通过 DBMS 创建和操作的容器

- **SQL**
  - 结构化查询语言（Structure Query Language）：专门用来和数据库通信的语言

## 3. 数据库管理系统

![image-20210909100321908](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909100321908.png)

**常见的数据库管理系统：**

- MySQL、Oracle、DB2、SqlServer（微软开发，缺点：只能安装在 windows 系统上使用）等

## 4. SQL 语言概述

**SQL 的优点：**

- 不是某个特定数据库供应商专有的语言，几乎所有的 DBMS 都支持 SQL
- 简单易学
- 虽然简单，但实际上是一种强有力的语言，灵活运用语言元素，可以进行非常复杂和高级的数据库操作

![image-20210909100751967](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909100751967.png)

## 5. 数据库存储数据的特点

- 将数据放到表中，表再放到库中
- 一个数据库中可以有多张表，每个表都有一个名字，用来标识自己（表名具有唯一性）
- 表具有一些特性，这些特性定义了数据在表中如何存储，类似 Java 中 "类" 的设计
- 表由列组成，我们也称为字段，所有表都是由一个或多个列组成的，每一列类似 Java 中的 "属性"
- 表中的数据是按行存储的，每一行数据类似 Java 中的 "对象"

## 6. SQL 语言的分类

- **DML（Data Manipulation Language)**

  - 数据库操纵语句，用于添加、删除、修改、查询数据库记录，并检查数据完整性

  - DML 用于**查询和修改数据记录**，包括如下 SQL 语句：

    - ```sql
      INSERT：添加数据到数据库中
      UPDATE：修改数据库中的数据
      DELETE：删除数据库中的数据
      ★SELECT：选择(查询)数据（SELECT是SQL语言的基础，最为重要）
      ```

- **DDL（Data Definition Language）**

  - 数据定义语言，用于库和表的创建、修改、删除

  - DDL 用于**定义数据库的结构**，比如创建、修改或删除数据库对象，包括如下 SQL 语句：

    - ```sql
      ★CREATE TABLE：创建数据库表
      ★ALTER TABLE：更改表结构，添加、修改、删除列长度
      ★DROP TABLE：删除表
      CREATE INDEX：在表上建立索引
      DROP INDEX：删除索引
      ```

- **DCL（Data Control Language）**

  - 数据控制语句，用于定义用户的访问权限和安全级别

  - DCL 用来**控制数据库的访问**，包括如下 SQL 语句：

    - ```sql
      GRANT：授予访问权限
      REVOKE：撤销访问权限
      ★COMMIT：提交事务处理
      ★ROLLBACK：事务处理回退
      ★SAVEPOINT：设置保存点
      LOCK：对数据库的特定部分进行锁定
      ```

      