---
title: 下载与配置
date: 2021-11-07
category: Maven
tag:
 - Maven
---

## 1. 下载

下载地址：[https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)

![image-20210911141618404](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911141618404.png)

选择 Binary zip archive 的 Link 下载即可

## 2. 设置本地仓库

（1）解压下载好的 apache-maven-3.6.3-bin.zip 到本地（这里解压到了 D 盘的根目录下）

（2）进入 D:\apache-maven-3.6.3\conf，找到一个 settings.xml（Maven 的全局配置文件）文件，打开它

![image-20210911141739743](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911141739743.png)

（3）**在 settings.xml 中主要配置 localRepository、mirrors>mirror、profiles>profile 这三个**

- **localRepository**（该值表示构建系统本地仓库的路径，这里设置在了 D:\repository）

  - ```xml
    <localRepository>D:\repository</localRepository>
    ```

- **mirrors**（配置远程仓库的镜像，这里配置了阿里云的镜像）

  - ```xml
    <mirror>
      <id>alimaven</id>
      <name>aliyun maven</name>
      <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
      <mirrorOf>central</mirrorOf>        
    </mirror>
    ```

- **jdk**（配置对应版本的 jdk，这里配置了 jdk1.8）

  - ```xml
    <profile>
      <id>jdk-1.8</id>
      <activation>
        <activeByDefault>true</activeByDefault>
        <jdk>1.8</jdk>
      </activation>
      <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
      </properties>
    </profile>
    ```