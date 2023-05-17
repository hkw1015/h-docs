---
title: MySQL 安装
date: 2021-09-11
category: MySQL
tag:
  - MySQL 安装
---

## 1. 下载

**1、进入 MySQL 官网**

- 官网地址：[https://www.mysql.com/downloads/](https://www.mysql.com/downloads/)
- 进入官网以后，登录你的 Oracle 帐号，没有的申请一个（也可以不申请）

**2、点击 MySQL Community(GPL) Downloads >>**

![image-20210911144510843](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911144510843.png)

**3、点击 MySQL Community Server**

![image-20210911142445307](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911142445307.png)

**4、点击 Go to Download Page >**

![image-20210911142517371](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911142517371.png)

**5、点击下面的那个 Download**

![image-20210911142543517](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911142543517.png)

**6.点击 Download Now 开始下载**

![image-20210911142605479](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911142605479.png)

## 2. 安装

**1、打开从官网下载好的安装文件**

![image-20210911142659624](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911142659624.png)

**2、选择安装 Custom**

![image-20210911144627518](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911144627518.png)

**3、选择操作系统（x64表示64位，x86表示32位）**

![image-20210911142751403](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911142751403.png)

**4、选中 MySQL Server 8.0.21，然后点击 Execute，把 Microsoft Visual C++ ... 安装上，然后点击 Next**

![image-20210911144653185](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911144653185.png)

**5、点击 Execute**

![image-20210911142847761](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911142847761.png)

Status 变为 Complete 后点击 Next

![image-20210911161824223](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911161824223.png)

**6、点击 Next**

![image-20210911142926380](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911142926380.png)

**7、继续点击 Next**

![image-20210911142946410](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911142946410.png)

**8、继续点 Next**

![image-20210911143013351](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911143013351.png)

**9、继续点 Next**

![image-20210911143035962](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911143035962.png)

**10、设置 root 密码后点击 Next**

![image-20210911143056831](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911143056831.png)

**11、点击 Next 进入下一步**

![image-20210911143122669](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911143122669.png)

**12、点击 Execute 执行**

![image-20210911143139919](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911143139919.png)

执行成功，点击 Finish

![image-20210911143205407](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911143205407.png)

**13、点击 Next**

![image-20210911143220834](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911143220834.png)

**14、点击 Finish 完成安装**

![image-20210911143417882](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911143417882.png)

## 3. 配置环境变量

> **主要目的：解决 cmd 输入 mysql 提示不是内部或外部命令**

**1、复制 MySQL 安装的 bin 的路径**

![image-20210911143430150](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911143430150.png)

**2、桌面，此电脑 > 属性 > 高级系统设置 > 高级 > 环境变量，选中 path 进行编辑**

![image-20210911143355587](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911143355587.png)

**3、点击新建**

![image-20210911143456349](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911143456349.png)

**4、把前面复制的路径粘贴进去，然后点击确认**

![image-20210911143517116](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911143517116.png)

**5、一路确认回去，完成环境配置**

**6、去到 cmd，输入 mysql -u root -p，输入正确密码以后，进入到 mysql，这是我们可以输入 mysql 的相关语句对数据库进行操作**

![image-20210911143645841](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911143645841.png)

**7、除了 dos 命令行的方式，现在我们通常利用连接数据库的客户端对数据库进行操作，比如 SQLYog、Navicat**

## 4. 安装 Nabicat 连接工具

**1、下载 Navicat Premium 15**

- 下载地址：[https://pan.baidu.com/s/1ZnmjY-xyCCx7-cxkWhOq1A](https://pan.baidu.com/s/1ZnmjY-xyCCx7-cxkWhOq1A)
- 提取码：ru45

**2、下载注册机**

- 下载地址：[https://pan.baidu.com/s/1nk6luPMwa_XNOaoMFPB0gQ](https://pan.baidu.com/s/1nk6luPMwa_XNOaoMFPB0gQ)
- 提取码：to9b

**3、注意事项**

- 运行注册机时最好关闭电脑的杀毒软件；
- 运行注册机请断网，无需将注册机放到 Navicat Premium 安装目录下；
- 请选择对各个版本，Products 那块；
- Navicat 安装完成后别运行软件，然后再打开注册机。

**4、激活步骤**

（1）运行注册机，勾选 Backup、Host 和 Navicat v15，如图所示。然后**点击 Patch 按钮**，找到 Navicat Premium 15安装路径下的 navicat.exe，选中并点击打开，此时会提示：navicat.exe - x64 -> Cracked，提示已破解。

![image-20210911144416948](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911144416948.png)

（2）点击下图的红色箭头所指的 Generate，将自动生成 **Serial Keygen（即注册码），然后复制上**。

![image-20210911144822778](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911144822778.png)

（3）现在打开 Navicat Premium 15，**点击注册**（或菜单栏的帮助——》注册），输入上一步生成的注册码，然后点击激活，紧接着**点手动激活**。

（4）将 Navicat 手动激活窗口的请求码框中内容复制到注册机 Request Code 框中，点击 Activation Code 下面的 Generate 按钮。

![image-20210911144857966](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911144857966.png)

（5）将注册机 Activation Code 处生成的激活码内容复制到 Navicat 激活码框中激活即可。

**注意：若多次激活失败，请先卸载已安装的 Navicat Premium 并清理残留文件夹和注册表，重启电脑，再尝试激活**