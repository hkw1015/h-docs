---
title: 流程控制结构
date: 2021-09-11
category: MySQL
tag:
 - MySQL 基础
---

## 1. 流程控制结构说明

- **顺序结构**：程序从上往下依次执行
- **分支结构**：程序从两条或多条路径中选择一条去执行
- **循环结构**：程序在满足一定条件的基础上，重复执行一段代码

## 2. 分支结构

### 2.1 if 函数

（1）**功能**：实现简单的双分支

（2）**语法**

```sql
IF(表达式1,表达式2,表达式3)
# 执行顺序：如果 表达式1 成立，则IF函数返回 表达式2 的值，否则返回 表达式3 的值
```

（3）**应用**：任何地方

### 2.2 case 结构

**（1）分类**

**情况1**：类似于 java 中的 switch 语句，一般用于实现**<span style="color:blue">等值判断</span>**

```sql
CASE 变量|表达式|字段
WHEN 要判断的值 THEN 返回的值1或语句1;
WHEN 要判断的值 THEN 返回的值2或语句2;
...
ELSE 要返回的值n或语句n;
END CASE;
```

**情况2**：类似于 java 中的多重if语句，一般用于实现**<span style="color:blue">区间判断</span>**

```sql
CASE
WHEN 要判断的条件1 THEN 返回的值1或语句1;
WHEN 要判断的条件2 THEN 返回的值2或语句2;
...
ELSE 要返回的值n或语句n;
END CASE;
```

**（2）特点**

- 既可以作为表达式，嵌套在其他语句中使用，可以放在任何地方，BEGIN END 中或 BEGIN END 的外面；也可以作为独立的语句去使用，只能放在 BEGIN END 中（值或语句后面需要跟分号）
- 如果 WHEN 中的值满足或条件成立，则执行对应的 THEN 后面的语句，并且结束 CASE；如果都不满足，则执行 ELSE 中的语句或值
- ELSE 可以省略，如果 ELSE 省略了，并且所有的 WHEN 条件都不满足，则返回 null

**（3）案例演示**

案例：创建存储过程，根据传入的成绩，来显示等级，比如传入的成绩：90-100，显示A；80-90，显示B；60-80，显示C，否则，显示D

```sql
CREATE PROCEDURE myp7(IN score INT)
BEGIN
	CASE
	WHEN score>=90 AND score<=100 THEN SELECT 'A' AS 等级;
	WHEN score>=80 THEN SELECT 'B' AS 等级;
	WHEN score>=60 THEN SELECT 'C' AS 等级;
	ELSE SELECT 'D' AS 等级;
	END CASE;
END $
```

![image-20210911092118833](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911092118833.png)

### 2.3 if 结构

**（1）功能**：实现多重分支

**（2）语法**

```sql
# 应用在 BEGIN END 中

IF 条件1 语句1;
ELSEIF 条件2 语句2;
...
【ELSE 语句n;】
END IF;
```

（3）**案例演示**

案例：根据传入的成绩，来显示等级，比如传入的成绩：90-100，返回A；80-90，返回B；60-80，返回C；否则，返回D

```sql
CREATE FUNCTION test_if(score INT) RETURNS CHAR(1)
BEGIN
	IF score>=90 AND score<=100 THEN RETURN 'A';
	ELSEIF score>=80 THEN RETURN 'B';
	ELSEIF score>=60 THEN RETURN 'C';
	ELSE RETURN 'D';
	END IF;
END $
```

![image-20210911094839802](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911094839802.png)

## 3. 循环结构

### 3.1 分类

**（1）while**

```sql
【标签:】WHILE 循环条件 do
    循环体;
END WHILE【标签】;
```

**（2）loop --- 可以用来实现简单的死循环**

```sql
【标签:】LOOP
    循环体;
END LOOP【标签】;
```

**（3）repeat**

```sql
【标签:】REPEAT
    循环体;
UNTIL 结束循环的条件
END WHILE【标签】;
```

### 3.2 循环控制

（1）iterate 类似于 continue，继续，结束本次循环，继续下一次

（2）leave 类似于 break，跳出，结束当前所在的循环

###  3.3 案例演示 --- 主要演示 while

**（1）不添加循环控制**

案例1：批量插入，根据传入的次数往 admin 表中插入记录

```sql
CREATE PROCEDURE test_while1(IN count INT)
BEGIN
	DECLARE i INT DEFAULT 1;
	WHILE i<=count DO
		INSERT INTO admin(username,password) VALUES(CONCAT('Jack',i),'1234');
		SET i=i+1;
	END WHILE;
END $
```

![image-20210911100643012](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911100643012.png)

**（2）添加 leave 语句**

案例2：批量插入，根据传入的次数往 admin 表中插入记录，如果次数>20就停止插入记录

```sql
CREATE PROCEDURE test_while2(IN count INT)
BEGIN
	DECLARE i INT DEFAULT 1;
	a:WHILE i<=count DO
		INSERT INTO admin(username,password) VALUES(CONCAT('Jack',i),'1234');
		IF i>=20 THEN LEAVE a;
		END IF;
		SET i=i+1;
	END WHILE a;
END $
```

![image-20210911101032790](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911101032790.png)

**（3）添加 iterate 语句**

案例3：批量插入，根据传入的次数往 admin 表中插入记录，只插入偶数次

```sql
CREATE PROCEDURE test_while3(IN count INT)
BEGIN
	DECLARE i INT DEFAULT 0;
	a:WHILE i<=count DO
		SET i=i+1;
		IF MOD(i,2) !=0 THEN ITERATE a;
		END IF;
		INSERT INTO admin(username,password) VALUES(CONCAT('Jack',i),'1234');
	END WHILE a;
END $
```

![image-20210911101152892](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210911101152892.png)