---
title: 下载与中文配置
date: 2021-11-07
category: 【VSCode】
tag:
 - 【VSCode】
---

**1、下载**

[https://code.visualstudio.com/](https://code.visualstudio.com/)

![image-20230511162805676](http://img.hl1015.top/work/image-20230511162805676.png)

**2、安装（傻瓜式安装）**

**3、中文界面配置**

- 首先安装中文插件：Chinese (Simplified) Language Pack for Visual Studio Code


![image-20210911145350450](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911145350450.png)

![image-20210911145358101](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911145358101.png)

- 右下角弹出是否重启 vs，点击 "Restart Now"


![image-20210911145435918](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911145435918.png)

- 可以看到重启之后，界面语言变成了中文


![image-20210911145451442](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911145451442.png)

- 有些机器重启后如果界面没有变化，则 点击 左边栏 Manage -> Command Paletet...【Ctrl+Shift+p】


![image-20210911145607944](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911145607944.png)

- 在搜索框中输入 "configure display language"，回车


![image-20210911145559476](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/tools/image-20210911145559476.png)

- 打开 locale.json 文件，修改文件下的属性 "locale":"zh-cn" 


```json
{
	// 定义 VS Code 的显示语言。
	// 请参阅 https://go.microsoft.com/fwlink/?LinkId=761051，了解支持的语言列表。
	
	"locale":"zh-cn" // 更改将在重新启动 VS Code 之后生效。
}
```

- 重启 vs