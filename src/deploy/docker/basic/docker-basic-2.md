---
title: Docker 安装
date: 2022-11-25
category: Docker
tag:
 - Docker 基础
---

## 1. Docker 官网

- 官网：[https://www.docker.com](https://www.docker.com/)

![image-20220304110115822](http://img.hl1015.top/blog/image-20220304110115822.png)

- 仓库【Docker Hub】：[https://hub.docker.com](https://hub.docker.com/)

![image-20220304110058964](http://img.hl1015.top/blog/image-20220304110058964.png)

## 2. 前提说明

**CentOS Docker 安装**

- Docker 并非是一个通用的容器工具，它依赖于已存在并运行的 Linux 内核环境
- Docker 实质上是在已经运行的 Linux 下制造了一个隔离的文件环境，因此它执行的效率几乎等同于所部署的 Linux 主机
- 因此，Docker 必须部署在 Linux 内核的系统上，如果其他系统想部署 Docker 就必须安装一个虚拟 Linux 环境

![image-20220304131908734](http://img.hl1015.top/blog/image-20220304131908734.png)

在 Windows 上部署 Docker 的方法都是先安装一个虚拟机，并在安装 Linux 系统的虚拟机中运行 Docker

**前提条件**

目前，CentOS 仅发行版本中的内核支持 Docker，Docker 运行在 CentOS 7（64-bit）上，要求系统为 64 位、Linux 系统内核版本为 3.8 以上

**查看自己的内核**

> uname 命令用于打印当前系统相关信息（内核版本号、硬件架构、主机名称和操作系统类型等）

```shell
[root@centos101 ~]# cat /etc/redhat-release 
CentOS Linux release 7.4.1708 (Core) 
[root@centos101 ~]# uname -r
3.10.0-693.el7.x86_64
```

## 3. Docker 的基本组成

### 3.1 镜像（image）

- Docker 镜像（image）就是一个<font color="red">只读</font>的模板，镜像可以用来创建 Docker 容器，<font color="red">一个镜像可以创建很多容器</font>
- image 相当于是一个 root 文件系统，比如官方镜像 centos:7 就包含了完整的一套 centos:7 最小系统的 root 文件系统
- image 相当于容器的 "源代码"，<font color="red">Docker 镜像文件类似于 Java 的类模板，而 Docker 容器实例类似于 Java 中 new 出来的实例对象</font>

容器与镜像的关系类似于面向对象编程中的对象与类

| Docker | 面向对象 |
| ------ | -------- |
| 容器   | 对象     |
| 镜像   | 类       |

### 3.2 容器（container）

**<font color="blue">从面向对象的角度</font>**

Docker 利用容器（container）独立运行的一个或一组应用，应用程序或服务运行在容器里面，容器就类似于一个虚拟化的运行环境，<font color="red">容器是用镜像创建的运行实例</font>，就像是 Java 中的类和实例对象一样，镜像是静态的定义，容器是镜像运行时的实体。容器为镜像提供了一个标准的和隔离的运行环境，它可以被启动、开始、停止、删除。每个容器都是相互隔离的、保证安全的平台

**<font color="blue">从镜像容器角度</font>**

<font color="red">可以把容器看作是一个简易版的 Linux 环境</font>（包括 root 用户权限、进程空间、用户空间和网络空间等）和运行在其中的应用程序

### 3.3 仓库（repository）

仓库（repository）是<font color="red">集中存放镜像</font>文件的场所

类似于：Maven 仓库，存放各种 jar 包的地方；GitHub 仓库，存放各种 Git 项目的地方

Docker 公司提供的官方 registry 被称为 Docker Hub，存放各种镜像模板的地方

仓库分为公开仓库（public）和私有仓库（private）两种形式，最大的公开仓库是 Docker Hub，存放了数量庞大的镜像供用户下载

国内的公开仓库包括阿里云、网易云等

### 3.4 总结

Docker 本身是一个容器运行载体或称之为管理引擎。我们把应用程序和配置依赖打包好形成一个可交付的运行环境，这个打包好的运行环境就是 image 镜像文件，只有通过这个镜像文件才能生成 Docker 容器实例（类似于 Java 中 new 出来一个对象）

image 文件可以看作是容器的模板，Docker 根据 image 文件生成容器的实例，同一个 image 文件，可以生成多个同时运行的容器实例

- **镜像文件**：image 文件可以生成容器实例，本身也是一个文件，称为镜像文件
- **容器实例**：一个容器运行一种服务，当我们需要的时候，就可以通过 Docker 客户端创建一个对应的运行实例，也就是我们的容器
- **仓库**：就是放一堆镜像的地方，我们可以把镜像发布到仓库中，需要的时候再从仓库中拉下来就可以了

## 4. Docker 平台架构图解

![image-20220304135631557](http://img.hl1015.top/blog/image-20220304135631557.png)

**Docker 工作原理**

Docker 是一个 Client-Server 结构的系统，Docker 守护进程运行在主机上，然后通过 Socket 连接从客户端访问，守护进程从客户端接收命令并管理运行在主机上的容器。（<font color="red">容器，是一个运行时环境，就是我们前面说到的集装箱</font>）

![image-20220304135943708](http://img.hl1015.top/blog/image-20220304135943708.png)

**整体架构及底层通信原理简述**

Docker 是一个 C/S 模式的架构，后端是一个松耦合架构，众多模块各司其职

Docker 运行的基本流程为：

1. 用户是使用 Docker Client 与 Docker Daemon 建立通信，并发送请求给后者
2. Docker Daemon 作为 Docker 架构中的主体部分，首先提供 Docker Server 的功能使其可以接收 Docker Client 的请求
3. Docker Engine 执行 Docker 内部的一系列工作，每一项工作都是以一个 Job 的形式存在
4. Job 的运行过程中，当需要容器镜像时，则从 Docker Registry 中下载镜像，并通过镜像管理驱动 Graph Driver 将下载的镜像以 Graph 的形式存储
5. 当需要为 Docker 创建网络环境时，通过网络管理驱动 Network Driver 创建并配置 Docker 容器网络环境
6. 当需要限制 Docker 容器运行资源或执行用户指令等操作时，则通过 Exec Driver 来完成
7. Libcontainer 是一项独立的容器管理包，Network Driver 以及 Exec Driver 都是通过 Libcontainer 来实现具体对容器进行的操作

![image-20220304143835924](http://img.hl1015.top/blog/image-20220304143835924.png)

## 5. 安装步骤【CentOS 上安装 Docker】

> 官网-安装文档：[https://docs.docker.com/engine/install/centos](https://docs.docker.com/engine/install/centos)

### 5.1 确认是 CentOS 7 及以上版本

```shell
[root@centos101 ~]# cat /etc/redhat-release 
CentOS Linux release 7.4.1708 (Core) 
```

### 5.2 卸载旧版本

```shell
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

### 5.3 yum 安装 gcc 相关依赖

> 机器能上外网的情况

```shell
yum -y install gcc
yum -y install gcc-c++
```

### 5.4 安装需要的软件包

```shell
sudo yum install -y yum-utils
```

### 5.5 设置 stable 镜像仓库

> 由于官网文档中是国外的网址，访问速度非常慢，不推荐使用，推荐使用国内的镜像仓库地址

```shell
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

### 5.6 更新 yum 软件包索引

```shell
yum makecache fast
```

### 5.7 安装 Docker CE

```shell
sudo yum install docker-ce docker-ce-cli containerd.io
```

### 5.8 启动 Docker

```shell
sudo systemctl start docker
```

### 5.9 测试

```shell
docker version
```

![image-20220304155501426](http://img.hl1015.top/blog/image-20220304155501426.png)

```shell
docker run hello-world
```

![image-20220304155618583](http://img.hl1015.top/blog/image-20220304155618583.png)

### 5.10 卸载

```shell
sudo systemctl stop docker
```

```shell
sudo yum remove docker-ce docker-ce-cli containerd.io
```

```shell
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

## 6. 配置阿里云镜像加速

- 阿里云云原生官网地址：[https://promotion.aliyun.com/ntms/act/kubernetes.html](https://promotion.aliyun.com/ntms/act/kubernetes.html)
- 注册一个属于自己的阿里云账户（可复用淘宝账号）
- 登录阿里云，打开控制台，找到 **容器镜像服务**

![image-20220304160625107](http://img.hl1015.top/blog/image-20220304160625107.png)

![image-20220304160837373](http://img.hl1015.top/blog/image-20220304160837373.png)

```shell
sudo mkdir -p /etc/docker
```

```shell
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://ovnvnphb.mirror.aliyuncs.com"]
}
EOF
```

```shell
sudo systemctl daemon-reload
```

```shell
sudo systemctl restart docker
```

## 7. docker run 干了什么

![image-20220304163115609](http://img.hl1015.top/blog/image-20220304163115609.png)

## 8. 为什么 Docker 比 VM 虚拟机快

- **Docker 有着比虚拟机更少的抽象层**

由于 Docker 不需要 Hypervisor（虚拟机）实现硬件资源虚拟化，运行在 Docker 容器上的程序直接使用的都是实际物理机的硬件资源，因此在 CPU、内存利用率上 Docker 将会在效率上有明显优势

- **Docker 利用的是宿主机的内核，而不需要加载操作系统 OS 内核**

当新建一个容器时，Docker 不需要和虚拟机一样重新加载一个操作系统内核，进而避免引寻、加载操作系统内核返回等比较费时费资源的过程，当新建一个虚拟机时，虚拟机软件需要加载 OS，返回新建过程是分钟级别的，而 Docker 由于直接利用宿主机的操作系统，则省略了返回过程，因此新建一个 Docker 容器只需要几秒钟

![image-20220304170416448](http://img.hl1015.top/blog/image-20220304170416448.png)