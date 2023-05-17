---
title: 函数
date: 2021-09-11
category: MySQL
tag:
 - MySQL 基础
---

## 1. 函数和存储过程的区别

函数和存储过程的定义一样，但有如下区别：

（1）存储过程：可以有0个返回，也可以有多个返回，适合做批量插入、批量更新（增删改）

（2）函数：有且仅有1个返回，适合做处理数据后返回一个结果（查询）

## 2. 函数的创建和调用

### 2.1 创建语法

```sql
CREATE FUNCTION 函数名(参数列表) RETURNS 返回类型
BEGIN
    函数体
END
```

**注意：**

（1）参数列表包含两部分：参数名、参数类型

（2）函数体中肯定会有 RETURN 语句，如果没有会报错，如果 RETURN 语句没有放在函数体的最后不会报错，但不建议

（3）函数体中仅有一句话，可以省略 BEGIN END

（4）使用 DELIMITER 语句设置结束标记

### 2.2 调用语法

```sql
SELECT 函数名(参数列表);
```

### 2.3 案例演示

**（1）无参有返回**

案例：返回公司的员工个数

```sql
CREATE FUNCTION myf1() RETURNS INT
BEGIN
	DECLARE count INT DEFAULT 0;# 声明局部变量
	SELECT COUNT(*) INTO count# 为变量赋值
	FROM employees;
	RETURN count;# 返回结果
END $
```

![image-20210911090703288](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911090703288.png)

**（2）有参有返回**

案例1：根据员工名，返回他的工资

```sql
CREATE FUNCTION myf2(empName VARCHAR(20)) RETURNS DOUBLE
BEGIN
	SET @sal = 0;# 定义用户变量
	SELECT salary INTO @sal# 为变量赋值
	FROM employees
	WHERE last_name = empName;
	RETURN @sal;
END $
```

![image-20210911090752494](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911090752494.png)

案例2：根据部门名，返回该部门的平均工资

```sql
CREATE FUNCTION myf3(deptName VARCHAR(20)) RETURNS DOUBLE
BEGIN
	DECLARE avgSal DOUBLE DEFAULT 0;
	SELECT AVG(emp.salary) INTO avgSal
	FROM employees AS emp JOIN departments AS dept
	ON emp.department_id = dept.department_id
	WHERE dept.department_name = deptName;
	RETURN avgSal;
END $
```

![image-20210911090825668](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911090825668.png)

## 3. 查看函数

```sql
SHOW CREATE FUNCTION 函数名;
```

## 4. 删除函数

```sql
DROP FUNCTION 函数名;
```

