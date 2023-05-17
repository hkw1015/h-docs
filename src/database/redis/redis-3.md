---
title: 常用五大数据类型
date: 2021-12-11
category: Redis
tag:
 - Redis
---

Redis 常见数据类型操作命令：[http://www.redis.cn/commands.html](http://www.redis.cn/commands.html)

## 1. Redis 键（key）

- 查看当前库所有 key（匹配：keys *1）

  ```shell
  127.0.0.1:6379> set aaa AAA
  OK
  127.0.0.1:6379> keys *
  1) "aaa"
  ```

- 判断某个 key 是否存在

  ```shell
  127.0.0.1:6379> exists aaa
  (integer) 1
  ```

- 查看 key 是什么类型

  ```shell
  127.0.0.1:6379> type aaa
  string
  ```

- 删除指定的 key

  ```shell
  127.0.0.1:6379> del aaa
  (integer) 1
  ```

- <span style="color:red">非阻塞删除</span>

  仅将 keys 从 keyspace 元数据中删除，真正的删除会在后续异步操作

  ```shell
  127.0.0.1:6379> set bbb BBB
  OK
  127.0.0.1:6379> unlink bbb
  (integer) 1
  ```

- 为给定的 key 设置过期时间 & 查看 key 还有多少秒过期 -1 表示永不过期，-2 表示已过期

  ```shell
  127.0.0.1:6379> set ccc CCC
  OK
  127.0.0.1:6379> expire ccc 10
  (integer) 1
  127.0.0.1:6379> ttl ccc
  (integer) 6
  127.0.0.1:6379> ttl ccc
  (integer) 4
  127.0.0.1:6379> ttl ccc
  (integer) 3
  ```

- 查看当前数据库的 key 的数量

  ```shell
  127.0.0.1:6379> keys *
  1) "ddd"
  127.0.0.1:6379> dbsize
  (integer) 1
  ```

- 切换数据库

  ```shell
  127.0.0.1:6379> select 5
  OK
  127.0.0.1:6379[5]> 
  ```

- 清空当前库

  ```shell
  127.0.0.1:6379> dbsize
  (integer) 1
  127.0.0.1:6379> flushdb
  OK
  127.0.0.1:6379> dbsize
  (integer) 0
  ```

- 通杀全部库

  ```shell
  127.0.0.1:6379[5]> flushall
  OK
  ```

## 2. Redis 字符串（String）

### 2.1 简介

- String 是 Redis 最基本的类型，你可以理解为与 Memcached 一模一样的类型，一个 key 对应一个 value。
- String 类型是<span style="color:red">二进制安全的</span>，意味着 Redis 的 String 可以包含任何数据，比如 jpg 图片或者序列化的对象。
- String 类型是 Redis 最基本的数据类型，一个 Redis 中字符串 value 最多可以是 <span style="color:red">512 M</span>。

### 2.2 常用命令

**（1）添加键值对**

①格式

```shell
set <key><value>
```

②案例实操

```shell
127.0.0.1:6379> set k1 v100
OK
127.0.0.1:6379> set k2 v200
OK
127.0.0.1:6379> keys *
1) "k2"
2) "k1"
127.0.0.1:6379> set k2 v2200 # 再次设置，会覆盖上一次的值
OK
127.0.0.1:6379> get k2
"v2200"
```

**（2）查询对应键值**

①格式

```shell
get <key>
```

②案例实操

```shell
127.0.0.1:6379> get k1
"v100"
127.0.0.1:6379> get k2
"v2200"
```

**（3）将给定的 value 追加到原值的末尾**

①格式

```shell
append <key><value>
```

②案例实操

```shell
127.0.0.1:6379> append k1 abc
(integer) 7
127.0.0.1:6379> get k1
"v100abc"
```

**（4）获得值的长度**

①格式

```shell
strlen <key>
```

②案例实操

```shell
127.0.0.1:6379> get k1
"v100abc"
127.0.0.1:6379> strlen k1
(integer) 7
```

**（5）只有在 key 不存在时，才设置 key 的值**

①格式

```shell
setnx <key><value>
```

②案例实操

```shell
127.0.0.1:6379> get k1
"v100abc"
127.0.0.1:6379> setnx k1 v1100
(integer) 0
127.0.0.1:6379> get k1
"v100abc"
```

**（6）将 key 中储存的数字值增 1**

①格式

```shell
incr <key>
```

②案例实操

```shell
127.0.0.1:6379> incr k1
(error) ERR value is not an integer or out of range
127.0.0.1:6379> set k3 100
OK
127.0.0.1:6379> incr k3
(integer) 101
127.0.0.1:6379> incr k3
(integer) 102
```

**（7）将 key 中储存的数字值减 1**

①格式

```shell
decr <key>
```

②案例实操

```shell
127.0.0.1:6379> decr k3
(integer) 101
127.0.0.1:6379> decr k3
(integer) 100
```

**（8）将 key 中储存的数字值增减【自定义步长】**

①格式

```shell
incrby / decrby <key><步长>
```

②案例实操

```shell
127.0.0.1:6379> incrby k3 5
(integer) 105
127.0.0.1:6379> incrby k3 5
(integer) 110
127.0.0.1:6379> incrby k3 5
(integer) 115
127.0.0.1:6379> decrby k3 2
(integer) 113
127.0.0.1:6379> decrby k3 2
(integer) 111
127.0.0.1:6379> decrby k3 2
(integer) 109
```

> ![image-20211117095653866](http://img.hl1015.top/blog/image-20211117095653866.png)
>
> 所谓**原子操作**是指不会被线程调度机制打断的操作。
>
> 这种操作一旦开始，就一直运行到结束，中间不会有任何 context switch（切换到另一个线程）。
>
> [1]在单线程中，能够在单条指令中完成的操作都可以认为是 "原子操作"，因为中断只能发生于指令之间。
>
> [2]在多线程中，不能被其他进程（线程）打断的操作就叫原子操作。
>
> Redis 单命令的原子性主要得益于 Redis 的单线程。

**（9）同时设置一个或多个 key-value 对**

①格式

```shell
mset <key1><value1><key2><value2> ...
```

②案例实操

```shell
127.0.0.1:6379> mset k4 v400 k5 v500 k6 v600
OK
```

**（10）同时获取一个或多个 value**

①格式

```shell
mget <key1><key2> ...
```

②案例实操

```shell
127.0.0.1:6379> mget k4 k5 k6
1) "v400"
2) "v500"
3) "v600"
```

**（11）同时设置一个或多个 key-value 对，当且仅当所有给定 key 都不存在**

> <span style="color:red">**原子性，有一个失败则都失败**</span>

①格式

```shell
msetnx <key1><value1><key2><value2> ...
```

②案例实操

```shell
127.0.0.1:6379> msetnx k4 v4400 k5 v5500 k6 v6600
(integer) 0
127.0.0.1:6379> msetnx k7 v700 k8 v800 k9 v900
(integer) 1
127.0.0.1:6379> mget k7 k8 k9
1) "v700"
2) "v800"
3) "v900"
```

**（12）获取值的范围，类似 Java 中的 substring【区别：<span style="color:red">包前 & 包后</span>】**

①格式

```shell
getrange <key><起始位置><结束位置> # 索引从 0 开始
```

②案例实操

```shell
127.0.0.1:6379> get k1
"v100abc"
127.0.0.1:6379> getrange k1 0 3
"v100"
```

**（13）用 \<value\> 覆写 \<key\> 所储存的字符串值，从 <起始位置> 开始**

①格式

```shell
setrange <key><起始位置><value> # 索引从 0 开始
```

②案例实操

```shell
127.0.0.1:6379> get k1
"v100abc"
127.0.0.1:6379> setrange k1 4 def
(integer) 7
127.0.0.1:6379> get k1
"v100def"
```

**（14）设置键值的同时，设置过期时间，单位：秒**

①格式

```shell
setex <key><过期时间><value>
```

②案例实操

```shell
127.0.0.1:6379> setex k10 10 v1000
OK
127.0.0.1:6379> ttl k10
(integer) 7
127.0.0.1:6379> ttl k10
(integer) 5
```

**（15）以新换旧，设置新值同时获得旧值**

①格式

```shell
getset <key><value>
```

②案例实操

```shell
127.0.0.1:6379> set k11 v1100
OK
127.0.0.1:6379> get k11
"v1100"
127.0.0.1:6379> getset k11 v1111
"v1100"
127.0.0.1:6379> get k11
"v1111"
```

### 2.3 数据结构

String 的数据结构为简单动态字符串（Simple Dynamic String，缩写 SDS），是可以修改的字符串，内部结构实现上类似于 Java 的 ArrayList，采用预分配冗余空间的方式来减少内存的频繁分配。

![image-20211117110520766](http://img.hl1015.top/blog/image-20211117110520766.png)

如上图所示，内部为当前字符串实际分配的空间 capacity 一般要高于实际字符串长度 len。当字符串长度小于 1 M 时，扩容都是加倍现有的空间，如果超过 1 M，扩容时一次只会多扩 1 M 的空间，需要注意的是字符串最大长度为 512 M。

## 3. Redis 列表（List）

### 3.1 简介

- 单键多值
- Redis 列表是简单的字符串列表，按照插入顺序排序，你可以添加一个元素到列表的头部（左边）或者尾部（右边）
- 它的底层实际是个双向链表，对两端的操作性能很高，通过索引下标的操作中间节点性能会较差

![image-20211117111214281](http://img.hl1015.top/blog/image-20211117111214281.png)

### 3.2 常用命令

**（1）从左边/右边插入一个或多个值**

①格式

```shell
lpush / rpush <key1><value1><value2><value3> ...
```

②案例实操

```shell
127.0.0.1:6379> lpush k1 v1 v2 v3
(integer) 3
127.0.0.1:6379> lrange k1 0 -1 # （从左到右）取出 k1 对应列表中的所有值
1) "v3"
2) "v2"
3) "v1"
127.0.0.1:6379> rpush k2 v1 v2 v3
(integer) 3
127.0.0.1:6379> lrange k2 0 -1
1) "v1"
2) "v2"
3) "v3"
```

lpush 过程分析：

![image-20211117133109944](http://img.hl1015.top/blog/image-20211117133109944.png)

rpush 过程分析：

![image-20211117133434492](http://img.hl1015.top/blog/image-20211117133434492.png)

**（2）从左边/右边吐出一个值【值在键在，值光键亡】**

①格式

```shell
lpop / rpop <key>
```

②案例实操

```shell
127.0.0.1:6379> lpop k1
"v3"
127.0.0.1:6379> lpop k1
"v2"
127.0.0.1:6379> lpop k1
"v1"
127.0.0.1:6379> exists k1
(integer) 0
127.0.0.1:6379> rpop k2
"v3"
127.0.0.1:6379> rpop k2
"v2"
127.0.0.1:6379> rpop k2
"v1"
127.0.0.1:6379> exists k2
(integer) 0
```

**（3）从 key1 列表右边吐出一个值，插到 key2 列表左边**

①格式

```shell
rpoplpush <key1><key2>
```

②案例实操

```shell
127.0.0.1:6379> lpush k1 v1 v2 v3
(integer) 3
127.0.0.1:6379> rpush k2 v1 v2 v3
(integer) 3
127.0.0.1:6379> rpoplpush k1 k2
"v1"
127.0.0.1:6379> lrange k2 0 -1
1) "v1"
2) "v1"
3) "v2"
4) "v3"
```

过程分析：

![image-20211117134549665](http://img.hl1015.top/blog/image-20211117134549665.png)

**（4）按照索引下标范围获得元素（从左到右）**

①格式

```shell
lrange <key><start><stop>
```

eg：lrange mylist 0 -1【0 代表左边第一个，-1 代表右边第一个，0 -1 表示获取所有】

②案例实操

```shell
127.0.0.1:6379> lrange k2 0 -1
1) "v1"
2) "v1"
3) "v2"
4) "v3"
```

**（5）按照索引下标获得元素（从左到右）**

①格式

```shell
lindex <key><index>
```

②案例实操

```shell
127.0.0.1:6379> lrange k2 0 -1
1) "v1"
2) "v1"
3) "v2"
4) "v3"
127.0.0.1:6379> lindex k2 0
"v1"
127.0.0.1:6379> lindex k2 1
"v1"
127.0.0.1:6379> lindex k2 2
"v2"
127.0.0.1:6379> lindex k2 3
"v3"
```

**（6）获得列表长度**

①格式

```shell
llen <key>
```

②案例实操

```shell
127.0.0.1:6379> llen k2
(integer) 4
```

**（7）在 value 前面/后面 插入 newvalue 新值**

①格式

```shell
linsert <key> before/after <value><newvalue>
```

②案例实操

```shell
127.0.0.1:6379> lrange k2 0 -1
1) "v1"
2) "v1"
3) "v2"
4) "v3"
127.0.0.1:6379> linsert k2 before v1 newv1
(integer) 5
127.0.0.1:6379> lrange k2 0 -1
1) "newv1"
2) "v1"
3) "v1"
4) "v2"
5) "v3"
127.0.0.1:6379> linsert k2 after v2 newv1
(integer) 6
127.0.0.1:6379> lrange k2 0 -1
1) "newv1"
2) "v1"
3) "v1"
4) "v2"
5) "newv1"
6) "v3"
```

**（8）从左边删除 n 个 value（从左到右）**

①格式

```shell
lrem <key><n><value>
```

②案例实操

```shell
127.0.0.1:6379> lrange k2 0 -1
1) "newv1"
2) "v1"
3) "v1"
4) "v2"
5) "newv1"
6) "v3"
127.0.0.1:6379> lrem k2 2 newv1
(integer) 2
127.0.0.1:6379> lrange k2 0 -1
1) "v1"
2) "v1"
3) "v2"
4) "v3"
```

**（9）将列表 key 下标为 index 的值替换成 value**

①格式

```shell
lset <key><index><value>
```

②案例实操

```shell
127.0.0.1:6379> lrange k2 0 -1
1) "v1"
2) "v1"
3) "v2"
4) "v3"
127.0.0.1:6379> lset k2 0 replacev1
OK
127.0.0.1:6379> lrange k2 0 -1
1) "replacev1"
2) "v1"
3) "v2"
4) "v3"
```

### 3.3 数据结构

List 的数据结构为 压缩列表 ziplist / 快速链表 quickList。

首先在列表元素较少的情况下会使用一块连续的内存存储，这个结构是 ziplist，也即是压缩列表。它将所有的元素紧挨着一起存储，分配的是一块连续的内存，当数据量比较多的时候才会改成 quicklist。因为普通的链表需要的附加指针空间太大，会比较浪费空间。比如这个列表里存的只是 int 类型的数据，结构上还需要两个额外的指针 prev 和 next。

![image-20211117140031259](http://img.hl1015.top/blog/image-20211117140031259.png)

Redis 将链表和 ziplist 结合起来组成了 quicklist，也就是将多个 ziplist 使用双向指针串起来使用。这样既满足了快速的插入删除性能，又不会出现太大的空间冗余。

## 4. Redis 集合（Set）

### 4.1 简介

Redis Set 对外提供的功能与 List 类似是一个列表的功能，特殊之处在于 Set 是可以<span style="color:red">**自主排重**</span>的，当你需要存储一个列表数据，又不希望出现重复数据时，Set 是一个很好的选择，并且 Set 提供了判断某个成员是否在一个 Set 集合内的重要接口，这个也是 List 所不能提供的。

Redis 的 Set 是 String 类型的<span style="color:red">无序集合</span>。<span style="color:red">它底层其实是一个 value 为 null 的 Hash 表</span>，所以添加，删除，查找的<span style="color:red">**复杂度都是 O(1)**</span>。一个算法，随着数据的增加，执行时间的长短，如果是 O(1)，数据增加，查找数据的时间不变。

### 4.2 常用命令

**（1）将一个或多个 member 元素加入到集合 key 中，已经存在的 member 元素将被忽略**

①格式

```shell
sadd <key><value1><value2> ...
```

②案例实操

```shell
127.0.0.1:6379> sadd k1 v1 v1 v2 v3
(integer) 3
```

**（2）取出集合的所有值**

①格式

```shell
smembers <key>
```

②案例实操

```shell
127.0.0.1:6379> smembers k1
1) "v3"
2) "v1"
3) "v2"
```

**（3）判断集合 key 是否含有该 value 值【有 1，没有 0】**

①格式

```shell
sismember <key><value>
```

②案例实操

```shell
127.0.0.1:6379> sismember k1 v4
(integer) 0
127.0.0.1:6379> sismember k1 v3
(integer) 1
```

**（4）返回集合的元素个数**

①格式

```shell
scard <key>
```

②案例实操

```shell
127.0.0.1:6379> scard k1
(integer) 3
```

**（5）删除集合中的某个元素**

①格式

```shell
srem <key><value1><value2> ...
```

②案例实操

```shell
127.0.0.1:6379> srem k1 v1
(integer) 1
127.0.0.1:6379> smembers k1
1) "v3"
2) "v2"
```

**（6）<span style="color:red">随机从集合中吐出一个值</span>**

①格式

```shell
spop <key>
```

②案例实操

```shell
127.0.0.1:6379> sadd k2 v21 v22 v23 v24 v25
(integer) 5
127.0.0.1:6379> spop k2
"v21"
127.0.0.1:6379> spop k2
"v23"
127.0.0.1:6379> spop k2
"v22"
```

**（7）随机从集合中取出 n 个值，不会从集合中删除**

①格式

```shell
srandmember <key><n>
```

②案例实操

```shell
127.0.0.1:6379> sadd k3 v31 v32 v33 v34 v35
(integer) 5
127.0.0.1:6379> srandmember k3 3
1) "v33"
2) "v32"
3) "v34"
127.0.0.1:6379> srandmember k3 3
1) "v32"
2) "v35"
3) "v34"
```

**（8）把集合中一个值从一个集合移动到另一个集合**

①格式

```shell
smove <source><destination> value
```

②案例实操

```shell
127.0.0.1:6379> sadd k4 v41 v42 v43
(integer) 3
127.0.0.1:6379> smove k3 k4 v31
(integer) 1
127.0.0.1:6379> smembers k4
1) "v42"
2) "v43"
3) "v41"
4) "v31"
```

**（9）返回两个集合的交集元素**

①格式

```shell
sinter <key1><key2>
```

②案例实操

```shell
127.0.0.1:6379> smembers key1
1) "v3"
2) "v1"
3) "v2"
4) "v4"
127.0.0.1:6379> smembers key2
1) "v6"
2) "v2"
3) "v8"
4) "v4"
127.0.0.1:6379> sadd key2 v2 v4 v6 v8
(integer) 4
127.0.0.1:6379> sinter key1 key2
1) "v2"
2) "v4"
```

**（10）返回两个集合的并集元素**

①格式

```shell
sunion <key1><key2>
```

②案例实操

```shell
127.0.0.1:6379> smembers key1
1) "v3"
2) "v1"
3) "v2"
4) "v4"
127.0.0.1:6379> smembers key2
1) "v6"
2) "v2"
3) "v8"
4) "v4"
127.0.0.1:6379> sunion key1 key2
1) "v3"
2) "v1"
3) "v2"
4) "v8"
5) "v6"
6) "v4"
```

**（11）返回两个集合的差集元素（key1中有，key2中没有的）**

①格式

```shell
sdiff <key1><key2>
```

②案例实操

```shell
127.0.0.1:6379> smembers key1
1) "v3"
2) "v1"
3) "v2"
4) "v4"
127.0.0.1:6379> smembers key2
1) "v6"
2) "v2"
3) "v8"
4) "v4"
127.0.0.1:6379> sdiff key1 key2
1) "v1"
2) "v3"
```

### 4.3 数据结构

Set 数据结构是 dict 字典，字典是用哈希表实现的。

Java 中 HashSet 的内部使用的是 HashMap，只不过所有的 value 都指向同一个对象。

Redis 的 Set 结构也是一样，它的内部也是用 Hash 结构，所有的 value 都指向同一个内部值。

## 5. Redis 哈希（Hash）

### 5.1 简介

Redis Hash 是一个键值对集合。

Redis Hash 是一个 String 类型的 field 和 value 的映射表，Hash 特别适合用于存储对象，类似 Java 里面的 Hash<String, Object>。

用户 ID 为查找的 key，存储的 value 用户对象包含姓名、年龄、生日等信息，如果用普通的 key/value 结构来存储，主要有以下 2 种存储方式：

- 方式一：将用户对象序列化后的二进制数据作为 value 进行存储
  - ![image-20211117152734429](http://img.hl1015.top/blog/image-20211117152734429.png)
  - 缺点：每次修改用户的某个属性，需要先反序列化，改好后在序列化会取，开销较大
- 方式二：根据不同属性组装多个 key，通过不同的属性标签去存储相应 value 数据
  - ![image-20211117152751244](http://img.hl1015.top/blog/image-20211117152751244.png)
  - 缺点：用户 ID 数据冗余

如果采用 Hash 结构进行存储，通过 <span style="color:red">key（用户 ID） + field（属性标签）</span>就可以操作对应属性数据了，既不需要重复存储数据，也不会带来序列化和并发修改控制的问题。

![image-20211117153714831](http://img.hl1015.top/blog/image-20211117153714831.png)

### 5.2 常用命令

**（1）给 key 集合中的 field 键赋值 value**

①格式

```shell
hset <key><field><value>
```

②案例实操

```shell
127.0.0.1:6379> hset k1 name zhangsan
(integer) 1
```

**（2）从 key 集合的 field 中取出 value**

①格式

```shell
hget <key><field>
```

②案例实操

```shell
127.0.0.1:6379> hget k1 name
"zhangsan"
```

**（3）批量设置 hash 的值**

①格式

```shell
hmset <key><field><value1><value2><value3> ...
```

②案例实操

```shell
127.0.0.1:6379> hmset k1 name zhangsan age 20 birthday 2020-10-10
OK
127.0.0.1:6379> hget k1 name
"zhangsan"
127.0.0.1:6379> hget k1 age
"20"
127.0.0.1:6379> hget k1 birthday
"2020-10-10"
```

**（4）查看哈希表 key 中，给定域 field 是否存在**

①格式

```shell
hexists <key><field>
```

②案例实操

```shell
127.0.0.1:6379> hexists k1 name
(integer) 1
127.0.0.1:6379> hexists k1 name1
(integer) 0
```

**（5）列出 hash 集合的所有 field**

①格式

```shell
hkeys <key>
```

②案例实操

```shell
127.0.0.1:6379> hkeys k1
1) "name"
2) "age"
3) "birthday"
```

**（6）列出 hash 集合的所有 value**

①格式

```shell
hvals <key>
```

②案例实操

```shell
127.0.0.1:6379> hvals k1
1) "zhangsan"
2) "20"
3) "2020-10-10"
```

**（7）为哈希表 key 中的域 field 的值加上增量 1 / -1**

①格式

```shell
hincrby <key><field><increment>
```

②案例实操

```shell
127.0.0.1:6379> hincrby k1 age 1
(integer) 21
127.0.0.1:6379> hincrby k1 age 1
(integer) 22
127.0.0.1:6379> hget k1 age
"22"
127.0.0.1:6379> hincrby k1 age -2
(integer) 20
127.0.0.1:6379> hget k1 age
"20"
```

**（8）将哈希表 key 中的域 field 的值设置为 value，当且仅当域 field 不存在**

①格式

```shell
hsetnx <key><field><value>
```

②案例实操

```shell
127.0.0.1:6379> hsetnx k1 name lisi
(integer) 0
127.0.0.1:6379> hsetnx k2 name lisi
(integer) 1
127.0.0.1:6379> hget k2 name
"lisi"
```

### 5.3 数据结构

Hash 类型对应的数据结构是两种：ziplist（压缩列表），hashtable（哈希表）。当 field-value 长度较短且个数较少时，使用 ziplist，否则使用 hashtable。

## 6. Redis 有序集合 Zset（sorted set）

### 6.1 简介

Redis 有序集合 zset 与普通集合 set 非常相似，是一个没有重复元素的字符串集合。

不同之处是有序集合的每个成员都关联了一个<span style="color:red">评分（score）</span>，这个评分（score）被用来按照从最低分到最高分或从最高分到最低分方式排序集合中的成员。<span style="color:red">集合的成员是唯一的，但是评分可以是重复的</span>。

因为元素是有序的，所以你也可以很快地根据评分（score）或者次序（position）来获取一个范围的元素。

访问有序集合的中间元素也是非常快的，因此你能够使用有序集合作为一个没有重复成员的智能列表。

### 6.2 常用命令

**（1）将一个或多个 member 元素及其 score 值加入到有序集合 key 当中**

①格式

```shell
zadd <key><score1><value1><score2><value2> ...
```

②案例实操

```shell
127.0.0.1:6379> zadd topn 200 c++ 300 java 400 php 500 mysql
(integer) 4
```

**（2）返回有序集合 key 中，下标在 start, stop 之间的元素**

①格式

```shell
zrange <key><start><stop> [WITHSCORES] # 带 WITHSCORES ，可以让分数一起和值返回到结果集
```

②案例实操

```shell
127.0.0.1:6379> zrange topn 0 -1
1) "c++"
2) "java"
3) "php"
4) "mysql"
127.0.0.1:6379> zrange topn 0 -1 WITHSCORES
1) "c++"
2) "200"
3) "java"
4) "300"
5) "php"
6) "400"
7) "mysql"
8) "500"
```

**（3）返回有序集 key 中，所有 score 值介于 min 和 max 之间（包括等于 min 或 max）的成员。有序集合成员按 score 值递增（从小到大 / 从大到小）次序排列。**

①格式

```shell
zrangebyscore key min max [WITHSCORES] [limit offset count] # 从小到大
zrevrangebyscore key max min [WITHSCORES] [limit offset count] # 从大到小
```

②案例实操

```shell
127.0.0.1:6379> zrangebyscore topn 300 500
1) "java"
2) "php"
3) "mysql"
127.0.0.1:6379> zrevrangebyscore topn 500 300
1) "mysql"
2) "php"
3) "java"
```

**（4）为元素的 score 加上增量**

①格式

```shell
zincrby <key><increment><value>
```

②案例实操

```shell
127.0.0.1:6379> zincrby topn 50 java
"350"
```

**（5）删除该集合下，指定值的元素**

①格式

```shell
zrem <key><value>
```

②案例实操

```shell
127.0.0.1:6379> zrem topn php
(integer) 1
127.0.0.1:6379> zrange topn 0 -1
1) "c++"
2) "java"
3) "mysql"
```

**（6）统计该集合，分数区间内的元素个数**

①格式

```shell
zcount <key><min><max>
```

②案例实操

```shell
127.0.0.1:6379> zcount topn 300 500
(integer) 2
```

**（7）返回该值在集合中的排名，从 0 开始**

①格式

```shell
zrank <key><value>
```

②案例实操

```shell
127.0.0.1:6379> zrank topn java
(integer) 1
```

### 6.3 数据结构

SortedSet（zset）是 Redis 提供的一个非常特别的数据结构，一方面它等价于 Java 的数据结构 Map<String, Double>，可以给每一个元素 value 赋予一个权重 score，另一方面它有类似于 TreeSet，内部的元素会按照权重 score 进行排序，可以得到每个元素的名词，还可以通过 score 的范围来获取元素的列表。

zset 底层使用了两个数据结构：

- hash：hash 的作用就是关联元素 value 和权重 score，保障元素 value 的唯一性，可以通过元素 value 找到相应的 score 值
- 跳跃表：跳跃表的目的在于给元素 value 排序，根据 score 的范围获取元素列表

> 【1】跳跃表简介
>
> 有序集合在生活中比较常见，例如根据成绩对学生排名，根据得分对玩家排名等。对于有序集合的底层实现，可以用数组、平衡树、链表等。数组不便元素的插入、删除；平衡树或红黑树虽然效率高但结构复杂；链表查询需要遍历所有效率低。Redis 采用的是跳跃表，跳跃表效率堪比红黑树，实现远比红黑树简单。
>
> 【2】跳跃表实例
>
> 对比有序链表和跳跃表，从链表中查询出 51
>
> ①有序链表
>
> ![image-20211117171021517](http://img.hl1015.top/blog/image-20211117171021517.png)
>
> 要查找值为 51 的元素，需要从第一个元素开始依次查找、比较才能找到，一共需要 6 次比较。
>
> ②跳跃表
>
> ![image-20211117172629149](http://img.hl1015.top/blog/image-20211117172629149.png)
>
> 从第 2 层开始，1 节点比 51 节点小，向后比较。21 节点比 51 节点小，继续向后比较，后面就是 NULL 了，所以从 21 节点向下到第 1 层。在第 1 层，41 节点比 51 节点小，继续向后，61 节点比 51 节点大，所以从 41 向下。在第 0 层，51 节点为要查找的节点，节点被找到，共查找 4 次。
>
> 从此可以看出跳跃表比有序链表效率要高。

