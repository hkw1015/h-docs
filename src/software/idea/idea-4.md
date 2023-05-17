---
title: 上传项目到 GitHub
date: 2021-11-07
category: IDEA
tag:
  - IDEA
---

**第一步，安装 Git**

cmd 命令行输入 `git --version` 检查版本，看是否成功安装好

```
git --version
```

![image-20210911134103972](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134103972.png)

**第二步，打开 IDEA，选择 FIle > Settings > Version Control > Git ，选择 Git 的路径，点击 Test，看是否成功**

![image-20210911134128384](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134128384.png)

**第三步，选择 FIle > Settings > Version Control > GitHub，没有设置账户的话点击 Add account**

![image-20210911134148187](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134148187.png)

填好相应信息后，点击 Log in

![image-20210911134207080](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134207080.png)

或者使用右上角的 User Token

成功之后如下图：

![image-20210911134223139](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134223139.png)

**第四步，选择 VCS > Imort into Version Control > Create Git Repository ...**

![image-20210911134252504](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134252504.png)

配置选择点击之后，会发现自己的项目文件名称变红了

![image-20210911134319650](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134319650.png)

**第五步，右键项目，选择 Git > + Add，把项目提交到本地仓库**

![image-20210911134342280](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134342280.png)

会发现自己的项目文件名称都变绿了

![image-20210911134356361](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134356361.png)

**第六步，右键项目，选择 Git > Commit Directory ...，提交到本地 Git**

![image-20210911134416172](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134416172.png)

填写好 Commit Message 后点击 Commit

![image-20210911134438034](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134438034.png)

commit 成功后左下角会有提示

![image-20210911134507557](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134507557.png)

现在，本地 Git 已 Commit 完了，项目文件从暂存区真正进入版本库中，会发现自己的项目文件名称会变白

![image-20210911134525183](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134525183.png)

**第七步，选择 VCS > Imort into Version Control > Share Project on GitHub，上传项目到 GitHub**

![image-20210911134551194](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134551194.png)

填写好相应信息，点击 Share 即可

![image-20210911134605596](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134605596.png)

**第八步，打开 GitHub，查看项目是否上传成功**

![image-20210911134625734](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134625734.png)

等待 IDEA 中 push 成功提示之后，我们登陆 GIthub 帐号，进入仓库进行查看

可以看到已经为我们成功创建 Spring5Study 项目仓库

![image-20210911134648757](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134648757.png)

![image-20210911134658853](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911134658853.png)

可以看到项目已成功上传