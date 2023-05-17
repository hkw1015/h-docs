---
title: 搭建 Vue 开发环境
date: 2022-12-01
category: Vue
tag:
  - Vue
---

## 直接用 \<script\> 引入 vuejs

> 这里以 Vue 2 官方教程为例
>
> 这里建议在 VS Code 中预先安装 `Live Server` 插件用于内置服务器进行本地代码运行
>
> <img src="http://img.hl1015.top/work/image-20221117142922663.png" alt="image-20221117142922663" style="zoom:50%;" />

- 新建一个工程目录，使用 VS Code 打开
- 在工程下创建两个目录，一个目录存放 html，一个目录存放 js（从官方地址下载）

![image-20221114131937987](http://img.hl1015.top/work/image-20221114131937987.png)

![image-20221114131731342](http://img.hl1015.top/work/image-20221114131731342.png)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>初始Vue</title>
    <!-- 引入Vue -->
    <script type="text/javascript" src="../js/vue.js"></script>
</head>
<body>
    
</body>
</html>
```

- 此时右键 `Open with Live Server`，运行到 Google 浏览器上打开控制台能看到报如下两个提示信息

![image-20221118091632604](http://img.hl1015.top/work/image-20221118091632604.png)

![image-20221114132800264](http://img.hl1015.top/work/image-20221114132800264.png)

**为了解决提示问题，第一步，我们前往官网下载开发者工具**

![image-20221114133317730](http://img.hl1015.top/work/image-20221114133317730.png)

![image-20221114133432176](http://img.hl1015.top/work/image-20221114133432176.png)

![image-20221114133459521](http://img.hl1015.top/work/image-20221114133459521.png)

> 以安装在 Google 浏览器上为例

![image-20221114133621169](http://img.hl1015.top/work/image-20221114133621169.png)

![image-20221114134606471](http://img.hl1015.top/work/image-20221114134606471.png)

![image-20221114135130681](http://img.hl1015.top/work/image-20221114135130681.png)

至此，我们已经在我们的浏览器上安装好了 Vue 开发者工具

**第二步，关闭生产环境提示信息**

这里需要先了解一下 `Vue.config` 这个概念

![image-20221114135553424](http://img.hl1015.top/work/image-20221114135553424.png)

然后我们关注 `productionTip` 这个属性

![image-20221114135645379](http://img.hl1015.top/work/image-20221114135645379.png)

我们在浏览器控制台输入 `Vue.config` 查看全局配置，可以看到 `productionTip = true` 开启了生产提示

![image-20221114135805141](http://img.hl1015.top/work/image-20221114135805141.png)

我们可以将这个生产提示进行关闭，打开 `vue.js` 文件，搜索 `productionTip`，将值改为 false

![image-20221114141104013](http://img.hl1015.top/work/image-20221114141104013.png)

这时再刷新页面，控制台就没有多余的提示信息了

> **favicon.ico 找不到问题解决**
>
> ![image-20221117143054985](http://img.hl1015.top/work/image-20221117143054985.png)
>
> 原因：我们在使用 `Live Server` 内置服务器运行代码时，默认启动了 5500 端口，项目根目录的所有文件都可以通过 `http://ip:5500/文件名` 来进行访问，于是浏览器查找网页图标通过 `http://127.0.0.1:5500/favicon.ico` 路径进行查找，由于项目中不存在，所以报了 404
>
> 解决：找一个 `favicon.ico` 文件放到项目根目录下即可
>
> ![image-20221117144621642](http://img.hl1015.top/work/image-20221117144621642.png)
>
> 然后浏览器通过 shift + f5 刷新即可看到图标了
>
> ![image-20221117144723936](http://img.hl1015.top/work/image-20221117144723936.png)

## Hello 小案例

**demo 代码：**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>初始Vue</title>
    <!-- 引入Vue -->
    <script type="text/javascript" src="../js/vue.js"></script>
</head>
<body>
    <!-- 准备好一个容器 -->
    <div id="root">
        <!-- {{}} 为插值表达式 -->
        <h1>Hello,{{name}}</h1>
    </div>

    <script type="text/javascript">
        // 创建 Vue 实例
        const x = new Vue({
            el: '#root', // el 用于指定当前 Vue 实例为哪个容器服务，值通常为css选择器字符串【不常用但支持的写法：el: document.getElementById('root')】
            data: { // data 中用于存储数据，数据供 el 所指定的容器去使用，值我们暂时先写成一个对象
                name: 'hkw'
            }
        })
    </script>
</body>
</html>
```

**运行效果：**

![image-20221117155411150](http://img.hl1015.top/work/image-20221117155411150.png)

使用 Vue 的开发者工具对 Vue 实例的 data 属性值进行修改，可以发现页面上的数据也会随之修改

![image-20221117162743561](http://img.hl1015.top/work/image-20221117162743561.png)

**总结：**

1. 想让 Vue 工作，就必须创建一个 Vue 实例，且要传入一个配置对象

2. root 容器里的代码依然符合 html 规范，只不过混入了一些特殊的 Vue 语法（比如：插值表达式）

3. root 容器里的代码被称为【Vue 模板】

4. Vue 实例和容器都是一一对应的

5. 真实开发中只有一个 Vue 实例，并且会配合着组件一起使用

6. {{xxx}} 中的 xxx 要写 js 表达式，且 xxx 可以自动读取到 data 中的所有属性

   > js 表达式：一个表达式能产生一个值，可以放在任何一个需要值的地方
   >
   > - a
   > - a + b
   > - function1()
   > - x === y ? 'a' : 'b'

7. 一旦 data 中的数据发生改变，那么页面中用到该数据的地方也会自动更新

## el 和 data 的两种写法

**el 的两种写法**

- （1）`new Vue` 时配置 el 属性

```js
new Vue({
	el: '#root'
})
```

- （2）先创建 Vue 实例【假设起名变量为 vm】，随后再通过 `vm.$mount('#容器id')` 指定 el 的值

```js
const vm = new Vue({})
vm.$mount('#root')
```

**data 的两种写法**

> 如何选择：目前哪种写法都可以，但后面学习到组件时，data 必须使用函数式，否则会报错

- （1）对象式

```js
new Vue({
	el: '#root',
	data: {
		name: 'hkw'
	}
})
```

- （2）函数式

```js
new Vue({
	el: '#root',
	data: function() {
		return {
			name: 'hkw'
		}
	}
})

或者简写为如下格式

new Vue({
	el: '#root',
	data() {
		return {
			name: 'hkw'
		}
	}
})
```

**一个重要的原则**：由 Vue 管理的函数，一定不要写箭头函数，一旦写了箭头函数，this 就不再是 Vue 实例了