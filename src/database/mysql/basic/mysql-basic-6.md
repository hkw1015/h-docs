---
title: 数据处理之增删改
date: 2021-09-11
category: MySQL
tag:
 - MySQL 基础
---

## 1. DML 语句

- DML（Data Manipulation Language - 数据操纵语言）可以在下面的条件下执行
  - 向表中**插入**数据
  - **修改**现存数据
  - **删除**现存数据
- 事务是由完成若干项工作的 DML 语句组成的

## 2. 插入

### 2.1 方式一

- **语法**

  - ```sql
    INSERT INTO 表名(字段名,...) VALUES(值,...);
    ```

- **特点**

  - 要求值的类型和字段的类型要一致或兼容
  - 字段的个数和顺序不一定与原始表中的字段个数和顺序一致，但要保证值和字段一一对应
  - 假如表中有可以为 null 的字段，注意可以通过以下两种方式插入 null 值
    - 字段和值都省略
    - 字段写上，值使用null
  - 字段和值的个数必须一致
  - 字段名可以省略，默认所有列

### 2.2 方式二

- **语法**

  - ```sql
    INSERT INTO 表名 set 字段=值,字段=值,...;
    ```

### 2.3 两种方式的区别

（1）方式一支持一次插入多行，语法如下：

```sql
INSERT INTO 表名【(字段名,...)】 VALUES(值,...),(值,...),...;
```

（2）方式一支持子查询，语法如下：

```sql
INSERT INTO 表名
查询语句;
```

## 3. 更新

### 3.1 修改单表的记录（★）

```sql
UPDATE 表名 SET 字段=值,字段=值 【WHERE 筛选条件】
```

### 3.2 修改多表的记录【补充】

```sql
UPDATE 表1 别名
LEFT|RIGHT|INNER JOIN 表2 别名
ON 连接条件
SET 字段=值,字段=值
【WHERE 筛选条件】
```

## 4. 删除

### 4.1 方式一：使用 DELETE

#### 4.1.1 删除单表的记录（★）

```sql
DELETE FROM 表名 【WHERE 筛选条件】 【LIMIT 条目数】
```

#### 4.1.2 级联删除【补充】

```sql
DELETE 别名1,别名2 FROM 表1 别名1
INNER|LEFT|RIGHT JOIN 表2 别名2
ON 连接条件
【WHERE 筛选条件】
```

### 4.2 方式二：使用 TRUNCTE

```sql
TRUNCATE TABLE 表名
```

### 4.3 两种方式的区别【面试题】

- TRUNCATE 删除后，如果再插入，标识列从 1 开始；DELETE 删除后，如果再插入，标识列从断点开始
- DELETE 可以添加筛选条件；TRUNCATE 不可以添加筛选条件
- TRUNCATE 效率较高
- TRUNCATE 没有返回值；DELETE 可以返回受影响的行数
- TRUNCATE 不可以回滚；DELETE 可以回滚