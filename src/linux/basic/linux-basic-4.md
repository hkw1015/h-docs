---
title: VI、VIM 编辑器
date: 2021-09-14
category: Linux
tag:
 - Linux 入门
---

## 1. VI、VIM 是什么

VI、VIM 是 Linux 系统命令行下的文本编辑器。

通过命令 **vi 文件名** 或者 **vim 文件名** 来使用。

## 2. 三种模式

### 2.1 一般模式（默认模式）

（1）通过 vi 或者是 vim 打开文档后默认进入到一般模式，该模式下主要负责查看和一些基础的修剪工作

（2）常用的操作

| 命令          | 描述                                        |
| ------------- | ------------------------------------------- |
| dd            | 删除光标当前行                              |
| dnd           | 删除 n 行                                   |
| u             | 撤销上一步                                  |
| x             | 删除一个字母，类似于键盘上的 Delete 功能    |
| X             | 删除一个字母，类似于键盘上的 Backspace 功能 |
| yy            | 复制光标当前行                              |
| p             | 粘贴                                        |
| dw            | 删除一个词                                  |
| yw            | 复制一个词                                  |
| Shift + g     | 移动到页尾                                  |
| N + gg        | 移动到第 N 行                               |
| Shift + 6     | 移动到行头                                  |
| Shift + 4     | 移动到行尾                                  |

### 2.2 编辑模式

（1）在一般模式下通过字母 i、a、o 进入到编辑模式，进入后左下角会有【插入】的字样，如果想要退出编辑，需要按下【ESC】按键

（2）常用的操作

| 命令 | 描述                   |
| ---- | ---------------------- |
| i    | 当前光标前录入         |
| a    | 当前光标后录入         |
| o    | 当前光标行的下一行录入 |
| I    | 行首录入               |
| A    | 行尾录入               |
| O    | 当前光标行的上一行录入 |

### 2.3 命令模式

（1）在一般模式下输入 / 或者 : 进入命令模式，命令模式一般用于存盘、退出 VIM、显示行号、搜索、批量替换等操作

（2）常用的操作

| 命令                  | 描述                             |
| --------------------- | -------------------------------- |
| :w                    | 保存                             |
| :q                    | 退出                             |
| :!                    | 强制执行                         |
| :%s/old 字符/new 字符 | 批量替换（全局替换+/g）          |
| /要查找的词           | 搜索，n 查找下一个，N 查找上一个 |
| ? 要查找的词          | n 查找上一个，shift+n 查找下一个 |
| :set nu               | 显示行号                         |
| :set nonu             | 关闭行号                         |
| noh                   | 取消高亮显示                     |

## 3. 三个模式之间的切换关系

![image-20210913144128639](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913144128639.png)

## 4. VI、VIM 键盘图

![image-20210913144238991](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913144238991.png)