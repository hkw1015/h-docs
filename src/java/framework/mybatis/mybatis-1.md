---
title: 简介
date: 2021-11-03
category: 常用框架
tag:
  - MyBatis
---

## 1. MyBatis 历史

MyBatis 最初是 Apache 的一个开源项目 **iBatis**，2010 年 6 月这个项目由 Apache Software Foundation 迁移到了 Google Code。随着开发团队转投 Google Code 旗下，iBatis 3.x 正式更名为 MyBtis。代码于 2013 年 11 月迁移到 GitHub。

iBatis 一词来源于 "internet" 和 "abatis" 的组合，是一个基于 Java 的持久层框架。iBatis 提供的持久层框架包括 SQL Maps 和 Data Access Objects（DAO）。

## 2. MyBatis 下载地址

[https://github.com/mybatis/mybatis-3/releases](https://github.com/mybatis/mybatis-3/releases)

![image-20211020221358071](http://img.hl1015.top/blog/image-20211020221358071.png)

## 3. MyBatis 特性

- MyBatis 支持定制化 SQL、存储过程以及高级映射
- MyBatis 避免了几乎所有的 JDBC 代码和手动设置参数以及结果集解析操作
- MyBatis 可以使用简单的 XML 或注解实现配置和原始映射；将接口和 Java 的 POJO（Plain Ordinary Java Object，普通的 Java 对象）映射成数据库中的记录
- MyBatis 是一个半自动的 ORM（Object Relation Mapping）框架

## 4. 和其他持久层技术对比

- JDBC
  - SQL 夹杂在 Java 代码中耦合度高，导致硬编码内伤
  - 维护不易且实际开发需求中 SQL 有变化，频繁修改的情况多见
  - 代码冗长，开发效率低
- Hibernate 和 JPA
  - 操作简便，开发效率高
  - 程序中的长难复杂 SQL 需要绕过框架
  - 内部自动生成的 SQL，不容易做特殊优化 
  - 基于全映射的全自动框架，大量字段的 POJO 进行部分映射时比较困难
- MyBais
  - 轻量级，性能出色
  - SQL 和 Java 编码分开，功能边界清晰。Java 代码专注业务、SQL 语句专注数据
  - 开发效率稍逊于 Hibernate，但是完全能够接受