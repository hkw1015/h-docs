---
title: 本地镜像发布到私有库
date: 2022-11-25
category: Docker
tag:
 - Docker 基础
---

## 1. 本地镜像发布到私有库流程

![image-20220310142751957](http://img.hl1015.top/blog/image-20220310142751957.png)

## 2. 私有库是什么

官方 Docker Hub 地址：[https://hub.docker.com](https://hub.docker.com)，中国大陆访问太慢了且已经有了被阿里云取代的趋势，不太主流

Docker Hub、阿里云这样的公共镜像仓库可能不太方便，涉及机密的公司不可能提供镜像给公网，所以需要创建一个本地私有仓库给团队使用，基于公司内部项目构建镜像

**Docker Registry 是官方提供的工具，可以用于构建私有镜像仓库**

## 3. 将本地镜像推送到私有库

**1、下载镜像 Docker Registry**

![image-20220310155417205](http://img.hl1015.top/blog/image-20220310155417205.png)

**2、运行私有库 Registry，相当于本地有个私有 Docker Hub**

```shell
docker run -d -p 5000:5000 -v /root/myregistry/:/tmp/registry --privileged=true registry
```

默认情况，仓库被创建在容器的 /var/lib/registry 目录下，建议自行用容器卷映射，方便宿主机联调

![image-20220310155732065](http://img.hl1015.top/blog/image-20220310155732065.png)

**3、案例演示创建一个新镜像，ubuntu 安装 ifconfig 命令**

①从 Hub 上下载 ubuntu 镜像到本地并成功运行

![image-20220310161004050](http://img.hl1015.top/blog/image-20220310161004050.png)

②原始的 ubuntu 镜像是不带 ifconfig 命令的

![image-20220310161027313](http://img.hl1015.top/blog/image-20220310161027313.png)

③外网连通的情况下，安装 ifconfig 命令并测试通过

```shell
apt-get update
apt-get install net-tools
```

![image-20220310161711496](http://img.hl1015.top/blog/image-20220310161711496.png)

④安装完成后，commit 我们自己的新镜像

```shell
docker commit -m="提交的描述信息" -a="作者" 容器ID 要创建的目标镜像名:标签名
```

![image-20220310162010715](http://img.hl1015.top/blog/image-20220310162010715.png)

⑤启动新镜像并和原来的对比

![image-20220310162319131](http://img.hl1015.top/blog/image-20220310162319131.png)

官网默认下载的 ubuntu 镜像没有 ifconfig 命令，我们通过 commit 构建的新镜像，新增了 ifconfig 功能，可以成功使用

**4、curl 验证私有服上有什么镜像**

回到宿主机，使用 `ifconfig` 命令查看宿主机 ip

![image-20220310163232254](http://img.hl1015.top/blog/image-20220310163232254.png)

```shell
curl -XGET http://192.168.184.130:5000/v2/_catalog
```

![image-20220310163444151](http://img.hl1015.top/blog/image-20220310163444151.png)

可以看到，目前私有库没有任何镜像上传过

**5、将新镜像修改符合私有服规范的 TAG**

公式：**`docker tag 镜像:Tag Host:Port/Repository:Tag`**

使用命令 docker tag 将 hkw/myubuntu:1.2 这个镜像修改为 192.168.184.130:5000/hkw/myubuntu:1.2

```shell
docker tag hkw/myubuntu:1.2 192.168.184.130:5000/hkw/myubuntu:1.2
```

![image-20220310164034650](http://img.hl1015.top/blog/image-20220310164034650.png)

**6、修改配置文件使之支持 HTTP**

理由：Docker 默认不允许 HTTP 方式推送镜像，通过配置选项来取消这个限制

```shell
vim /etc/docker/daemon.json
```

编辑后内容应该类似如下：

```
{
  "registry-mirrors": ["https://ovnvnphb.mirror.aliyuncs.com"],
  "insecure-registries": ["192.168.184.130:5000"]
}
```

> **<font color="red">注意别遗漏了中间的逗号（非中文）</font>**
>
> <font color="blue">修改完后如果不生效，建议重启 Docker</font>
>
> ```shell
> systemctl daemon-reload
> systemctl restart docker
> ```
>
> <font color="blue">重启之后，记得重新启动 registry</font>
>
> ```shell
> docker run -d -p 5000:5000 -v /root/myregistry/:/tmp/registry --privileged=true registry
> ```

**7、push 推送到私有库**

```shell
docker push 192.168.184.130:5000/hkw/myubuntu:1.2
```

![image-20220310165825004](http://img.hl1015.top/blog/image-20220310165825004.png)

**8、再次通过 curl 验证私有库上有什么镜像**

```shell
curl -XGET http://192.168.184.130:5000/v2/_catalog
```

![image-20220310170046779](http://img.hl1015.top/blog/image-20220310170046779.png)

**9、pull 到本地并运行**

```shell
docker pull 192.168.184.130:5000/hkw/myubuntu:1.2
```

![image-20220310170449247](http://img.hl1015.top/blog/image-20220310170449247.png)

验证 ifconfig 命令是否可用

![image-20220310170728314](http://img.hl1015.top/blog/image-20220310170728314.png)