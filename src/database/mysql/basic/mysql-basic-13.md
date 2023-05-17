---
title: 存储过程
date: 2021-09-11
category: MySQL
tag:
 - MySQL 基础
---

## 1. 什么是存储过程

### 1.1 含义

事先经过编译并存储在数据库中的一段 sql 语句的集合（类似于 Java 中的方法）

### 1.2 好处

（1）简化开发人员很多工作

（2）减少数据在数据库和应用服务器之间的传输

（3）提高了数据处理的效率

## 2. 创建和调用存储过程

### 2.1 语法

```sql
CREATE PROCEDURE 存储过程名(参数列表)
BEGIN
    存储过程体(一组合法有效的SQL语句)
END
```

### 2.2 注意

**参数列表包含三部分：**

```sql
参数模式 参数名 参数类型
```

**举例：**

```sql
IN stu_name VARCHAR(20);
```

**参数模式说明：**

- IN：该参数作为作为输入，也就是该参数需要调用方传入值
- OUT：该参数可以作为输出，也就是该参数可以作为返回值
- INOUT：该参数既可以作为输入又可以作为输出，也就是该参数既需要传入值，又可以返回值

（1）如果存储过程仅仅只有一句话，BEGIN END 可以省略

（2）存储过程体中的每条 SQL 语句的结尾要求必须加分号

（3）存储过程的结尾可以使用 **DELIMITER** 重新设置

```sql
DELIMITER 结束标记（命令行可用）
举例：
DELIMITER $
```

### 2.3 调用存储过程

```sql
CALL 存储过程名(实参列表);
```

### 2.4 示例

**（1）空参列表**

案例：插入到admin表中5条记录

```sql
DELIMITER $
CREATE PROCEDURE myp1()
BEGIN
	INSERT INTO admin(username,`password`) VALUES
	('jack','0000'),
	('tom','0000'),
	('lilei','0000'),
	('rose','0000'),
	('jerry','0000');
END $
```

![image-20210911085117296](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911085117296.png)

**（2）带 IN 模式的存储过程**

案例1：创建存储过程实现，根据女神名，查询对应的男神信息

```sql
CREATE PROCEDURE myp2(IN beautyName VARCHAR(20))
BEGIN
	SELECT bo.* FROM boys AS bo JOIN beauty AS b
	ON bo.id = b.boyfriend_id
	WHERE b.`name` = beautyName;
END $
```

![image-20210911085211116](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911085211116.png)

案例2：创建存储过程实现，用户是否登录成功

```sql
CREATE PROCEDURE myp3(IN username VARCHAR(20),IN password VARCHAR(20))
BEGIN
	DECLARE result INT DEFAULT 0;
	SELECT COUNT(*) INTO result
	FROM admin
	WHERE admin.username = username AND admin.password = password;
	SELECT IF(result > 0,'登录成功','登陆失败') AS 结果;
END $
```

![image-20210911085330109](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911085330109.png)

**（3）带 OUT 模式的存储过程**

案例1：根据女神名，返回对应男神名

```sql
CREATE PROCEDURE myp4(IN beautyName VARCHAR(20),OUT bName VARCHAR(20))
BEGIN
	SELECT bo.boyName INTO bName
	FROM boys AS bo
	JOIN beauty AS b ON bo.id = b.boyfriend_id
	WHERE b.`name` = beautyName;
END $
```

![image-20210911085650804](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911085650804.png)

案例2：根据女神名，返回对应男神名和男神魅力值

```sql
CREATE PROCEDURE myp5(IN beautyName VARCHAR(20),OUT bName VARCHAR(20),OUT userCP VARCHAR(20))
BEGIN
	SELECT bo.boyName,bo.userCP INTO bName,userCP
	FROM boys AS bo
	JOIN beauty AS b ON bo.id = b.boyfriend_id
	WHERE b.`name` = beautyName;
END $
```

![image-20210911085719157](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911085719157.png)

**（4）带 INOUT 模式的存储过程**

案例：传入a和b两个值，最终a和b都翻倍并返回

```sql
CREATE PROCEDURE myp6(INOUT a INT,INOUT b INT)
BEGIN
	SET a = a * 2;
	SET b = b * 2;
END $
```

![image-20210911085830789](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911085830789.png)

## 3. 存储过程的删除

```sql
DROP PROCEDURE 存储过程名;# 一次只能删除一个
```

## 4. 查看存储过程的信息

### 4.1 语法

```sql
SHOW CREATE PROCEDURE 存储过程名;
```

### 4.2 示例

```sql
SHOW CREATE PROCEDURE myp2;
```

查看结果：

![image-20210911084916194](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911084916194.png)

