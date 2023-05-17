---
title: Apache-DBUtils 实现 CRUD 操作
date: 2021-09-14
category: Java
tag:
 - JDBC
---

## 1. Apache-DBUtils 简介

（1）commons-dbutils 是 Apache 组织提供的一个开源的 JDBC 工具类库，它是对 JDBC 的简单封装，学习成本极低，并且使用 dbutils 能极大简化 jdbc 编码的工作量，同时也不会影响程序的性能。

（2）API 介绍

①org.apache.commons.dbutils.QueryRunner

②org.apache.commons.dbutils.ResultSetHandler

③工具类：org.apache.commons.dbutils.DbUtils

## 2. commons-dbutils 的使用

**（1）添加一条记录**

```java
@Test
public void testInsert() {
	Connection conn = null;
	try {
		QueryRunner runner = new QueryRunner();
		conn = JDBCUtil.getConnection();
		String sql = "INSERT INTO stuinfo(stuName,gender,seat,age) VALUES(?,?,?,?)";
		int insert = runner.update(conn, sql, "小黄子","男","66666",20);
		System.out.println("添加了" + insert + "条记录");
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		JDBCUtil.closeResource(conn, null);
	}
}
```

**（2）查询一条或多条记录**

**①BeanHandler：用于封装一条记录**

```java
/**
 * BeanHandler:是ResultSetHandler接口的实现类，用于封装一条记录
 */
@Test
public void testQuery1() {
	Connection conn = null;
	try {
		QueryRunner runner = new QueryRunner();
		conn = JDBCUtil.getConnection();
		String sql = "SELECT * FROM stuinfo WHERE id = ?";
		BeanHandler<Stuinfo> rsh = new BeanHandler<>(Stuinfo.class);
		Stuinfo stuinfo = runner.query(conn, sql, rsh,14);
		System.out.println(stuinfo);
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		JDBCUtil.closeResource(conn, null);
	}
}
```

测试结果：

![image-20210914174221958](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914174221958.png)

**②BeanListHandler：用于封装多条记录**

```java
/**
 * BeanListHandler:是ResultSetHandler接口的实现类，用于封装多条记录
 */
@Test
public void testQuery2() {
	Connection conn = null;
	try {
		QueryRunner runner = new QueryRunner();
		conn = JDBCUtil.getConnection();
		String sql = "SELECT * FROM stuinfo";
		BeanListHandler<Stuinfo> rsh = new BeanListHandler<>(Stuinfo.class);
		List<Stuinfo> stuinfoList = runner.query(conn, sql, rsh);
		stuinfoList.forEach(System.out::println);
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		JDBCUtil.closeResource(conn, null);
	}
}
```

测试结果：

![image-20210914174300405](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914174300405.png)

**③MapHandler：用于封装一条记录**

将字段及相应字段的值作为 map 中的 key 和 value

```java
/**
 * MapHandler:是 ResultSetHandler 接口的实现类，用于封装一条记录
 * 将字段及相应字段的值作为 map 中的 key 和 value
 */
@Test
public void testQuery3() {
	Connection conn = null;
	try {
		QueryRunner runner = new QueryRunner();
		conn = JDBCUtil.getConnection();
		String sql = "SELECT * FROM stuinfo";
		MapHandler rsh = new MapHandler();
		Map<String, Object> stuinfo = runner.query(conn, sql, rsh);
		System.out.println(stuinfo);
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		JDBCUtil.closeResource(conn, null);
	}
}
```

测试结果：

![image-20210914174442808](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914174442808.png)

**④MapListHandler：用于封装多条记录**

```java
/**
 * MapListHandler:是ResultSetHandler接口的实现类，用于封装多条记录
 * 	将字段及相应字段的值作为map中的key和value
 */
@Test
public void testQuery4() {
	Connection conn = null;
	try {
		QueryRunner runner = new QueryRunner();
		conn = JDBCUtil.getConnection();
		String sql = "SELECT * FROM stuinfo";
		MapListHandler rsh = new MapListHandler();
		List<Map<String, Object>> stuinfoList = runner.query(conn, sql, rsh);
		stuinfoList.forEach(System.out::println);
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		JDBCUtil.closeResource(conn, null);
	}
}
```

测试结果：

![image-20210914174529075](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914174529075.png)

**⑤ScalarHandler：用于查询特殊值**

```java
/**
 * ScalarHandler:是ResultSetHandler接口的实现类，用于查询特殊值
 * 	将字段及相应字段的值作为map中的key和value
 */
@Test
public void testQuery5() {
	Connection conn = null;
	try {
		QueryRunner runner = new QueryRunner();
		conn = JDBCUtil.getConnection();
		String sql = "SELECT COUNT(*) FROM stuinfo";
		ScalarHandler rsh = new ScalarHandler();
		Long count = (Long) runner.query(conn, sql, rsh);
		System.out.println("表中一共有" + count + "条记录");
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		JDBCUtil.closeResource(conn, null);
	}
}
```

测试结果：

![image-20210914174651782](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914174651782.png)

**（3）使用 DbUtils 工具类实现关闭资源**

```java
/**
 * 使用 dbutils.jar 中提供的 DbUtils 工具类，实现资源的关闭
 * @param conn
 * @param ps
 * @param rs
 */
public stati	c void closeResource(Connection conn,Statement ps,ResultSet rs) {
	DbUtils.closeQuietly(conn);
	DbUtils.closeQuietly(ps);
	DbUtils.closeQuietly(rs);
}
```

