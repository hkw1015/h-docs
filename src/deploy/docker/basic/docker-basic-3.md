---
title: Docker 常用命令
date: 2022-11-25
category: Docker
tag:
 - Docker 基础
---

## 1. 帮助启动类命令

- **启动 Docker**：**`systemctl start docker`**
- **停止 Docker**：**`systemctl stop docker`**
- **重启 Docker**：**`systemctl restart docker`**
- **查看 docker 状态**：**`systemctl status docker`**
- **开机启动**：**`systemctl enable docker`**
- **查看 docker 概要信息**：**`docker info`**
- **查看 docker 总体帮助文档**：**`docker --help`**
- **查看 docker 命令帮助文档**：**`docker 具体命令 --help`**

## 2. 镜像命令

### 2.1 列出本地镜像

- 命令

```shell
docker images [OPTIONS]
```

- 演示

```shell
[root@centos101 ~]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    feb5d9fea6a5   5 months ago   13.3kB
```

- 参数说明
  - **`REPOSITORY`：表示镜像的仓库源**
  - **`TAG`：镜像的标签版本号**
  - **`IMAGE ID`：镜像 ID**
  - **`CREATED`：镜像创建时间**
  - **`SIZE`：镜像大小**

> 同一仓库源可以有多个 TAG 版本，代表这个仓库源的不同版本，我们使用 `REPOSITORY:TAG` 来定义不同的镜像，如果不指定一个镜像的版本标签，例如你只使用 ubuntu，docker 将默认使用 `ubuntu:lastest` 镜像

- OPTIONS 说明
  - -a：列出本地所有的镜像（含历史映像层）
  - -q：只显示镜像 ID

### 2.2 从 Docker Hub 查找镜像

> Docker Hub 官网地址：[https://hub.docker.com](https://hub.docker.com)

- 命令

```shell
docker search [OPTIONS] 镜像名字
```

- 演示

![image-20220305112317600](http://img.hl1015.top/blog/image-20220305112317600.png)

- OPTIONS 说明
  - --limit：只列出 N 个镜像，默认 25 个【例：`docker search --limit 5 redis`】

- 参数说明
  - **`NAME`：镜像仓库源的名称**
  - **`DESCRIPTION`：镜像的描述**
  - **`OFFICIAL`：是否是 Docker 官方发布**
  - **`STARS`：类似 GitHub 里面的 star，表示点赞、喜欢的意思**
  - **`AUTOMATED`：自动构建**

### 2.3 从镜像仓库中拉取或者更新指定镜像

- 命令

```shell
docker pull 镜像名字[:TAG]
```

- 演示

![image-20220307214641863](http://img.hl1015.top/blog/image-20220307214641863.png)

> 没有 TAG 就是最新版，等价于 `docker pull ubuntu:lastest`

### 2.4 查看镜像/容器/数据卷所占的空间

- 命令

```shell
docker system df
```

- 演示

![image-20220307215152236](http://img.hl1015.top/blog/image-20220307215152236.png)

### 2.5 删除本地一个或多个镜像

- 命令

  - 删除单个

  ```shell
  docker rmi -f 镜像ID
  ```

  - 删除多个

  ```shell
  docker rmi -f 镜像名1:TAG 镜像名2:TAG
  ```

  - 删除全部【<font color="red">慎用，工作时千万别用</font>】

  ```shell
  docker rmi -f ${docker images -qa}
  ```

- 演示

![image-20220307220043876](http://img.hl1015.top/blog/image-20220307220043876.png)

### 2.6 什么是 Docker 虚悬镜像？

仓库名、标签是 \<none\> 的镜像，俗称虚悬镜像（dangling image）

![image-20220307220357582](http://img.hl1015.top/blog/image-20220307220357582.png)

## 3. 容器命令

> 下载一个 ubuntu 镜像到本地来进行演示
>
> ![image-20220309103059908](http://img.hl1015.top/blog/image-20220309103059908.png)

### 3.1 新建 + 启动容器

**OPTIONS 说明：**

- **`--name=容器名称`**：为容器指定一个名称
- **`-d`**：后台运行容器并返回容器 ID，也即启动守护式容器（后台运行），比如 MySQL、Redis 等
- **`-i`**：以交互模式运行容器，通常与 -t 同时使用
- **`-t`**：为容器重新分配一个伪输入终端，通常与 -i 同时使用

> 使用 **-it** 目的是启动交互式容器（前台有伪终端，等待交互），比如我们通过 ubuntu 镜像跑容器实例时就需要使用到 **-it**

- **`-P`**：随机端口映射，大写 P

- **`-p`**：指定端口映射，小写 p【一般使用这个】

  > | 参数                          | 说明                                  |
  > | ----------------------------- | ------------------------------------- |
  > | -p hostPort:containerPort     | 端口映射 `-p 8080:80`                 |
  > | -p ip:hostPort:containerPort  | 配置监听地址  `-p 10.0.0.100:8080:80` |
  > | -p ip::containerPort          | 随机分配端口 `-p 10.0.0.100::80`      |
  > | -p hostPort:containerPort:udp | 指定协议 `-p 8080:80:tcp`             |
  > | -p 80:80 -p 443:443           | 指定多个                              |

**启动交互式容器（前台命令行 ）**

![image-20220309104744789](http://img.hl1015.top/blog/image-20220309104744789.png)

`docker run -it ubuntu /bin/bash` 命令参数说明：

- -i：交互式操作
- -t：终端
- ubuntu：ubuntu 镜像
- /bin/bash：放在镜像名后的是命令，我们希望有个交互式 shell，因此用的是 /bin/bash
- 要退出终端，直接输入 `exit`，会导致容器停止，不推荐 --- <font color="blue">建议使用按键 **`ctrl + q + p`** 进行退出</font>

### 3.2 列出当前正在运行的容器

```shell
docker ps [OPTIONS]
```

![image-20220309171149938](http://img.hl1015.top/blog/image-20220309171149938.png)

**OPTIONS 说明：**

- **`-a`**：列出当前所有<font color="red">正在运行的 + 历史上运行过的</font>容器
- **`-l`**：显示最近创建的容器
- **`-n`**：显示最近 n 个创建的容器
- **`-q`**：静默模式，只显示容器编号

![image-20220309172114265](http://img.hl1015.top/blog/image-20220309172114265.png)

### 3.3 退出容器

两种退出方式：

- **exit**：run 进去容器（交互模式），输入 `exit` 退出，<font color="red">容器会停止</font>
- **ctrl + p + q**：run 进去容器（交互模式），通过按键 `ctrl + p + q` 退出，<font color="red">容器不会停止</font>

### 3.4 启动已停止运行的容器

```shell
docker start 容器ID 或 容器名
```

![image-20220309173002921](http://img.hl1015.top/blog/image-20220309173002921.png)

### 3.5 重启容器

```shell
docker restart 容器ID 或 容器名
```

![image-20220309173108587](http://img.hl1015.top/blog/image-20220309173108587.png)

### 3.6 停止容器

```shell
docker stop 容器ID 或 容器名
```

![image-20220310085425953](http://img.hl1015.top/blog/image-20220310085425953.png)

### 3.7 强制停止容器

```shell
docker kill 容器ID 或 容器名
```

![image-20220310085746807](http://img.hl1015.top/blog/image-20220310085746807.png)

### 3.8 删除已停止的容器

```shell
docker rm 容器ID
```

![image-20220310090554590](http://img.hl1015.top/blog/image-20220310090554590.png)

> 一次性删除多个容器（<font color="red">慎用，工作中尽量杜绝使用</font>）
>
> ```shell
> docker rm -f ${docker ps -a -q}
> ```
>
> 或者
>
> ```shell
> docker ps -a -q | xargs docker rm
> ```

### 3.9 重要⭐

**1、<font color="red">有镜像才能创建容器，这是根本前提</font>**

**2、启动守护式容器（后台服务器）**：在大部分场景下，我们希望 Docker 服务是在后台运行的，我们可以通过 -d 指定容器的后台运行模式

```shell
docker run -d 容器名
```

我们使用 ubuntu:lastest 以后台模式启动一个容器 `docker run -d ubuntu`，然后我们通过 `docker ps -a` 进行查看，会发现容器已经退出

![image-20220310092128478](http://img.hl1015.top/blog/image-20220310092128478.png)

这里很重要地要说明的一点：<font color="red">Docker 容器后台运行，就必须有一个前台进程</font>

容器运行的命令如果不是那些<font color="red">一直挂起的命令（比如运行 top，tail）</font>，就是会自动退出的，这个是 Docker 机制的问题，比如你的 Web 容器，我们以 Nginx 为例，正常情况下，我们配置启动服务只需要启动相应的 Service 即可，例如 `service nginx start`，但是，这样做，Nginx 为后台进程模式运行，就导致 Docker 前台没有运行的应用，这样的容器后台启动后，会立即自杀，因为它觉得没事可做了，所以，最佳的解决方案是：<font color="red">将你要运行的程序以前台进程的形式运行，常见的就是命令行模式，表示我还有交互操作，别中断，O(∩_∩)O哈哈</font>

Redis 前后台启动演示（使用 `docker pull redis:6.0.8` 下载 Redis 镜像）：

- 前台交互式启动

```shell
docker run -it redis:6.0.8
```

![image-20220310093643008](http://img.hl1015.top/blog/image-20220310093643008.png)

此时，如果按了 `ctrl + c` 容器会自动停止退出【不推荐】

- 后台守护式启动

```shell
docker run -d redis:6.0.8
```

![image-20220310094117699](http://img.hl1015.top/blog/image-20220310094117699.png)

**3、查看容器日志**

```shell
docker logs 容器ID
```

![image-20220310094641855](http://img.hl1015.top/blog/image-20220310094641855.png)

**4、查看容器内运行的进程**

```shell
docker top 容器ID
```

![image-20220310094818971](http://img.hl1015.top/blog/image-20220310094818971.png)

**5、查看容器内部细节**

```shell
docker inspect 容器ID
```

![image-20220310095525662](http://img.hl1015.top/blog/image-20220310095525662.png)

**6、<font color="red">进入正在运行的容器并以命令行交互</font>**

> 两种方式：`docker exec` 或者 `docker attach`

```shell
docker exec -it 容器ID /bin/bash
```

![image-20220310102415521](http://img.hl1015.top/blog/image-20220310102415521.png)

```shell
docker attach 容器ID
```

![image-20220310101839574](http://img.hl1015.top/blog/image-20220310101839574.png)

`docker exec` 和 `docker attach` 的区别：

- `exec` 是在容器中打开新的终端，并且可以启动新的进程，用 `exit` 退出，<font color="blue">不会导致容器的停止</font>
- `attach` 直接进入容器启动命令的终端，不会启动新的进程，用 `exit` 退出，<font color="blue">会导致容器的停止</font>

因此，建议大家使用 `docker exec`，因为退出容器终端，不会导致容器的停止

进入之前的 Redis 容器实例：

```shell
docker exec -it 容器ID /bin/bash
```

![image-20220310103020095](http://img.hl1015.top/blog/image-20220310103020095.png)

```shell
docker exec -it 容器ID redis-cli
```

![image-20220310103128823](http://img.hl1015.top/blog/image-20220310103128823.png)

<font color="blue">一般我们使用 -d 后台启动程序，然后再用 exec 进入对应的容器实例</font>

**7、从容器内拷贝文件到主机上**

```shell
docker cp 容器ID:容器内路径 目标主机路径
```

![image-20220310105533041](http://img.hl1015.top/blog/image-20220310105533041.png)

**8、导入和导出容器**

- `export` 导出容器的内容留作为一个 tar 归档 文件

```shell
docker export 容器ID > 文件名.tar
```

![image-20220310110559779](http://img.hl1015.top/blog/image-20220310110559779.png)

- `import` 从 tar 包中的内容创建一个新的文件系统再导入为镜像

```shell
cat 文件名.tar | docker import - 镜像用户/镜像名:镜像版本号
```

![image-20220310111127020](http://img.hl1015.top/blog/image-20220310111127020.png)

## 4. 总结

![image-20220310111326877](http://img.hl1015.top/blog/image-20220310111326877.png)

- **`attach`**：当前 shell 下 attach 连接指定运行镜像
- **`build⭐`**：通过 Dockerfile 定制镜像
- **`commit`**：提交当前容器为新的镜像
- **`cp`**：从容器中拷贝指定文件或者目录到宿主机中
- **`create`**：创建一个新的容器，同 run，但不启动容器
- **`diff`**：查看 docker 容器变化
- **`events`**：从 docker 服务获取容器实时事件
- **`exec⭐`**：在已存在的容器上运行命令
- **`export`**：导出容器的内容流作为一个 tar 归档文件[对应 import]
- **`history`**：展示一个镜像形成历史
- **`images⭐`**：列出系统当前镜像
- **`import`**：从 tar 包中的内容创建一个新的文件系统镜像[对应 export]
- **`info`**：显示系统相关信息
- **`inspect`**：查看容器详细信息
- **`kill`**：kill 指定 docker 容器
- **`load`**：从一个 tar 包中加载一个镜像[对应 save]
- **`login`**：注册或者登录一个 docker 源服务器
- **`logout`**：从当前 Docker Registry 退出
- **`logs`**：输出当前容器日志信息
- **`port`**：查看映射端口对应的容器内部源端口
- **`pause`**：暂停容器
- **`ps⭐`**：列出容器列表
- **`pull⭐`**：从 docker 镜像源服务器拉取指定镜像或者库镜像
- **`push`**：推送指定镜像或者库镜像至 docker 源服务器
- **`restart⭐`**：重启运行的容器
- **`rm`**：移除一个或者多个容器
- **`rmi`**：移除一个或者多个镜像[无容器使用该镜像才可删除，否则需删除相关容器才可继续 - f 强制删除]
- **`run⭐`**：创建一个新的容器并运行
- **`save`**：保存一个镜像为一个 tar 包[对应 load]
- **`start⭐`**：启动容器
- **`stop⭐`**：停止容器
- **`tag`**：给源中镜像打标签
- **`top`**：查看容器中运行的进程信息
- **`unpause`**：取消暂停容器
- **`version`**：查看 docker 版本号
- **`wait`**：截取容器停止时的退出状态值

