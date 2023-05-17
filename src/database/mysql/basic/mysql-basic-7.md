---
title: 创建和管理表
date: 2021-09-11
category: MySQL
tag:
 - MySQL 基础
---

## 1. 库的管理

### 1.1 创建库

- 语法

  - ```sql
    CREATE DATABASE 【IF NOT EXISTS】 库名 【CHARACTER SET 字符集名】;
    ```

- 示例

  - 创建一个库名为books的数据库

  - ```sql
    CREATE DATABASE IF NOT EXISTS books;
    ```

  - 创建结果如下：

    - ![image-20210910153405081](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910153405081.png)

### 1.2 修改库（修改字符集）

```sql
ALTER DATABASE 库名 CHARACTER SET 字符集名;
```

### 1.3 删除库

```sql
DROP DATABASE 【IF EXISTS】 库名;
```

## 2. 表的管理

### 2.1 创建表

- 语法

  - ```sql
    CREATE TABLE 【IF NOT EXISTS】 表名(
        字段名 字段类型 【约束】,
        字段名 字段类型 【约束】,
        ...
        字段名 字段类型 【约束】
    );
    ```

- 示例

  - 创建表名分别为book和author的两个表

  - ```sql
    USE books;
    CREATE TABLE IF NOT EXISTS book(
        id INT,# 编号
        bName VARCHAR(20),# 图书名
        price DOUBLE,# 价格
        authorId INT,# 作者编号
        publicDate DATETIME# 出版日期
    );
    
    CREATE TABLE IF NOT EXISTS author(
        id INT,
        au_name VARCHAR(20),# 作者名
        nation VARCHAR(10)# 国籍
    );
    ```

  - 创建结果如下：

    - ![image-20210910153713310](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910153713310.png)

### 2.2 修改表

#### 2.2.1 添加新列

```sql
ALTER TABLE 表名 ADD COLUMN 列名 类型 【新约束】 【first|after 字段名】;
```

#### 2.2.2 修改列的类型或约束

```sql
ALTER TABLE 表名 MODIFY COLUMN 列名 类型 【新约束】
```

#### 2.2.3 修改列名

```sql
ALTER TABLE 表名 CHANGE COLUMN 旧列名 新列名 类型;
```

#### 2.2.4 删除列

```sql
ALTER TABLE 表名 DROP COLUMN 列名;
```

#### 2.2.5 修改表名

```sql
ALTER TABLE 表名 RENAME 【TO】 新表名;
```

### 2.3 删除表

```sql
DROP TABLE 【IF EXISTS】 表名;
```

### 2.4 复制表

#### 2.4.1 复制表的结构

```sql
CREATE TABLE 新表名 LIKE 旧表;
```

#### 2.4.2 复制表的结构 + 数据

```sql
CREATE TABLE 表名
SELECT 查询列表 FROM 旧表 【WHERE 筛选条件】;
```

