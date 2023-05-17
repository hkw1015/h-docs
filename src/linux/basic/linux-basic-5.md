---
title: 常用命令
date: 2021-09-14
category: Linux
tag:
 - Linux 入门
---

## 1. 基本命令

| 命令    | 描述                                                         |
| ------- | :----------------------------------------------------------- |
| man     | 帮助手册                                                     |
| --help  | 帮助手册                                                     |
| date    | 日期                                                         |
| cal     | 日历                                                         |
| pwd     | 显示当前所在的目录                                           |
| cd      | 切换目录                                                     |
| ls      | 显示当前目录下的内容                                         |
| grep    | 通过 \| 管道符，配置 grep 进行过滤筛选                       |
| mkdir   | 创建目录<br />-p：同时创建多级目录                           |
| touch   | 创建文件                                                     |
| rmdir   | 删除一个空目录                                               |
| rm      | 删除文件或者目录<br />-rvf：递归删除所有目录内容，有提示<br />-rf：递归删除所有目录内容,无提示【慎用】 |
| cp      | 复制<br />-r：递归复制整个目录<br />-v：显示复制过程中文件的列表<br />\cp：强制覆盖不提示 |
| cat     | 查看文件<br />cat 文件名  查看轻量级的文本文件<br />cat 文件1 文件2 连接显示多个文件<br />cat 文件1 > 文件2 合并为新文件<br />cat 文件1 >> 文件2 追加 |
| more    | 查看比较长的文件<br />空格键：向下翻一页<br />回车键：向下翻一行<br />q：代表立刻离开more<br />ctrl+F 向下滚动一屏<br />ctrl+B 向上滚动一屏 |
| less    | 同 more 类似，比 more 功能更多<br />pageDown：向下滚动一页<br />pageUp：向上滚动一页<br />/字符串： 向下搜索指定字符串<br />?字符串：向上搜索指定字符串<br />n：重复前一个搜索<br />N：反向重复前一个搜索 |
| tail    | 从尾部开始查看文件，比较适合看日志<br />-f：跟随查看<br />-n<行数> 输出文件尾部 n 行内容 |
| history | 查看命令                                                     |
| echo    | 回显，输出一般在 shell 脚本中使用较多                        |
| find    | 查找文件，提供了丰富的模糊搜索及条件搜索 Find+搜索路径+参数+搜索关键字 按文件名：find  /目录/…  -name  "*.txt" |
| locate  | 查找文件，基于索引，查询速度更快<br />通过 updatedb 来更新索引 |
| ln      | 软链接<br />ln -s 原文件或者目录 软链接名                    |
| tar     | 压缩文件 、解压缩文件<br />tar -zcvf  xxx.tar.gz  xxxx 压缩文件<br />tar -zxvf xxx.tar.gz  解压缩文件<br />-c：创建一个新归档<br />-x：从归档中解出文件<br />-v：显示详细信息<br />-f：指定压缩后的文件名<br />-z：通过 gzip 过滤归档 |
| zip     | 压缩文件<br />zip xxx.zip  xxxx<br />zip -r  xxx.zip  目录/* |
| unzip   | 解压缩文件 upzip xxx.zip                                     |

## 2. 分类详细说明

### 2.1 帮助命令

**（1）man --- 获得帮助信息**

- 语法

  - ```shell
    man [命令或配置文件]
    ```

- 显示说明

  - | 名称        | 描述                     |
    | ----------- | ------------------------ |
    | NAME        | 命令的名称和单行描述     |
    | SYNOPSIS    | 怎样使用命令             |
    | DESCRIPTION | 命令-功能的深入讨论      |
    | EXAMAPLES   | 怎样使用命令的例子       |
    | SEE ALSO    | 相关主题（通常是手册页） |

- 示例

  - 查看 ls 命令的帮助信息

  - ```shell
    man ls
    ```

    - ![image-20210913150804701](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913150804701.png)

**（2）help --- 获得 shell 内置命令的帮助信息**

- 语法

  - ```shell
    help 命令
    ```

- 示例

  - 查看 cd 命令的帮助信息

  - ```shell
    help cd
    ```

    - ![image-20210913151049546](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913151049546.png)

**（3）常用快捷键**

| 命令            | 描述                       |
| --------------- | -------------------------- |
| ctrl + c        | 停止进程                   |
| ctrl + l        | 清屏；彻底清屏：reset      |
| ctrl + q        | 退出                       |
| 【善于用】tab键 | 提示（更重要的是防止敲错） |
| 上下键          | 查找执行过的命令           |
| ctrl + alt      | linux 和 windows 之间切换  |

### 2.2 时间日期类

- 语法

  - ```shell
    date [选项] []
    ```

- 示例

  - ![image-20210913151439905](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913151439905.png)

### 2.3 文件目录类

**（1）pwd --- 显示当前工作目录的绝对路径**

> pwd：print working directory 打印工作目录

![image-20210913152327486](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913152327486.png)



**（2）ls --- 列出目录的内容**

> ls：list 列表

- 语法

  - ```shell
    ls [选项] [目录或是文件]
    ```

- 选项说明

  - | 选项 | 描述                                                        |
    | ---- | ----------------------------------------------------------- |
    | -a   | 全部的文件，连同隐藏的（开头为 . 的文件）一起列出来【常用】 |
    | -l   | 长数据串列出，包含文件的属性和权限等等数据【常用】          |

- 显示说明

  - 每行列出的信息依次是
    - **文件类型与权限**  **链接数**  **文件属主**  **文件属组**  **文件大小(单位byte)**  **建立或最近修改的时间**  **名称**

- 示例

  - 查看当前目录的所有内容信息

  - ```shell
    ls -al
    ```

    - ![image-20210913171356437](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913171356437.png)

**（3）cd --- 切换目录**

> cd：change directory 切换目录

- 语法

  - ```shell
    cd [参数]
    ```

- 参数说明

  - | 参数         | 描述                                 |
    | ------------ | ------------------------------------ |
    | cd 绝对路径  | 切换路径                             |
    | cd 相对路径  | 切换路径                             |
    | cd ~ 或者 cd | 回到自己的家目录                     |
    | cd -         | 回到上一次所在目录                   |
    | cd ..        | 回到当前目录的上一级目录             |
    | cd -P        | 跳转到实际物理路径，而非快捷方式路径 |

- 示例

  - 使用绝对路劲切换到 root 目录
    - ![image-20210913171745666](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913171745666.png)
  - 使用相对路径切换到 opt 目录
    - ![image-20210913171800946](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913171800946.png)
  - 回到自己的家目录，即 root 这个目录
    - ![image-20210913171817712](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913171817712.png)
  - 回到上一次所在目录
    - ![image-20210913171831545](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913171831545.png)
  - 回到当前目录的上一级目录
    - ![image-20210913171851064](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913171851064.png)

**（4）mkdir --- 创建一个新的目录**

> mkdir：make a directory 建立一个目录

- 语法

  - ```shell
    mkdir [选项] 要创建的目录
    ```

- 选项说明：-p 创建多层目录

- 示例

  - 创建一个目录
    - ![image-20210913172046030](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913172046030.png)
  - 创建一个多级目录
    - ![image-20210913172056793](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913172056793.png)

**（5）rmdir --- 删除一个空的目录**

> rmdir：remove directory 移除目录

- 语法

  - ```shell
    rmdir 要删除的目录
    ```

- 示例

  - ![image-20210913172300367](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913172300367.png)

**（6）touch --- 创建空文件**

- 语法

  - ```shell
    touch 文件名称
    ```

- 示例

  - ![image-20210913172407143](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913172407143.png)

**（7）cp --- 复制文件或目录**

- 语法

  - ```shell
    // 复制 source 文件到 dest
    cp [选项] source dest
    ```

- 选项说明：-r 递归复制整个文件夹

- 参数说明

  - | 参数   | 描述     |
    | ------ | -------- |
    | source | 源文件   |
    | dest   | 目标文件 |

- 经验技巧

  - 强制覆盖不提示的方法：\cp

- 示例

  - 复制文件
    - ![image-20210913172747987](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913172747987.png)
  - 递归复制整个文件夹
    - ![image-20210913172852996](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913172852996.png)

**（8）rm --- 移除文件或目录**

- 语法

  - ```shell
    rm [选项] deleteFile
    ```

- 选项说明

  - | 选项 | 描述                       |
    | ---- | -------------------------- |
    | -r   | 递归删除目录中所有内容     |
    | -f   | 强制执行删除操作，不给提示 |
    | -v   | 显示指令的详细执行过程     |

- 示例

  - ![image-20210913174011539](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913174011539.png)

**（9）mv --- 移动文件与目录或重命名**

- 语法

  - 移动文件

    - ```shell
      mv /temp/movefile /targetFolder
      ```

  - 重命名

    - ```shell
      mv oldNameFile newNameFile
      ```

- 示例

  - 移动文件
    - ![image-20210913174451660](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913174451660.png)
  - 重命名
    - ![image-20210913174459739](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913174459739.png)

**（10）cat --- 查看文件内容**

查看文件内容，从第一行开始显示

- 语法

  - ```shell
    cat [选项] 要查看的文件
    ```

- 选项说明：-n 显示所有的行号，包括空行

- 经验技巧

  - 一般查看比较小的文件，一屏幕能显示全的

- 示例

  - 查看文件内容并显示行号
    - ![image-20210913174918803](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210913174918803.png)

**（11）more --- 文件内容分屏查看器**

more 指令是一个基于 VI 编辑器的文本过滤器，它以全屏幕的方式按页显示文本文件的内容。more 指令中内置了若干快捷键，详见操作说明。

- 语法

  - ```shell
    more 要查看的文件
    ```

- 操作说明

  - | 操作          | 描述                                  |
    | ------------- | ------------------------------------- |
    | 空格键(space) | 代表向下翻一页                        |
    | Enter         | 代表向下翻一行                        |
    | q             | 代表立即离开more， 不再显示该文件内容 |
    | Ctrl + F      | 向下滚动一屏                          |
    | Ctrl + B      | 返回上一屏                            |
    | =             | 输出当前的行号                        |
    | :f            | 输出文件名和当前的行号                |

**（12）less --- 分屏显示文件内容**

less 指令用来分屏查看文件内容，它的功能与 more 指令类似,但是比 more 指令更加强大，支持各种显示终端。less 指令在显示文件内容时，并不是一次将整个文件加载之后才显示，而是根据显示需要加载内容，对于显示大型文件具有较高的效率。

- 语法

  - ```shell
    less 要查看的文件
    ```

- 操作说明

  - | 操作          | 描述                                               |
    | ------------- | -------------------------------------------------- |
    | 空格键(space) | 向下翻动一页                                       |
    | 【pagedown】  | 向下翻动一页                                       |
    | 【pageup】    | 向上翻动一页                                       |
    | /字符串       | 向下搜寻【字符串】的功能；n:向下查找，N:向上查找； |
    | ?字符串       | 向上搜寻【字符串】的功能；n:向上查找，N:向下查找； |
    | q             | 离开less这个程序                                   |

**（13）echo --- 输出内容到控制台**

- 语法

  - ```shell
    echo [选项] [输出内容]
    ```

- 选项说明：-e 支持反斜线控制的字符转换

  - | 控制字符 | 描述                |
    | -------- | ------------------- |
    | \\       | 输出\本身           |
    | \n       | 换行符              |
    | \t       | 制表符，也就是Tab键 |

- 示例

  - ![image-20210914090319680](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914090319680.png)

**（14）head --- 显示文件头部内容**

head 用于显示文件的开头部分内容，默认情况下 head 指令显示文件的前 10 行内容。

- 语法

  - 查看文件头 10 行内容

    - ```shell
      head 文件
      ```

  - 查看文件头 5 行内容，5 可以是任意行数

    - ```shell
      head -n5 文件
      ```

- 选项说明：-n<行数> 指定显示头部内容的行数

- 示例

  - ![image-20210914090757206](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914090757206.png)

**（15）tail --- 输出文件尾部内容**

tail 用于输出文件中尾部的内容，默认情况下 tail 指令显示文件的最后 10 行内容。

- 语法

  - 查看文件的最后 10 行内容

    - ```shell
      tail 文件
      ```

  - 查看文件最后 5 行内容，5 可以是任意行数

    - ```shell
      tail -n5 文件
      ```

  - 实时追踪该文件的所有更新

    - ```shell
      tail -f 文件
      ```

- 示例

  - ![image-20210914091032238](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914091032238.png)

**（16）> 输出重定向和 >> 追加**

- 语法

  - 列表的内容写入到文件中（覆盖写）

    - ```shell
      ls -l > 文件
      ```

  - 列表的内容追加到文件的末尾

    - ```shell
      ls -al >> 文件
      ```

  - 将 文件1 的内容覆盖到 文件2

    - ```shell
      cat 文件1 > 文件2
      ```

  - 使用 echo 将内容追加到文件末尾

    - echo "内容" >> 文件

- 示例

  - ![image-20210914091436465](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914091436465.png)

**（17）ln --- 软链接**

软链接也称为符号链接，类似于 Windows 里的快捷方式，有自己的数据块，主要存放了链接其他文件的路径。

- 语法

  - ```shell
    ln -s [原文件或目录] [软链接名]
    ```

- 经验技巧

  - 删除软链接：rm -rf 软链接名，而不是 rm -rf 软链接名/
  - 查询：通过 ll 就可以查看，列表属性第1位是1，尾部会有位置指向

- 示例

  - 创建软链接
    - ![image-20210914091820381](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914091820381.png)
  - 删除软链接
    - ![image-20210914091840891](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914091840891.png)
  - 进入软链接实际物理路径
    - ![image-20210914091900603](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914091900603.png)

**（18）history --- 查看已经执行过的历史命令**

- 语法

  - ```shell
    history
    ```

- 示例

  - ![image-20210914091940740](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914091940740.png)

## 3. 磁盘分区类命令

### 3.1 Windows 下的磁盘分区

![image-20210914092051619](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914092051619.png)

![image-20210914092127706](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914092127706.png)

### 3.2 常用的两种磁盘分区类型

（1）**mbr**

①操作系统要安装在主分区

②只支持 4 个主分区

③扩展分区占一个主分区

（2）**gpt**(win7 64位以后)

①无限主分区

②支持超大硬盘 3T 以上

（3）Linux 下查看所有设备的挂载情况

```shell
lsblk 或者 lsblk -f
```

（4）增加一块新硬盘，通过命令进行分区

**①虚拟机插入新硬盘**

在【虚拟机】菜单中，选择【设置】，然后设备列表里添加硬盘，然后一路【下一步】，中间只有选择磁盘大小的地方需要修改，直至完成，然后重启系统

![image-20210914092349284](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914092349284.png)

**②进行分区**

通过 fdisk/dev/sdb 开始对 /sdb 进行分区

```shell
m 显示命令列表

p 显示磁盘

n 新增分区

d 删除分区

w 入并退出分区
```

分区步骤如下：开始分区后输入 n，新增分区，然后选择 p，分区类型为主分区。两次回车默认剩余全部空间，最后输入 w 写入分区并退出，若不保存退出输入 q。

![image-20210914092514099](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914092514099.png)

![image-20210914092538068](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914092538068.png)

**③格式化磁盘**

命令：

```shell
mkfs -t ext4 /dev/sdb1
```

**④挂载**

将一个分区与一个目录联系起来

```shell
mount 设备名称 挂载目录
```

例如：mount /dev/sdb1 /netdisk

```shell
umount 设备名称 或者 挂载目录
```

例如：umount /dev/sdb1 或者 umount /netdisk

注意：用命令挂载重启后会失效

**⑤永久挂载**

通过修改 /etc/fstab 实现挂载

添加完成后 执行 mount -a 即刻生效

/etc/fatab 文件参数介绍

第一列：磁盘设备文件或者该设备的 Label 或者 UUID

第二列:  设备的挂载点，就是你要挂载到哪个目录下

第三列:  磁盘文件系统的格式，包括 ext2、ext3、reiserfs、nfs、vfat 等

第四列:  文件系统的参数 ，defaults 代表同时具有 rw,suid,dev,exec,auto,nouser,async 等默认参数的设置

第五列:  能否被 dump 备份命令作用  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 代表不要做 dump 备份

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 代表要每天进行 dump 的操作

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 代表不定日期的进行 dump 操作

第六列:   是否检验扇区

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 不要检验

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 最早检验（一般根目录会选择）

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 1级别检验完成之后进行检验

## 4. 磁盘情况查询

- df -h：查询系统整体磁盘使用情况

- du -h /目录：查询指定目录的磁盘占用情况,默认为当前目录

- 参数说明：

  - -s 指定目录占用大小汇总
  - -h 带计量单位
  - -a 含文件
  - --max-depth=1 子目录深度
  - -c 列出明细的同时，增加汇总值

- 使用举例

  - ```shell
    du -ach --max-depth=1 /opt
    ```

## 5. 网络配置类

### 5.1 ifconfig 查看网络配置

5.2 如何修改 IP

（1）图形化操作

（2）命令行方式

```shell
vi /etc/sysconfig/network-scripts/ifcfg-ens33
```

或者

```shell
vi /etc/sysconfig/network-scripts/ifcfg-eth0
```

**参数说明：**

```
DEVICE=eth0 # 接口名（设备,网卡）
BOOTPROTO=none # IP的配置方法[none|static|bootp|dhcp]（引导时不使用协议|静态分配IP|BOOTP协议|DHCP 协议）
BROADCAST=192.168.1.255 # 广播地址    
HWADDR=00:0C:2x:6x:0x:xx # MAC地址
IPADDR=192.168.1.23 # IP地址
NETMASK=255.255.255.0 # 网络掩码  
NETWORK=192.168.1.0 # 网络地址
ONBOOT=yes # 系统启动的时候网络接口是否有效（yes/no）
TYPE=Ethernet # 网络类型（通常是Ethernet）
GATEWAY=192.168.1.2 # 网关
DNS1=192.168.1.2 # 域名解析器
```

## 6. 进程类

### 6.1 ps（process）

ps 显示的信息选项：

| 字段 | 说明                   |
| ---- | ---------------------- |
| PID  | 进程识别号             |
| TTY  | 终端机号               |
| TIME | 此进程所消 CPU 时间    |
| CMD  | 正在执行的命令或进程名 |

![image-20210914095310780](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914095310780.png)

### 6.2 ps -aux

-a：显示当前总段的所有进程信息（选择所有进程）

-u：以用户的格式显示进程信息

-x：显示后台进程（没有终端）

**详细解释：**

```shell
ps -aux | grep xxx
```

![image-20210914095801366](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914095801366.png)

- USER：用户名称
- PID：进程号
- %CPU：进程占用 CPU 资源的百分比，占用越高，进程越耗费资源
- %MEM：进程占用物理内存的百分比，占用越高，进程越耗费资源
- VSZ：进程占用的虚拟内存大小(单位：KB)
- RSS：进程占用的物理内存大小(单位：KB)
- TTY：终端名称,缩写（其中 tty1-tty7 代表本地控制台终端，tty1-tty6 是本地的字符界面终端，tty7 是图形终端。pts/0-255 代表虚拟终端）
- STAT：进程状态，其中S-睡眠，s-表示该进程是会话的先导进程，N-表示进程拥有比普通优先级更低的优先级，R-正在运行，D-短期等待，Z-僵死进程，T-被跟踪或者被停止等等
- (R：运行、S：睡眠、T：停止状态、s：包含子进程、+：位于后台)
- START：进程的启动时间
- TIME：该进程占用 CPU 的运算时间，注意不是系统时间
- COMMAND：启动进程所用的命令和参数，如果过长会被截断显示

### 6.3 ps -ef

> **ps -ef：是以全格式显示当前所有的进程**

-e 显示所有进程

-f 全格式

```shell
ps -ef | grep xxx
```

![image-20210914100133238](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914100133238.png)

- UID：用户 ID
- PID：进程 ID
- PPID：父进程 ID
- C：CPU 用于计算执行优先级的因子。数值越大，表明进程是 CPU 密集型运算，执行优先级会降低；数值越小，表明进程是 I/O 密集型运算，执行优先级会提高
- STIME：进程启动的时间
- TTY：完整的终端名称
- TIME：CPU 时间
- CMD：启动进程所用的命令和参数

### 6.4 kill pid

杀死指定的 pid 对应的进程（-9：强行杀死进程）

## 7. 服务类

### 7.1 service（CentOS6）

（1）注册在系统中的标准化程序

（2）有方便统一的管理方式（常用的方法）

- service 服务名 start >>> 开启服务
- service 服务名 stop >>> 关闭服务
- service 服务名 restart >>> 重新启动服务
- service 服务名 reload >>> 重新加载服务
- service 服务名 status >>> 查看服务状态

（3）查看服务的方法 /etc/init.d/ 服务名

（4）通过 chkconfig 命令设置自启动

- ```shell
  // 查看服务开机启动状态
  chkconfig 服务名 --list
  ```

- ```shell
  // 开启指定服务的自动启动
  chkconfig (--level 5) 服务名 on
  ```

- ```shell
  // 关闭指定服务的自动启动
  chkconfig (--level 5) 服务名 off
  ```

（5）运行级别

![image-20210914100800943](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914100800943.png)

查看默认级别：vi /etc/inittab

- Linux 系统有 7 种运行级别(runlevel)：常用的是级别 3 和 5
- 运行级别 0：系统停机状态，系统默认运行级别不能设为 0，否则不能正常启动
- 运行级别 1：单用户工作状态，root 权限，用于系统维护，禁止远程登陆
- 运行级别 2：多用户状态(没有 NFS)，不支持网络
- 运行级别 3：完全的多用户状态(有 NFS)，登陆后进入控制台命令行模式
- 运行级别 4：系统未使用，保留
- 运行级别 5：X11 控制台，登陆后进入图形 GUI 模式
- 运行级别 6：系统正常关闭并重启，默认运行级别不能设为 6，否则不能正常启动

### 7.2 systemctl（CentOS7）

（1）注册在系统中的标准化程序

（2）有方便统一的管理方式（常用的方法）

- systemctl 服务名 start >>> 开启服务
- systemctl 服务名 stop >>> 关闭服务
- systemctl 服务名 restart >>> 重新启动服务
- systemctl 服务名 reload >>> 重新加载服务
- systemctl 服务名 status >>> 查看服务状态

（3）查看服务的方法 /usr/lib/systemd/system

（4）查看服务的命令

- ```shell
  systemctl list-unit-files
  ```

- ```shell
  systemctl --type service
  ```

（5）通过 systemctl 命令设置自启动

- ```shell
  // 自启动
  systemctl enable service_name
  ```

- ```shell
  // 不自启动
  systemctl disable service_name
  ```

（6）运行级别

![image-20210914100800943](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/linux/image-20210914100800943.png)

查看默认级别：vi /etc/inittab

CentOS7 运行级别简化为：

| init 级别 | systemctl target  |
| --------- | ----------------- |
| 0         | shutdown.target   |
| 1         | emergency.target  |
| 2         | rescure.target    |
| 3         | multi-user.target |
| 4         | 无                |
| 5         | graphical.target  |
| 6         | 无                |

get-default：取得当前的 target

set-default：设置指定的 target 为默认的运行级别

isolate：切换到指定的运行级别

| systemctl 命令                          | 说明                                           |
| --------------------------------------- | ---------------------------------------------- |
| systemctl get-default                   | 获得当前的运行级别                             |
| systemctl set-default multi-user.target | 设置默认的运行级别为 mulit-user                |
| systemctl isolate multi-user.target     | 在不重启的情况下，切换到运行级别 mulit-user 下 |
| systemctl isolate graphical.target      | 在不重启的情况下，切换到图形界面下             |

## 8. netstat

> **查看系统的网络情况**

-an 按一定的顺序排列输出

-p 显示哪个进程在调用

```shell
netstat -anp | grep 8080 // 查看占用 8080 端口的进程
```

