---
title: 用户与权限管理
date: 2021-09-14
category: Linux
tag:
 - Linux 入门
---

## 1. 用户

（1）Linux 系统是一个多用户多任务的操作系统，任何一个要使用系统资源的用户，都必须首先向系统管理员申请一个账号，然后以这个账号的身份进入系统。

（2）对用户的操作

```shell
新增用户：useradd 新用户名

设置密码：passwd 用户名

用户是否存在：id 用户名

切换用户：su 切换用户名

查看当前用户/登录用户：whoami / who am I

删除用户：userdel
```

## 2. 用户组

（1）类似于角色，系统可以对有共性的多个用户进行统一的管理。

（2）对用户组的操作

```shell
新增组：groupadd 组名

删除组：groupdel 组名

修改用户的组：usermod –g 用户组 用户名

增加用户时直接加上组：useradd –g 用户组 用户名
```

## 3. 系统中用户和组的相关文件

（1）用户（user）的配置文件：/etc/passwd

每行含义：**用户名:口令:用户标识号:组标识号:注释性描述:主目录:登录Shell**

（2）口令的配置文件：/etc/shadow

每行含义：**登录名:加密口令:最后一次修改时间:最小时间间隔:最大时间间隔:警告时间:不活动时间:失效时间:标志**

（3）组（group）的配置文件：/etc/group

每行含义：**组名:口令:组标识号:组内用户列表**

## 4. 文件的权限管理

### 4.1 再说 ls -l

![image-20210914103304791](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914103304791.png)

 

**0-9 位说明：**

- 第 0 位确定文件类型
  - d：目录文件, -：普通文件, l：链接文件, c：字符设备文件, b：块设备文件, p：管道文件【FIFO文件】
- 第 1-3 位确定所有者（该文件的所有者）拥有该文件的权限 --- User
- 第 4-6 位确定所属组（同用户组的）拥有该文件的权限 --- Group
- 第 7-9 位确定其他用户拥有该文件的权限 --- Other

**作用到文件：**

- [ r ]代表可读(read)：可以读取,查看
- [ w ]代表可写(write)：可以修改，但是不代表可以删除该文件，删除一个文件的前提条件是**对该文件所在的目录有写权限，才能删除该文件**
- [ x ]代表可执行(execute)：可以被系统执行

**作用到目录：**

- [ r ]代表可读(read)：可以读取，ls 查看目录内容
- [ w ]代表可写(write)：可以修改，目录内创建+删除+重命名目录
- [ x ]代表可执行(execute)：可以进入该目录

### 4.2 chmod

![image-20210914103310378](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914103310378.png)

 

**第一种方式：+ 、-、= 变更权限**

u：所有者  g：所有组  o：其他人

a：所有人（u、g、o 的总和）

```shell
chmod u=rwx,g=rx,o=x 文件目录名

chmod o+w 文件目录名

chmod a-x 文件目录名
```

**第二种方式：通过数字变更权限**

r=4 w=2 x=1   rwx=4+2+1=7

```shell
chmod u=rwx,g=rx,o=x 文件目录名
// 相当于 chmod 751 文件目录名
```

### 4.3 chown

```shell
// 改变文件的所有者
chown newowner file

// 改变用户的所有者和所有组
chown newowner:newgroup file

// -R 如果是目录 则使其下所有子文件或目录递归生效
```

### 4.4 chgrp

```shell
// 改变文件的所有组
chgrp newgroup file
```

