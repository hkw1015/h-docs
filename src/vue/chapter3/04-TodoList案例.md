---
title: TodoList 案例(待完善)
date: 2022-12-01
category: Vue
tag:
  - Vue
---

## 组件化编码流程（通用）

1. 实现静态组件：抽取组件，使用组件实现静态页面效果
2. 展示动态数据
   - 数据的类型，名称是什么？
   - 数据保存在那个组件？
3. 交互 --- 从绑定事件监听开始

## 第一步：抽取静态组件

![image-20230320123738557](http://img.hl1015.top/work/image-20230320123738557.png)

将如上图的静态界面拆分成：**MyHeader、MyList、MyItem、MyFooter** 四个组件

### 创建组件

![image-20230320124802552](http://img.hl1015.top/work/image-20230320124802552.png)

### 引入组件

App.vue

```vue
<script>
  // 引入 MyHeader、MyList、MyFooter
  import MyHeader from './components/MyHeader';
  import MyList from './components/MyList';
  import MyFooter from './components/MyFooter';

  export default {
    name: 'App',
    components: {
      MyHeader,
      MyList,
      MyFooter
    }
  }
</script>
```

MyList.vue

```vue
<script>
  // 引入 MyItem
  import MyItem from './MyItem';

  export default {
    name: 'MyList',
    components: {
      MyItem
    },
    data() {
      return {
        todos: [
          { id: '001', title: '抽烟', done: true },
          { id: '002', title: '喝酒', done: false },
          { id: '003', title: '烫头', done: true }
        ]
      }
    }
  }
</script>
```

### 拆分结构(内容)

App.vue

```vue
<template>
  <div id="root">
    <div class="todo-container">
      <div class="todo-wrap">
        <MyHeader/>
        <MyList/>
        <MyFooter/>
      </div>
    </div>
  </div>
</template>
```

MyHeader.vue

```vue
<template>
  <div class="todo-header">
    <input type="text" placeholder="请输入你的任务名称，按回车键确认"/>
  </div>
</template>
```

MyList.vue

```vue
<template>
  <ul class="todo-main">
    <MyItem/>
    <MyItem/>
    <MyItem/>
    <MyItem/>
  </ul>
</template>
```

MyItem.vue

```vue
<template>
  <li>
    <label>
      <input type="checkbox"/>
      <span>xxxxx</span>
    </label>
    <button class="btn btn-danger" style="display:none">删除</button>
  </li>
</template>
```

MyFooter.vue

```vue
<template>
  <div class="todo-footer">
    <label>
      <input type="checkbox"/>
    </label>
    <span>
      <span>已完成0</span> / 全部2
    </span>
    <button class="btn btn-danger">清除已完成任务</button>
  </div>
</template>
```

### 拆分样式

App.vue

```vue
<style>
  /*base*/
  body {
    background: #fff;
  }
  .btn {
    display: inline-block;
    padding: 4px 12px;
    margin-bottom: 0;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
  .btn-danger {
    color: #fff;
    background-color: #da4f49;
    border: 1px solid #bd362f;
  }
  .btn-danger:hover {
    color: #fff;
    background-color: #bd362f;
  }
  .btn:focus {
    outline: none;
  }
  .todo-container {
    width: 600px;
    margin: 0 auto;
  }
  .todo-container .todo-wrap {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
</style>
```

MyHeader.vue

```vue
<style scoped>
  /*header*/
  .todo-header input {
    width: 560px;
    height: 28px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px 7px;
  }
  .todo-header input:focus {
    outline: none;
    border-color: rgba(82, 168, 236, 0.8);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(82, 168, 236, 0.6);
  }
</style>
```

MyList.vue

```vue
<style scoped>
  /*main*/
  .todo-main {
    margin-left: 0px;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 0px;
  }
  .todo-empty {
    height: 40px;
    line-height: 40px;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding-left: 5px;
    margin-top: 10px;
  }
</style>
```

MyItem.vue

```vue
<style scoped>
  /*item*/
  li {
    list-style: none;
    height: 36px;
    line-height: 36px;
    padding: 0 5px;
    border-bottom: 1px solid #ddd;
  }
  li label {
    float: left;
    cursor: pointer;
  }
  li label li input {
    vertical-align: middle;
    margin-right: 6px;
    position: relative;
    top: -1px;
  }
  li button {
    float: right;
    display: none;
    margin-top: 3px;
  }
  li:before {
    content: initial;
  }
  li:last-child {
    border-bottom: none;
  }
</style>
```

MyFooter.vue

```vue
<style scoped>
  /*footer*/
  .todo-footer {
    height: 40px;
    line-height: 40px;
    padding-left: 6px;
    margin-top: 5px;
  }
  .todo-footer label {
    display: inline-block;
    margin-right: 20px;
    cursor: pointer;
  }
  .todo-footer label input {
    position: relative;
    top: -1px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .todo-footer button {
    float: right;
    margin-top: 5px;
  }
</style>
```

### 最终静态页面效果

![image-20230320131141898](http://img.hl1015.top/work/image-20230320131141898.png)

## 第二步：展示动态数据

###  初始化列表

MyList.vue

```vue
<template>
  <ul class="todo-main">
    <MyItem v-for="todoObj in todos" :key="todoObj.id" :todo="todoObj"/>
  </ul>
</template>

<script>
  // 引入 MyItem
  import MyItem from './MyItem';

  export default {
    name: 'MyList',
    components: {
      MyItem
    },
    data() {
      return {
        todos: [
          { id: '001', title: '抽烟', done: true },
          { id: '002', title: '喝酒', done: false },
          { id: '003', title: '烫头', done: true }
        ]
      }
    }
  }
</script>

<style>省略</style>
```

MyItem.vue

```vue
<template>
  <li>
    <label>
      <input type="checkbox" :checked="todo.done"/>
      <span>{{todo.title}}</span>
    </label>
    <button class="btn btn-danger" style="display:none">删除</button>
  </li>
</template>

<script>
  export default {
    name: 'MyItem',
    props: ['todo'],
    data() {
      return {
        
      }
    }
  }
</script>

<style>省略</style>
```

页面效果：

![image-20230425120205484](http://img.hl1015.top/work/image-20230425120205484.png)





## 第三步：交互

### 添加

> 首先安装一个 nanoid 依赖（uuid 精简版），用于生成 todo 对象的 id 值
>
> ```shell
> npm install nanoid
> ```
>
> 引入 nanoid
>
> ```vue
> import { nanoid } from 'nanoid'
> ```

这里还没学习高级的组件间通信的方法，采用的最基础的方式，借助父 App 组件来实现，思路如下：

1. 将添加 todo 对象的方法定义在 App 组件，将这个添加方法通过 MyHeader 组件的 props 进行父子传值
2. 将 todos 列表数据存放在 App 组件，将这个 todos 数据通过 MyList 组件的 props 进行父子传值

App.vue

```vue
<template>
  <div id="root">
    <div class="todo-container">
      <div class="todo-wrap">
        <MyHeader :addTodo="addTodo" />
        <MyList :todos="todos" />
        <MyFooter/>
      </div>
    </div>
  </div>
</template>

<script>
  // 引入 MyHeader、MyList、MyFooter
  import MyHeader from './components/MyHeader';
  import MyList from './components/MyList';
  import MyFooter from './components/MyFooter';

  export default {
    name: 'App',
    components: {
      MyHeader,
      MyList,
      MyFooter
    },
    data() {
      return {
        todos: [
          { id: '001', title: '抽烟', done: true },
          { id: '002', title: '喝酒', done: false },
          { id: '003', title: '烫头', done: true }
        ]
      }
    },
    methods: {
      addTodo(todoObj) {
        this.todos.unshift(todoObj)
      }
    }
  }
</script>

<style>省略</style>
```

MyHeader.vue

```vue
<template>
  <div class="todo-header">
    <input type="text" placeholder="请输入你的任务名称，按回车键确认" v-model="title" @keyup.enter="add"/>
  </div>
</template>

<script>
  import { nanoid } from 'nanoid';

  export default {
    name: 'MyHeader',
    props: ['addTodo'],
    data() {
      return {
        title: ''
      }
    },
    methods: {
      add() {
        // 校验数据
        if (!this.title.trim()) alert('输入不能为空')
        else {
          // 封装todo对象
          const todoObj = { id: nanoid(), title: this.title, done: false }
          // 添加数据
          this.addTodo(todoObj)
          // 清空输入
          this.title = ''
        }
      }
    }
  }
</script>

<style scoped>省略</style>
```

MyList.vue

```vue
<template>
  <ul class="todo-main">
    <MyItem v-for="todoObj in todos" :key="todoObj.id" :todo="todoObj"/>
  </ul>
</template>

<script>
  // 引入 MyItem
  import MyItem from './MyItem';

  export default {
    name: 'MyList',
    components: {
      MyItem
    },
    props: ['todos']
  }
</script>

<style scoped>省略</style>
```

### 勾选

