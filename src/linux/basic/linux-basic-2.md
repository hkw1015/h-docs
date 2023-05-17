---
title: VM 与 Linux 的安装
date: 2021-09-14
category: Linux
tag:
 - Linux 入门
---

## 1. Linux 系统从哪下载

- 网易镜像：[http://mirrors.163.com/centos/7/isos/](http://mirrors.163.com/centos/7/isos/)
- 搜狐镜像：[http://mirrors.sohu.com/centos/7/isos/](http://mirrors.sohu.com/centos/7/isos/)

## 2. BIOS 中开启虚拟化设备支持

![image-20210913132823967](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913132823967.png)

<span style="color:red">注意：先进行安装，如果出现虚拟化不支持的错误，再进入 BIOS 进行设置，部分电脑默认已经开启。</span>

虚拟化设备支持未开启在安装时会出现如下错误：

![image-20210913135534667](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913135534667.png)

## 3. 安装虚拟机【组装电脑】

可以 通过 VMware 或者 VirtualBox 来安装虚拟机

- VMware
  - VM12 下载
    - 链接：[https://pan.baidu.com/s/1ixH1xArP0lQZNEzDqHPxRQ](https://pan.baidu.com/s/1ixH1xArP0lQZNEzDqHPxRQ)
    - 提取码：yml3
- VirtualBox
  - VirtualBox 下载地址：[https://www.virtualbox.org/](https://www.virtualbox.org/)
  - vagrant 下载地址：[https://www.vagrantup.com/](https://www.vagrantup.com/)
  - vagrant 官方镜像仓库地址：[https://app.vagrantup.com/boxes/search](https://app.vagrantup.com/boxes/search)

## 4. 安装 Linux【装系统】

详见 [在 VM 上安装 CentOS7](/linux/basic/linux-basic-9)，这里不做展开

## 5. xshell 和 xftp 工具的安装

- xshell 的作用：远程命令访问服务器端的 Linux 系统
- xftp 的作用：远程访问及传输文件
- 扩展：一个小型云服务网站架构
  - ![image-20210913140919166](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913140919166.png)
- 安利一款界面感比较舒适的远程连接工具：**Termius**
  - 下载地址：[https://www.termius.com/windows](https://www.termius.com/windows)
  - ![image-20210913141145369](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913141145369.png)