---
title: 分支操作
date: 2021-11-07
category: Git
tag:
  - Git
---

![image-20211108090224759](http://img.hl1015.top/blog/image-20211108090224759.png)

## 1. 什么是分支

在版本控制过程中，同时推进多个任务，为每个任务，我们就可以创建每个任务的单独分支。使用分支意味着程序员可以把自己的工作从开发主线上分离开来，开发自己分支的时候不会影响主线分支的运行。对于初学者而言，分支可以简单理解为副本，一个分支就是一个单独的副本。（分支底层其实也是指针的引用）

![image-20211108150736098](http://img.hl1015.top/blog/image-20211108150736098.png)

## 2. 分支的好处

同时并行推进多个功能开发，提高开发效率。

各个分支在开发过程中，如果某一个分支开发失败，不会对其他分支有任何影响。失败的分支删除重新开始即可。

## 3. 分支的操作

|      命令名称       |             作用             |
| :-----------------: | :--------------------------: |
|  git branch 分支名  |           创建分支           |
|    git branch -v    |           查看分支           |
| git checkout 分支名 |           切换分支           |
|  git merge 分支名   | 把指定的分支合并到当前分支上 |

### 3.1 查看分支

**（1）基本语法**

```shell
git branch -v
```

**（2）案例实操**

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git branch -v
* master 1738a0e my first commit （* 代表当前所在的分支）
```

### 3.2 创建分支

**（1）基本语法**

```shell
git branch 分支名
```

**（2）案例实操**

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git branch hot-fix

Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git branch -v
  hot-fix 1738a0e my first commit （刚创建的新分支，并将主分支 master 的内容复制了一份）
* master  1738a0e my first commit
```

### 3.3 修改分支

```shell
--- 在 master 分支上做修改 ---
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ vim hello.txt

Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ cat hello.txt
hello git！hello hkw！master-test
hello git！hello hkw！

--- 添加暂存区 ---
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git add hello.txt

--- 提交本地库 ---
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git commit -m "my third commit" hello.txt
[master f333df8] my third commit
 1 file changed, 1 insertion(+), 1 deletion(-)

--- 查看分支 ---
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git branch -v
  hot-fix 1738a0e my first commit （hot-fix 分支并未做任何改变）
* master  f333df8 my third commit （当前 master 分支已更新为最新一次提交的版本）
```

### 3.4 切换分支

**（1）基本语法**

```shell
git checkout 分支名
```

**（2）案例实操**

```shell
--- 切换分支 ---
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git checkout hot-fix
Switched to branch 'hot-fix'

--- 发现当前分支已由 master 改为 hot-fix ---
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (hot-fix)
$ git branch -v
* hot-fix 1738a0e my first commit
  master  f333df8 my third commit

--- 查看 hot-fix 分支上的内容发现与 master 分支上的内容不同 ---
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (hot-fix)
$ cat hello.txt
hello git！hello hkw！
hello git！hello hkw！

--- 在 hot-fix 分支上做修改 ---
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (hot-fix)
$ vim hello.txt

Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (hot-fix)
$ cat hello.txt
hello git！hello hkw！ hot-fix-test
hello git！hello hkw！

--- 添加暂存区 ---
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (hot-fix)
$ git add hello.txt

--- 提交本地库 ---
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (hot-fix)
$ git commit -m "hot-fix commit" hello.txt
[hot-fix 2ead043] hot-fix commit
 1 file changed, 1 insertion(+), 1 deletion(-)
```

### 3.5 合并分支

**（1）基本语法**

```shell
git merge 分支名
```

**（2）案例实操 - 在 master 分支上合并 hot-fix 分支**

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$ git merge hot-fix
Auto-merging hello.txt
CONFLICT (content): Merge conflict in hello.txt
Automatic merge failed; fix conflicts and then commit the result.
```

### 3.6 产生冲突

冲突产生的表现：后面的状态为 <span style="color:red">MERGING</span>

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master|MERGING)
$ cat hello.txt
<<<<<<< HEAD
hello git！hello hkw！master-test
=======
hello git！hello hkw！ hot-fix-test
>>>>>>> hot-fix
hello git！hello hkw！
```

冲突产生的原因：

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;合并分支时，两个分支在同一文件的同一个位置有两套完全不同的修改。Git 无法替我们决定使用哪一个，必须人为决定新代码内容。

查看状态（检测到文件有两处修改）

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master|MERGING)
$ git status
On branch master
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   hello.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

### 3.7 解决冲突

（1）编辑有冲突的文件，删除特殊符号，决定要使用的内容

特殊符号：<span style="color:red"><<<<<<< HEAD</span> 当前分支的代码 <span style="color:red">=======</span> 合并过来的代码 <span style="color:red">>>>>>>> hot-fix</span>

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master|MERGING)
$ vim hello.txt

Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master|MERGING)
$ cat hello.txt
hello git！hello hkw！master-test
hello git！hello hkw！hot-fix-test
hello git！hello hkw！
```

（2）添加到暂存区

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master|MERGING)
$ git add hello.txt
```

（3）执行提交（注意：此时使用 git commit 命令时 <span style="color:red">**不能带文件名**</span>）

```shell
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master|MERGING)
$ git commit -m "merge hot-fix"
[master fd0c18d] merge hot-fix

--- 发现后面的状态 MERGING 消失，变为正常 ---
Administrator@WIN-84I7718196I MINGW64 ~/Desktop/git_test (master)
$
```

## 4. 创建分支和切换分支图解

![image-20211108171125543](http://img.hl1015.top/blog/image-20211108171125543.png)

master、hot-fix 其实都是指向具体版本记录的指针。当前所在的分支，其实是由 HEAD 决定的，所以创建分支的本质就是多创建一个指针。

HEAD 如果指向 master，那么我们现在就在 master 分支上。

HEAD 如果执行 hot-fix，那么我们现在就在 hot-fix 分支上。

所以，切换分支的本质就是移动 HEAD 指针。