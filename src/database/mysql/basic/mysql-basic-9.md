---
title: 约束
date: 2021-09-11
category: MySQL
tag:
 - MySQL 基础
---

## 1. 什么是约束？

### 1.1 含义

- 为了保证数据的一致性和完整性，SQL 规范以约束的方式对表数据进行额外的条件限制
- 约束是表级的强制规定
- 可以在创建表时规定约束（通过 CREATE TABLE 语句），或者在表创建之后也可以（通过 ALTER TABLE 语句）

### 1.2 约束分类

有以下六大约束：

- **NOT NULL**：非空约束，规定某个字段不能为空，比如姓名，学号等
- **UNIQUE**：唯一约束，规定某个字段在整个表中是唯一的，可以为空，比如座位号
- **PRIMARY KEY**：主键约束(非空且唯一)，比如学号，员工编号
- **FOREIGN KEY**：外键约束，用于限制两个表的关系
  - (在从表中添加外键约束，用于引用主表中某列的值，比如学生表的专业编号，员工表的部门编号)
- **CHECK**：检查约束(MySQL 不支持，但也不报错)，比如年龄，性别
- **DEFAULT**：默认值，用于保证该字段有默认值，比如性别、删除标识

### 1.3 约束的添加分类

- ①列级约束：只能作用在一个列上，跟在列定义的后面

  - **六大约束都支持，但外键约束没有效果**

- ②表级约束：可以作用在多个列上，不与列一起，而是单独定义

  - **除了非空和默认，其他都支持**

  - ```sql
    CREATE TABLE 表名 {
        字段名 字段类型 列级约束,
        字段名 字段类型,
        表级约束
    }
    ```

## 2. 创建表时添加约束

### 2.1 添加列级约束

**语法**：直接在字段名和类型后面追加约束类型即可，只支持：默认、非空、主键、唯一

```sql
CREATE DATABASE students;
USE students;

CREATE TABLE stuinfo (
    id INT PRIMARY KEY,# 主键
    stuName VARCHAR(20) NOT NULL,# 非空
    gender CHAR(1) CHECK(gender='男' OR gender='女'),# 检查约束
    seat INT UNIQUE,# 唯一
    age INT DEFAULT 18 # 默认值
);

# 查看stuinfo中的所有索引，包括主键、外键、唯一
SHOW INDEX FROM stuinfo;
```

索引查看结果如下：

![image-20210910164856785](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910164856785.png)

### 2.2 添加表级约束

**语法**

在各个字段的最下面：

【CONSTRAINT 约束名】 约束类型(字段名)

```sql
DROP TABLE IF EXISTS stuinfo;

CREATE TABLE major (
    id INT PRIMARY KEY,
    majorName VARCHAR(20)
);

CREATE TABLE stuinfo (
    id INT,
    stuName VARCHAR(20) NOT NULL,# 非空
    gender CHAR(1),
    seat INT,
    age INT DEFAULT 18,# 默认值
    majorid INT,
    
    CONSTRAINT pk PRIMARY KEY(id),# 主键
    CONSTRAINT uq UNIQUE(seat),# 唯一
    CONSTRAINT ck CHECK(gender='男' OR gender='女'),# 检查
    CONSTRAINT fk_stuinfo_major FOREIGN KEY(majorid) REFERENCES major(id) # 外键
);

# 查看stuinfo中的所有索引，包括主键、外键、唯一
SHOW INDEX FROM stuinfo;
```

索引查看结果如下：

![image-20210910165127128](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910165127128.png)

### 2.3 通用的写法

```sql
CREATE TABLE IF NOT EXISTS stuinfo (
    id INT PRIMARY KEY,# 主键
    stuName VARCHAR(20) NOT NULL,# 非空
    gender CHAR(1) CHECK(gender='男' OR gender='女'),# 检查
    seat INT UNIQUE,# 唯一
    age INT DEFAULT 18,# 默认值
    majorid INT,
    CONSTRAINT fk_stuinfo_major FOREIGN KEY(majorid) REFERENCES major(id) # 外键
);
```

## 3. 修改表时添加约束

### 3.1 语法

- **添加列级约束**

  - ```sql
    ALTER TABLE 表名 MODIFY COLUMN 字段名 字段类型 新约束;
    ```

- **添加表级约束**

  - ```sql
    ALTER TABLE 表名 ADD 【CONSTRAINT 约束名】 约束类型(字段名) 【外键的引用】;
    ```

### 3.2 示例

**（1）添加非空约束**

```sql
ALTER TABLE stuinfo MODIFY COLUMN stuName VARCHAR(20) NOT NULL;
```

**（2）添加默认约束**

```sql
ALTER TABLE stuinfo MODIFY COLUMN age INT DEFAULT 18;
```

**（3）添加主键约束**

①列级约束

```sql
ALTER TABLE stuinfo MODIFY COLUMN id INT PRIMARY KEY;
```

②表级约束

```sql
ALTER TABLE stuinfo ADD PRIMARY KEY(id);
```

**（4）添加唯一约束**

①列级约束

```sql
ALTER TABLE stuinfo MODIFY COLUMN seat INT UNIQUE;
```

②表级约束

```sql
ALTER TABLE stuinfo ADD UNIQUE(seat);
```

**（5）添加外键约束**

```sql
ALTER TABLE stuinfo ADD FOREIGN KEY(majorid) REFERENCES major(id);
```

## 4. 修改表时删除约束

**（1）删除非空约束**

```sql
ALTER TABLE stuinfo MODIFY COLUMN stuName VARCHAR(20) NULL;
```

**（2）删除默认约束**

```sql
ALTER TABLE stuinfo MODIFY COLUMN age INT;
```

**（3）删除主键约束**

```sql
ALTER TABLE stuinfo DROP PRIMARY KEY;
```

**（4）删除唯一约束**

```sql
# seat为对应的索引名称，可通过SHOW INDEX FROM stuinfo;语句进行查看
ALTER TABLE stuinfo DROP INDEX seat;
```

**（5）删除外键约束**

```sql
ALTER TABLE stuinfo DROP FOREIGN KEY fk_stuinfo_major;
```

## 5. 主键和唯一的对比

|                   | 是否保证唯一性 | 是否允许为空 | 一个表中是否允许有多个 | 是否允许组合 |
| :---------------: | :------------: | :----------: | :--------------------: | :----------: |
| 主键(PRIMARY KEY) |       √        |      ×       |       至多有一个       | √，但不推荐  |
|   唯一(UNIQUE)    |       √        |      √       |       可以有多个       | √，但不推荐  |

## 6. 外键的特点

- 要求在从表设置外键关系
- 从表外键列的类型和主表的关联列的类型要求一致或兼容，名称无要求
- 主表的关联列必须是一个 KEY (一般是主键或唯一)
- 插入数据时，先插入主表，再插入从表；删除数据时，先删除从表，再删除主表

