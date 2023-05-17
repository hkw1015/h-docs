---
title: 事务之秒杀案例
date: 2021-12-11
category: Redis
tag:
 - Redis
---

## 1. 解决计数器和人员记录的事务操作

![image-20211119095356656](http://img.hl1015.top/blog/image-20211119095356656.png)

**基础实现：**

```java
/**
 * 模仿秒杀
 */
public class ImitateSecKillRedisUtil {

    // 秒杀过程
    public static String doSecKill(String uid, String prodid) throws IOException {
        // 1 uid 和 prodid 非空判断
        if (uid == null || prodid == null) {
            return "uid 和 prodid 不能为空！";
        }

        // 2 连接redis
        Jedis jedis = new Jedis("ip地址", 6379);
        jedis.auth("*****");

        // 3 拼接key
        // 3.1 库存key
        String kcKey = "sk:" + prodid + ":qt";
        // 3.2 秒杀成功用户key
        String userKey = "sk:" + prodid + ":user";

        // 4 获取库存，如果库存为null，秒杀还没有开始
        String kc = jedis.get(kcKey);
        if (kc == null && "".equals(kc.trim())) {
            System.out.println("秒杀还没有开始，请等待！");
            jedis.close();
            return "秒杀还没有开始，请等待！";
        }

        // 5 判断用户是否重复秒杀操作
        if (jedis.sismember(userKey, uid)) {
            System.out.println("已经秒杀成功了，不能重复秒杀！");
            jedis.close();
            return "已经秒杀成功了，不能重复秒杀！";
        }

        // 6 判断如果商品库存数量小于1，秒杀结束
        if (Integer.parseInt(kc) <= 0) {
            System.out.println("秒杀已经结束了！");
            jedis.close();
            return "秒杀已经结束了！";
        }

        // 7 秒杀过程
        // 库存-1
        jedis.decr(kcKey);
        // 把秒杀成功用户添加清单里面
        jedis.sadd(userKey, uid);

        System.out.println("秒杀成功了...");
        jedis.close();
        return "秒杀成功了...";
    }
}
```

controller 层添加一个 映射方法：

```java
@GetMapping("/doSecKill")
public String doSecKill(String uid, String prodid) {
	try {
		if (uid == null) {
			uid = String.valueOf(new Random().nextInt(10000));
		}
		return ImitateSecKillRedisUtil.doSecKill(uid, prodid);
	} catch (Exception e) {
		e.printStackTrace();
	}
	return "秒杀出异常了！";
}
```

事先在 redis 中存入 prodid 为 1001 的 key，value 设为 10：

![image-20211119202639009](http://img.hl1015.top/blog/image-20211119202639009.png)

通过 potman 进行测试：

![seckill_1](http://img.hl1015.top/blog/seckill_1.gif)

然后再看看 redis 中关于 prodid = 1001 的库存：

![image-20211119203851268](http://img.hl1015.top/blog/image-20211119203851268.png)

redis 中关于 prodid = 1001 的秒杀成功的用户 id 清单：

<img src="http://img.hl1015.top/blog/image-20211119204052699.png" alt="image-20211119204052699" style="zoom: 67%;" />


## 2. Redis 事务 --- 秒杀并发模拟

使用工具 ab 模拟并发测试【CentOS 6 默认安装、CentOS 7 需要手动安装】

### 2.1 联网

使用如下命令进行安装

```shell
yum install httpd-tools
```

```shell
[root@centos101 ~]# yum install httpd-tools
已加载插件：fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: mirrors.163.com
 * epel: mirrors.bfsu.edu.cn
 * extras: mirrors.163.com
 * updates: mirrors.163.com
正在解决依赖关系
...
作为依赖被安装:
  apr.x86_64 0:1.4.8-7.el7    apr-util.x86_64 0:1.5.2-6.el7

完毕！
```

### 2.2 无网络

（1） 进入目录： cd  /run/media/root/CentOS 7 x86_64/Packages（路径跟 centos 6 不同）

（2） 按顺序安装

- apr-1.4.8-3.el7.x86_64.rpm
- apr-util-1.5.2-6.el7.x86_64.rpm
- httpd-tools-2.4.6-67.el7.centos.x86_64.rpm

### 2.3 测试及结果

#### 2.3.0 ab 工具命令说明

```shell
[root@centos101 ~]# ab --help
ab: wrong number of arguments
Usage: ab [options] [http[s]://]hostname[:port]/path
Options are:
    -n requests     Number of requests to perform # 请求数
    -c concurrency  Number of multiple requests to make at a time # 并发数
    -t timelimit    Seconds to max. to spend on benchmarking
                    This implies -n 50000
    -s timeout      Seconds to max. wait for each response
                    Default is 30 seconds
    -b windowsize   Size of TCP send/receive buffer, in bytes
    -B address      Address to bind to when making outgoing connections
    -p postfile     File containing data to POST. Remember also to set -T
    -u putfile      File containing data to PUT. Remember also to set -T
    -T content-type Content-type header to use for POST/PUT data, eg.
                    'application/x-www-form-urlencoded'
    ...
```

#### 2.3.1 通过 ab 测试

首先将 redis 中关于 prodid = 1001 的库存设为 10，并且把用户 id 清单清空

然后通过如下命令对 本地的秒杀接口进行并发测试：（192.168.81.1 替换为你们的本机 ip）

```shell
ab -n 1000 -c 100 http://192.168.81.1:6666/doSecKill?prodid=1001
```

```shell
[root@centos101 ~]# ab -n 1000 -c 100 http://192.168.81.1:6666/doSecKill?prodid=1001
This is ApacheBench, Version 2.3 <$Revision: 1430300 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking 192.168.81.1 (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests
...

Percentage of the requests served within a certain time (ms)
  50%    375
  66%    387
  75%    396
  80%    402
  90%    425
  95%    448
  98%    460
  99%    467
 100%    480 (longest request)
```

#### 2.3.3 超卖

查看控制台打印结果：

![image-20211119211743010](http://img.hl1015.top/blog/image-20211119211743010.png)

查看 redis 中关于 prodid = 1001 的库存：

![image-20211119211850611](http://img.hl1015.top/blog/image-20211119211850611.png)

由此可以发现，上面的秒杀程序，在高并发请求下，引发了**超卖**现象

## 3. 超卖问题

![image-20211119212013463](http://img.hl1015.top/blog/image-20211119212013463.png)

## 4. 利用乐观锁淘汰用户，解决超卖问题

添加了 **乐观锁** 之后的代码：

```java
/**
 * 模仿秒杀
 */
public class ImitateSecKillRedisUtil {

    // 秒杀过程
    public static String doSecKill(String uid, String prodid) throws IOException {
        // 1 uid 和 prodid 非空判断
        if (uid == null || prodid == null) {
            return "uid 和 prodid 不能为空！";
        }

        // 2 连接redis
        Jedis jedis = new Jedis("ip地址", 6379);
        jedis.auth("*****");

        // 3 拼接key
        // 3.1 库存key
        String kcKey = "sk:" + prodid + ":qt";
        // 3.2 秒杀成功用户key
        String userKey = "sk:" + prodid + ":user";

        // 增加乐观锁 ***【乐观锁change1】***
        jedis.watch(kcKey);

        // 4 获取库存，如果库存为null，秒杀还没有开始
        String kc = jedis.get(kcKey);
        if (kc == null && "".equals(kc.trim())) {
            System.out.println("秒杀还没有开始，请等待！");
            jedis.close();
            return "秒杀还没有开始，请等待！";
        }

        // 5 判断用户是否重复秒杀操作
        if (jedis.sismember(userKey, uid)) {
            System.out.println("已经秒杀成功了，不能重复秒杀！");
            jedis.close();
            return "已经秒杀成功了，不能重复秒杀！";
        }

        // 6 判断如果商品库存数量小于1，秒杀结束
        if (Integer.parseInt(kc) <= 0) {
            System.out.println("秒杀已经结束了！");
            jedis.close();
            return "秒杀已经结束了！";
        }

        // 7 秒杀过程
        // 使用事务 ***【乐观锁change2】***
        Transaction multi = jedis.multi();

        // 组队操作 ***【乐观锁change3】***
        // 库存-1
        multi.decr(kcKey);
        // 把秒杀成功用户添加清单里面
        multi.sadd(userKey, uid);

        // 执行事务 ***【乐观锁change4】***
        List<Object> results = multi.exec();
        // 判断提交事务是否失败
        if (results == null || results.size() == 0) {
            System.out.println("秒杀失败了....");
            jedis.close();
            return "秒杀失败了....";
        }

        System.out.println("秒杀成功了...");
        jedis.close();
        return "秒杀成功了...";
    }
}
```

## 5. 继续增加并发测试

### 5.1 连接有限制

如果测试过程中出现 `apr_socket_recv: Connection refused (111)` 的提示

解决方案：增加 -r 参数【-r，Don't exit on socket receive errors】

### 5.2 连接超时，通过连接池解决

![image-20211119214528176](http://img.hl1015.top/blog/image-20211119214528176.png)

为了节省每次连接 redis 服务带来的消耗，把连接好的实例反复利用，通过参数管理连接的行为。

（1）依赖

```xml
<!-- jedis -->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>2.9.0</version>
</dependency>
```

（2）连接池工具类

- 连接池参数

  - **maxTotal**：控制一个 pool 可分配多少个 jedis 实例，通过pool.getResource() 来获取；如果赋值为 -1，则表示不限制；如果 pool 已经分配了 maxTotal 个 jedis 实例，则此时 pool 的状态为 exhausted
  - **maxIdle**：控制一个 pool 最多有多少个状态为 idle（空闲）的 jedis 实例
  - **maxWaitMills**：表示当 borrow 一个 jedis 实例时，最大的等待毫秒数，如果超过等待时间，则直接抛 JedisConnectionException
  - **testOnBorrow**：获得一个 jedis 实例的时候是否检查连接可用性（ping()），如果为 true，则得到的 jedis 实例均是可用的

- 工具类代码

  - ```java
    public class JedisPoolUtil {
    
        private static volatile JedisPool jedisPool = null;
    
        private JedisPoolUtil() {
        }
    
        public static JedisPool getJedisPoolInstance() {
            if (null == jedisPool) {
                synchronized (JedisPoolUtil.class) {
                    if (null == jedisPool) {
                        JedisPoolConfig poolConfig = new JedisPoolConfig();
                        poolConfig.setMaxTotal(200);
                        poolConfig.setMaxIdle(32);
                        poolConfig.setMaxWaitMillis(100 * 1000);
                        poolConfig.setBlockWhenExhausted(true);
                        poolConfig.setTestOnBorrow(true); // ping PONG
    
                        jedisPool = new JedisPool(poolConfig, "ip地址", 6379, 60000, "*****");
                    }
                }
            }
            return jedisPool;
        }
    
        public static void release(JedisPool jedisPool, Jedis jedis) {
            if (null != jedis) {
                jedisPool.returnResource(jedis);
            }
        }
    }
    ```

- 模拟秒杀代码 **连接 jedis** 改造

  - ```java
    // 2 连接redis
    // 通过连接池得到 jedis 对象
    JedisPool jedisPoolInstance = JedisPoolUtil.getJedisPoolInstance();
    Jedis jedis = jedisPoolInstance.getResource();
    ```

### 5.3 已经秒光，可是还有库存

将 redis 中关于 prodid = 1001 的库存设为 200

![image-20211119222011447](http://img.hl1015.top/blog/image-20211119222011447.png)

然后再次通过 ab 工具进行并发测试

```shell
ab -n 1000 -c 100 http://192.168.81.1:6666/doSecKill?prodid=1001
```

控制台打印结果：

![image-20211119222351856](http://img.hl1015.top/blog/image-20211119222351856.png)

查看 redis 中关于 prodid = 1001 的库存

![image-20211119222535033](http://img.hl1015.top/blog/image-20211119222535033.png)

可以发现已经秒光了，可是还有库存。

原因：乐观锁导致很多请求都失败【先点的没秒到，后点的可能秒到了】

## 6. 解决库存遗留问题

### 6.1 LUA 脚本

![image-20211120135431048](http://img.hl1015.top/blog/image-20211120135431048.png)

Lua 是一个小巧的脚本语言，Lua 脚本可以很容易地被 C/C++ 代码调用，也可以反过来调用 C/C++ 的函数，Lua 并没有提供强大的库，一个完整的 Lua 解释器不过 200 k，所以 Lua 不适合作为开发独立应用程序的语言，而是作为<span style="color:red">嵌入式脚本语言</span>。

很多应用程序、游戏使用 Lua 作为自己的嵌入式脚本语言，以此来实现可配置性、可扩展性。

这其中包括魔兽争霸地图、魔兽世界、博德之门、愤怒的小鸟等众多游戏插件或外挂。

学习地址：[https://www.w3cschool.cn/lua/](https://www.w3cschool.cn/lua/)

### 6.2 LUA 脚本在 Redis 中的优势

将复杂的或者多步的 redis 操作，写为一个脚本，一次提交给 redis 执行，减少反复连接 redis 的次数，提升性能。

<span style="color:blue">Lua 脚本类似 redis 事务，有一定的原子性，不会被其他命令插队，可以完成一些 redis 事务性的操作，但是注意 redis 的 lua 脚本功能，只有在 Redis 2.6 以上的版本才可以使用。--- 可以利用 lua 脚本淘汰用户，解决超卖问题</span>

redis 2.6 版本以后，通过 lua 脚本解决<span style="color:red">**争抢问题**</span>，实际上是 <span style="color:red">**redis 利用其单线程的特性，用任务队列的方式解决多任务并发的问题**</span>。

![image-20211120151039256](http://img.hl1015.top/blog/image-20211120151039256.png)

## 7. 秒杀案例代码

回顾上面的秒杀代码：

- 第一版：简单版（使用 ab 工具模拟并发测试时，出现了超卖现象，库存出现复数）
- 第二版：连接池解决超时问题
- 第三版：加事务-乐观锁（解决超卖），但出现遗留库存
- 第四版：使用 Lua 脚本解决库存遗留问题（看下面实现）

### 解决库存遗留问题 --- LUA 脚本

lua 脚本：

```lua
local userid=KEYS[1]; 
local prodid=KEYS[2];
local qtkey="sk:"..prodid..":qt";
local usersKey="sk:"..prodid.":usr'; 
local userExists=redis.call("sismember",usersKey,userid);
if tonumber(userExists)==1 then 
  return 2;
end
local num= redis.call("get" ,qtkey);
if tonumber(num)<=0 then 
  return 0; 
else 
  redis.call("decr",qtkey);
  redis.call("sadd",usersKey,userid);
end
return 1;
```

模拟秒杀过程代码改造：

```java
// lua 脚本
static String secKillScript = "local userid=KEYS[1];\r\n" +
		"local prodid=KEYS[2];\r\n" +
		"local qtkey='sk:'..prodid..\":qt\";\r\n" +
		"local usersKey='sk:'..prodid..\":usr\";\r\n" +
		"local userExists=redis.call(\"sismember\",usersKey,userid);\r\n" +
		"if tonumber(userExists)==1 then \r\n" +
		"   return 2;\r\n" +
		"end\r\n" +
		"local num= redis.call(\"get\" ,qtkey);\r\n" +
		"if tonumber(num)<=0 then \r\n" +
		"   return 0;\r\n" +
		"else \r\n" +
		"   redis.call(\"decr\",qtkey);\r\n" +
		"   redis.call(\"sadd\",usersKey,userid);\r\n" +
		"end\r\n" +
		"return 1";

// 使用 lua 脚本模拟秒杀过程
public static String doSecKillWithLuaScript(String uid, String prodid) throws IOException {

	JedisPool jedispool = JedisPoolUtil.getJedisPoolInstance();
	Jedis jedis = jedispool.getResource();
	String sha1 = jedis.scriptLoad(secKillScript);
	Object result = jedis.evalsha(sha1, 2, uid, prodid);

	String reString = String.valueOf(result);
	String res;
	if ("0".equals(reString)) {
		System.err.println("已抢空！！");
		res = "已抢空！！";
	} else if ("1".equals(reString)) {
		System.out.println("抢购成功！！！！");
		res = "抢购成功！！！！";
	} else if ("2".equals(reString)) {
		System.err.println("该用户已抢过！！");
		res = "该用户已抢过！！";
	} else {
		System.err.println("抢购异常！！");
		res = "抢购异常！！";
	}
	jedis.close();
	return res;
}
```

再次使用 ab 工具进行并发模拟测试，redis 中关于 prodid = 1001 的库存设置为 500

```shell
ab -n 1000 -c 100 http://192.168.81.1:6666/doSecKillWithLuaScript?prodid=1001
```

![image-20211120155944259](http://img.hl1015.top/blog/image-20211120155944259.png)

控制台打印结果：

![image-20211120172317012](http://img.hl1015.top/blog/image-20211120172317012.png)

查看 redis 中关于 prodid = 1001 的库存：

![image-20211120172406305](http://img.hl1015.top/blog/image-20211120172406305.png)