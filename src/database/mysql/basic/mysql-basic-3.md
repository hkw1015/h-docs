---
title: 数据处理之查询
date: 2021-09-11
category: MySQL
tag:
 - MySQL 基础
---

## 0. 准备工作

在我们自己电脑的数据库中创建一些数据库表（SQL 执行脚本文件的网盘下载地址如下）

> **链接：[https://pan.baidu.com/s/1CwXAMv5YPpT6Sj5Dl7ykxg](https://pan.baidu.com/s/1CwXAMv5YPpT6Sj5Dl7ykxg)**
>
> **提取码：ghi2**

- 第一步，打开我们的 Navicat Premium
  - 右键 已连上的连接，选择 **运行 SQL 文件...**
    - ![image-20210909111744955](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909111744955.png)
- 第二步，选择好要执行的 sql 文件，点击开始
  - ![image-20210909111847172](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909111847172.png)
- 第三步，执行成功，点击关闭
  - ![image-20210909111928714](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909111928714.png)
- 第四步，这时候还看不见创建的表，我们需要刷新一下
  - 右键 连接，选择 **刷新**
    - ![image-20210909125704399](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909125704399.png)
  - 可以看到我们创建的表了
    - ![image-20210909125728897](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909125728897.png)
- 第五步，双击打开 myemployees 数据库，打开表，可以看到里面有四张表
  - ![image-20210909125844750](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909125844750.png)
- 第六步，分别右键这四张表，选择 **设计表**
  - 为这四张表的各个字段加上注释，方便后面对查询要求的理解
    - **departments表(部门表)**
      - ![image-20210909130059616](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909130059616.png)
    - **employees(员工表)**
      - ![image-20230512152053878](http://img.hl1015.top/work/image-20230512152053878.png)
    - **jobs(工种表)**
      - ![image-20210909130129912](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909130129912.png)
    - **locations(位置表)**
      - ![image-20210909130143888](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909130143888.png)

好，到此，我们的准备工作就结束了，下面我们正式开始我们的 **`DQL(Data Query Language)：数据查询语言`** 的学习!!!

## 1. 基本的 SELECT 语句

- **语法**

  - ```sql
    SELECT 查询列表 FROM 表名;
    # 类似于Java中的：System.out.println(要打印的东西);
    ```

- **特点**

  - 查询列表可以是：**表中的字段、常量值、表达式、函数**
  - 通过 select 查询到的结果，是一个**虚拟的表格，不是真实存在**

- **基础查询**

  - **查询表中的单个字段**（last_name)

    - ```sql
      SELECT last_name FROM employees;
      ```

    - 查询结果如下：

      - ![image-20210909130949353](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909130949353.png)

  - **查询表中的多个字段**（last_name , salary , email）

    - ```sql
      SELECT last_name,salary,email FROM employees;
      ```

    - 查询结果如下：

      - ![image-20210909131134922](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909131134922.png)

  - **查询表中的所有字段**

    - **方式一：挨个列出表中的所有字段，自己可调整顺序**

      - ```sql
        SELECT
        	employee_id,
        	first_name,
        	last_name,
        	email,
        	phone_number,
        	job_id,
        	salary,
        	commission_pct,
        	manager_id,
        	department_id,
        	hiredate 
        FROM
        	employees;
        ```

      - 查询结果如下：

        - ![image-20210909131448887](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909131448887.png)

    - **方式二：使用 * 号，好处是简单，但是调整不了顺序**

      - ```sql
        SELECT * FROM employees;
        ```

      - 查询结果如下：

        - ![image-20210909131610348](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909131610348.png)

    - **<span style="color:red">注</span>**：当我们表中的某个字段和某个关键字相同时，为了予以区分，我们可以在查询时为字段加一对着重号``(键盘上位置：在 1 的左边)

      - ```sql
        SELECT `name` from 表名
        ```

  - **查询常量值**

    - ```sql
      SELECT 100;
      SELECT 'hkw';
      ```

    - 查询结果如下：

      - ![image-20210909131929328](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909131929328.png)

    - **<span style="color:red">注</span>**：**字符型和日期型**的常量值必须用**单引号引起来**，数值型不需要

  - **查询表达式**

    - ```sql
      SELECT 5*100;
      ```

    - 查询结果如下：

      - ![image-20210909132103944](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909132103944.png)

  - **查询函数**

    - ```sql
      SELECT VERSION();
      ```

    - 查询结果如下：

      - ![image-20210909132212605](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909132212605.png)

  - **起别名**

    - 作用

      - 便于提高可读性
      - 如果要查询的字段有重名的情况，使用别名可以区分开来

    - **方式一：使用 AS（推荐，提高可读性）**

      - ```sql
        SELECT 5*100 AS 结果;
        SELECT last_name AS 姓,first_name AS 名 FROM employees;
        ```

      - 查询结果如下：

        - ![image-20210909132453941](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909132453941.png)

    - **方式二：AS 省略，加个空格即可**

      - ```sql
        SELECT last_name 姓,first_name 名,salary 月薪 FROM employees;
        ```

      - 查询结果如下：

        - ![image-20210909132551477](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909132551477.png)

      - 示例：查询 salary，显示结果为 out put

        - **<span style="color:red">注</span>**：别名中间有空格的，需要使用 "" 或者 '' 引起来（MySQL 中建议使用 ""）

        - ```sql
          SELECT salary AS "out put" FROM employees;
          ```

        - 查询结果如下：

          - ![image-20210909132801369](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909132801369.png)

  - **去重**

    - 去重关键字：**DISTINCT**

    - 示例：查询员工表中涉及到的所有的部门编号

      - ```sql
        SELECT DISTINCT department_id FROM employees;
        ```

      - 查询结果如下：

        - ![image-20210909133002382](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909133002382.png)

  - **+ 号的作用**

    - 回顾一下 Java 中 + 号的作用

      - 运算符，两个操作数都为数值型
      - 连接符，只要有一个操作数为字符型

    - 而 MySQL 中的 + 号的作用：仅仅只有一个功能，运算符

      - select 100+200; 两个操作数都为数值型，则作加法运算

        - ```sql
          SELECT 100+200;
          ```

        - 查询结果如下：

          - ![image-20210909133423749](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909133423749.png)

      - select '100'+200; 其中一个为字符串，试图将字符串转换为数值型，如果转换成功，则继续做加法运算

        - ```sql
          SELECT '100'+200;
          ```

        - 查询结果如下：

          - ![image-20210909133704465](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909133704465.png)

      - select 'john'+100; 如果转换失败，则将字符型数值转换成0

        - ```sql
          SELECT 'john'+100;
          ```

        - 查询结果如下：

          - ![image-20210909133959057](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909133959057.png)

      - select null+100; 只要其中一方为 null，则结果肯定为 null

        - ```sql
          SELECT null+100;
          ```

        - 查询结果如下：

          - ![image-20210909134315963](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909134315963.png)

    - 示例：查询员工名+姓连接成一个字符串，并显示姓名

      - 所以这里用 + 号就实现不了，我们可以使用 **CONCAT** 实现字符串连接

      - ```sql
        SELECT CONCAT(last_name,first_name) AS 姓名 FROM employees;
        ```

      - 查询结果如下：

        - ![image-20210909134637818](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909134637818.png)

  - **IFNULL(expr1,expr1)**

    - 实现判断 expr1 是否为 null 值，并在为 null 时赋上一个默认值 expr2

    - ```sql
      SELECT IFNULL(commission_pct,0),commission_pct FROM employees;
      ```

    - 查询结果如下：

      - ![image-20210909134837690](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909134837690.png)

  - **ISNULL(expr)**

    - 判断某个字段是否为 null，如果是，返回 1，如果不是，返回 0

    - ```sql
      SELECT ISNULL(commission_pct),commission_pct FROM employees;
      ```

    - 查询结果如下：

      - ![image-20210909134947651](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909134947651.png)

## 2. 过滤和排序

### 2.1 过滤查询，又称条件查询

#### 1、语法

使用 WHERE 子句，将不满足的行过滤掉

```sql
SELECT ------------第三步
    查询列表
FROM  -------------第一步
    表名
WHERE -------------第二步
    	筛选条件;
```

#### 2、<span style="color:red">执行顺序</span>

1. FROM 表名（先去看看当前库里边有没有对应的表，有的话就定位到这个表）
2. WHERE 筛选条件（去筛选满足条件的行）
3. SELECT 查询列表

#### 3、分类

- **按条件表达式筛选**

  - 简单条件运算符：\>  <  =  !=  <>  >=  <=

  - 示例1：查询工资大于12000的员工信息

    - ```sql
      SELECT
      	* 
      FROM
      	employees 
      WHERE
      	salary > 12000;
      ```

    - 查询结果如下：

      - ![image-20210909142703169](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909142703169.png)

  - 示例2：查询部门编号不等于90号的员工名和部门编号

    - ```sql
      SELECT
      	last_name,
      	department_id 
      FROM
      	employees 
      WHERE
      	department_id <> 90;
      ```

    - 查询结果如下：
    
      - ![image-20210909142838322](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909142838322.png)
  
- **按逻辑表达式筛选**

  - 逻辑表达式：&&  ||  ! **AND  OR  NOT(使用 MySQL 推荐的)**

    - && 和 AND：两个条件都为 true，结果为 true，反之为 false
    - || 和 OR：只要有一个条件为 true，结果为 true，反之为 false
    - ! 和 NOT：如果连接的条件本身为 false，结果为 true，反之为 false

  - 示例1：查询工资在10000到20000之间的员工名、工资以及奖金率

    - ```sql
      SELECT
      	last_name,
      	salary,
      	commission_pct 
      FROM
      	employees 
      WHERE
      	salary >= 10000 
      	AND salary <= 20000;
      ```

    - 查询结果如下：

      - ![image-20210909143053337](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909143053337.png)

  - 示例2：查询部门编号不是在90到110之间的，或者工资高于15000的员工信息

    - ```sql
      SELECT
      	* 
      FROM
      	employees 
      WHERE
      	department_id < 90 OR department_id > 110 
      	OR salary > 15000;
      ```

    - 或 

      ```sql
      SELECT
      	* 
      FROM
      	employees 
      WHERE
      	NOT ( department_id >= 90 AND department_id <= 110 ) 
      	OR salary > 15000;
      ```

    - 查询结果如下：

      - ![image-20210909143212052](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909143212052.png)

- **模糊查询**

  - ```sql
    LIKE
    BETWEEN AND
    IN
    IS NULL
    ```

  - 示例1：查询员工名中包含字符a的员工信息

    - ```sql
      SELECT
      	* 
      FROM
      	employees 
      WHERE
      	last_name LIKE '%a%';
      ```

    - 查询结果如下：

      - ![image-20210909143453688](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909143453688.png)

  - **LIKE 通常和通配符一起使用，既可用于判断字符型，也可以用于判断数值型**

    - 通配符：①%：任意**多个**字符，包含0个 ②_：任意**单个**字符

  - 示例2：查询员工名中第三个字符为n，第五个字符为l的员工名和工资

    - ```sql
      SELECT
      	last_name,
      	salary 
      FROM
      	employees 
      WHERE
      	last_name LIKE '__n_l%';
      ```

    - 查询结果如下：

      - ![image-20210909143727734](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909143727734.png)

  - 示例3：查询员工名中第二个字符为_的员工名

    - ```sql
      SELECT
      	last_name 
      FROM
      	employees 
      WHERE
      	last_name LIKE '_\_%';
      ```

    - 或

      ```sql
      SELECT
      	last_name 
      FROM
      	employees 
      WHERE
      	last_name LIKE '_$_%' ESCAPE '$';
      ```

      转义：可以使用 \ 进行转义，或者使用 **ESCAPE** 关键字进行转义（推荐）

    - 查询结果如下：

      - ![image-20210909143917839](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909143917839.png)

  - 示例4：查询员工编号在100到120之间的员工信息

    - ```sql
      SELECT
      	* 
      FROM
      	employees 
      WHERE
      	employee_id BETWEEN 100 
      	AND 120;
      ```

    - 查询结果如下：

      - ![image-20210909144001910](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909144001910.png)

        **BETWEEN  AND  可以提高语句的简洁度，包含临界值**

  - 示例5：查询员工的工种编号是IT_PROG、FI_MGR、AD_VP中的一个的员工名和工种编号

    - ```sql
      SELECT
      	last_name,
      	job_id 
      FROM
      	employees 
      WHERE
      	job_id IN ( 'IT_PROG', 'FI_MGR', 'AD_VP' );
      ```

    - 查询结果如下：

      - ![image-20210909144109405](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909144109405.png)

        **IN 的含义：判断某字段的值是否属于 IN 列表中的某一项**

        **使用 IN 可以提高语句简洁度**

        **IN 列表的值类型必须一致或兼容('123'，123)**

  - 示例6：查询没有奖金的员工名和奖金率

    - ```sql
      SELECT
      	last_name,
      	commission_pct 
      FROM
      	employees 
      WHERE
      	commission_pct IS NULL;
      ```

    - 查询结果如下：

      - ![image-20210909144217463](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909144217463.png)

    - 如果查询有奖金的员工名和奖金率?

      - ```sql
        SELECT
        	last_name,
        	commission_pct 
        FROM
        	employees 
        WHERE
        	commission_pct IS NOT NULL;
        ```

    - **= 或 <> 不能判断 null 值**

      **IS NULL 或 IS NOT NULL 可以判断 null 值**

      **IS NULL 和 <=> 的比较：**

      **①IS NULL：仅仅可以判断 null 值，可读性较高，建议使用**

      **②<=>(安全等于)：既可以判断 null 值，又可以判断普通的数值，可读性较低**

  - **经典面试题**

    - ```sql
      SELECT * FROM employees;
      ```

      和 

      ```sql
      SELECT * FROM employees WHERE comission_pct LIKE '%%' AND last_name LIKE '%%';
      ```

      结果是否一样?并说明原因

    - 答案：不一样，因为可能判断的字段会有 null 值。

### 2.2 排序查询

#### 1、语法

```sql
SELECT
    查询列表
FROM
    表名 
【WHERE
    筛选条件】
ORDER BY
    排序列表 【ASC/DESC】;
```

#### 2、特点

- ASC 代表升序，DESC 代表降序
- 如果不写，默认是升序
- ORDER BY 子句中可以支持单个字段、多个字段、表达式、函数和别名
- ORDER BY 子句一般是放在查询语句的最后面，limit 子句除外

#### 3、<span style="color:red">执行顺序</span>

1. FROM 表名
2. WHERE 筛选条件
3. SELECT 查询列表
4. ORDER BY 排序列表

#### 4、示例

- 示例1：查询员工信息，要求工资从高到低排序

  - ```sql
    SELECT
    	* 
    FROM
    	employees 
    ORDER BY
    	salary DESC;
    ```

  - 查询结果如下：

    - ![image-20210909151652494](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909151652494.png)

- 示例2：查询员工信息，要求工资从低到高排序

  - ```sql
    SELECT
    	* 
    FROM
    	employees 
    ORDER BY
    	salary ASC; // ASC 可以省略
    ```

  - 查询结果如下：

    - ![image-20210909151733953](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909151733953.png)

- 示例3：查询部门编号>=90的员工信息，按入职时间的先后顺序排序

  - ```sql
    SELECT
    	* 
    FROM
    	employees 
    WHERE
    	department_id >= 90 
    ORDER BY
    	hiredate ASC;
    ```

  - 查询结果如下：

    - ![image-20210909151850636](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909151850636.png)

- 示例4：按年薪的高低显示员工的信息和年薪【按表达式排序】

  - ```sql
    SELECT
    	*,
    	12 * salary *(1+IFNULL ( commission_pct, 0 )) 
    FROM
    	employees 
    ORDER BY
    	12 * salary *(1+IFNULL ( commission_pct, 0 )) DESC;
    ```

  - 查询结果如下：

    - ![image-20210909152027166](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909152027166.png)

- 示例5：按年薪的高低显示员工的信息和年薪【按别名排序】

  - ```sql
    SELECT
    	*,
    	12 * salary *(1+IFNULL ( commission_pct, 0 )) AS 年薪 
    FROM
    	employees 
    ORDER BY
    	年薪 DESC;
    ```

  - 查询结果如下：

    - ![image-20210909152114994](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909152114994.png)

- 示例6：按姓名的长度显示员工的姓名和工资【按函数排序】

  - ```sql
    SELECT
    	LENGTH( last_name ) AS 字节长度,
    	last_name,
    	salary 
    FROM
    	employees 
    ORDER BY
    	LENGTH( last_name ) DESC;
    ```

  - 查询结果如下：

    - ![image-20210909152151261](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909152151261.png)

      **LENGTH(str)：用来计算字符串的字节长度**

- 示例7：查询员工信息，要求先按工资升序，再按员工编号降序【按多个字段排序】

  - ```sql
    SELECT
    	* 
    FROM
    	employees 
    ORDER BY
    	salary ASC,
    	employee_id DESC;
    ```

  - 查询结果如下：

    - ![image-20210909152244164](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909152244164.png)

## 3. 分组查询

### 1、语法

```sql
SELECT 分组函数,列 (要求出现在GROUP BY的后面)
FROM 表名
【WHERE 筛选条件】
GROUP BY 分组的列表
【HAVING 分组后筛选】
【ORDER BY 排序列表】;
```

**<span style="color:red">注意</span>：查询列表必须特殊，要求是分组函数和 GROUP BY 后出现的字段**

### 2、执行顺序

1. FROM 表名
2. 【WHERE 筛选条件】
3. GROUP BY 分组的列表
4. 【HAVING 分组后筛选】
5. SELECT 分组函数,列 (要求出现在GROUP BY的后面)
6. 【ORDER BY 排序列表】

### 3、特点

- 分组查询中的筛选条件分为两类

  - | 时机       | 数据源         | 位置                | 关键字 |
    | ---------- | -------------- | ------------------- | ------ |
    | 分组前筛选 | 原始表         | GROUP BY 子句的前面 | WHERE  |
    | 分组后筛选 | 分组后的结果集 | GROUP BY 子句的后面 | HAVING |

- 分组函数做条件肯定是在 HAVING 子句中

- 能用分组前筛选的，就优先考虑使用分组前筛选
- GROUP BY 子句支持单个字段分组、多个字段分组(多个字段之间用逗号隔开没有顺序要求)、表达式或函数(用的较少)
- 也可以添加排序(排序放在整个分组查询的最后)

### 4、示例

#### 4.1 简单的分组查询

- 示例1：查询每个工种的最高工资

  - ```sql
    SELECT
    	MAX( salary ),
    	job_id 
    FROM
    	employees 
    GROUP BY
    	job_id;
    ```

  - 查询结果如下：

    - ![image-20210909153524819](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909153524819.png)

- 示例2：查询每个位置上的部门个数

  - ```sql
    SELECT
    	COUNT(*),
    	location_id 
    FROM
    	departments 
    GROUP BY
    	location_id;
    ```

  - 查询结果如下：

    - ![image-20210909153615356](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909153615356.png)

#### 4.2 添加分组前的筛选条件

- 示例1：查询邮箱中包含a字符的，每个部门的平均工资

  - ```sql
    SELECT
    	AVG( salary ),
    	email,
    	department_id 
    FROM
    	employees 
    WHERE
    	email LIKE '%a%' 
    GROUP BY
    	department_id;
    ```

  - 查询结果如下：

    - ![image-20210909153750167](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909153750167.png)

- 示例2：查询有奖金的每个领导手下员工的最高工资

  - ```sql
    SELECT
    	MAX( salary ),
    	manager_id 
    FROM
    	employees 
    WHERE
    	commission_pct IS NOT NULL 
    GROUP BY
    	manager_id;
    ```

  - 查询结果如下：

    - ![image-20210909153837603](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909153837603.png)

#### 4.3 添加分组后的筛选条件

这里需要使用后对分组结果筛选的关键字 **HAVING**

- 示例1：查询哪些部门的员工个数 > 2?

  - ```sql
    SELECT
    	COUNT(*),
    	department_id 
    FROM
    	employees 
    GROUP BY
    	department_id 
    HAVING
    	COUNT(*) > 2;
    ```

  - 查询结果如下：

    - ![image-20210909154025802](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909154025802.png)

- 示例2：查询每个工种有奖金的员工的最高工资>12000的工种编号和最高工资

  - ```sql
    SELECT
    	MAX( salary ) AS 最高工资,
    	job_id 
    FROM
    	employees 
    WHERE
    	commission_pct IS NOT NULL 
    GROUP BY
    	job_id 
    HAVING
    	MAX( salary ) > 12000;
    ```

  - 查询结果如下：

    - ![image-20210909154138185](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909154138185.png)

- 示例3：查询领导编号>102的每个领导手下的最低工资>5000的领导编号有哪些，以及其最低工资

  - ```sql
    SELECT
    	MIN( salary ),
    	manager_id 
    FROM
    	employees 
    WHERE
    	manager_id > 102 
    GROUP BY
    	manager_id 
    HAVING
    	MIN( salary )> 5000;
    ```

  - 查询结果如下：

    - ![image-20210909154520632](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909154520632.png)

#### 4.4 按多个字段分组

- 示例1：查询每个部门每个工种的员工的平均工资

  - ```sql
    SELECT
    	AVG( salary ),
    	department_id,
    	job_id 
    FROM
    	employees 
    GROUP BY
    	department_id,
    	job_id;
    ```

  - 查询结果如下：

    - ![image-20210909154700193](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909154700193.png)

#### 4.5 按表达式或函数分组

- 示例1：按员工的姓名长度分组，查询每一组的员工个数，筛选员工个数>5的有哪些

  - ```sql
    SELECT
    	COUNT(*) AS 员工人数,
    	LENGTH( last_name ) AS 姓名长度 
    FROM
    	employees 
    GROUP BY
    	LENGTH( last_name )
    HAVING
    	COUNT(*)>5;
    ```

  - 查询结果如下：

    - ![image-20210909154833689](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909154833689.png)

#### 4.6 添加排序

- 示例1：查询每个部门每个工种的员工的平均工资，并按平均工资的高低显示

  - ```sql
    SELECT
    	AVG( salary ),
    	department_id,
    	job_id 
    FROM
    	employees 
    GROUP BY
    	department_id,
    	job_id 
    ORDER BY
    	AVG( salary ) DESC;
    ```

  - 查询结果如下：

    - ![image-20210909154957689](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909154957689.png)

## 4. 连接查询

### 1、含义

又称多表查询，当查询的字段来自多个表时，就会用到连接查询

### 2、笛卡尔乘积现象

- 表 1 有 m 行，表 2 有 n 行，结果有 m*n 行

- 发生原因
  - **没有有效的<span style="color:red">连接条件</span>**，导致多个表所有行实现完全连接

- 如何避免
  - **添加有效的<span style="color:red">连接条件</span>**

### 3、分类

- **按年代分类**
  - sql92 标准：MySQL 中仅仅支持内连接(Oracle、sqlserver 中支持一部分外连接，不好用，不稳定)
  - **sql99 标准【推荐】**：MySQL 中支持内连接+外连接(左外+右外)+交叉连接

- **按功能分类**
  - 内连接：等值连接、非等值连接、自连接
  - 外连接：左外连接、右外连接、全外连接(MySQL 不支持)
  - 交叉连接

### 4、sql92 标准

#### 内连接

- **等值连接**

  - 特点

    - 多表等值连接的结果为多表的交集部分
    - n 表连接，至少需要 n-1 个连接条件
    - 多表的顺序没有要求
    - 一般需要为表起别名
    - 可以搭配前面学习的所有子句使用：排序、分组、筛选...

  - 准备工作：创建练习用的数据库和表(girls.sql)

    - 链接：[https://pan.baidu.com/s/1Q30C-lSAhFXp9WOCtJHesA](https://pan.baidu.com/s/1Q30C-lSAhFXp9WOCtJHesA)
    - 提取码：pvvg

  - 示例1：查询女神名对应的男神名

    - ```sql
      SELECT
      	`name`,
      	boyName 
      FROM
      	beauty,
      	boys 
      WHERE
      	beauty.boyfriend_id = boys.id;
      ```

    - 查询结果如下：

      - ![image-20210909160217914](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909160217914.png)

  - 示例2：查询员工名对应的部门名

    - ```sql
      SELECT
      	last_name,
      	department_name 
      FROM
      	employees,
      	departments 
      WHERE
      	employees.department_id = departments.department_id;
      ```

    - 查询结果如下：

      - ![image-20210909160254258](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909160254258.png)

  - 示例3：查询员工名，工种号，工种名

    - 可以考虑为表 **起别名，好处：①提高语句的简洁度 ②区分多个重名的字段**

      - **<span style="color:red">注意</span>：如果为表起了别名，则查询的字段就不能使用原来的表名去限定了**

    - ```sql
      SELECT
      	last_name,
      	e.job_id,
      	job_title 
      FROM
      	employees AS e,
      	jobs AS j 
      WHERE
      	e.job_id = j.job_id;
      ```

    - 查询结果如下：

      - ![image-20210909160642031](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909160642031.png)

    - **两个表的顺序可以换吗?---可以**

      - ```sql
        SELECT
        	last_name,
        	e.job_id,
        	job_title 
        FROM
        	jobs AS j,
        	employees AS e 
        WHERE
        	e.job_id = j.job_id;
        ```

      - 查询结果如下：（结果和示例3还是一样的）

        - ![image-20210909160816043](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909160816043.png)

  - 示例4：查询有奖金的员工名，部门名

    - ```sql
      SELECT
      	last_name,
      	department_name,
      	e.commission_pct 
      FROM
      	employees AS e,
      	departments AS d 
      WHERE
      	e.department_id = d.department_id 
      	AND e.commission_pct IS NOT NULL;
      ```

    - 查询结果如下：

      - ![image-20210909160925819](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909160925819.png)

  - 示例5：查询城市名中第二个字符为o的部门名和城市名

    - ```sql
      SELECT
      	department_name,
      	city 
      FROM
      	departments AS d,
      	locations AS l 
      WHERE
      	d.location_id = l.location_id 
      	AND l.city LIKE '_o%';
      ```

    - 查询结果如下：

      - ![image-20210909161654557](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909161654557.png)

  - 示例6：查询每个城市的部门个数

    - ```sql
      SELECT
      	COUNT(*) AS 部门个数,
      	department_id,
      	city 
      FROM
      	departments AS d,
      	locations AS l 
      WHERE
      	d.location_id = l.location_id 
      GROUP BY
      	l.city;
      ```

    - 查询结果如下：

      - ![image-20210909161805562](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909161805562.png)

  - 示例7：查询有奖金的每个部门的部门名，部门领导的编号以及该部门的最低工资

    - ```sql
      SELECT
      	d.department_name,
      	d.manager_id,
      	MIN( salary ) AS 最低工资 
      FROM
      	employees AS e,
      	departments AS d 
      WHERE
      	e.department_id = d.department_id 
      	AND commission_pct IS NOT NULL 
      GROUP BY
      	d.department_name,d.manager_id;
      ```

    - 查询结果如下：

      - ![image-20210909161840775](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909161840775.png)

  - 示例8：查询每个工种的工种名和员工的个数，并且按员工个数降序

    - ```sql
      SELECT
      	job_title,
      	COUNT(*) 
      FROM
      	employees AS e,
      	jobs AS j 
      WHERE
      	e.job_id = j.job_id 
      GROUP BY
      	j.job_title
      ORDER BY
      	COUNT(*) DESC;
      ```

    - 查询结果如下：

      - ![image-20210909161913433](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909161913433.png)

  - 示例9：查询员工名，部门名和所在的城市名（**三表连接**）

    - ```sql
      SELECT
      	last_name,
      	department_name,
      	city 
      FROM
      	employees AS e,
      	departments AS d,
      	locations AS l 
      WHERE
      	e.department_id = d.department_id 
      	AND d.location_id = l.location_id;
      ```

    - 查询结果如下：

      - ![image-20210909162220166](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909162220166.png)

- **非等值连接**

  - 准备工作：选中 myemployees 数据库，运行下面的 sql 语句，创建工资等级表 job_grades

    - ```sql
      CREATE TABLE job_grades
      (grade_level VARCHAR(3),
       lowest_sal  int,
       highest_sal int);
      
      INSERT INTO job_grades
      VALUES ('A', 1000, 2999);
      
      INSERT INTO job_grades
      VALUES ('B', 3000, 5999);
      
      INSERT INTO job_grades
      VALUES('C', 6000, 9999);
      
      INSERT INTO job_grades
      VALUES('D', 10000, 14999);
      
      INSERT INTO job_grades
      VALUES('E', 15000, 24999);
      
      INSERT INTO job_grades
      VALUES('F', 25000, 40000);
      ```

    - 运行成功后可以得到如下表：

      - ![image-20210909162543217](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909162543217.png)

  - 示例：查询员工的工资和工资等级

    - ```sql
      SELECT
      	salary,
      	grade_level 
      FROM
      	employees AS e,
      	job_grades AS g 
      WHERE
      	salary BETWEEN g.lowest_sal 
      	AND g.highest_sal;
      ```

    - 查询结果如下：

      - ![image-20210909162647961](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909162647961.png)

- **自连接**

  - 示例1：查询员工名和上级领导的名称

    - 自连接的应用场景：针对一些特殊含义的表，就比如我们的 employees 表，里边的员工 id 可以理解为普通员工的 id 和领导员工 id 的总和，所以在做上面这道例题的时候，我们需要用到两次 employees 表：一张表看作普通员工的表，一张表看作领导表，连接条件是普通员工的 manager_id = 领导员工的 employee_id

    - ```sql
      SELECT
      	e.employee_id AS 员工 id,
      	e.last_name AS 员工名,
      	m.employee_id AS 领导 id,
      	m.last_name AS 领导名称 
      FROM
      	employees AS e,
      	employees AS m 
      WHERE
      	e.manager_id = m.employee_id;
      ```

    - 查询结果如下：

      - ![image-20210909162840507](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909162840507.png)

### 5、sql99 标准（★★★）

#### 5.1 语法

```sql
SELECT 查询列表
FROM 表1 别名 【连接类型】
JOIN 表2 别名
ON 连接条件
【WHERE 筛选条件】
【GROUP BY 分组】
【HAVING 分组后筛选条件】
【ORDER BY 排序列表】;
```

#### 5.2 分类

- 内连接(★)：连接类型为 INNER
- 外连接(★)
  - 左外(★)：连接类型为LEFT【OUTER】
  - 右外(★)：连接类型为RIGHT【OUTER】
  - 全外：连接类型为FULL 【OUTER】
- 交叉连接：连接类型为 CROSS

#### 5.3 特点

- 可以添加排序、分组、筛选等
- INNER 可以省略
- 筛选条件放在 WHERE 后面，连接条件放在 ON 后面，提高分离性，便于阅读
- INNER JOIN 连接和 sql92 语法中的等值连接效果是一样的，都是查询多表的交集

#### 5.4 内连接

##### 5.4.1 语法

```sql
SELECT 查询列表
FROM 表1 别名
INNER JOIN 表2 别名
ON 连接条件;
```

##### 5.4.2 分类

- 等值连接
- 非等值连接
- 自连接

##### 5.4.3 示例

**（1）等值连接**

- 示例1：查询员工名、部门名

  - ```sql
    SELECT
    	e.last_name,
    	d.department_name 
    FROM
    	employees AS e
    	INNER JOIN departments AS d ON e.department_id = d.department_id;
    ```

  - 查询结果如下：

    - ![image-20210909163619176](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909163619176.png)

- 示例2：查询名字中包含a的员工名和工种名

  - ```sql
    SELECT
    	e.last_name,
    	j.job_title 
    FROM
    	employees AS e
    	INNER JOIN jobs AS j ON e.job_id = j.job_id 
    WHERE
    	e.last_name LIKE '%a%';
    ```

  - 查询结果如下：

    - ![image-20210909163711492](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909163711492.png)

- 示例3：查询部门个数>3的城市名和部门个数

  - ```sql
    SELECT
    	COUNT(*),
    	l.city 
    FROM
    	departments AS d
    	INNER JOIN locations AS l ON d.location_id = l.location_id 
    GROUP BY
    	l.city 
    HAVING
    	COUNT(*)> 3;
    ```

  - 查询结果如下：

    - ![image-20210909163827583](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909163827583.png)

- 示例4：查询部门个数>3的部门名和员工个数，并按个数排序

  - ```sql
    SELECT
    	department_name,
    	COUNT(*) AS 员工个数 
    FROM
    	departments AS d
    	INNER JOIN employees AS e ON d.department_id = e.department_id 
    GROUP BY
    	d.department_name 
    HAVING
    	COUNT(*)> 3 
    ORDER BY
    	员工个数 DESC;
    ```

  - 查询结果如下：

    - ![image-20210909164004555](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909164004555.png)

- 示例5：查询员工名、部门名、工种名，并按部门名降序

  - ```sql
    SELECT
    	e.last_name,
    	d.department_name,
    	j.job_title 
    FROM
    	employees AS e
    	INNER JOIN departments AS d ON e.department_id = d.department_id
    	INNER JOIN jobs AS j ON e.job_id = j.job_id 
    ORDER BY
    	d.department_name DESC;
    ```

  - 查询结果如下：

    - ![image-20210909164038411](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909164038411.png)

**（2）非等值连接**

- 示例1：查询员工的工资级别

  - ```sql
    SELECT
    	e.last_name,
    	g.grade_level 
    FROM
    	employees AS e
    	INNER JOIN job_grades AS g ON e.salary BETWEEN g.lowest_sal 
    	AND g.highest_sal;
    ```

  - 查询结果如下：

    - ![image-20210909164406905](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909164406905.png)

- 示例2：查询每个工资级别的个数，并且按工资级别降序

  - ```sql
    SELECT
    	g.grade_level AS 工资级别,
    	COUNT(*) AS 个数 
    FROM
    	employees AS e
    	INNER JOIN job_grades AS g ON e.salary BETWEEN g.lowest_sal 
    	AND g.highest_sal 
    GROUP BY
    	g.grade_level 
    HAVING
    	COUNT(*)> 20 
    ORDER BY
    	g.grade_level DESC;
    ```

  - 查询结果如下：

    - ![image-20210909164452035](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909164452035.png)

**（3）自连接**

- 示例：查询员工的名字和上级的名字

  - ```sql
    SELECT
    	e.employee_id AS 员工编号,
    	e.last_name AS 员工名,
    	m.employee_id AS 领导编号,
    	m.last_name AS 领导名 
    FROM
    	employees AS e
    	INNER JOIN employees AS m ON e.manager_id = m.employee_id;
    ```

  - 查询结果如下：

    - ![image-20210909164607969](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909164607969.png)

#### 5.5 外连接

##### 5.5.1 应用场景

用于查询一个表中有，另一个表中没有的记录

##### 5.5.2 特点

- 外连接的查询结果为主表中的所有记录 +
  - 如果从表中有和主表匹配的，则显示匹配的值
  - 如果从表中没有和主表匹配的，则显示 null
  - 所以**外连接的查询结果=内连接结果+主表中有而从表中没有的记录**
- **左外连接**：LEFT JOIN 左边的是主表 | **右外连接**：RIGHT JOIN 右边的是主表
- 左外和右外交换两个表的顺序，可以实现同样的效果
- 全外连接=内连接的结果+表1中有但表2中没有的记录+表2中有但表1中没有的记录

##### 5.5.3 示例

- 示例1：查询男朋友 不在女神表的女神名（左外连接）

  - ```sql
    SELECT
    	b.NAME,
    	bo.* 
    FROM
    	beauty AS b
    	LEFT JOIN boys AS bo ON b.boyfriend_id = bo.id;
    ```

  - 查询结果如下：

    - ![image-20210909165430567](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909165430567.png)

- 只想要男朋友 不在女神表的女神名，不要其他的信息

  - ```sql
    SELECT
    	b.NAME
    FROM
    	beauty AS b
    	LEFT JOIN boys AS bo ON b.boyfriend_id = bo.id WHERE bo.id IS NULL;
    ```

    **<span style="color:red">注：一般这种时候我们都拿从表的主键id做判断</span>**

  - 查询结果如下：

    - ![image-20210909165557556](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909165557556.png)

- 示例2：男朋友 不在女神表的女神名（右外连接）

  - 只需要换一下boys表和beauty表的位置，将LEFT改为RIGHT即可

  - ```sql
    SELECT
    	b.NAME
    FROM
    	boys AS bo
    	RIGHT JOIN beauty AS b ON b.boyfriend_id = bo.id WHERE bo.id IS NULL;
    ```

  - 查询结果如下：

    - ![image-20210909165557556](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909165557556.png)

- 示例3：查询哪些部门没有员工

  - ```sql
    SELECT
    	department_name 
    FROM
    	departments AS d
    	LEFT JOIN employees AS e ON d.department_id = e.department_id 
    WHERE
    	e.employee_id IS NULL;
    ```

  - 查询结果如下：

    - ![image-20210909165853031](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909165853031.png)

#### 5.6 交叉连接

其实就是使用 sql99 语法的标准实现的笛卡尔乘积

```sql
SELECT
	b.*,
	bo.* 
FROM
	beauty AS b
	CROSS JOIN boys AS bo;
```

查询结果如下：

![image-20210909170049705](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909170049705.png)

### 6、sql92 和 sql99 比较

**（1）功能**

sql99 支持的功能较多

**（2）可读性**

sql99 实现连接条件和筛选条件的分离，可读性较高

### 7、JOIN 连接总结

![image-20210909170819230](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909170819230.png)

![image-20210909170758036](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909170758036.png)

## 5. 分页查询

MySQL 中使用 **limit** 实现分页

### 5.1 应用场景

当显示数据时，一页显示不全，需要分页提交 sql 请求

### 5.2 语法

```sql
SELECT 查询列表
FROM 表1
【连接类型 JOIN 表2
ON 连接条件
WHERE 筛选条件
GROUP BY 分组列表
HAVING 分组后的筛选
ORDER BY 排序列表】
LIMIT offset,size;
```

offset：要显示的条目的起始索引(起始索引从 0 开始)

size：要显示的条目个数

### 5.3 特点

- LIMIT 语句放在查询语句的最后
- 公式：(当前要显示的页数 - 1) * 每页条数 , 每页条数

### 5.4 示例

- 示例1：查询前五条员工信息

  - ```sql
    SELECT * FROM employees LIMIT 0,5;
    ```

    或

    ```sql
    SELECT * FROM employees LIMIT 5;
    ```

    **如果从第一条数据开始，可以省略起始索引**

  - 查询结果如下：

    - ![image-20210909171606640](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909171606640.png)

- 示例2：查询第11条-第25条员工信息

  - ```sql
    SELECT * FROM employees LIMIT 10,15;
    ```

  - 查询结果如下：

    - ![image-20210909171716528](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909171716528.png)

## 6. 联合查询

### 6.1 语法

```sql
SELECT 字段|常量|表达式|函数 【FROM 表】 【WHERE 条件】 UNION 【ALL】
SELECT 字段|常量|表达式|函数 【FROM 表】 【WHERE 条件】 UNION 【ALL】
SELECT 字段|常量|表达式|函数 【FROM 表】 【WHERE 条件】 UNION 【ALL】
	.....
SELECT 字段|常量|表达式|函数 【FROM 表】 【WHERE 条件】
```

### 6.2 特点

- 多条查询语句的查询的列数必须是一致的
- 多条查询语句的查询的列的类型几乎相同
- union 代表去重，union all 代表不去重