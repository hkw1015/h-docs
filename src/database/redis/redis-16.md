---
title: 应用问题解决
date: 2021-12-11
category: Redis
tag:
 - Redis
---

## 1. 缓存穿透

### 1.1 问题描述

key 对应的数据在数据源并不存在，每次针对此 key 的请求从缓存获取不到，请求都会压到数据源，从而可能压垮数据源。比如用一个不存在的用户 id 获取用户信息，不论缓存还是数据库都没有，若黑客利用此漏洞进行攻击可能压垮数据库。

![image-20211124223024214](http://img.hl1015.top/blog/image-20211124223024214.png)

### 1.2 解决方案

一个一定不存在缓存及查询不到的数据，由于缓存是不命中时被动写的，并且出于容错考虑，如果从存储层查询不到数据则不写入缓存，这将导致这个不存在的数据每次请求都要到存储层去查询，失去了缓存的意义。

解决方案：

<font color="red">**（1）对空值缓存**</font>

如果一个查询返回的数据为空（不管是数据是否不存在），我们仍然把这个空结果（null）进行缓存，设置空结果的过期时间会很短，最长不超过五分钟

<font color="red">**（2）设置可访问的名单（白名单）**</font>

使用 bitmaps 类型定义一个可以访问的名单，名单 id 作为 bitmaps 的偏移量，每次访问和 bitmaps 里面的 id 进行比较，如果访问 id 不在 bitmaps 里面，进行拦截，不允许访问

<font color="red">**（3）采用布隆过滤器**</font>

布隆过滤器（Bloom Filter）是 1970 年由布隆提出的，它实际上是一个很长的二进制向量（位图）和一系列随机映射函数（哈希函数）。布隆过滤器可以用于检索一个元素是否在一个集合中，它的优点是空间效率和查询时间都远远超过一般的算法，缺点是有一定的误识别率和删除困难

<font color="red">**（4）进行实时监控**</font>

当发现 Redis 的命中率开始急速降低，需要排查访问对象和访问的数据，和运维人员配置，可以设置黑名单限制服务

## 2. 缓存击穿

### 2.1 问题描述

key 对应的数据存在，但在 Redis 中过期，此时若有大量并发请求过来，这些请求发现缓存过期一般都会从后端 DB 加载数据并回设到缓存，这个时候大并发的请求可能会瞬间把后端 DB 压垮。

![image-20211124224459158](http://img.hl1015.top/blog/image-20211124224459158.png)

### 2.2 解决方案

key 可能会在某些时间点被超高并发地访问，是一种非常 "热点" 的数据，这个时候，需要考虑一个问题：缓存被 "击穿" 的问题。

解决方案：

<font color="red">**（1）预先设置热门数据**</font>

在 Redis 高峰访问之前，把一些热门数据提前存入到 Redis 里面，加大这些热门数据 key 的时长

<font color="red">**（2）实时调整**</font>

现场监控哪些数据热门，实时调整 key 的过期时长

<font color="red">**（3）使用锁**</font>

①就是在缓存失效的时候（判断拿出来的值为空），不是立即去 load db

②先使用缓存工具的某些带成功操作返回值的操作（比如 Redis 的 setnx），去 set 一个 mutex key

③当操作返回成功时，再进行 load db 的操作，并回设缓存，最后删除 mutex key

④当操作返回失败，证明有线程在 load db，当前线程睡眠一段时间再重试这个 get 缓存的方法

![image-20211124225505942](http://img.hl1015.top/blog/image-20211124225505942.png)

## 3. 缓存雪崩

### 3.1 问题描述

key 对应的数据存在，但在 Redis 中过期，此时若有大量并发请求过来，这些请求发现缓存过期一般都会从后端 DB 加载数据并回设到缓存，这个时候大并发的请求可能会瞬间把后端 DB 压垮。

缓存雪崩与缓存击穿的区别在于这里针对很多 key 缓存，前者则是某一个 key。

 正常访问：

![image-20211125153808299](http://img.hl1015.top/blog/image-20211125153808299.png)

缓存失效瞬间：

![image-20211125153814327](http://img.hl1015.top/blog/image-20211125153814327.png)

缓存失效时的雪崩效应对底层系统的冲击非常可怕！

### 3.2 解决方案

<font color="red">**（1）构建多级缓存架构**</font>

nginx 缓存 + redis 缓存 + 其他缓存（ehcache 等）

<font color="red">**（2）使用锁或队列**</font>

用加锁或者队列的方式来保证不会有大量的线程对数据库一次性进行读写，从而避免失效时大量的并发请求落到底层存储系统上，不适用高并发的情况

<font color="red">**（3）设置过期标志更新缓存**</font>

记录缓存数据是否过期（设置提前量），如果过期会触发通知另外的线程在后台去更新实际 key 的缓存

<font color="red">**（4）将缓存失效时间分散开**</font>

比如我们可以在原有的失效时间基础上增加一个随机值，比如 1 - 5 分钟随机，这样每一个缓存的过期时间的重复率就会降低，就很难引发集体失效的事件

## 4. 分布式锁

### 4.1 问题描述

随着业务发展的需要，原单体单机部署的系统被演化成分布式集群系统后，由于分布式系统多线程、多进程并且分布在不同机器上，这将使原单机部署情况下的并发控制锁策略失效，单纯的 Java API 并不能提供分布式锁的能力。为了解决这个问题就需要一种跨 JVM 的互斥机制来控制共享资源的访问，这就是分布式锁要解决的问题！

分布式锁主流的实现方案：

1. 基于数据库实现的分布式锁
2. **基于缓存（Redis 等）**
3. 基于 Zookeeper

每一种分布式锁解决方案都有各自的优缺点：

1. 性能：Redis 最高
2. 可靠性：Zookeeper 最高

### 4.2 解决方案：使用 redis 实现分布式锁

redis 命令：`set sku:1:info "OK" NX PX 10000`

- EX second：设置键的过期时间为 second 秒，`set key value EX second` 效果等同于 `setex key second value`
- PX millisecond：设置键的过期时间为 millisecond 毫秒，`set key value PX millisecond` 等同于 `psetex key value`
- NX：只有键不存在时，才对键进行设置操作，`set key value NX` 效果等同于 `setnx key value`
- XX：只有键已经存在时，才对键进行设置操作

![image-20211125164143768](http://img.hl1015.top/blog/image-20211125164143768.png)

1. 多个客户端同时获取锁（setnx）
2. 获取成功，执行业务逻辑，执行完成释放锁（del）
3. 其他客户端等待重试

### 4.3 编写代码

准备工作：Redis 中 设置：`set num 0`

![image-20211125165451603](http://img.hl1015.top/blog/image-20211125165451603.png)

```java
@GetMapping("testLock")
public void testLock() {
	// 1.获取锁，setnx
	Boolean lock = redisTemplate.opsForValue().setIfAbsent("lock", "111");
	// 2.获取锁成功、查询num的值
	if (lock) {
		Object value = redisTemplate.opsForValue().get("num");
		// 2.1 判断num为空return
		if (StringUtils.isEmpty(value)) {
			return;
		}
		// 2.2 有值就转成成int
		int num = Integer.parseInt(value + "");
		// 2.3 把redis的num加1
		redisTemplate.opsForValue().set("num", ++num);
		// 2.4 释放锁，del
		redisTemplate.delete("lock");
	} else {
		// 3.获取锁失败、每隔0.1秒再获取
		try {
			Thread.sleep(100);
			testLock();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}
```

使用 ab 工具进行压测：

```shell
ab -n 1000 -c 100 http://192.168.81.1:6666/testLock
```

查看 Redis 中 num 的值：

![image-20211125170512714](http://img.hl1015.top/blog/image-20211125170512714.png)

可以发现基本实现了。

### 4.4 优化之设置锁的过期时间

- 问题：setnx 刚好获取到锁，业务逻辑出现异常，导致锁无法释放
- 解决：设置过期时间，自动释放锁

设置过期时间有两种方式：

1. 首先想到通过 expire 设置过期时间（缺乏原子性：如果在 setnx 和 expire 之间出现异常，锁也无法释放）
2. 在 set 时指定过期时间（<font color="red">推荐</font>）

![image-20211125171728670](http://img.hl1015.top/blog/image-20211125171728670.png)

设置过期时间：

![image-20211125173113296](http://img.hl1015.top/blog/image-20211125173113296.png)

> 压力测试肯定也没有问题，可以自行测试

### 4.5 优化之 UUID 防误删

问题：可能会释放其他服务器的锁

场景：如果业务逻辑的执行时间是 7 s，执行流程如下：

1. index 1 业务逻辑没执行完，3 秒后锁被自动释放
2. index 2 获取到锁，执行业务逻辑，3 秒后锁被自动释放
3. index 3 获取到锁，执行业务逻辑
4. index 1 业务逻辑执行完成，开始调用 del 释放锁，这时释放的是 index 3 的锁，导致 index 3 的业务只执行 1 秒就被别人释放
5. 最终等于没锁的情况

解决：setnx 获取锁时，设置一个指定的唯一值（例如：uuid），释放前获取这个值，判断是否是自己的锁

![image-20211126101422403](http://img.hl1015.top/blog/image-20211126101422403.png)

![image-20211126102750424](http://img.hl1015.top/blog/image-20211126102750424.png)

### 4.6 优化之 LUA 脚本保证删除的原子性

问题：删除操作缺乏原子性

场景：

1. index 1 执行删除时，查询到的 lock 值确实和 uuid 相等

   ```java
   ...
   if (uuid.equals(redisTemplate.opsForValue().get("lock"))) {} // index 1 线程刚好执行到这一步，并且查询到的 lock 值和 uuid 相等
   ```

2. index 1 执行删除前，lock 刚好过期时间已到，被 redis 自动释放

   ```java
   // 在下面一步之前，Redis 中的 lock 刚好过期了
   redisTemplate.delete("lock");
   ```

3. index 2 获取到了 lock

   ```java
   // 此时 index 2 线程获取到了 CPU 资源，开始执行方法
   uuid = uuid2;
   set(lock, uuid);
   ...
   ```

4. index 1 执行删除，此时会把 index 2 的 lock 删除

   ```java
   // 因为 index 1 已经在执行方法中，所以不需要重新上锁，有执行权限了，而且 uuid 和 lock 值已经比较完成，这个时候往下执行删除 lock 方法
   redisTemplate.delete("lock");
   // 这时就会误删了 index 2 的 lock
   ```

加入 Lua 脚本保证原子性：

```java
@GetMapping("testLockLua")
public void testLockLua() {
	// 1 声明一个 uuid ,将做为一个 value 放入我们的key所对应的值中
	String uuid = UUID.randomUUID().toString();
	// 2 定义一个锁：lua 脚本可以使用同一把锁，来实现删除！
	String skuId = "25"; // 访问 skuId 为 25 号的商品
	String locKey = "lock:" + skuId; // 锁住的是每个商品的数据

	// 3 获取锁
	Boolean lock = redisTemplate.opsForValue().setIfAbsent(locKey, uuid, 3, TimeUnit.SECONDS);

	if (lock) { // 如果 true
		// 开始执行业务逻辑
		// 获取缓存中的 num 数据
		Object value = redisTemplate.opsForValue().get("num");
		// 如果是空直接返回
		if (StringUtils.isEmpty(value)) {
			return;
		}
		// 不是空 如果说在这出现了异常！ 那么 delete 就删除失败！ 也就是说锁永远存在！
		int num = Integer.parseInt(value + "");
		// 使 num 每次 +1 放入缓存
		redisTemplate.opsForValue().set("num", String.valueOf(++num));
		/* 使用 lua 脚本来锁 */
		// 定义lua 脚本
		String script = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
		// 使用 redis 执行 lua 脚本
		DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>();
		redisScript.setScriptText(script);
		// 设置一下 返回值类型 为 Long
		// 因为删除判断的时候，返回的 0，给其封装为数据类型。如果不封装那么默认返回 String 类型，那么返回字符串与 0 会有发生错误。
		redisScript.setResultType(Long.class);
		// 第一个要是 script 脚本，第二个需要判断的 key，第三个就是 key 所对应的值。
		redisTemplate.execute(redisScript, Arrays.asList(locKey), uuid);
	} else {
		// 其他线程等待
		try {
			// 睡眠
			Thread.sleep(1000);
			// 睡醒了之后，调用方法。
			testLockLua();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}
```

Lua 脚本详解：

![image-20211126131343639](http://img.hl1015.top/blog/image-20211126131343639.png)

项目中正确使用：

```java
// 定义 key，key 应该是为每个 sku 定义的，也就是每个 sku 有一把琐。
String lockKey = "lock:" + skuId;
Boolean lock = redisTemplate.opsForValue().setIfAbsent(lockKey, uuid, 3, TimeUnit.SECONDS);
```

### 4.7 总结

**（1）加锁**

```java
// 1. 从 redis 中获取锁,set k1 v1 px 20000 nx
String uuid = UUID.randomUUID().toString();
Boolean lock = this.redisTemplate.opsForValue().setIfAbsent("lock", uuid, 2, TimeUnit.SECONDS);
```

**（2）使用 lua 释放锁**

```java
// 2. 释放锁 del
String script = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
// 设置 lua 脚本返回的数据类型
DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>();
// 设置 lua 脚本返回类型为 Long
redisScript.setResultType(Long.class);
redisScript.setScriptText(script);
redisTemplate.execute(redisScript, Arrays.asList("lock"), uuid);
```

**（3）重试**

```java
Thread.sleep(500);
testLockLua();
```

为了确保分布式锁可用，我们至少要确保锁的实现同时 **满足以下四个条件**：

- 互斥性。在任意时刻，只有一个客户端能持有锁。
- 不会发生死锁。即使有一个客户端在持有锁的期间崩溃而没有主动解锁，也能保证后续其他客户端能加锁。
- 解铃还须系铃人。加锁和解锁必须是同一个客户端，客户端自己不能把别人加的锁给解了。
- 加锁和解锁必须具有原子性。