---
title: ref、props、mixin
date: 2022-12-01
category: Vue
tag:
  - Vue
---

## ref 属性

（1）功能：被用来给元素或子组件注册引用信息（id 的替代者）

（2）应用场景

- 应用在 html 标签上获取的是真实 DOM 元素
- 应用在组件标签上获取的是组件实例对象（vc）

（3）使用方式

- 打标识：`<h1 ref="xxx">...</h1>` 或 `<School ref="xxx"></School>`
- 获取：`this.$refs.xxx`

## props 配置项

（1）功能：让组件接收外部传过来的数据

（2）使用方式

- 传递数据

```vue
<Demo name="xxx"/>
或者
<Demo :name="xxx"/>
```

- 接收数据

  - 第一种方式（只接收）

    ```js
    props: ['name']
    ```

  - 第二种方式（限制类型）

    ```js
    props: {
        name: Number
    }
    ```

  - 第三种方式（限制类型、限制必要性、指定默认值）

    ```js
    props: {
        name: {
            type: String, // 类型
            required: true, // 必要性
            default: '老王' // 默认值
        }
    }
    ```

（3）说明

props 是只读的，Vue 底层会监测你对 props 的修改，如果进行了修改，就会发出警告，若业务需求确实需要修改，那么请复制 props 的内容到 data 中一份，然后去修改 data 中的数据

## mixin 混入

（1）功能：可以把多个组件公用的配置提取成一个混入对象

（2）使用方式

- 第一步，定义混入（mixin.js），例如：

```js
export const mixin = {
    data() {
        methods: { ... }
    }
}
```

- 第二步，使用混入
  - 全局混入：`Vue.mixin(xxx)`
  - 局部混入：`mixins: [xxx]`

（3）说明

- 如果组件的 data 和 methods 配置项和混入冲突了，以组件的为准
- 如果组件的生命周期函数和混入冲突了，则两者都会保留