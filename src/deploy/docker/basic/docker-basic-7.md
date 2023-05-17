---
title: Docker 容器数据卷
date: 2022-11-25
category: Docker
tag:
 - Docker 基础
---

## 1. 🚽避坑点：使用容器数据卷记得加上 --privileged=true

**理由**：Docker 挂载主机目录访问，如果出现 <font color="red">cannot open directory: Permission denied</font>，说明权限不足

**解决方法**：在挂载目录后面多加一个 **`--privileged=true`** 参数即可

如果是 CentOS 7 安全模块会比之前系统版本加强，不安全的会先禁止，所以目录挂载的情况被默认为不安全的行为，在 SELinux 里面挂载目录被禁止掉了，如果要开启，我们一般使用 --privileged=true 参数，扩大容器的权限解决挂载目录没有权限的问题，也即使用该参数，container 内的 root 拥有真正的 root 权限，否则，container 内的 root 只是外部的一个普通用户权限

## 2. 容器数据卷是什么

卷就是目录或文件，存在于一个或多个容器中，由 Docker 挂载到容器，但不属于联合文件系统，因此能够绕过 Union File System 提供一些用于持续存储或共享数据的特性。卷的设计目的就是数据的持久化，完全独立于容器的生存周期，因此 Docker 不会在容器删除时删除其挂载的数据卷

一句话，容器数据卷有点类似我们 Redis 里面的 RDB 和 AOF 文件，它能够将 Dokcer 容器内的数据保存进宿主机的磁盘中，运行一个带有容器卷存储功能的容器实例

```shell
docker run -it --privileged=true -v /宿主机绝对路径目录:/容器内目录 镜像名
```

## 3. 容器数据卷能干嘛

将运用于运行的环境打包镜像，run 后形成容器实例运行，但是我们对数据的要求希望是<font color="red">持久化的</font>

Docker 容器产生的数据，如果不备份，那么当容器实例删除后，容器内的数据自然也就没有了，为了能保存数据在 Docker 中我们就需要使用数据卷

**特点：**

1. 数据卷可在容器之间共享或重用数据
2. 卷中的更改可以直接实时生效
3. 数据卷中的更改不会包含在镜像的更新中
4. 数据卷的生命周期一直持续到没有容器使用它为止