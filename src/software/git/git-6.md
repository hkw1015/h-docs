---
title: GitHub 操作
date: 2021-11-07
category: Git
tag:
  - Git
---

GitHub 网址：[https://github.com/](https://github.com/)

Ps：全球最大同性交友网站，技术宅男的天堂，新世界的大门，你还在等什么？

## 0. 注册一个 GitHub 账号

![image-20211109105830188](http://img.hl1015.top/blog/image-20211109105830188.png)

## 1. 创建远程仓库

![image-20211109210317450](http://img.hl1015.top/blog/image-20211109210317450.png)

![image-20211109223022711](http://img.hl1015.top/blog/image-20211109223022711.png)

## 2. 远程仓库操作

|              命令名称              |                           作用                           |
| :--------------------------------: | :------------------------------------------------------: |
|           git remote -v            |                 查看当前所有远程地址别名                 |
|    git remote add 别名 远程地址    |                          起别名                          |
|         git push 别名 分支         |              推送本地分支上的内容到远程仓库              |
|         git clone 远程地址         |                将远程仓库的内容克隆到本地                |
| git pull 远程库地址别名 远程分支名 | 将远程仓库对应分支最新内容拉下来后与当前本地分支直接合并 |

### 2.1 创建远程仓库别名

**（1）基本语法**

```shell
git remote -v 查看当前所有远程地址别名
git remote add 别名 远程地址
```

**（2）案例实操**

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git remote -v

Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git remote add gitTest https://github.com/hkw1015/git_test.git

Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git remote -v
gitTest https://github.com/hkw1015/git_test.git (fetch)
gitTest https://github.com/hkw1015/git_test.git (push)
```

### 2.2 推送本地分支到远程仓库

**（1）基本语法**

```shell
git push 别名 分支
```

**（2）案例实操**

> Tips：由于推送需要登录 GitHub 账户，但是从 2021 年 8 月 31 日开始，必须使用个人访问令牌代替密码使用，所以我们先生成访问令牌
>
> <img src="http://img.hl1015.top/blog/image-20211109230040431.png" alt="image-20211109230040431" style="zoom:50%;" />
>
> <img src="http://img.hl1015.top/blog/image-20211109230216877.png" alt="image-20211109230216877" style="zoom:50%;" />
>
> ![image-20211109230332845](http://img.hl1015.top/blog/image-20211109230332845.png)
>
> <img src="http://img.hl1015.top/blog/image-20211109233129574.png" alt="image-20211109233129574" style="zoom: 50%;" />
>
> ![image-20211109230502340](http://img.hl1015.top/blog/image-20211109230502340.png)

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git push gitTest master
Logon failed, use ctrl+c to cancel basic credential prompt.
Enumerating objects: 15, done.
Counting objects: 100% (15/15), done.
Delta compression using up to 4 threads
Compressing objects: 100% (10/10), done.
Writing objects: 100% (15/15), 1.16 KiB | 25.00 KiB/s, done.
Total 15 (delta 1), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (1/1), done.
To https://github.com/hkw1015/git_test.git
 * [new branch]      master -> master
```

此时发现已将我们 master 分支上的内容推送到 GitHub 创建的远程仓库。

![image-20211109234134643](http://img.hl1015.top/blog/image-20211109234134643.png)

### 2.3 克隆远程仓库到本地

（1）基本语法

```shell
git clone 远程仓库地址
```

（2）案例实操

```shell
Administrator@WIN-84I7718196I MINGW64 /d/clone_project
$ git clone https://github.com/hkw1015/git_test.git
Cloning into 'git_test'...
remote: Enumerating objects: 15, done.
remote: Counting objects: 100% (15/15), done.
remote: Compressing objects: 100% (9/9), done.
remote: Total 15 (delta 1), reused 15 (delta 1), pack-reused 0
Unpacking objects: 100% (15/15), 1.14 KiB | 1024 bytes/s, done.
```

https://github.com/hkw1015/git_test.git 这个地址为远程仓库地址，克隆结果：初始化本地仓库

![image-20211112091027996](http://img.hl1015.top/blog/image-20211112091027996.png)

```shell
--- 创建远程仓库别名 ---
Administrator@WIN-84I7718196I MINGW64 /d/clone_project/git_test (master)
$ git remote add git_test https://github.com/hkw1015/git_test.git

Administrator@WIN-84I7718196I MINGW64 /d/clone_project/git_test (master)
$ git remote -v
git_test        https://github.com/hkw1015/git_test.git (fetch)
git_test        https://github.com/hkw1015/git_test.git (push)
origin  https://github.com/hkw1015/git_test.git (fetch)
origin  https://github.com/hkw1015/git_test.git (push)
```

小结：clone 会做如下操作 1、拉取代码 2、初始化本地仓库 3、创建别名

### 2.4 邀请加入团队

**（1）选择邀请合作者**

![image-20211112092317812](http://img.hl1015.top/blog/image-20211112092317812.png)

**（2）填入想要合作的人**

<img src="http://img.hl1015.top/blog/image-20211112094302929.png" alt="image-20211112094302929" style="zoom:50%;" />

**（3）复制地址并通过微信钉钉等方式发送给该用户，复制内容如下：**

```
https://github.com/hkw1015/git_test/invitations
```

<img src="http://img.hl1015.top/blog/image-20211112094436612.png" alt="image-20211112094436612" style="zoom:50%;" />

**（4）账号 hl1015811422 将上面的地址粘贴到浏览器地址栏访问后，点击接受邀请**

<img src="http://img.hl1015.top/blog/image-20211112095203390.png" alt="image-20211112095203390" style="zoom:50%;" />

**（5）成功之后，hl1015811422 这个账号有了 push 代码到 git_test 仓库的权限**

![image-20211112095618620](http://img.hl1015.top/blog/image-20211112095618620.png)

**（6）hl1015811422 可以修改内容并 push 到远程仓库**

```shell
--- 编辑 clone 下来的文件 ---
Administrator@WIN-84I7718196I MINGW64 /d/clone_project/git_test (master)
$ vim hello.txt

Administrator@WIN-84I7718196I MINGW64 /d/clone_project/git_test (master)
$ cat hello.txt
hello git！hello hkw！master-test
hello git！hello hkw！hot-fix-test
hello git！hello hkw！我是最帅的！

--- 将编辑好的文件添加到暂存区 ---
Administrator@WIN-84I7718196I MINGW64 /d/clone_project/git_test (master)
$ git add hello.txt

--- 将暂存区的文件上传到本地库 ---
Administrator@WIN-84I7718196I MINGW64 /d/clone_project/git_test (master)
$ git commit -m "hl1015811422 commit" hello.txt
[master a0809fb] hl1015811422 commit
 1 file changed, 1 insertion(+), 1 deletion(-)
 
--- 将本地库的内容 push 到远程仓库 ---
Administrator@WIN-84I7718196I MINGW64 /d/clone_project/git_test (master)
$ git push origin master
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 4 threads
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 282 bytes | 141.00 KiB/s, done.
Total 3 (delta 1), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
To https://github.com/hkw1015/git_test.git
   fd0c18d..a0809fb  master -> master
```

**（7）回到 hkw1015 的 GitHub 远程仓库中可以看到，最后一次是 hl1015811422 提交的**

![image-20211112102859650](http://img.hl1015.top/blog/image-20211112102859650.png)

### 2.5 拉取远程仓库内容

**（1）基本语法**

```shell
git pull 远程库地址别名 远程分支名
```

**（2）案例实操**

```shell
--- 将远程仓库对于分支最新内容拉下来后与当前本地分支直接合并 ---
Administrator@WIN-84I7718196I MINGW64 /d/clone_project/git_test (master)
$ git pull git_test master
From https://github.com/hkw1015/git_test
 * branch            master     -> FETCH_HEAD
 * [new branch]      master     -> git_test/master
Already up to date. // 说明本地已经是最新的代码
```

## 3. 跨团队合作

**（1）将远程仓库地址复制发给邀请团队协作的人**

![image-20211112143159785](http://img.hl1015.top/blog/image-20211112143159785.png)

**（2）在浏览器地址栏中粘贴上面的地址并访问，然后点击 Fork 将项目叉到自己的本地仓库**

![image-20211112143126489](http://img.hl1015.top/blog/image-20211112143126489.png)

叉成功后可以看到当前仓库信息（当前仓库所有人是：hl1015811422，fork 来源是 hkw1015）

![image-20211113141143908](http://img.hl1015.top/blog/image-20211113141143908.png)

**（3）hl1015811422 就可以在线编辑叉取过来的文件**

![image-20211114150911590](http://img.hl1015.top/blog/image-20211114150911590.png)

![image-20211114150946989](http://img.hl1015.top/blog/image-20211114150946989.png)

**（4）编辑完毕后，填写描述信息并点击左下角绿色按钮提交**

![image-20211114151334745](http://img.hl1015.top/blog/image-20211114151334745.png)

**（5）接下来点击右上方的 Pull 请求，并创建一个新的请求**

![image-20211114151538862](http://img.hl1015.top/blog/image-20211114151538862.png)

![image-20211114151703283](http://img.hl1015.top/blog/image-20211114151703283.png)

![image-20211114151749763](http://img.hl1015.top/blog/image-20211114151749763.png)

**（6）回到 hkw1015 的账号可以看到有一个 Pull request 请求**

![image-20211114151918250](http://img.hl1015.top/blog/image-20211114151918250.png)

![image-20211114152015307](http://img.hl1015.top/blog/image-20211114152015307.png)

进入聊天室，可以讨论代码相关内容

![image-20211114152238107](http://img.hl1015.top/blog/image-20211114152238107.png)

![image-20211114152437462](http://img.hl1015.top/blog/image-20211114152437462.png)

**（7）如果代码没有问题，可以点击 Merge pull request 合并代码**

![image-20211114152800323](http://img.hl1015.top/blog/image-20211114152800323.png)

![image-20211114153030423](http://img.hl1015.top/blog/image-20211114153030423.png)

## 4. SSH 免密登录

我们可以看到远程仓库中还有一个 SSH 的地址，因此我们也可以使用 SSH 进行访问。

![image-20211114153516921](http://img.hl1015.top/blog/image-20211114153516921.png)

具体做如下：

```shell
--- 进入当前用户的家目录 ---
Administrator@WIN-84I7718196I MINGW64 /d/clone_project/git_test (master)
$ cd

--- 删除 .ssh 目录 ---
Administrator@WIN-84I7718196I MINGW64 ~
$ rm -rvf .ssh
removed '.ssh/id_rsa'
removed '.ssh/id_rsa.pub'
removed '.ssh/known_hosts'
removed directory '.ssh'

--- 运行命令 .ssh 密钥目录[注意：这里 -C 这个参数是大写的 C]
Administrator@WIN-84I7718196I MINGW64 ~
$ ssh-keygen -t rsa -C hkw1015@163.com
Generating public/private rsa key pair.
Enter file in which to save the key (/c/Users/Administrator/.ssh/id_rsa):
Created directory '/c/Users/Administrator/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /c/Users/Administrator/.ssh/id_rsa
Your public key has been saved in /c/Users/Administrator/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:DW4u96rzA/k6snVRubq/aetK0RgMMSit2jnqFSaKjO8 hkw1015@163.com
The key's randomart image is:
+---[RSA 3072]----+
|   . .+.         |
|  . o  +   .     |
|   o    + o      |
|  .    . B .     |
| + +   .S +      |
|* * . oo +       |
|+o o  oo*        |
|... ..o=oo..     |
|.oE .oo*=BBo     |
+----[SHA256]-----+

--- 进入 .ssh 目录查看文件列表 ---
Administrator@WIN-84I7718196I MINGW64 ~
$ cd .ssh/

Administrator@WIN-84I7718196I MINGW64 ~/.ssh
$ ll -a
total 33
drwxr-xr-x 1 Administrator 197121    0 11月 14 17:41 ./
drwxr-xr-x 1 Administrator 197121    0 11月 14 17:41 ../
-rw-r--r-- 1 Administrator 197121 2602 11月 14 17:41 id_rsa
-rw-r--r-- 1 Administrator 197121  569 11月 14 17:41 id_rsa.pub

--- 查看 id_rsa.pub 文件内容 ---
Administrator@WIN-84I7718196I MINGW64 ~/.ssh
$ cat id_rsa.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDIKAh0tuniwyvgaRwZz9Xc/NLzfEW2MCpD3azqnDlgHa/aPczOIOEeTmnRjpdV2U0gTNNghhqfTTJXIsXqji73phgc2iR6Jck3kE0u6yG7cQu21emUFV80WQFTzcsxVaiNR08d7v6WXAn0aH4vIM0O7oXoReJxFBIMgjZ4r2aDVu4ibiaehqR/7aRCZpqXX7ZSJSuZM+ouNUMCmz72b7cZR/Bgzaej0H+qTBl6jAojd4f4+HfDWOvz+dnWrpxfB27KzxRIHp0ImSzuYHOBBRLSFe+6rug3oetQW2sEH3wa3Pol+Sje8vytsMajS88gSWvhPnTVCf5FrcHa0lQN5Wi7HqidXWLiqvo1zvqh1OTi5GcoVtLine+10ftvYkAXnLEb7/IOmAecoCJeQPhE/xM3RiQS2Pb+wEi+DY8PyrbdTGxla+d7zwku5bFBESraTxuH6DTcwtsPkfph1Pehapyq+9/6kT7WbiqgOOXEFgqDbI1lO2Xtlos/oSBuRee/6u8= hkw1015@163.com
```

复制 id_rsa.pub 文件内容，登录 GitHub，点击用户头像 -> Settings -> SSH and GPG keys

<img src="http://img.hl1015.top/blog/image-20211114174750149.png" alt="image-20211114174750149" style="zoom:50%;" />

![image-20211114174854097](http://img.hl1015.top/blog/image-20211114174854097.png)

![image-20211114175125932](http://img.hl1015.top/blog/image-20211114175125932.png)

添加成功

![image-20211114175223898](http://img.hl1015.top/blog/image-20211114175223898.png)

接下来再往远程仓库 push 东西的时候使用 SSH 连接就不需要登录了