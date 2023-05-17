---
title: 与 SpringBoot 整合
date: 2021-12-11
category: Redis
tag:
 - Redis
---

> SpringBoot 整合 Redis 非常简单，只需要按如下步骤整合即可！！！

## 1. 整合步骤

**（1）在 pom.xml 文件中引入 redis 相关依赖**

```xml
<!-- redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- spring2.X 集成 redis 所需 common-pool2 -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
    <version>2.6.0</version>
</dependency>
```

**（2）application.properties 配置 redis**

```properties
# Redis 服务器地址
spring.redis.host=服务器ip地址
# Redis 服务器连接端口
spring.redis.port=6379
# Redis 服务器密码
spring.redis.password=*****
# Redis 数据库索引（默认为0）
spring.redis.database=0
# 连接超时时间（毫秒）
spring.redis.timeout=1800000
# 连接池最大连接数（使用负值表示没有限制）
spring.redis.lettuce.pool.max-active=20
# 最大阻塞等待时间（负数表示没限制）
spring.redis.lettuce.pool.max-wait=-1
# 连接池中的最大空闲连接
spring.redis.lettuce.pool.max-idle=5
# 连接池中的最小空闲连接
spring.redis.lettuce.pool.min-idle=0
```

**（3）添加 redis 配置类**

```java
@EnableCaching
@Configuration
public class RedisConfig extends CachingConfigurerSupport {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        RedisSerializer<String> redisSerializer = new StringRedisSerializer();
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        template.setConnectionFactory(factory);
        // key 序列化方式
        template.setKeySerializer(redisSerializer);
        // value 序列化
        template.setValueSerializer(jackson2JsonRedisSerializer);
        // value hashmap 序列化
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        return template;
    }

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisSerializer<String> redisSerializer = new StringRedisSerializer();
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        // 解决查询缓存转换异常的问题
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        // 配置序列化（解决乱码的问题）,过期时间600秒
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(600))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(redisSerializer))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(jackson2JsonRedisSerializer))
                .disableCachingNullValues();
        RedisCacheManager cacheManager = RedisCacheManager.builder(factory)
                .cacheDefaults(config)
                .build();
        return cacheManager;
    }
}
```

**（4）测试一下**

RedisTestController 中添加测试方法

```java
@RestController
public class RedisTestController {

    @Autowired
    private RedisTemplate redisTemplate;

    @GetMapping("/redisTest")
    public String testRedis() {
        // 设置值到 redis
        redisTemplate.opsForValue().set("name", "hkw");
        // 从 redis 获取值
        String name = (String) redisTemplate.opsForValue().get("name");
        return name;
    }
}
```

![image-20211118215616319](http://img.hl1015.top/blog/image-20211118215616319.png)