---
title: 下载与安装
date: 2021-11-07
category: Git
tag:
  - Git
---

## 1. 下载

下载地址：[https://git-scm.com/downloads](https://git-scm.com/downloads)

![](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911131746871.png)

## 2. 安装

**（1）使用许可声明**

![image-20210911131925541](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911131925541.png)

点击 Next 进入下图界面

**（2）选择安装路径**

![image-20210911132229340](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911132229340.png)

手动输入本地地址，或者点击“Browse...”选择本地地址，然后点击 Next 进入下图界面

**（3）选择安装组件（推荐全选）**

![image-20210911132332180](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911132332180.png)

根据需要选择完毕后，点击 Next 进入下图界面

**（4）选择开始菜单文件夹（默认就好）**

![image-20210911132415474](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911132415474.png)

不需要改，点击 Next 进入下图界面

**（5）选择 Git 文件默认的编辑器**

![image-20210911132438499](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911132438499.png)

很少用到，默认 Vim 即可，点击 Next 进入下图界面

**（6）调整你的 PATH 环境**

![image-20210911132508330](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911132508330.png)

- 第一种配置是“仅从Git Bash使用Git”。这是最安全的选择，因为您的 PATH 根本不会被修改。您只能使用 Git Bash 的 Git 命令行工具。但是这将不能通过第三方软件使用。

- 第二种配置是“从命令行以及第三方软件进行Git”。该选项被认为是安全的，因为它仅向 PATH 添加了一些最小的 Git 包装器，以避免使用可选的Unix工具造成环境混乱。

  - 您将能够从Git Bash，命令提示符和 Windows PowerShell 以及在 PATH 中寻找 Git 的任何第三方软件中使用 Git。这也是推荐的选项。

- 第三种配置是“从命令提示符使用 Git 和可选的 Unix 工具”。警告：这将覆盖 Windows 工具，如 “ find 和 sort ”。只有在了解其含义后才使用此选项。

  

  推荐第二种配置，点击 Next 进入下图界面

**（7）选择 HTTPS 后端传输**

![image-20210911132729285](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911132729285.png)

- 第一个选项是“使用 OpenSSL 库”。服务器证书将使用 ca-bundle.crt 文件进行验证。这也是我们常用的选项。
- 第二个选项是“使用本地 Windows 安全通道库”。服务器证书将使用 Windows 证书存储验证。此选项还允许您使用公司的内部根 CA 证书，例如通过 Active Directory Domain Services 。

这里使用默认的第一个选项，点击 Next 进入下图界面

**（8）配置行尾符号转换**

![image-20210911132828394](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911132828394.png)

- 第一个选项是“签出Windows风格，提交 Unix 风格的行尾”。签出文本文件时，Git 会将 LF 转换为 CRLF。提交文本文件时，CRLF 将转换为 LF。对于跨平台项目，这是 Windows 上的推荐设置（“ core.autocrlf”设置为“ true”）
- 第二个选项是“按原样签出，提交 Unix 样式的行尾”。签出文本文件时，Git 不会执行任何转换。 提交文本文件时，CRLF 将转换为 LF。对于跨平台项目，这是 Unix 上的建议设置（“ core.autocrlf”设置为“ input”）
- 第三个选项是“按原样签出，按原样提交”。当签出或提交文本文件时，Git 不会执行任何转换。不建议跨平台项目选择此选项（“ core.autocrlf”设置为“ false”）

这里我用的是 windows 系统，所以使用默认的第一个选项，点击 Next 进入下图界面

**（9）配置终端模拟器与 Git Bash 一起使用**

![image-20210911133013335](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911133013335.png)

- 第一个选项是“使用MinTTY（MSYS2的默认终端）”。Git Bash 将使用 MinTTY 作为终端模拟器，该模拟器具有可调整大小的窗口，非矩形选择和 Unicode 字体。Windows 控制台程序（例如交互式Python）必须通过“ winpty”启动才能在 MinTTY 中运行。
- 第二个选项是“使用Windows的默认控制台窗口”。Git 将使用 Windows 的默认控制台窗口（“cmd.exe”），该窗口可以与 Win32 控制台程序（如交互式Python或node.js）一起使用，但默认的回滚非常有限，需要配置为使用 unicode 字体以正确显示非 ASCII 字符，并且在 Windows 10 之前，其窗口不能自由调整大小，并且只允许矩形文本选择。

这里使用默认的第一个选项，点击 Next 进入下图界面

**（10）选择 git pull 命令的默认行为**

![image-20210911133139982](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911133139982.png)

这里使用默认的第一个选项，点击 Next 进入下图界面

**（11）选择一个凭证助手**

![image-20210911133221718](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911133221718.png)

这里使用默认的选项，点击 Next 进入下图界面

**（12）配置额外选项**

![image-20210911133327130](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911133327130.png)

第一个选项是“启用文件系统缓存”。文件系统数据将被批量读取并缓存在内存中用于某些操作（“core.fscache”设置为“true”）。 这提供了显著的性能提升。

这里使用默认的第一个选项，点击 Next 进入下图界面

**（13）配置实验选项**

![image-20210911133410193](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911133410193.png)

启用实验性的内置添加 -i / -p。（新！）使用实验性的内置交互式 add（“ git add -i”或“ git add -p”）。这使其速度更快（尤其是启动！），但尚未被认为是可靠的。

默认不勾选，直接点击 Install 安装进度界面

**（14）正在安装界面**

![image-20210911133452607](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911133452607.png)

**（15）安装完成**

![image-20210911133509006](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911133509006.png)

这里可以勾选是否启动启动 Git Bash 和是否查看发行说明，然后点击 Next 完成安装

## 3. 启动测试

在开始菜单中我们可以看见 Git 的三个启动图标：GIt CMD、Git Bash、Git GUI

![image-20210911133624124](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911133624124.png)

Git CMD，是通过 CMD 使用 Git（不推荐使用），点击打开后如下图：

![image-20210911133643086](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911133643086.png)

Git Bash 是 Git 配套的一个控制台，点击打开后如下图：

![image-20210911133700698](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911133700698.png)

Git GUI，是 Git 的可视化操作工具，点击打开后如下图：

![image-20210911133717410](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911133717410.png)