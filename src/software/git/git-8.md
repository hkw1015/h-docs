---
title: IDEA 集成 GitHub
date: 2021-11-07
category: Git
tag:
  - Git
---

## 1. 设置 GitHub 账号

<img src="http://img.hl1015.top/blog/image-20211114221018457.png" alt="image-20211114221018457" style="zoom:50%;" />

<img src="http://img.hl1015.top/blog/image-20211114221041858.png" alt="image-20211114221041858" style="zoom:67%;" />

<span style="color:red">如果出现 401 等情况连接不上的，是因为网络原因，可以使用 token 登录（token 从 GitHub 账户获取，此处不再赘述）</span>

## 2. 分享工程到 GitHub

<img src="http://img.hl1015.top/blog/image-20211114221527853.png" alt="image-20211114221527853" style="zoom: 67%;" />

<img src="http://img.hl1015.top/blog/image-20211114221736222.png" alt="image-20211114221736222" style="zoom:67%;" />

![image-20211114221817837](http://img.hl1015.top/blog/image-20211114221817837.png)

来到 GitHub 中发现已经帮我们创建好了 idea_git_test_project 的远程仓库

![image-20211114221958824](http://img.hl1015.top/blog/image-20211114221958824.png)

## 3. push 推送本地库到远程库

右键点击项目，可以将当前分支的内容 push 到 GitHub 的远程仓库中

![image-20211114223123473](http://img.hl1015.top/blog/image-20211114223123473.png)

<img src="http://img.hl1015.top/blog/image-20211114223234943.png" alt="image-20211114223234943" style="zoom:67%;" />

<img src="http://img.hl1015.top/blog/image-20211114223358943.png" alt="image-20211114223358943" style="zoom:67%;" />

<img src="http://img.hl1015.top/blog/image-20211114223551678.png" alt="image-20211114223551678" style="zoom:67%;" />

<img src="http://img.hl1015.top/blog/image-20211114224153519.png" alt="image-20211114224153519" style="zoom:67%;" />

注意：push 是将本地库代码推送到远程库，如果本地库代码跟远程库代码版本不一致，push 的操作是会被拒绝的，也就是说，要想 push 成功，一定要保证本地库的版本要比远程库的版本高！<span style="color:red">因此一个成熟的程序员在动手改本地代码之前，一定会先检查下远程库跟本地代码的区别！如果本地的代码版本已经落地，切记要先 pull 拉取一下远程库的代码，将本地代码更新到最新以后，然后再修改，提交，推送！</span>

## 4. pull 拉取远程库到本地库

右键点击项目，可以将远程仓库的内容 pull 到本地仓库

![image-20211114224823138](http://img.hl1015.top/blog/image-20211114224823138.png)

<img src="http://img.hl1015.top/blog/image-20211114224858187.png" alt="image-20211114224858187" style="zoom:67%;" />

注意：pull 是拉取远端仓库代码到本地，如果远程库代码和本地库代码不一致，会自动合并，如果自动合并失败，还会涉及到手动解决冲突的问题

## 5. clone 克隆远程库到本地

<img src="http://img.hl1015.top/blog/image-20211114225753903.png" alt="image-20211114225753903" style="zoom:67%;" />

<img src="http://img.hl1015.top/blog/image-20211114230401137.png" alt="image-20211114230401137" style="zoom:67%;" />

