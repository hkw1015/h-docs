---
title: 常用函数
date: 2021-09-11
category: MySQL
tag:
 - MySQL 基础
---

## 1. 概述

### 1.1 概念

类似 Java 中的方法，将一组逻辑语句封装在方法体中，对外暴露方法名

### 1.2 好处

- 隐藏了实现细节
- 提高了代码的重用性

### 1.3 调用

```sql
SELECT 函数名(实参列表) 【FROM 表名】
```

### 1.4 需要了解

- 叫什么(函数名) 
- 干什么(函数功能)

### 1.5 分类

- 单行函数
  - 如 CONCAT、LENGTH、IFNULL 等
- 分组函数
  - 功能：做统计使用，又称为统计函数、聚合函数，组函数

## 2. 详细介绍

### 2.1 单行函数

#### 1、字符函数

**（1）LENGTH(str)：获取参数值 str 的字节长度**

```sql
SELECT LENGTH('john');
SELECT LENGTH('张三hahaha');
```

查询结果如下：

![image-20210910083924008](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910083924008.png)

可以通过如下语句查看当前客户端、服务端等的字符集编码格式

```sql
SHOW VARIABLES LIKE '%character%';
```

查询结果如下：

![image-20210910084028720](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910084028720.png)

**（2）CONCAT(str1,str2,...)：拼接字符串**

```sql
SELECT
	CONCAT( last_name, "_", first_name ) AS 姓名 
FROM
	employees;
```

查询结果如下：

![image-20210910084603815](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910084603815.png)

**（3）UPPER(str)、LOWER(str) --- UPPER(str)：将 str 转换为大写、LOWER(str)：将 str 转换为小写**

```sql
SELECT UPPER('john');
SELECT LOWER('JOHN');
```

查询结果如下：

![image-20210910084850237](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910084850237.png)

示例：将姓变大写，名变小写，然后拼接

```sql
SELECT
	CONCAT(
		UPPER( last_name ),
		"_",
	LOWER( first_name )) AS 姓名
FROM
	employees;
```

查询结果如下：

![image-20210911164139064](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911164139064.png)

**（4）SUBSTR、SUBSTRING：两个函数的作用相同，SUBSTR 是 SUBSTRING 的缩写形式**

> **<span style="color:red">注：索引从1开始</span>**

①SUBSTR(str,pos)：截取从 pos 索引处开始往后的所有字符

```sql
SELECT SUBSTR('李莫愁爱上了陆展元',7) AS "out put";
```

查询结果如下：

![image-20210910085248638](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910085248638.png)

②SUBSTR(str,pos,len)：截取从 pos 索引处开始往后 len 个字符长度的字符

```sql
SELECT SUBSTR('李莫愁爱上了陆展元',1,3) AS "out put";
```

查询结果如下：

![image-20210910085403117](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910085403117.png)

示例：姓中首字符大写，其他字符小写，然后用_拼接，显示出来

```sql
SELECT
	CONCAT(
		UPPER(
		SUBSTR( last_name, 1, 1 )),
		"_",
		LOWER(
		SUBSTR( last_name, 2 ))) AS "out put" 
FROM
	employees;
```

查询结果如下：

![image-20210911164254391](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911164254391.png)

**（5）INSTR(str,substr)：返回 substr 在 str 中第一次出现的起始索引，如果找不到就返回 0**

①找得到的情况

```sql
SELECT INSTR('hkw爱上了小李子','小李子') AS "out put";
```

查询结果如下：

![image-20210910085759254](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910085759254.png)

②找不到的情况

```sql
SELECT INSTR('hkw爱上了小李子','小子') AS "out put";
```

查询结果如下：

![image-20210910085852961](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910085852961.png)

**（6）TRIM(【remstr FROM】 str)：默认去掉前后空格，也可自己指定去掉的内容，格式：内容 + FROM + '要操作的字符'**

①默认情况

```sql
SELECT LENGTH(TRIM('    哈哈哈    ')) AS "out put";
```

查询结果如下：

![image-20210910090103065](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910090103065.png)

②指定去掉的内容

```sql
SELECT TRIM('a' FROM 'aaaaaaaaaa哈哈哈aaaaaaa') AS "out put";
```

查询结果如下：

![image-20210910090142872](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910090142872.png)

**（7）LPAD(str,len,padstr)：用指定的字符 padstr 实现左填充到指定长度len**

```sql
SELECT LPAD('小李子',10,'*') AS "out put";
```

查询结果如下：

![image-20210910090323517](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910090323517.png)

如果指定的长度小于原字符长度，则会截取原字符到指定长度(从后往前截取)

```sql
SELECT LPAD('小李子',2,'*') AS "out put";
```

查询结果如下：

![image-20210910090358175](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910090358175.png)

**（8）RPAD(str,len,padstr)：用指定的字符 padstr 实现右填充到指定长度 len**

```sql
SELECT RPAD('小李子',10,'abc') AS "out put";
```

查询结果如下：

![image-20210910090600707](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910090600707.png)

同样，如果指定的长度小于原字符长度，则会截取原字符到指定长度(从后往前截取)

**（9）REPLACE(str,from_str,to_str)：使用 to_str 替换掉 str 中的 from_str**

```sql
SELECT REPLACE('张无忌爱上了周芷若','周芷若','赵敏') AS "out put";
```

查询结果如下：

![image-20210910090712828](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910090712828.png)

#### 2、数学函数

**（1）ROUND**

ROUND(X)：四舍五入

```sql
SELECT ROUND(1.65);
SELECT ROUND(-1.55);
```

查询结果如下：

![image-20210910090903149](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910090903149.png)

ROUND(X,D)：小数点后保留 D 位

```sql
SELECT ROUND(1.567,2);
```

查询结果如下：

![image-20210910091009819](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910091009819.png)

**（2）CEIL(X)：向上取整：返回>=X的最小整数**

```sql
SELECT CEIL(1.45);
SELECT CEIL(1.00);
SELECT CEIL(-1.55);
```

查询结果如下：

![image-20210910091115398](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910091115398.png)

**（3）FLOOR(X)：向下取整：返回<=X的最大整数**

```sql
SELECT FLOOR(9.99);
SELECT FLOOR(-9.99);
```

查询结果如下：

![image-20210910091247560](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910091247560.png)

**（4）TRUNCATE(X,D)：截短，小数点后保留 D 位**

```sql
SELECT TRUNCATE(1.65,1);
```

查询结果如下：

![image-20210910091501262](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910091501262.png)

**（5）MOD(N,M)**

取余：本质是 N - N/M*M

口诀：和 Java 中一样，N 是正，结果也为正，N 为负，结果也为负

```sql
SELECT MOD(10,3);
SELECT MOD(10,-3);
SELECT MOD(-10,3);
SELECT MOD(-10,-3);
```

查询结果如下：

![image-20210910091626662](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910091626662.png)

**（6）RAND()**

获取随机数，返回 [0,1) 之间的小数

```sql
SELECT RAND();
```

查询结果如下：

![image-20210910091747573](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910091747573.png)

#### 3、日期函数

**（1）NOW()：返回当前系统 日期 + 时间**

```sql
SELECT NOW();
```

查询结果如下：

![image-20210910091922755](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910091922755.png)

**（2）CURDATE()：返回当前系统 日期，不包含 时间**

```sql
SELECT CURDATE();
```

查询结果如下：

![image-20210910092020718](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910092020718.png)

**（3）CURTIME()：返回当前系统 时间，不包含 日期**

```sql
SELECT CURTIME();
```

查询结果如下：

![image-20210910092122566](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910092122566.png)

**（4）获取指定的部分：年、月、日、时、分、秒**

**YEAR(date)**：传入一个日期，会获取到里边的年份

```sql
SELECT YEAR(NOW()) AS 年;
SELECT YEAR('1996-8-11') AS 年;
SELECT YEAR(hiredate) AS 年 FROM employees;
```

查询结果如下：

![image-20210910092308719](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910092308719.png)

**MONTH(date)**：传入一个日期，会获取到里边的月份

**MONTHNAME(date)**：传入一个日期，会获取到里边的月份的英文名

```sql
SELECT MONTH(NOW()) AS 月;
SELECT MONTHNAME(NOW()) AS 月; # 获取月份的英文名
```

查询结果如下：

![image-20210910092427275](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910092427275.png)

<!--剩下的(日DAY、时HOUR、分MINUTE、秒SECOND)都一样的用法-->

**（5）STR_TO_DATE(str,format)：将字符 str 通过指定的格式 format 转换成日期**

| 序号  | 格式符 | 功能                                |
| :---- | :----- | :---------------------------------- |
| **1** | **%Y** | **四位的年份**                      |
| **2** | **%y** | **两位的年份**                      |
| **3** | **%m** | **月份（01 , 02 , ... , 11 , 12）** |
| **4** | **%c** | **月份（1 , 2 , ... , 11 , 12）**   |
| **5** | **%d** | **日（01 , 02 , ...）**             |
| **6** | **%H** | **小时（24 小时制）**               |
| **7** | **%h** | **小时（12 小时制）**               |
| **8** | **%i** | **分钟（00 , 01 , ... , 59）**      |
| **9** | **%s** | **秒（00 , 01 , ... , 59）**        |

```sql
SELECT STR_TO_DATE('1998-8-11','%Y-%c-%d') AS 日期;
```

查询结果如下：

![image-20210910093431999](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910093431999.png)

示例：查询入职日期为1992-4-3的员工信息

> 假设 '4-3 1992' 这里用了格式乱序或者不对的业务场景：
>
> 因为可能在 web 前端页面用户传过来的字符串日期不是完完全全地按照日期的格式，所以我们有必要通过STR_TO_DATE() 这个函数进行转换

```sql
SELECT
	* 
FROM
	employees 
WHERE
	hiredate = STR_TO_DATE( '4-3 1992', '%c-%d %Y' );
```

查询结果如下：

![image-20210910093709291](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910093709291.png)

**（6）DATE_FORMAT(date,format)：将日期通过指定的格式 format 转换成字符**

```sql
SELECT DATE_FORMAT(NOW(),'%y年%m月%d日') AS 日期;
```

查询结果如下：

![image-20210910094014888](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910094014888.png)

示例：查询有奖金的员工名和入职日期(xx月/xx日/ xx年)

```sql
SELECT
	last_name AS 员工名,
	DATE_FORMAT( hiredate, '%m月/%d/ %Y' ) AS 入职日期 
FROM
	employees 
WHERE
	commission_pct IS NOT NULL;
```

查询结果如下：

![image-20210910094105790](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910094105790.png)

**（7）DATEDIFF(expr1,expr2)：计算日期 expr1 和日期 expr2 之间的相差天数，expr1 大于 expr2**

示例：查询员工表中最大入职时间和最小入职时间的相差天数

```sql
SELECT DATEDIFF(MAX(hiredate),MIN(hiredate)) FROM employees;
```

查询结果如下：

![image-20210910094231336](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910094231336.png)

#### 4、流程控制函数

**（1）IF(expr1,expr2,expr3)**

类似 Java 中的 if else 和 三元表达式 的效果

判断的 expr1 的值，如果为 true，则返回 expr2 的值，如果为 false，则返回 expr3 的值

```sql
SELECT IF(5>2,'是','否') AS "5>2 吗";
```

查询结果如下：

![image-20210910094914612](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910094914612.png)

示例：

```sql
SELECT
	last_name,
	commission_pct,
IF
	( commission_pct IS NULL, '没奖金，呵呵', '有奖金，哈哈' ) 
FROM
	employees;
```

查询结果如下：

![image-20210910094952308](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910094952308.png)

**（2）CASE**

**CASE 函数的使用姿势一**

```sql
/*
类似于 Java 中的 switch...case
switch(变量或表达式) {
	case 常量值1 : 语句1;break;
	...
	default : 语句;break;
}
*/

# MySQL中
CASE 要判断的字段或表达式
    WHEN 常量值1 THEN 要显示的值1或语句1;
    WHEN 常量值2 THEN 要显示的值2或语句2;
    ...
    ELSE 要显示的值n或语句n;
END
```

```sql
/*
	示例：查询员工的工资，要求：
		部门编号=30，显示的工资为1.1倍，
		部门编号=40，显示的工资为1.2倍，
		部门编号=50，显示的工资为1.3倍，
		其他部门，显示的工资为原工资
*/
SELECT salary AS 原始工资,department_id,
CASE department_id
	WHEN 30 THEN salary*1.1
	WHEN 40 THEN salary*1.2
	WHEN 50 THEN salary*1.3
ELSE salary
END AS 新工资
FROM employees;
```

查询结果如下：

![image-20210910095412121](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910095412121.png)

**CASE函数的使用姿势二**

类似于 Java 中的 多重if

```sql
/*
类似于Java中的 多重if
if(条件1) {
	语句1;
} else if(条件2) {
	语句2;
}
... 
else {
	语句n;
}
*/

# MySQL中
CASE
    WHEN 条件1 THEN 要显示的值1或语句1;
    WHEN 条件2 THEN 要显示的值2或语句2;
    ...
    ELSE 要显示的值n或语句n;
END
```

```sql
# 查询员工工资的情况
/*
	如果工资>20000,显示A级别
	如果工资>15000,显示B级别
	如果工资>10000,显示C级别
	否则，显示D级别
*/
SELECT salary AS 工资,
CASE
    WHEN salary>20000 THEN 'A'
    WHEN salary>15000 THEN 'B'
    WHEN salary>10000 THEN 'C'
    ELSE 'D'
END AS 工资级别
FROM employees;
```

查询结果如下：

![image-20210910095712535](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910095712535.png)

#### 5、其他函数【补充】

**（1）VERSION()：查看数据库版本号**

```sql
SELECT VERSION();
```

查询结果如下：

![image-20210910094356107](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910094356107.png)

**（2）DATABASE()：查看当前数据库**

```sql
SELECT DATABASE();
```

查询结果如下：

![image-20210910094444073](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910094444073.png)

**（3）USER()：查看当前用户**

```sql
SELECT USER();
```

查询结果如下：

![image-20210910094523054](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910094523054.png)

**（4）MD5(str)：返回 str 的 MD5 加密形式**

```sql
SELECT MD5('hkw');
```

查询结果如下：

![image-20210910094630944](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910094630944.png)

> PASSWORD(str)：返回 str 的密码形式

### 2.2 分组函数

#### 1、功能

做统计使用，又称为统计函数、聚合函数、组函数

#### 2、分类

**SUM 求和、AVG 平均值、MAX 最大值、MIN 最小值、COUNT 计算个数（非空字段）**

#### 3、特点

- SUM、AVG 一般用于处理数值型，MAX、MIN、COUNT 可以处理任何类型
- 以上分组函数都忽略 NULL 值
- 可以和 DISTINCT 搭配实现去重的运算
- **一般使用 COUNT(*) 用作统计行数**
- **和分组函数一同查询的字段要求是 GROUP BY 后的字段**

#### 4、示例

**（1）简单使用**

```sql
SELECT SUM(salary) AS 工资之和 FROM employees;
SELECT AVG(salary) AS 工资平均值 FROM employees;
SELECT MAX(salary) AS 工资最大值 FROM employees;
SELECT MIN(salary) AS 工资最小值 FROM employees;
SELECT COUNT(salary) AS 统计个数 FROM employees;
```

查询结果如下：

![image-20210910100512598](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910100512598.png)

放到一个查询语句使用

```sql
SELECT
	SUM( salary ) AS 工资之和,
	ROUND(AVG( salary ),2) AS 工资平均值,
	MAX( salary ) AS 工资最大值,
	MIN( salary ) AS 工资最小值,
	COUNT( salary ) AS 统计个数 
FROM
	employees;
```

查询结果如下：

![image-20210910100626313](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910100626313.png)

**（2）和 DISTINCT 搭配使用**

```sql
SELECT SUM(DISTINCT salary),SUM(salary) FROM employees; # 计算所有不同工资的总和
SELECT COUNT(DISTINCT salary),COUNT(salary) FROM employees; # 计算有几种工资情况
```

查询结果如下：

![image-20210910100740117](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910100740117.png)

**（3）COUNT 函数的详细介绍**

- 作用：统计行数

- 方式一

  - ```sql
    SELECT COUNT(salary) FROM employees;
    ```

  - 查询结果如下：

    - ![image-20210910100855793](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910100855793.png)

- 方式二

  - ```sql
    SELECT COUNT(*) FROM employees;
    ```

  - 查询结果如下：

    - ![image-20210910100922866](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910100922866.png)

- 方式三

  - ```sql
    SELECT COUNT(1) FROM employees;
    ```

  - 查询结果如下：

    - ![image-20210910100946175](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210910100946175.png)

- **效率问题**

  - MYISAM 存储引擎下，COUNT(\*) 的效率最高（内部有个计数器，使用 COUNT(\*) 可以直接返回行数）
  - INNODB 存储引擎下，COUNT(*) 和 COUNT(1) 的效率差不多，比 COUNT(字段) 的效率要高（需要判断非空）