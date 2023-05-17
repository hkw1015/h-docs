---
title: 子查询
date: 2021-09-11
category: MySQL
tag:
 - MySQL 基础
---

## 1. 介绍

### 1.1 含义

- 出现在其他语句中的 SELECT 语句，称为子查询或内查询
- 内部嵌套其他 SELECT 语句的查询，称为主查询或外查询

### 1.2 示例

```sql
SELECT
	first_name 
FROM
	employees 
WHERE
	department_id IN ( 
    	SELECT
    		department_id 
    	FROM
		departments 
	WHERE
	location_id = 1700
);
```

### 1.3 分类

- **按子查询出现的位置分**
  - （1）SELECT 后面 -- 仅支持标量子查询
  - （2）FROM 后面 --- 支持表子查询
  - （3）**WHERE 或 HAVING 后面(★★★)** --- 支持 标量子查询(单行)、列子查询(多行)、行子查询(较少)
  - （4）EXISTS 后面（相关子查询） --- 支持表子查询
- **按结果集的行列数不同分**
  - （1）标量子查询（结果集只有一行一列）
  - （2）列子查询（结果集有一列多行）
  - （3）行子查询（结果集有一行多列）
  - （4）表子查询（结果集一般为多行多列）

### 1.4 特点

- 子查询放在小括号内
- 子查询一般放在比较条件的右侧
- 标量子查询，一般搭配着单行操作符使用
  - 单行操作符：>  <   >=  <=  =  <>
- 列子查询，一般搭配着多行操作符使用
  - 多行操作符：IN  ANY/SOME  ALL
  - ![image-20210910143143193](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910143143193.png)
- 子查询的执行优先于主查询执行，主查询的条件用到了子查询的结果

## 2. 子查询的使用

### 2.1 WHERE 或 HAVING 后面

#### 1、标量子查询（单行子查询）

**示例1：谁的工资比Abel高?**

第一步：查询 Abel 的工资   ①

```sql
SELECT
	salary 
FROM
	employees 
WHERE
	last_name = 'Abel';
```

查询结果如下：

![image-20210910143457178](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910143457178.png)

第二步，查询员工的信息，要求： salary>①结果

```sql
SELECT 
	employee_id, last_name, salary 
FROM 
	employees 	
WHERE 
	salary > ( 
		SELECT 
			salary 
		FROM 
		employees 
    WHERE 
		last_name = 'Abel' 
);
```

查询结果如下：

![image-20210910143556827](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910143556827.png)

**示例2：返回job_id与141号员工相同，salary比143号员工多的 姓名，job_id和工资**

第一步，查询141号员工的job_id   ①

```sql
SELECT
	job_id 
FROM
	employees 
WHERE
	employee_id = 141;
```

第二步，查询143号员工的salary   ②

```sql
SELECT
	salary 
FROM
	employees 
WHERE
	employee_id = 143;
```

第三步，查询员工的姓名，job_id和工资，要求：job_id=①结果，salary>②结果

```sql
SELECT last_name,job_id,salary FROM employees WHERE job_id=(
	SELECT
		job_id 
	FROM
		employees 
	WHERE
		employee_id = 141
) AND salary>(
	SELECT
		salary 
	FROM
		employees 
	WHERE
		employee_id = 143
);
```

查询结果如下：

![image-20210910143818361](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910143818361.png)



**示例3：返回工资最少的员工的last_name,job_id和salary**

第一步，查询员工中的最少工资   ①

```sql
SELECT
	MIN( salary ) 
FROM
	employees;
```

第二步，查询员工的last_name,job_id和salary，要求：工资=①结果

```sql
SELECT last_name,job_id,salary FROM employees WHERE salary=(
	SELECT
		MIN( salary ) 
	FROM
		employees
);
```

查询结果如下：

![image-20210910143926895](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910143926895.png)



**示例4：查询最低工资大于50号部门最低工资的部门id和其最低工资**

第一步，查询50号部门的最低工资

```sql
SELECT
	MIN( salary ) 
FROM
	employees 
WHERE
	department_id = 50;
```

第二步，查询各个部门的最低工资

```sql
SELECT MIN(salary) FROM employees GROUP BY department_id;
```

第三步，查询部门id和其最低工资，要求：最低工资大于50号部门最低工资

```sql
SELECT department_id,MIN(salary) FROM employees GROUP BY department_id HAVING MIN(salary)>(
	SELECT
		MIN( salary ) 
	FROM
		employees 
	WHERE
		department_id = 50
);
```

查询结果如下：

![image-20210910144111355](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910144111355.png)



**非法使用标量子查询的情况：**

```sql
SELECT department_id,MIN(salary) FROM employees GROUP BY department_id HAVING MIN(salary)>(
	SELECT
		salary // 这里返回了多行
	FROM
		employees 
	WHERE
		department_id = 50
);
```

或

```sql
SELECT department_id,MIN(salary) FROM employees GROUP BY department_id HAVING MIN(salary)>(
	SELECT
		MIN( salary )
	FROM
		employees 
	WHERE
		department_id = 1000 // 使用了不存在条件
);
```

#### 2、列子查询（多行子查询）

**示例1：查询location_id是1400或1700部门中的所有员工姓名**

第一步，查询location_id是1400或1700的所有部门编号   ①

```sql
SELECT
	department_id 
FROM
	departments 
WHERE
	location_id IN ( 1400, 1700 );
```

第二步，查询员工姓名，要求：部门编号=①结果

```sql
SELECT last_name FROM employees WHERE department_id IN (
	SELECT
		department_id 
	FROM
		departments 
	WHERE
		location_id IN ( 1400, 1700 )
);
```

查询结果如下：

![image-20210910144411217](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910144411217.png)



**示例2：查询其他工种中比job_id为'IT_PROG'工种任一工资低的员工号、姓名、job_id以及salary**

第一步，查询job_id为'IT_PROG'工种的任一工资   ①

```sql
SELECT
	salary 
FROM
	employees 
WHERE
	job_id = 'IT_PROG';
```

第二步，查询其他工种的员工号、姓名、job_id以及salary，要求：salary比①结果任一工资低

```sql
SELECT
	employee_id,
	last_name,
	job_id,
	salary 
FROM
	employees 
WHERE
	salary < ANY ( 
	SELECT
		salary 
	FROM
		employees 
	WHERE
	job_id = 'IT_PROG'
);
```

查询结果如下：

![image-20210910144553635](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910144553635.png)

#### 3、行子查询（结果集为一行多列或多列多行）

**示例1：查询员工编号最小并且工资最高的员工信息**

第一步，查询最小的员工编号   ①

```sql
SELECT MIN(employee_id) FROM employees;
```

第二步，查询最高工资   ②

```sql
SELECT MAX(salary) FROM employees;
```

第三步，查询员工信息，要求：员工编号=①结果，工资=②结果

```sql
SELECT * FROM employees WHERE (employee_id,salary) = (
	SELECT MIN(employee_id),MAX(salary) FROM employees
);
```

### 2.2 SELECT 后面

示例1：查询每个部门的员工个数

```sql
SELECT d.department_id,d.department_name,(
	SELECT
		COUNT(*) 
	FROM
		employees AS e 
	WHERE
		e.department_id = d.department_id
) AS 个数
FROM departments AS d;
```

查询结果如下：

![image-20210910145127945](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910145127945.png)



示例2：查询员工号=102的部门名

```sql
SELECT e.department_id,(
	SELECT
		d.department_name 
	FROM
		departments AS d 
	WHERE
		d.department_id = e.department_id
) AS 部门名
FROM
	employees AS e 
WHERE
	e.employee_id = 102;
```

查询结果如下：

![image-20210910145158740](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910145158740.png)

### 2.3 FROM 后面

**将子查询结果充当一张表，要求必须起别名**

示例1：查询每个部门的平均工资的工资等级

第一步，查询每个部门的平均工资

```sql
SELECT
	AVG( salary ),
	department_id 
FROM
	employees 
GROUP BY
	department_id;
```

​	第二步，查询工资等级

```sql
SELECT avg_dep.dep,g.grade_level FROM (
	SELECT
		AVG( salary ) AS avg,
		department_id AS dep 
	FROM
		employees 
	GROUP BY
		department_id
) AS avg_dep
INNER JOIN job_grades AS g
ON avg_dep.avg BETWEEN g.lowest_sal AND g.highest_sal;
```

查询结果如下：

![image-20210910150603085](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910150603085.png)

### 2.4 EXIST 后面（相关子查询）

**语法**

```sql
EXISTS(完整的SELECT查询语句)
结果：返回1或0
```

```sql
SELECT EXISTS(SELECT employee_id FROM employees);
```

查询结果如下：

![image-20210910150926984](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910150926984.png)



示例1：查询有员工的部门名

```sql
SELECT department_name FROM departments AS d WHERE EXISTS(
	SELECT
		*
	FROM
		employees AS e 
	WHERE
		d.department_id = e.department_id
);
```

示例2：查询没有女朋友的男神信息

```sql
SELECT boyName FROM boys AS bo WHERE NOT EXISTS(
	SELECT
		* 
	FROM
		beauty AS b 
	WHERE
		b.boyfriend_id = bo.id
);
```

