---
title: 视图
date: 2021-09-11
category: MySQL
tag:
 - MySQL 基础
---

## 1. 什么是视图

### 1.1 概念

MySQL 从 5.0.1 版本开始提供视图功能。一种虚拟存在的表，行和列的数据来自定义视图的查询中使用的表，并且是在使用视图时**动态生成的**，**只保存了 sql 逻辑，不保存查询结果**

### 1.2 应用场景

（1）多个地方用到同样的查询结果

（2）该查询结果使用的sql语句较复杂

### 1.3 视图的好处

（1）重用 SQL 语句

（2）简化复杂的 SQL 操作，不必知道它的查询细节

（3）保护数据，提高安全性

## 2. 创建或修改视图

### 2.1 创建视图

#### （1）语法

```sql
CREATE VIEW 视图名
AS
查询语句;
```

#### （2）示例

示例1：查询姓名中包含a字符的员工名、部门名和工种信息

```sql
# （1）创建视图
CREATE VIEW myv1
AS
SELECT last_name,department_name,job_title FROM employees AS e
JOIN departments AS d ON e.department_id = d.department_id
JOIN jobs AS j ON e.job_id = j.job_id;

# （2）使用
SELECT * FROM myv1 WHERE last_name LIKE '%a%';
```

示例2：查询各部门的平均工资级别

```sql
# （1）创建视图
CREATE VIEW myv2
AS
SELECT AVG(salary) AS ag,department_id FROM employees
GROUP BY department_id;
# （2）使用
SELECT myv2.ag,grade_level FROM myv2
JOIN job_grades AS jg
ON myv2.ag BETWEEN jg.lowest_sal AND jg.highest_sal;
```

示例3：查询平均工资最低的部门信息

```sql
# 复用视图myv2
SELECT * FROM departments WHERE department_id = (
	SELECT department_id FROM myv2 ORDER BY ag LIMIT 1 # 默认 asc 排序，从小到大，取的第一个就是最低
);
```

示例4：查询平均工资最低的部门名和工资

```sql
# （1）创建视图
CREATE VIEW myv3
AS
SELECT * FROM myv2 ORDER BY ag LIMIT 1;
# （2）使用
SELECT d.department_name,myv3.ag FROM myv3
JOIN departments AS d ON myv3.department_id = d.department_id;
```

### 2.2 修改视图

#### （1）方式一

```sql
CREATE OR REPLACE VIEW 视图名
AS
查询语句;
```

#### （2）方式二

```sql
ALTER VIEW 视图名
AS
查询语句;
```

#### （3）注意点

**视图的可更新性（指的<span style="color:blue">增删改</span>）和视图中查询的定义有关系，以下类型的视图是不能更新的：**

- ①包含以下关键字的 sql 语句：分组函数、distinct、group by、having、union 或 union all

- ②常量视图

- ③SELECT 中包含子查询

- ④JOIN

- ⑤FROM 一个不能更新的视图

- ⑥WHERE 子句的子查询引用了 FROM 子句中的表


## 3. 视图的查看和删除

### 3.1 查看

（1）方式一

```sql
DESC 视图名;
```

（2）方式二（★）

```sql
SHOW CREATE VIEW 视图名;
```

### 3.2 删除

```sql
DROP VIEW 视图名1,视图名2,...;
```