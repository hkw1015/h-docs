---
title: Docker 镜像
date: 2022-11-25
category: Docker
tag:
 - Docker 基础
---

## 1. 是什么

镜像是一种轻量级、可执行的独立软件包，它包含运行某个软件所需的所有内容，我们把应用程序和配置依赖打包好形成一个可交付的运行环境（包括代码、运行时需要的库、环境变量和配置文件等），这个打包好的运行时环境就是 image 镜像文件

只有通过这个镜像文件才能生成 Docker 容器实例（类似 Java 中 new 出来一个对象）

当我们使用 `pull` 命令下载某个镜像的时候，我们可以看到 Docker 的镜像好像是在一层一层的下载：

![image-20220310131424402](http://img.hl1015.top/blog/image-20220310131424402.png)

**UnionoFS（联合文件系统）**

Union 文件系统（UnionFS）是一种分层、轻量级并且高性能的文件系统，它支持<font color="red">对文件系统的修改作为一次提交来一层层的叠加</font>，同时可以将不同目录挂载到同一个虚拟文件系统下。Union 文件系统是 Docker 镜像的基础，<font color="blue">镜像可以通过分层来进行继承</font>，基于基础镜像（没有父镜像），可以制作各种具体的应用镜像

![image-20220310132107864](http://img.hl1015.top/blog/image-20220310132107864.png)

特性：一次同时加载多个文件系统，但从外面看起来，只能看到一个文件系统，联合加载会把各层文件系统叠加起来，这样最终的文件系统会包含所有底层的文件和目录

**Docker 镜像加载原理**

Docker 镜像实际上是由一层一层的文件系统组成（层级文件系统 UnionFS）

bootfs（boot file system）主要包含 bootloader 和 kernel，bootloader 主要是引导加载 kernel，Linux 刚启动时会加载 bootfs 文件系统，<font color="red">在 Docker 镜像的最底层是引导文件系统 bootfs</font>。这一层与我们典型的 Linux/Unix 系统是一样的，包含 boot 加载器和内核，当 boot 加载完成之后整个内核就都在内存中了，此时内存的使用权已由 bootfs 转交给内核，此时系统也会卸载 bootfs

rootfs（root file system），在 bootfs 之上，包含的就是典型 Linux 系统中的 /dev，/proc，/bin，/etc 等标准目录和文件，rootfs 就是各种不同的操作系统发行版，比如 Ubuntu，CentOS 等等

![image-20220310133553520](http://img.hl1015.top/blog/image-20220310133553520.png)

<font color="blue">平时我们安装虚拟机用的 CentOS 都是好几个 G，为什么 Docker 这里才 200 MB？？？</font>

对于一个精简的 OS，rootfs 可以很小，只需要包括最基本的命令、工具和程序库就可以了，因为底层直接用 Host 的 kernel，自己只需要提供 rootfs 就行了。由此可见对于不同的 Linux 发行版，bootfs 基本是一致的，rootfs 会有差别，因此不同的发行版可以公用 bootfs

**为什么 Docker 镜像要采用这种分层结构？**

镜像分层最大的一个好处就是共享资源，方便复制迁移，就是为了复用。比如，有多个镜像都从相同的 base 镜像构建而来，那么 Docker Host 只需在磁盘上保存一份 base 镜像，同时内存中也只需加载一份 base 镜像，就可以为所有容器服务了，而且镜像的每一层都可以被共享

## 2. 重点理解

**<font color="red">Docker 镜像层都是只读的，容器层是可写的</font>**

当容器启动时，一个新的可写层被加载到镜像的顶部，这一层通常被称作 "容器层"，"容器层" 之下的都叫 "镜像层"。所有对容器的改动 - 无论添加、删除、还是修改文件都只会发生在容器层中。只有容器层是可写的，容器层下面的所有镜像层都是只读的

![image-20220310134518172](http://img.hl1015.top/blog/image-20220310134518172.png)

## 3. Docker 镜像 commit 操作案例

**`docker commit`：提交容器副本使之称为一个新的镜像**

```shell
docker commit -m="提交的描述信息" -a="作者" 容器ID 要创建的目标镜像名:标签名
```

**<font color="blue">这里以 ubuntu 上安装 vim 为例</font>**

- 1、从 Hub 上下载 ubuntu 镜像到本地并成功运行

![image-20220310135610967](http://img.hl1015.top/blog/image-20220310135610967.png)

- 2、原始的默认 ubuntu 镜像是不带 vim 命令的

![image-20220310135819283](http://img.hl1015.top/blog/image-20220310135819283.png)

- 3、外网连通的情况下，安装 vim

①更新包管理工具

```shell
apt-get update
```

②安装 vim

```shell
apt-get -y install vim
```

- 4、安装完成后，commit 我们自己的新镜像

![image-20220310141101562](http://img.hl1015.top/blog/image-20220310141101562.png)

- 5、启动新镜像并和原来的进行对比

![image-20220310141333672](http://img.hl1015.top/blog/image-20220310141333672.png)

官网默认下载的 ubuntu 没有 vim 命令，现在我们自己 commit 构建的镜像，新增加 了 vim 功能，可以成功使用

## 4. 总结

Docker 中的镜像分层，<font color="red">支持通过扩展现有镜像，创建新的镜像</font>，类似 Java 继承于一个 Base 基础类，自己再按需扩展，新镜像是从 base 镜像一层一层叠加生成的，每安装一个软件，就在现有镜像的基础上增加一层