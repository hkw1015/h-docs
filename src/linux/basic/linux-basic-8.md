---
title: 搭建开发环境
ddate: 2021-09-14
category: Linux
tag:
 - Linux 入门
---

:::tip
所需开发环境安装包：

链接：[https://pan.baidu.com/s/1F6FlGEIJKAyDbH7LaKt4lg](https://pan.baidu.com/s/1F6FlGEIJKAyDbH7LaKt4lg)

提取码：74zb
:::

## 1. 安装 JDK

（1）将 JDK 解压缩到 opt 目录下

（2）配置环境变量，vim  /etc/profile

```bash
JAVA_HOME=/opt/jdk1.8.0_152

PATH=/opt/jdk1.8.0_152/bin:$PATH

export JAVA_HOME PATH
```

（3）配置完成后执行如下操作

安装完成注销重新登录一下

```bash
source /etc/profile
```

重启系统[最靠谱]

## 2. 安装 Tomcat

（1）解压缩到 /opt

（2）进入到 Tomcat 目录下的 bin 目录中，启动 tomcat

```shell
./startup.sh
```

## 3. 安装 MySQL

### 3.1 检查工作

**CentOS6**

```shell
rpm -qa | grep mysql
```

如果存在 mysql-libs 的旧版本包如下：

![image-20210914111932669](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914111932669.png)

请先执行卸载命令：

```shell
rpm -e --nodeps  mysql-libs
```



**CentOS7**

```shell
rpm -qa | grep mariadb
```

如果存在如下：

![image-20210914111944306](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914111944306.png)

 

请先执行卸载命令：

```shell
rpm -e --nodeps  mariadb-libs
```



**检查 /tmp 文件夹权限**

执行 ：

```shell
chmod -R 777 /tmp
```

### 3.2 安装 MySQL

**拷贝安装包到 opt 目录下**

MySQL-client-5.5.54-1.linux2.6.x86_64.rpm

MySQL-server-5.5.54-1.linux2.6.x86_64.rpm

**执行如下命令进行安装**

```shell
rpm -ivh MySQL-client-5.5.54-1.linux2.6.x86_64.rpm
rpm -ivh MySQL-server-5.5.54-1.linux2.6.x86_64.rpm
```

### 3.3 检查安装是否成功

**安装完成后查看 MySQL 的版本**

执行 mysqladmin –version，如果打印出消息，即为成功

![image-20210914111958311](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914111958311.png)

或者通过 rpm 查询

```shell
rpm –qa | grep –i mysql（-i 表示忽略大小写）
```

### 3.4 MySQL 服务的启停

```shell
启动: service mysql start
停止: service mysql stop
```

### 3.5 设置 root 用户的密码

```sql
mysqladmin -u root  password '123123'
```

### 3.6 登录 MySQL

```sql
mysql  -uroot  -p123123
```

### 3.7 建库

```sql
create database 库名
```

### 3.8 建表

```sql
create table 表名 (字段名 字段类型(长度) 约束 ...)
```

### 3.9 字符集问题

**查看字符集**

```sql
show variables like 'character%';
```

**查看 MySQL 的安装位置**

![image-20210914111733770](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914111733770.png)

 

**修改字符集**

将 /usr/share/mysql/ 中的 my-huge.cnf 拷贝到 /etc/ 下，改名为 my.cnf

> **mysql 启动时，会优先读取 /etc/my.cnf 文件**

在[client] [mysqld] [mysql]中添加相关的字符集设置

```shell
[client]
default-character-set=utf8

[mysqld]
character_set_server=utf8
character_set_client=utf8
collation-server=utf8_general_ci

[mysql]
default-character-set=utf8
```

重启 MySQL 服务，查看字符集

```shell
service mysql restart
```

**修改已有库表的字符集**

修改库的字符集

```sql
alter database 库名 character set 'utf8';
```

修改表的字符集

```sql
alter table 表名 convert to character set 'utf8';
```

### 3.10 远程访问

**MySQL 默认的 root 用户只允许本机登录，远程通过 SQLyog、Navicat Premium 工具不能登录**

**查看 MySQL mysql 库中的用户表**

列显示：

```sql
select * from user;
```

查询常用字段：

```sql
select host,user,password,select_priv from mysql.user;
```

**创建可以远程访问的 root 用户并授予所有权限**

```sql
grant all privileges on *.* to root@'%' identified by '123123';
```

**修改用户的密码**

修改当前用户的密码

```sql
set password = password('123456')
```

修改某个用户的密码

```sql
update mysql.user set password=password('123456') where user='li4';
```

> **注意: 所有通过 user 表的修改,必须使用 flush privileges 命令才能生效**