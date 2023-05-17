---
title: 常用命令
date: 2021-11-07
category: Git
tag:
  - Git
---

|               命令名称               |      作用      |
| :----------------------------------: | :------------: |
| git config --global user.name 用户名 |  设置用户签名  |
| git config --global user.email 邮箱  |  设置用户签名  |
|               git init               |  初始化本地库  |
|              git status              | 查看本地库状态 |
|            git add 文件名            |  添加到暂存区  |
|   git commit -m "日志信息" 文件名    |  提交到本地库  |
|              git reflog              |  查看历史记录  |
|       git reset --hard 版本号        |    版本穿梭    |

## 1. 设置用户签名

**（1）基本语法**

```shell
git config --global user.name 用户名
git config --global user.email 邮箱
```

**（2）案例实操**

全局范围的签名设置：

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test
$ git config --global user.name hkw

Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test
$ git config --global user.email hkw1015@163.com

Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test
$ cat ~/.gitconfig
[user]
        name = hkw
        email = hkw1015@163.com
```

说明：

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;签名的作用是区分不同操作者身份。用户的签名信息在每一个版本的提交信息中能够看到，以此确认本次提交是谁做的。Git 首次安装必须设置一下用户签名，否则无法提交代码。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注意：这里设置用户签名和将来登录 GitHub（或其他代码托管中心）的账号没有任何关系。

## 2. 初始化本地库

**（1）基本语法**

```shell
git init
```

**（2）案例实操**

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test
$ git init
Initialized empty Git repository in C:/Users/Administrator/Desktop/git_test/.git/

Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ ll -a
total 12
drwxr-xr-x 1 Administrator 197121 0 11月  7 20:24 ./
drwxr-xr-x 1 Administrator 197121 0 11月  7 19:41 ../
drwxr-xr-x 1 Administrator 197121 0 11月  7 20:24 .git/ （.git 初始化的效果，生成 git）
```

**（3）结果查看**

![image-20211107202812407](http://img.hl1015.top/blog/image-20211107202812407.png)

## 3. 查看本地库状态

**（1）基本语法**

```shell
git status
```

**（2）案例实操**

①首次查看（工作区没有任何文件）

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git status
On branch master

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```

②新增文件（hello.txt）

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ vim hello.txt
hello git！hello hkw！
hello git！hello hkw！
```

③再次查看（检测到未追踪的文件）

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git status
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        hello.txt

nothing added to commit but untracked files present (use "git add" to track)
```

④<span style="color:red">**添加**</span>暂存区

[1]将工作区的文件添加到暂存区

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<1>基本语法

```shell
git add 文件名
```

&nbsp;&nbsp;&nbsp;&nbsp;<2>案例实操

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git add hello.txt
warning: LF will be replaced by CRLF in hello.txt.
The file will have its original line endings in your working directory
```

[2]查看状态（检测到暂存区有新文件）

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git status
On branch master

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   hello.txt
```

⑤<span style="color:red">**提交**</span>本地库

[1]将暂存区的文件提交到本地库

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<1>基本语法

```shell
git commit -m "日志信息" 文件名
```

&nbsp;&nbsp;&nbsp;&nbsp;<2>案例实操

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git commit -m "my first commit" hello.txt
warning: LF will be replaced by CRLF in hello.txt.
The file will have its original line endings in your working directory
[master (root-commit) 1738a0e] my first commit
 1 file changed, 3 insertions(+)
 create mode 100644 hello.txt
```

[2]查看状态（没有文件需要提交）

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git status
On branch master
nothing to commit, working tree clean
```

⑥修改文件

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ vim hello.txt
hello git！hello hkw！666
hello git！hello hkw！
```

[1]查看状态（检测到工作区有文件被修改）

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   hello.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

[2]将修改的文件再次添加暂存区

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git add hello.txt
warning: LF will be replaced by CRLF in hello.txt.
The file will have its original line endings in your working directory
```

[3]查看状态（工作区的修改添加到了暂存区）

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git status
On branch master
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   hello.txt
```

[4]提交修改到本地库

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git commit -m "my second commit"
[master 3911d3a] my second commit
 1 file changed, 1 insertion(+), 1 deletion(-)
```

[5]查看状态（没有文件需要提交）

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git status
On branch master
nothing to commit, working tree clean
```

⑦<span style="color:red">**历史版本**</span>

[1]查看历史版本

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<1>基本语法

```shell
git reflog 查看版本信息
git log 查看版本详细信息
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<2>案例实操

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git reflog
3911d3a (HEAD -> master) HEAD@{0}: commit: my second commit
1738a0e HEAD@{1}: commit (initial): my first commit
```

[2]版本穿梭

```shell
-- 首先查看当前的历史记录，可以看到当前是 3911d3a 这个版本 --
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git reflog
3911d3a (HEAD -> master) HEAD@{0}: commit: my second commit
1738a0e HEAD@{1}: commit (initial): my first commit

-- 切换到 1738a0e 版本，也就是我们第一次提交的版本 --
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git reset --hard 1738a0e
HEAD is now at 1738a0e my first commit

-- 切换完毕之后再查看历史记录，当前成功切换到了1738a0e 版本 --
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git reflog
1738a0e (HEAD -> master) HEAD@{0}: reset: moving to 1738a0e
3911d3a HEAD@{1}: commit: my second commit
1738a0e (HEAD -> master) HEAD@{2}: commit (initial): my first commit

-- 然后查看文件 hello.txt，发现文件内容已经变化 --
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ cat hello.txt
hello git！hello hkw！
hello git！hello hkw！
```

Git 切换版本，底层其实是移动的 HEAD 指针，具体原理如下图所示：

![image-20211107214656265](http://img.hl1015.top/blog/image-20211107214656265.png)