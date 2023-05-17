---
title: 总结
date: 2021-09-14
category: Java
tag:
 - JDBC
---

**（1）考虑事务以后的数据库操作**

```java
// 1、获取数据库的连接
Connection conn = JDBCUtils.getConnection(); // 方式1：手动获取连接 方式2：数据库连接池
conn.setAutoCommit(false); // 体现事务

// 2、如下的多个 DML 操作，作为一个事务出现
操作1：需要使用通用的增删改查操作 // 通用的增删改查操作如何实现？
操作2：需要使用通用的增删改查操作 // 方式1：手动使用 PreparedStatement 实现
操作3：需要使用通用的增删改查操作 // 方式2：使用 dbUtils.jar 中的 QueryRunner 方法
conn.commit();

// 3、如果出现异常，则
conn.rollback();

// 4、关闭资源
JDBCUtils.closeResource(...,...,...,); // 方式1：手动关闭资源 方式2：使用 DbUtils 类的关闭方法
```

**（2）使用数据库连接池的好处**

- 提高程序的响应速度（减少了创建连接响应的时间）
- 降低资源的消耗（可以重复使用已经提供好的连接）
- 便于连接的管理