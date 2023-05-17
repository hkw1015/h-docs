---
title: 插件和 scope 样式
date: 2022-12-01
category: Vue
tag:
  - Vue
---

## 插件

（1）功能：增强 Vue

（2）本质：包含 install 方法的一个对象，install 的第一个参数是 Vue，第二个以后的参数是插件使用者传递的数据

（3）定义插件

```js
对象.install = function (Vue, options) {
    // 添加全局过滤器
    Vue.filter(...)
               
    // 添加全局指令
    Vue.directive(...)
    
    // 添加全局混入
    Vue.mixin(...)
              
    // 添加实例方法/属性
    Vue.prototype.$myMethod = function () {...}
    Vue.prototype.$myProperty = xxx
}
```

（4）使用插件

```js
Vue.use(xxx)
```

（5）示例代码

plugin.js【定义】

```js
export default {
	install(Vue,x,y,z){
		console.log(x,y,z)
		//全局过滤器
		Vue.filter('mySlice',function(value){
			return value.slice(0,4)
		})

		//定义全局指令
		Vue.directive('fbind',{
			//指令与元素成功绑定时（一上来）
			bind(element,binding){
				element.value = binding.value
			},
			//指令所在元素被插入页面时
			inserted(element,binding){
				element.focus()
			},
			//指令所在的模板被重新解析时
			update(element,binding){
				element.value = binding.value
			}
		})

		//定义混入
		Vue.mixin({
			data() {
				return {
					x:100,
					y:200
				}
			},
		})

		//给Vue原型上添加一个方法（vm和vc就都能用了）
		Vue.prototype.hello = () => {alert('你好啊')}
	}
}
```

main.js【使用】

```js
//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'
//引入插件
import plugins from './plugins'
//关闭Vue的生产提示
Vue.config.productionTip = false

//应用（使用）插件
Vue.use(plugins,1,2,3)
//创建vm
new Vue({
	el:'#app',
	render: h => h(App)
})
```

## scope 样式

- 作用：让样式在局部生效，防止冲突
- 写法：`<style scoped></style>`