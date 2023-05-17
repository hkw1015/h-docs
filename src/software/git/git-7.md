---
title: IDEA 集成 Git
date: 2021-11-07
category: Git
tag:
  - Git
---

## 1. 配置 git 过滤文件

**（1）Eclipse 特定文件**

<img src="http://img.hl1015.top/blog/image-20211114175630742.png" alt="image-20211114175630742" style="zoom:67%;" />

**（2）IDEA 特定文件**

<img src="http://img.hl1015.top/blog/image-20211114175711881.png" alt="image-20211114175711881" style="zoom:67%;" />

**（3）Maven 工程的 target 文件**

<img src="http://img.hl1015.top/blog/image-20211114175759260.png" alt="image-20211114175759260" style="zoom:67%;" />

**问题 1：为什么要忽略他们？**

答：与项目的实际功能无关，不参与服务器上部署运行，把它们忽略掉能够屏蔽 IDE 工具之间的差异。

**问题 2：怎么忽略？**

（1）创建忽略规则文件 <span style="color:red">xxx.ignore（前缀名随便起，建议是 git.ignore）</span>

这个文件的存放位置原则上在哪里都可以，为了便于让 ~/.gitconfig 文件引用，建议也放在用户家目录下

git.ignore 文件模版内容如下：

```shell
# Compiled class file
*.class

# Log file
*.log

# BlueJ files
*.ctxt

# Mobile Tools for Java (J2ME)
.mtj.tmp/

# Package Files
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar

# virtual machine crash logs, see http://www.java.com/en/download/help/error_hotspot.xml
hs_err_pid*

.classpath
.project
.settings
target
.idea
*.iml
```

（2）在 .gitconfig 文件中引用忽略配置文件（此文件在 Windows 的家目录中）

```shell
[user]
    name = hkw
    email = hkw1015@163.com
[core]
    excludesfile = C:/Users/asus/git.ignore
注意：这里要使用“正斜线（/）”，不要使用“反斜线（\）
```

## 2. 定位 Git 程序

![image-20211114181326462](http://img.hl1015.top/blog/image-20211114181326462.png)

## 3. 初始化本地仓库

<img src="http://img.hl1015.top/blog/image-20211114181509741.png" alt="image-20211114181509741" style="zoom:67%;" />

选择要创建 Git 本地仓库的工程

<img src="http://img.hl1015.top/blog/image-20211114182738695.png" alt="image-20211114182738695" style="zoom:67%;" />

通过 IDEA 打开刚初始化的 Git 本地仓库工程

<img src="http://img.hl1015.top/blog/image-20211114183015831.png" alt="image-20211114183015831" style="zoom:67%;" />

<img src="http://img.hl1015.top/blog/image-20211114183103123.png" alt="image-20211114183103123" style="zoom:67%;" />

## 4. 添加到暂存区

右键点击项目，选择 Git -> Add 将项目添加到暂存区

<img src="http://img.hl1015.top/blog/image-20211114183933051.png" alt="image-20211114183933051" style="zoom:50%;" />

## 5. 提交到本地库

<img src="http://img.hl1015.top/blog/image-20211114184039444.png" alt="image-20211114184039444" style="zoom:50%;" />

<img src="http://img.hl1015.top/blog/image-20211114184222416.png" alt="image-20211114184222416" style="zoom:50%;" />

## 6. 切换版本

在 IDEA 的左下角，点击 Version Control 或者 Git，然后点击 Log 查看版本

![image-20211114184812391](http://img.hl1015.top/blog/image-20211114184812391.png)

右键选择要切换的版本，然后在菜单里点击 Checkout Revision

![image-20211114184918960](http://img.hl1015.top/blog/image-20211114184918960.png)

## 7. 创建分支

选择 Git，在 Repository 里面，点击 Branches 按钮

<img src="http://img.hl1015.top/blog/image-20211114185450170.png" alt="image-20211114185450170" style="zoom:50%;" />

在弹出的 Git Branches 框里，点击 New Branch 按钮

![image-20211114185527789](http://img.hl1015.top/blog/image-20211114185527789.png)

填写分支名称，创建 dev_hkw 分支

![image-20211114191423723](http://img.hl1015.top/blog/image-20211114191423723.png)

然后在 IDEA 的右下角看到 dev_hkw，说明分支创建成功，并且当前已经切换成 dev_hkw 分支

![image-20211114191537775](http://img.hl1015.top/blog/image-20211114191537775.png)

## 8. 切换分支

在 IDEA 窗口的右下角，切换到 mater 分支

![image-20211114191702598](http://img.hl1015.top/blog/image-20211114191702598.png)

然后在 IDEA 窗口的右下角看到了 master，说明 master 分支切换成功

![image-20211114191824106](http://img.hl1015.top/blog/image-20211114191824106.png)

## 9. 合并分支

在 IDEA 窗口的右下角，将 dev_hkw 分支合并到当前 master 分支

![image-20211114214211515](http://img.hl1015.top/blog/image-20211114214211515.png)

如果代码没有冲突，分支直接合并成功，分支合并成功以后，代码自动提交，无需手动提交本地库

## 10. 解决冲突

如图所示，如果 master 分支和 dev_hkw 分支都修改了同一行代码，在合并分支的时候就会发生冲突

![image-20211114215019313](http://img.hl1015.top/blog/image-20211114215019313.png)

![image-20211114215108750](http://img.hl1015.top/blog/image-20211114215108750.png)

我们现在站在 master 分支上合并 dev_hkw 分支，就会发生代码冲突

![image-20211114215517648](http://img.hl1015.top/blog/image-20211114215517648.png)

点击 Conflicts 框里的 Merge 按钮，进行手动合并代码

![image-20211114220413620](http://img.hl1015.top/blog/image-20211114220413620.png)

手动合并完代码后，点击右下角的 Apply 按钮

![image-20211114220606747](http://img.hl1015.top/blog/image-20211114220606747.png)

代码冲突解决，自动提交本地库

![image-20211114220703686](http://img.hl1015.top/blog/image-20211114220703686.png)