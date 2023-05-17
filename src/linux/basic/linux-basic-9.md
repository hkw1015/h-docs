---
title: 在 VM 上安装 CentOS7
date: 2021-09-14
category: Linux
tag:
 - Linux 入门
---

## 0 检查 BIOS 虚拟化支持

![image-20210914130804420](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914130804420.png)

## 1 新建虚拟机

![image-20210914130816997](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914130816997.png)

## 2 新建虚拟机向导

![image-20210914130827987](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914130827987.png)

## 3 创建虚拟空白光盘

![image-20210914130839054](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914130839054.png)

## 4 安装 Linux 系统对应的 CentOS 版

![image-20210914130851029](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914130851029.png)

## 5 虚拟机命名和定位磁盘位置

![image-20210914130901739](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914130901739.png)

## 6 处理器配置，看自己是否是双核、多核

![image-20210914130912133](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914130912133.png)

## 7 设置内存为 2GB

![image-20210914130920805](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914130920805.png)

## 8 网络设置 NAT

## 9 选择 IO 控制器类型

![image-20210914130931412](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914130931412.png)

## 10 选择磁盘类型

![image-20210914130940160](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914130940160.png)

## 11 新建虚拟磁盘

![image-20210914130952771](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914130952771.png)

## 12 设置磁盘容量

![image-20210914131003138](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131003138.png)

## 13 设置存储磁盘文件位置

![image-20210914131011666](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131011666.png)

## 14 新建虚拟机向导配置完成

![image-20210914131020857](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131020857.png)

## 15 VM 设置

![image-20210914131030612](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131030612.png)

## 16 加载 ISO

![image-20210914131040291](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131040291.png)

## 17 加电并安装配置 CentOS

![image-20210914131051829](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131051829.png)

## 18 加电后初始化欢迎进入页面

![image-20210914131102359](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131102359.png)

 回车选择第一个开始安装配置，此外，在 Ctrl+Alt 可以实现 Windows 主机和 VM 之间窗口的切换

## 19 CentOS 欢迎页面，选择中文-简体中文，点击继续

![image-20210914131115018](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131115018.png)

## 20 进入设置页面，点击“日期和时间”调整后点完成

![image-20210914131122324](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131122324.png)

![image-20210914131132557](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131132557.png)

## 21 点击“键盘”设置键盘布局，调整后点完成

![image-20210914131147454](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131147454.png)

## 22 “语言支持”中文-简体中文

![image-20210914131159259](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131159259.png)

## 23 “安装源”本地介质

![image-20210914131210466](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131210466.png)

## 24 “软件安装”-GNOME桌面

![image-20210914131236080](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131236080.png)

## 25 安装目标位置

其他存储选项 —— 我要配置分区

![image-20210914131244662](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131244662.png)

![image-20210914131255642](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131255642.png)

Boot，要大于 200 mb

![image-20210914131308343](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131308343.png)

![image-20210914131320091](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131320091.png)

根分区新建，设备类型“标准分区”，挂载点为“/”，文件系统为“ext4”

swap 分区设置，文件系统为“swap”

![image-20210914131330638](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131330638.png)

点击完成后

![image-20210914131342231](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131342231.png)

## 26 网络主机名，修改主机名

![image-20210914131422398](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131422398.png)

## 27 Kdump，不启用Kdump

![image-20210914131434284](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131434284.png)

## 28 点击“开始安装”，进入安装页面，设置“ROOT密码”

![image-20210914131445916](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131445916.png)

![image-20210914131454633](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131454633.png)

## 29 完成配置，继续安装 CentOS

![image-20210914131506186](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131506186.png)

## 30 等待安装完成

等待等待等待等待……20 分钟左右

![image-20210914131526094](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131526094.png)

## 31 安装完成，重新引导

![image-20210914131538620](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131538620.png)

## 32 进入欢迎页面

![image-20210914131547300](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131547300.png)

## 33 重启后，许可证页面，下面同意许可

![image-20210914131557042](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131557042.png)

## 34 无需创建新用户，点击“完成配置”

![image-20210914131606313](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131606313.png)

## 35 输入选择“汉语（pinyin）”，点击“前进”

![image-20210914131616650](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131616650.png)

## 36 隐私，默认

![image-20210914131625858](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131625858.png)

## 37 时区，上海

## 38 在线账号，跳过

![image-20210914131658934](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131658934.png)

## 39 关于您，设置自己账号

![image-20210914131710944](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131710944.png)

![image-20210914131718630](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131718630.png)

![image-20210914131651203](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131651203.png)

## 40 注销自己账号，W用 root 账号登录，初始化 root 账号

![image-20210914131805321](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131805321.png)

![image-20210914131814632](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131814632.png)

![image-20210914131823690](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131823690.png)

![image-20210914131834832](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131834832.png)

![image-20210914131847272](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914131847272.png)

重复初始化步骤

## 41 安装 gcc

有网情况：**yum install gcc**

```
yum install gcc-c++
```

无网情况下：

> gcc 相关 rpm 文件下载地址
>
> **链接：[https://pan.baidu.com/s/1UHMVEOZ4gTRVlZBqHcVqqQ](https://pan.baidu.com/s/1UHMVEOZ4gTRVlZBqHcVqqQ)**
>
> **提取码：41ot**

![image-20210914132638967](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914132638967.png)

进入 CentOS 下存放 .rpm 文件的目录，执行

```
rpm -Uvh *.rpm --nodeps --force
```

然后使用

```
gcc -v

g++ -v
```

查看 gcc 版本和 g++ 版本，会看到详细的版本信息，离线环境下安装 GCC 和 GCC-C++ 就完成了