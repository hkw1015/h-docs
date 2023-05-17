---
title: rpm 和 yum
date: 2021-09-14
category: Linux
tag:
 - Linux 入门
---

## 1. rpm

（1）RPM（RedHat Package Manager），RedHat 软件包管理工具，类似 windows 里面的 setup.exe，是 Linux 这系列操作系统里面的打包安装工具，它虽然是 RedHat 的标志，但理念是通用的。

（2）查询已安装的 rpm 列表

```
rpm  –qa | grep xx
```

（3）rpm 包的名称：firefox-52.5.0-1.el7.centos.x86_64

- 名称：firefox
- 版本号：52.6.0-1
- 适用操作系统：el7.centos.x86_64
- 表示 centos7.x 的 64 位系统。

（4）安装 rpm

```
rpm –ivh rpm包名
```

- -i 安装 install
- -v 查看信息
- -h 查看进度条

（5）卸载 rpm

```
rpm -e RPM软件包
```

## 2. yum

（1）类似于我们 java 开发中的 maven 工具，可以从镜像网站上下载应用程序，并直接安装

（2）yum 操作

```
yum list|grep xx // 软件列表

yum install xxx // 下载安装
```

