---
title: 本地镜像发布到阿里云
date: 2022-11-25
category: Docker
tag:
 - Docker 基础
---

## 1. 本地镜像发布到阿里云流程

![image-20220310142751957](http://img.hl1015.top/blog/image-20220310142751957.png)

## 2. 镜像的生成方法

两种方式：

- **`docker commit`**

  - ```shell
    docker commit -m="提交的描述信息" -a="作者" 容器ID 要创建的目标镜像名:标签名
    ```

- Dockerfile【后面会介绍】

## 3. 将本地镜像推送到阿里云

### 3.1 本地素材原型

![image-20220310143359007](http://img.hl1015.top/blog/image-20220310143359007.png)

### 3.2 登录阿里云，打开控制台

> [阿里云-上云就上阿里云 (aliyun.com)](https://www.aliyun.com/)

### 3.3 创建镜像仓库

1、进入 **容器镜像服务**

![image-20220310143908789](http://img.hl1015.top/blog/image-20220310143908789.png)

2、选择 **个人实例**

![image-20220310144035354](http://img.hl1015.top/blog/image-20220310144035354.png)

3、创建 **命名空间**

![image-20220310144146270](http://img.hl1015.top/blog/image-20220310144146270.png)

4、创建 **镜像仓库**

![image-20220310144558236](http://img.hl1015.top/blog/image-20220310144558236.png)

![image-20220310144649498](http://img.hl1015.top/blog/image-20220310144649498.png)

5、进入管理界面**获得脚本**

![image-20220310144816793](http://img.hl1015.top/blog/image-20220310144816793.png)

![image-20220310144916279](http://img.hl1015.top/blog/image-20220310144916279.png)

### 3.4 将镜像推送到阿里云

> 根据上面最后一步获取到的脚本：
>
> ![image-20220310145240610](http://img.hl1015.top/blog/image-20220310145240610.png)

```shell
docker login --username=hl422**** registry.cn-hangzhou.aliyuncs.com
```

```shell
docker tag [ImageId] registry.cn-hangzhou.aliyuncs.com/hl1015/myubuntu:[镜像版本号]
docker push registry.cn-hangzhou.aliyuncs.com/hl1015/myubuntu:[镜像版本号]
```

![image-20220310150024651](http://img.hl1015.top/blog/image-20220310150024651.png)

推送成功后，可以看到阿里云控制台-镜像仓库-镜像版本中就有了我们刚才推送的镜像

![image-20220310150242340](http://img.hl1015.top/blog/image-20220310150242340.png)

## 4.将阿里云上的镜像下载到本地

![image-20220310150635404](http://img.hl1015.top/blog/image-20220310150635404.png)

```shell
docker pull registry.cn-hangzhou.aliyuncs.com/hl1015/myubuntu:[镜像版本号]
```

![image-20220310150743891](http://img.hl1015.top/blog/image-20220310150743891.png)