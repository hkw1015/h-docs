---
title: 安装与使用
date: 2021-09-11
category: MySQL
tag:
 - MySQL 基础
---

## 1. MySQL 数据库产品(软件)的介绍

**MySQL产品的特点**

- MySQL 数据库隶属于 MySQL AB 公司，总部位于瑞典，后被 Oracle 收购

- 优点：
  - ①成本低：开放源代码，一般可以免费使用
  - ②性能高：执行快
  - ③简单：很容易安装和使用



## 2. MySQL 数据库的安装

**（1）DBMS 分为两类**

- ①基于共享文件系统的DBMS(Access)
- ②基于客户机-服务器的DBMS(MySQL、Oracle、SqlServer)

**（2）MySQL 的版本**

- 社区版(免费)
- 企业版(收费)

**（3）服务端安装完成后【windows版本】，提及一个重要的配置文件 my.ini**

![image-20210909102607111](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909102607111.png)

- 对它里面的几个重要结构说明：
  - ![image-20210909102717049](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909102717049.png)
  - ![image-20210909102734204](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909102734204.png)
  - ![image-20210909102750648](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909102750648.png)
  - ![image-20210909102803887](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909102803887.png)
  - ![image-20210909102832125](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909102832125.png)
  - ![image-20210909102849688](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909102849688.png)
  - ![image-20210909102906805](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909102906805.png)
  - ![image-20210909102918215](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909102918215.png)

## 3. MySQL 服务的启动与停止

- **第一种方式**
  - 第一步，此电脑，右键 打开 **管理**
    - ![image-20210909103125684](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909103125684.png)
  - 第二步，双击打开 **服务和应用程序**，进去后再双击打开 **服务**
    - ![image-20210909103250215](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909103250215.png)
    - ![image-20210909103313047](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909103313047.png)
  - 第三步，找到 MySQL 这个服务，右键 **属性**
    - ![image-20210909103359157](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909103359157.png)
    - 这里面可以将启动类型改为手动，这样不是开机自启模式可以提升电脑性能
      - ![image-20210909103520277](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909103520277.png)
    - **停止 MySQL 服务的操作**
      - ![image-20210909103615842](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909103615842.png)
    - **启动 MySQL 服务的操作**
      - ![image-20210909103644678](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909103644678.png)

- **第二种方式**

  - 以**管理员身份**运行 **命令行提示符**

    - ![image-20210909103811519](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909103811519.png)

  - 停止服务的命令（MySQL80 是你电脑上具体的服务名称）

    - ```cmd
      net stop MySQL80
      ```

  - 启动服务的命令

    - ```cmd
      net start MySQL80
      ```

  - ![image-20210909104348772](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909104348772.png)

## 4. MySQL 服务端的登录和退出

**方式一：通过 MySQL 自带的客户端**

- 该方式只限于 root 用户
- ![image-20210909104601854](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909104601854.png)
- ![image-20210909104615157](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210909104615157.png)

**方式二：通过 windows 自带的客户端（推荐）**

- 登录：mysql 【-h 主机名 -P 端口号】 -u 用户名 -p密码

  - ```cmd
    mysql -h localhost -P 3306 -u root -proot
    ```

  - 连接自己主机上的 MySQL 服务，可以省略 -h 主机名 -P 端口号

  - 所以上面可以写成：

    - ```cmd
      mysql -u root -proot
      ```

- 退出：exit 或 ctrl + c

## 5. MySQL 语法规范

- 不区分大小写，但建议关键字大写，表名、列名小写
- 每句话用 ; 或 \g 结尾（最好用分号）
- 各子句一般分行写
- 关键字不能缩写也不能分行
- 用缩进提高语句的可读性
- 注释
  - 单行注释：# 注释文字 或者 ~ 注释文字
  - 多行注释：/* 注释文字 */

## 6. MySQL 常见命令

```sql
SHOW DATABASES; 查看所有的数据库
USE 库名; 打开指定的库
SHOW TABLES; 显示库中的所有表
SHOW TABLES FROM 库名; 显示指定库中的所有表
CREATE TABLE 表名(
		字段名 字段类型,	
		字段名 字段类型
); 创建表

DESC 表名; 查看指定表的结构
SELECT * FROM 表名;显示表中的所有数据
```

