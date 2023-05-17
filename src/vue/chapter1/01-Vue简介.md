---
title: Vue 简介
date: 2022-12-01
category: Vue
tag:
  - Vue
---

## Vue 是什么？

![image-20221108101241215](http://img.hl1015.top/work/image-20221108101241215.png)

Vue 是一套用于**构建用户界面**的**渐进式** JavaScript 框架

> 所谓构建用户界面就是将数据以界面的方式展示
>
> 所谓渐进式是指 Vue 可以自底向上逐层的应用
>
> - 简单应用：只需一个轻量小巧的核心库
> - 复杂应用：可以引入各式各样的 Vue 插件

## Vue 是谁开发的？

![尤雨溪](https://so1.360tres.com/dr/270_500_/t0155dc35ea4eba6c26.jpg?size=460x460)

- 2013 年，受到 Angular 框架的启发，**尤雨溪**开发出了一款轻量框架 - Seed，同年 12 月，Seed 更名为 Vue，版本号 0.6.0
- 2014 年，Vue 正式对外发布，版本号 0.8.0，Taylor otwell 在 Twitter 上发表动态，说自己正在学习 Vue.js
- 2015 年 10 月 27 日，正式发布 Vue 1.0.0 Evangelion（新世纪福音战士）
- 2016 年 10 月 1 日，正式发布 Vue 2.0.0 Ghost in the Shell（攻壳机动队）
- 2020 年 9 月 18 日，正式发布 Vue 3.0.0 One Piece（海贼王）

**一句话总结 Vue：后起之秀，生态完善，已然成为国内前端工程师必备技能**

## Vue 的特点

- 采用**组件化**的模式，提高代码复用率，且让代码更好维护
- **声明式**编码，让编程人员无需直接操作 DOM，提高开发效率

命令式编码：

```js
// 准备html字符串
let htmlStr = ''
// 遍历数据拼接html字符串
persons.forEach(p => {
    htmlStr += `<li>${p.id} - ${p.name} - ${p.age}</li>`
});
// 获取list元素
let list = document.getElementById('list')
// 修改内容（亲自操作 DOM）
list.innerHTML = htmlStr
```

声明式编码：

```vue
<ul id="list">
    <li v-for="p in persons">
        {{p.id}} - {{p.name}} - {{p.age}}
    </li>
</ul>
```

- 使用**虚拟 DOM** + 优秀的 **Diff 算法**，尽量复用 DOM 节点

## 学习 Vue 之前要掌握的基础 JS 知识

- ES6 语法规范
- ES6 模块化
- 包管理器
- 原型、原型链
- 数组常用方法
- axios
- promise
- ...

## Vue 官方使用指南

- Vue 2 中文官网：[Vue.js (vuejs.org)](https://v2.cn.vuejs.org/)

![image-20221114124720578](http://img.hl1015.top/work/image-20221114124720578.png)

- Vue 3 中文官网：[Vue.js - 渐进式 JavaScript 框架 | Vue.js (vuejs.org)](https://cn.vuejs.org/)

![image-20221108105536109](http://img.hl1015.top/work/image-20221108105536109.png)

