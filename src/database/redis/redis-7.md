---
title: Jedis 测试
date: 2021-12-11
category: Redis
tag:
 - Redis
---

## 1. Jedis 需要的 jar 包

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.2.0</version>
</dependency>
```

## 2. 连接 Redis 注意事项

**（1）禁用 Linux 的防火墙**

Linux（CentOS7）里执行命令：

```
systemctl stop / disable firewalld.service
```

禁用后，查看防火墙状态：`systemctl status firewalld.service`

![image-20211118140925036](http://img.hl1015.top/blog/image-20211118140925036.png)

**（2）redis.conf 中注释掉 bind 127.0.0.1，然后将 protected-mode yes 改为 no**

## 3. Jedis 常用操作

### 3.1 创建一个 Maven 工程，并在 pom.xml 文件中添加 jedis 依赖

![image-20211118142140217](http://img.hl1015.top/blog/image-20211118142140217.png)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.hl1015</groupId>
    <artifactId>jedisDemo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>redis.clients</groupId>
            <artifactId>jedis</artifactId>
            <version>3.2.0</version>
        </dependency>
    </dependencies>
</project>
```

### 3.2 创建测试程序

```java
public class Demo01 {
    public static void main(String[] args) {
        Jedis jedis = new Jedis("ip地址", 6379);
        jedis.auth("*****");
        String pong = jedis.ping();
        System.out.println("连接成功：" + pong);
        jedis.close();
    }
}
```

![image-20211118151325850](http://img.hl1015.top/blog/image-20211118151325850.png)

## 4. 测试相关数据类型

### 4.1 Jedis_API：Key

```java
public static void main(String[] args) {
    Jedis jedis = new Jedis("ip地址", 6379);
    jedis.auth("*****");
    
    jedis.set("k1", "v1");
    jedis.set("k2", "v2");
    jedis.set("k3", "v3");
    Set<String> keys = jedis.keys("*");
    System.out.println(keys.size());
    for (String key : keys) {
        System.out.println(key);
    }
    System.out.println(jedis.exists("k1"));
    System.out.println(jedis.ttl("k1"));
    System.out.println(jedis.get("k1"));

    jedis.close();
}
```

### 4.2 Jedis_API：String

```java
public static void main(String[] args) {
    Jedis jedis = new Jedis("ip地址", 6379);
    jedis.auth("*****");
    
    jedis.mset("str1", "v1", "str2", "v2", "str3", "v3");
	System.out.println(jedis.mget("str1", "str2", "str3"));

    jedis.close();
}
```

### 4.3 Jedis_API：List

```java
public static void main(String[] args) {
    Jedis jedis = new Jedis("ip地址", 6379);
    jedis.auth("*****");
    
    jedis.rpush("mylist", "e1", "e2", "e3", "e4");
    List<String> list = jedis.lrange("mylist", 0, -1);
    for (String element : list) {
        System.out.println("element = " + element);
    }

    jedis.close();
}
```

### 4.4 Jedis_API：Set

```java
public static void main(String[] args) {
    Jedis jedis = new Jedis("ip地址", 6379);
    jedis.auth("*****");
    
    jedis.sadd("orders", "order01");
    jedis.sadd("orders", "order02");
    jedis.sadd("orders", "order03");
    jedis.sadd("orders", "order04");
    Set<String> smembers = jedis.smembers("orders");
    for (String order : smembers) {
        System.out.println("order = " + order);
    }
    Long srem = jedis.srem("orders", "order02");
    System.out.println("srem = " + srem);

    jedis.close();
}
```

### 4.5 Jedis_API：Hash

```java
public static void main(String[] args) {
    Jedis jedis = new Jedis("ip地址", 6379);
    jedis.auth("*****");
    
    jedis.hset("hash1", "username", "zhangsan");
    System.out.println(jedis.hget("hash1", "username"));
    Map<String, String> map = new HashMap<>();
    map.put("telephone", "13111111111");
    map.put("address", "浙江省余杭区");
    map.put("email", "test@163.com");
    jedis.hmset("hash2", map);
    List<String> result = jedis.hmget("hash2", "telephone", "email");
    for (String element : result) {
        System.out.println("element = " + element);
    }

    jedis.close();
}
```

### 4.6 Jedis_API：ZSet

```java
public static void main(String[] args) {
    Jedis jedis = new Jedis("ip地址", 6379);
    jedis.auth("*****");
    
    jedis.zadd("zset1", 100d, "q1");
    jedis.zadd("zset1", 90d, "w2");
    jedis.zadd("zset1", 80d, "e3");
    jedis.zadd("zset1", 70d, "r4");
    Set<String> zrange = jedis.zrange("zset1", 0, -1);
    for (String element : zrange) {
        System.out.println("element = " + element);
    }

    jedis.close();
}
```

