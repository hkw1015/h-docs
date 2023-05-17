---
title: 关于 plugin 加载不出来的问题解决
date: 2021-11-07
category: IDEA
tag:
  - IDEA
---

**进入 File > Settings**

**1、Appearance & Behavior > System Settings > Updates，将 Automatically check updates for 取消勾选**

![image-20210911140417066](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911140417066.png)

**2、选中 Http Proxy，勾选 Auto-detect proxy settings，勾选 Automatic proxy configuration，URL 填写：**

```http
http://127.0.0.1:1080
```

![image-20210911140525774](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911140525774.png)

**3、确认修改,重启 IDEA**