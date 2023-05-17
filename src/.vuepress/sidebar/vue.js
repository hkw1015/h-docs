import { arraySidebar } from "vuepress-theme-hope";

export const vue = arraySidebar([
  {
    text: "第一章：Vue 核心",
    icon: "vue",
    collapsible: true,
    prefix: "chapter1/",
    children: [
      "01-Vue简介",
      "02-搭建Vue开发环境",
      "03-模板语法",
      "04-数据绑定",
      "05-MVVM模型",
      "06-数据代理",
      "07-事件处理",
      "08-计算属性与侦听器",
      "09-class与style绑定",
      "10-条件渲染",
      "11-列表渲染",
      "12-数据监测总结",
      "13-收集表单数据",
      "14-过滤器",
      "15-内置指令",
      "16-自定义指令",
      "17-Vue实例生命周期",
    ]
  },
  {
    text: "第二章：Vue 组件编程",
    icon: "vue",
    collapsible: true,
    prefix: "chapter2/",
    children: [
      "01-模块(化)与组件(化)",
      "02-非单文件组件",
      "03-单文件组件",
    ]
  },
  {
    text: "第三章：使用 Vue 脚手架",
    icon: "vue",
    collapsible: true,
    prefix: "chapter3/",
    children: [
      "01-初始化脚手架",
      "02-ref、props、mixin",
      "03-插件和scope样式",
      "04-TodoList案例",
    ]
  },
  {
    text: "第四章：Vue中的 Ajax",
    icon: "vue",
    collapsible: true,
    prefix: "chapter4/",
    children: [
    ]
  },
  {
    text: "第五章：Vuex",
    icon: "vue",
    collapsible: true,
    prefix: "chapter5/",
    children: [
    ]
  },
  {
    text: "第六章：Vue-Router",
    icon: "vue",
    collapsible: true,
    prefix: "chapter6/",
    children: [
    ]
  },
  {
    text: "第七章：Vue UI 组件库",
    icon: "vue",
    collapsible: true,
    prefix: "chapter7/",
    children: [
    ]
  }
]);