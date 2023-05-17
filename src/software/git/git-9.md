---
title: 国内代码托管中心-码云
date: 2021-11-07
category: Git
tag:
  - Git
---

## 1. 简介

众所周知，GitHub 服务器在国外，使用 GitHub 作为项目托管网站，如果网速不好的话，严重影响使用体验，甚至会出现登录不上的情况。针对这个情况，大家也可以使用国内的项目托管网站-码云。

码云是开源中国推出的基于 Git 的代码托管服务中心，网址是 [https://gitee.com/](https://gitee.com/)，使用方式跟 GitHub 一样，而且它还是一个中文网站，如果你英文不是很好它是最好的选择。

## 2. 码云账号注册和登录

进入码云官网地址：[https://gitee.com](https://gitee.com)，点击注册 Gitee

![image-20211114231622668](http://img.hl1015.top/blog/image-20211114231622668.png)

注册成功登录以后如下图

![image-20211114232013299](http://img.hl1015.top/blog/image-20211114232013299.png)

## 3. 码云创建远程库

点击首页右上角的加号，选择下面的新建仓库

![image-20211114232144227](http://img.hl1015.top/blog/image-20211114232144227.png)

填写仓库名称，路径和选择是否开源（公开库或私有库）

<img src="http://img.hl1015.top/blog/image-20211114232348715.png" alt="image-20211114232348715" style="zoom:67%;" />

最后根据需求选择分支模型，然后点击创建按钮

![image-20211114232541334](http://img.hl1015.top/blog/image-20211114232541334.png)

远程库创建好以后，就可以看到 HTTPS 和 SSH 的链接

![image-20211114233012404](http://img.hl1015.top/blog/image-20211114233012404.png)

## 4. IDEA 集成码云

### 4.1 IDEA 安装码云插件

IDEA 默认不自带码云插件，我们第一步要安装 Gitee 插件

![image-20211114233322499](http://img.hl1015.top/blog/image-20211114233322499.png)

安装成功并重启 IDEA 后，在 Version Control 设置里面可以看到 Gitee，说明码云插件安装成功

![image-20211114233509867](http://img.hl1015.top/blog/image-20211114233509867.png)

然后在码云插件里面添加码云账号，我们就可以使用 IDEA 连接码云了

<img src="http://img.hl1015.top/blog/image-20211114233747072.png" alt="image-20211114233747072" style="zoom:67%;" />

### 4.2 IDEA 连接码云

IDEA 连接码云和连接 GitHub 几乎一样，首先在 IDEA 里面创建一个工程，初始化 git 工程，然后将代码添加到暂存区，提交到本地库，这些步骤上面已经讲过，此处不再赘述。

**将本地代码 push 到码云远程库**

![image-20211114234853411](http://img.hl1015.top/blog/image-20211114234853411.png)

自定义远程库链接

<img src="http://img.hl1015.top/blog/image-20211115085206298.png" alt="image-20211115085206298" style="zoom:67%;" />

给远程库链接定义个 name，然后在 URL 里面填入码云远程库的 HTTPS 链接即可。码云云服务器在国内，用 HTTPS 链接即可，没必要用 SSH 免密链接。

![image-20211115085340818](http://img.hl1015.top/blog/image-20211115085340818.png)

然后选择定义好的远程库链接，点击 Push 即可

<img src="http://img.hl1015.top/blog/image-20211115085618426.png" alt="image-20211115085618426" style="zoom:67%;" />

看到提示就说明 Push 远程库成功

![image-20211115085744730](http://img.hl1015.top/blog/image-20211115085744730.png)

去码云远程库查看代码

![image-20211115090124883](http://img.hl1015.top/blog/image-20211115090124883.png)

只要码云远程库链接定义好以后，对码云远程库进行 pull 和 clone 的操作和 GitHub 一致，此处不再赘述

## 5. 码云复制 GitHub 项目

码云提供了直接复制 GitHub 项目的功能，方便我们做项目的迁移和下载

具体操作如下：

![image-20211115090600555](http://img.hl1015.top/blog/image-20211115090600555.png)

![image-20211115090842490](http://img.hl1015.top/blog/image-20211115090842490.png)

![image-20211115091000479](http://img.hl1015.top/blog/image-20211115091000479.png)

如果 GitHub 项目更新了以后，在码云项目端可以手动重新同步，进行更新！

![image-20211115091136180](http://img.hl1015.top/blog/image-20211115091136180.png)