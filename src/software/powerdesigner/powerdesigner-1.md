---
title: 下载与安装
date: 2022-09-10
category: PowerDesigner
tag:
 - PowerDesigner
---

## 1. PowerDesigner 下载

- 链接：[https://pan.baidu.com/s/17ZGJ6EVT-3U3Dq4nMzjjtg?pwd=ez9l](https://pan.baidu.com/s/17ZGJ6EVT-3U3Dq4nMzjjtg?pwd=ez9l)
- 提取码：ez9l 

## 2. PowerDesigner 安装

- 按照提示安装，选择地区时选择 `Hong Kong`，其他使用默认选项即可【这里不再赘述】
- 进行 powerdesigner 破解，将下载下来的 `pdflm 16.dll` 文件复制粘贴到 powerdesigner 安装的根目录进行替换，具体操作如下图：

![image-20221121092150060](./imgs/image-20221121092150060.png)

## 3. PowerDesigner 配置

### 文本格式字符集配置

> 此项配置是为了防止导出 SQL 脚本运行时出现乱码问题

打开：`Database` -> `Generate Database` -> `Format`，将 `Text formatting` 下的 `Encoding` 设置为 `UTF-8`

![image-20221121093026688](./imgs/image-20221121093026688.png)

### SQL 脚本去掉双引号

> 此项配置是为了查询数据库表时不区分大小写【表名、字段】

打开：`Database` -> `Edit Currnet DBMS ...` -> `General`，具体操作如下图：

![image-20221121093153477](./imgs/image-20221121093153477.png)

## 4. PowerDesigner 使用

> 如下操作都是在已有 pdm 文件前提下，从 0 到 1 创建工作区和物理模型等这里暂不赘述

### 新建表

![image-20221121094357043](./imgs/image-20221121094357043.png)

### 编辑表

**General：表信息**

![image-20221121094957371](./imgs/image-20221121094957371.png)

**Columns：字段信息**

![image-20221121095656890](./imgs/image-20221121095656890.png)

`Comment` 默认不展示，打开它的步骤如下图：

![image-20221121095959677](./imgs/image-20221121095959677.png)

### 预览 SQL

![image-20221121100220020](./imgs/image-20221121100220020.png)

### 创建索引

这里以创建客户名称的唯一索引为例，具体操作如下图：

![image-20221121100807174](./imgs/image-20221121100807174.png)

## 5. PowerDesigner 连接数据库

> 以下操作以连接 进销存账 powerdb 数据库为例

打开数据库连接界面

![image-20221121101513909](./imgs/image-20221121101513909.png)

![image-20221121101632983](./imgs/image-20221121101632983.png)

点击 `Setup ...`，按下图进行操作：

![image-20221121101827323](./imgs/image-20221121101827323.png)

选择 `Connention profile`（前提是有 dcp 文件，没有就自行输入连接信息），按下图进行操作：

> 下边的 ojdbc8 jar 包需要提前准备

![image-20221121103003440](./imgs/image-20221121103003440.png)

填写数据库连接定义信息，按下图进行操作：

![image-20221121104120035](./imgs/image-20221121104120035.png)

测试连接成功后，点击三次 `OK` 到 `Connect` 界面，按下图进行操作：

![image-20221121104649689](./imgs/image-20221121104649689.png)

在下一个界面输入正确的密码后，点击 `Connect` 开始连接

![image-20221121104822012](./imgs/image-20221121104822012.png)

连接成功后在底部的 `Output` 控制台会输出如下信息

![image-20221121105046492](./imgs/image-20221121105046492.png)

连接成功后可以在 `Repository` tab 页下看到当前的版本信息

![image-20221121105328207](./imgs/image-20221121105328207.png)

## 6. PowerDesigner 拉取与提交

### 拉取

<img src="./imgs/image-20221121105608136.png" alt="image-20221121105608136" style="zoom:80%;" />

![image-20221121105655741](./imgs/image-20221121105655741.png)

<img src="./imgs/image-20221121105711502.png" alt="image-20221121105711502" style="zoom:80%;" />

拉取成功 `Output` 控制台会输出如下信息

![image-20221121105824962](./imgs/image-20221121105824962.png)

### 提交

<img src="./imgs/image-20221121110005313.png" alt="image-20221121110005313" style="zoom:80%;" />

![image-20221121110100997](./imgs/image-20221121110100997.png)

<img src="./imgs/image-20221121110217943.png" alt="image-20221121110217943" style="zoom:80%;" />

提交成功 `Output` 控制台会输出如下信息

![image-20221121110318622](./imgs/image-20221121110318622.png)

版本号也会随之 +1

![image-20221121110348987](./imgs/image-20221121110348987.png)