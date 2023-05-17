---
title: MVVM 模型
date: 2022-12-01
category: Vue
tag:
  - Vue
---

1. **M：模型（Model）==> 对应 data 中的数据**
2. **V：视图（View）==> 模板**
3. **VM：视图模型（ViewModel）==> Vue 实例对象**

![image-20211218090853409](http://img.hl1015.top/blog/image-20211218090853409.png)

打印 vm【Vue 实例对象】

```js
const vm = new Vue({
	el: '#root',
	data: {
		name: 'hello hkw'
	}
})
console.log('vm', vm)
```

![image-20221129131259219](http://img.hl1015.top/work/image-20221129131259219.png)

**观察发现：**

1. **data 中的所有属性，最后都出现在了 vm 身上**
2. **vm 身上所有的属性以及 Vue 原型上的所有属性，在 Vue 模板中都可以直接使用**