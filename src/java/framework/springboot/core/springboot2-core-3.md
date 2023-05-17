---
title: 数据访问
date: 2021-09-08
category: 常用框架
tag:
  - SpringBoot 核心
---

## 1. SQL

### 1.1 数据源的自动配置 - <span style="color:red">HikariDataSource</span>

#### 1.1.1 导入 JDBC 场景

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-jdbc</artifactId>
</dependency>
```

![image-20210906085538247](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210906085538247.png)

`数据库驱动`？为什么导入 JDBC 场景，官方不导入驱动？官方不知道我们接下来要操作什么数据库。

**`数据库版本和驱动版本对应`**

```xml
默认版本：<mysql.version>8.0.22</mysql.version>

想要修改版本
1、直接依赖引入具体版本（maven的就近依赖原则）
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
	<!--<version>5.1.49</version>-->
</dependency>
2、重新声明版本（maven的属性的就近优先原则）
<properties>
	<java.version>1.8</java.version>
	<mysql.version>5.1.49</mysql.version>
</properties>
```

#### 1.1.2 分析自动配置

- DataSourceAutoConfiguration：数据源的自动配置
  - 修改数据源相关的配置：**spring.datasource**
  - **数据库连接池的配置，是自己容器中没有 DataSource 才自动配置的**
  - 底层配置好的连接池是：**<span style="color:red">HikariDataSource</span>**
- DataSourceTransactionManagerAutoConfiguration：事务管理器的自动配置
- JdbcTemplateAutoConfiguration：**JdbcTemplate 的自动配置，可以来对数据进行 crud**
  - `可以修改这个配置项 @ConfigurationProperties(prefix="spring.jdbc")` 来修改 JdbcTemplate
  - `@Bean @Primary` JdbcTemplate；容器中有这个组件
- JndiDataSourceAutoConfiguration：jndi 的自动配置
- XADataSourceAutoConfiguration：分布式事务相关的

#### 1.1.3 修改配置项

```yaml
datasource:
    url: jdbc:mysql://localhost:3306/hl_blog?useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
```

#### 1.1.4 测试

```java
@Slf4j
@SpringBootTest
class SpringBoot2BuildDemoApplicationTests {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void contextLoads() {
        Long aLong = jdbcTemplate.queryForObject("select count(*) from article", Long.class);
        log.info("记录总数：{}", aLong);
    }
}
```

### 1.2 使用 Druid 数据源

#### 1.2.1 druid 官方 github 地址

[https://github.com/alibaba/druid](https://github.com/alibaba/druid)

整合第三方技术的两种方式：1.自定义 2.找 starter

#### 1.2.2 自定义方式

##### 1、创建数据源

```xml
<dependency>
	<groupId>com.alibaba</groupId>
	<artifactId>druid</artifactId>
	<version>1.1.17</version>
</dependency>
```

```xml
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource" destroy-method="close">
		<property name="url" value="${jdbc.url}" />
		<property name="username" value="${jdbc.username}" />
		<property name="password" value="${jdbc.password}" />
		<property name="maxActive" value="20" />
		<property name="initialSize" value="1" />
		<property name="maxWait" value="60000" />
		<property name="minIdle" value="1" />
		<property name="timeBetweenEvictionRunsMillis" value="60000" />
		<property name="minEvictableIdleTimeMillis" value="300000" />
		<property name="testWhileIdle" value="true" />
		<property name="testOnBorrow" value="false" />
		<property name="testOnReturn" value="false" />
		<property name="poolPreparedStatements" value="true" />
		<property name="maxOpenPreparedStatements" value="20" />
</bean>
```

##### 2、StatViewServlet

StatViewServlet 的用途包括：1.提供监控信息展示的 html 页面 2.提供监控信息的 JSON API

```xml
<servlet>
	<servlet-name>DruidStatView</servlet-name>
	<servlet-class>com.alibaba.druid.support.http.StatViewServlet</servlet-class>
</servlet>
<servlet-mapping>
	<servlet-name>DruidStatView</servlet-name>
	<url-pattern>/druid/*</url-pattern>
</servlet-mapping>
```

##### 3、StatFilter

用于统计监控信息，如 SQL 监控、URI 监控

```xml
需要给数据源中配置如下属性；可以允许多个 filter，多个用,分割；如：

<property name="filters" value="stat,slf4j" />
```

系统中所有 filter

|     别名      |                      Filter 类名                       |
| :-----------: | :----------------------------------------------------: |
|    default    |        com.alibaba.druid.filter.stat.StatFilter        |
|     stat      |        com.alibaba.druid.filter.stat.StatFilter        |
|   mergeStat   |     com.alibaba.druid.filter.stat.MergeStatFilter      |
|   encoding    | com.alibaba.druid.filter.encoding.EncodingConverFilter |
|     log4j     |      com.alibaba.druid.filter.logging.Log4jFilter      |
|    log4j2     |     com.alibaba.druid.filter.logging.Log4j2Filter      |
|     slf4j     |    com.alibaba.druid.filter.logging.Slf4jLogFilter     |
| commonlogging |   com.alibaba.druid.filter.logging.CommonsLogFilter    |

**慢 sql 记录配置**

```xml
<bean id="stat-filter" class="com.alibaba.druid.filter.stat.StatFilter">
	<!--使用 slowSqlMillis 定义慢SQL的时长-->
    <property name="slowSqlMillis" value="10000" />
    <property name="logSlowSql" value="true" />
</bean>
```

#### 1.2.3 使用 官方 starter 方式

##### 1、引入 druid-starter

```xml
<dependency>
	<groupId>com.alibaba</groupId>
	<artifactId>druid-spring-boot-starter</artifactId>
	<version>1.1.17</version>
</dependency>
```

##### 2、分析自动配置

- 扩展配置项：**spring.datasource.druid**

- DruidSpringAopConfiguration.class，监控 SpringBean 的配置项：**spring.datasource.druid.aop-patterns**

- DruidStatViewConfiguration.class，监控页的配置：**spring.datasource.druid.stat-view-servlet（默认开启）**

- DruidWebStatFilterConfiguration.class，web 监控配置：**spring.datasource.druid.web-stat-filter（默认开启）**

- DruidFilterConfiguration.class：所有 Druid 自己 filter 的配置

  ```java
  private static final String FILTER_STAT_PREFIX = "spring.datasource.druid.filter.stat";
  private static final String FILTER_CONFIG_PREFIX = "spring.datasource.druid.filter.config";
  private static final String FILTER_ENCODING_PREFIX = "spring.datasource.druid.filter.encoding";
  private static final String FILTER_SLF4J_PREFIX = "spring.datasource.druid.filter.slf4j";
  private static final String FILTER_LOG4J_PREFIX = "spring.datasource.druid.filter.log4j";
  private static final String FILTER_LOG4J2_PREFIX = "spring.datasource.druid.filter.log4j2";
  private static final String FILTER_COMMONS_LOG_PREFIX = "spring.datasource.druid.filter.commons-log";
  private static final String FILTER_WALL_PREFIX = "spring.datasource.druid.filter.wall";
  ```

##### 3、配置示例

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/db_account
    username: root
    password: 123456
    driver-class-name: com.mysql.jdbc.Driver

    druid:
      aop-patterns: com.atguigu.admin.*  # 监控 SpringBean
      filters: stat,wall     # 底层开启功能，stat（sql监控），wall（防火墙）

      stat-view-servlet:   # 配置监控页功能
        enabled: true
        login-username: admin
        login-password: admin
        resetEnable: false

      web-stat-filter:  # 监控 web
        enabled: true
        urlPattern: /*
        exclusions: '*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*'


      filter:
        stat:    # 对上面 filters 里面的 stat 的详细配置
          slow-sql-millis: 1000
          logSlowSql: true
          enabled: true
        wall:
          enabled: true
          config:
            drop-table-allow: false
```

SpringBoot配置示例

[https://github.com/alibaba/druid/tree/master/druid-spring-boot-starter](https://github.com/alibaba/druid/tree/master/druid-spring-boot-starter)

配置项列表

[https://github.com/alibaba/druid/wiki/DruidDataSource配置属性列表](https://github.com/alibaba/druid/wiki/DruidDataSource%E9%85%8D%E7%BD%AE%E5%B1%9E%E6%80%A7%E5%88%97%E8%A1%A8)

### 1.3 整合 MyBatis 操作

[https://github.com/mybatis](https://github.com/mybatis)
SpringBoot 官方的 Starter：spring-boot-starter-*
第三方的：*-spring-boot-starter

```xml
<dependency>
	<groupId>org.mybatis.spring.boot</groupId>
	<artifactId>mybatis-spring-boot-starter</artifactId>
	<version>2.1.4</version>
</dependency>
```

![image-20210907110945285](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210907110945285.png)

#### 1.3.1 配置模式

- 全局配置文件
- SqlSessionFactory：自动配置好了
- SqlSession：**自动配置了 SqlSessionTemplate 组合了 SqlSession**
- **`@Import`(AutoConfiguredMapperScannerRegistrar.class)**
- Mapper：只要我们操作 MyBatis 的接口标注了 **@Mapper** 就会被自动扫描进来

```java
@EnableConfigurationProperties(MybatisProperties.class) // MyBatis 配置项绑定类。
@AutoConfigureAfter({ DataSourceAutoConfiguration.class, MybatisLanguageDriverAutoConfiguration.class })
public class MybatisAutoConfiguration{}
```

```java
@ConfigurationProperties(prefix = "mybatis")
public class MybatisProperties {}
```

可以修改配置文件中 mybatis 开头的所有配置

```yaml
# 配置 mybatis 规则
mybatis:
  config-location: classpath:mybatis/mybatis-config.xml  # 全局配置文件位置
  mapper-locations: classpath:mybatis/mapper/*.xml  # sql映射文件位置
```

```java
@Mapper
public interface ArticleMapper {
    Integer count();
}
```

```xml
<!--Mapper 接口 ---》 绑定 xml-->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.hkw.demo.mapper.ArticleMapper">
    <!--Integer count();-->
    <select id="count" resultType="java.lang.Integer">
        select count(*) from article
    </select>
</mapper>
```

**配置 mybatis.configuration 下的所有，相当于改 mybatis 的全局配置文件中的值**

```yaml
# 配置mybatis规则
mybatis:
  # config-location: classpath:mybatis/mybatis-config.xml
  mapper-locations: classpath:mybatis/mapper/*.xml
  configuration: # 可以不写全局配置文件，所有全局配置文件的配置都放在 configuration 配置项中即可★★★
    map-underscore-to-camel-case: true
```

**总结：**

- 导入 MyBatis 官方 starter
- 编写 mapper 接口，标注 @Mapper 注解
- 编写 sql 映射文件并绑定 mapper 接口
- 在 application.yaml 中指定 Mapper 配置文件的位置，以及指定全局配置文件的信息（建议：**配置在 mybatis.configuration**）

#### 1.3.2 注解模式

```java
@Select("select title from article where article_id = #{id}")
String findArticleTitle(Integer id);
```

#### 1.3.3 混合模式

```java
@Mapper
public interface ArticleMapper {

    Integer count();

    @Select("select title from article where article_id = #{id}")
    String findArticleTitle(Integer id);
}
```

**最佳实战：**

- 引入 mybatis-starter
- **配置 application.yaml，指定 mapper-location 位置即可**
- 编写 Mapper 接口并标注 @Mapper 注解
- 简单方法直接注解方式
- 复杂方法编写 mapper.xml 进行绑定映射
- 使用`@MapperScan("com.hkw.demo.mapper")` 简化，其他的接口就可以不用标注 @Mapper 注解

### 1.4 整合 MyBatis-Plus 完成 CRUD

#### 1.4.1 什么是 MyBatis-Plus

[MyBatis-Plus](https://github.com/baomidou/mybatis-plus) （简称 MP）是一个 [MtBatis](https://mybatis.org/mybatis-3/) 的增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。

[MyBatis-Plus 官网](https://baomidou.com/)

> 建议安装 **MyBatisX** 插件

#### 1.4.2 整合 MyBatis-Plus

```xml
<dependency>
	<groupId>com.baomidou</groupId>
	<artifactId>mybatis-plus-boot-starter</artifactId>
	<version>3.4.1</version>
</dependency>
```

自动配置：

- MybatisPlusAutoConfiguration 配置类，MybatisPlusProperties 配置项绑定。**mybatis-plus: xxx 就是对 mybatis-plus 的定制**
- **SqlSessionFactory 自动配置好，底层是容器中默认的数据源**
- mapperLocations 自动配置好的。`有默认值classpath*:/mapper/**/*.xml`（**代表任意的类路径下的所有 mapper 文件夹下任意路径下的所有的 xml 都是 sql 映射文件。建议以后 sql 映射文件，都放在 mapper 下**）
- **容器中也自动配置好了 SqlSessionTemplate**
- **@Mapper 标注的接口也会被自动扫描，建议直接 `@MapperScan("com.hkw.demo.mapper")` 批量扫描就行**

优点：只需要我们的 Mapper 继承 **BaseMapper** 就可以拥有 crud 能力

#### 1.4.3 CRUD 功能

```java
@Mapper
public interface ArticleMapper extends BaseMapper<Article> {
```

```java
@Service
public class ArticleServiceImpl extends ServiceImpl<ArticleMapper, Article> implements ArticleService {
```

```java
public interface ArticleService extends IService<Article> {
```

```java
@RestController
@RequestMapping("/article")
public class ArticleConroller {

    @Autowired
    private ArticleService articleService;

    @PostMapping("/save")
    public String save(@RequestBody Article article) {
        boolean save = articleService.save(article);
        if (!save) return "失败";
        return "成功";
    }

    @Delete("/remove")
    public String remove(Integer id) {
        boolean remove = articleService.removeById(id);
        if (!remove) return "失败";
        return "成功";
    }

    @PutMapping("/update")
    public String update(@RequestBody Article article) {
        boolean update = articleService.updateById(article);
        if (!update) return "失败";
        return "成功";
    }

    @GetMapping("/list")
    public List<Article> list() {
        return articleService.list();
    }
}
```

## 2. NoSQL

Redis 是一个开源（BSD 许可）的，内存中的数据结构存储系统，它可以用作数据库、缓存和消息中间件。它支持多种类型的数据结构，如 `字符串(strings)，散列（hashes）、列表（list），集合（sets），有序集合（sorted sets）`与范围查询，`bitmaps，htperloglogs` 和 `地理空间（geospatial）`索引半径查询。Redis 内置了 `复制（replication），LUA 脚本（lua scripting），LRU 驱动事件（LRU eviction），事务（transactions）`和不同级别的 `磁盘持久化（persistence）`，并通过 `Redis 哨兵（Sentinel）`和自动 `分区（Cluster）`提供高可用性（high availavility）

### 2.1 Redis 自动配置

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

![image-20210907145811435](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210907145811435.png)

自动配置：

- RedisAutoConfiguration 自动配置类，RedisProperties 属性类 ---> **spring.redis.xxx 是对 redis 的配置**

  ```yaml
  spring:
    redis:
        host: xxx
        port: 6379
        password: xxx
  ```

  连接工厂是准备好的。**LettuceConnectionConfiguration、JedisConnectionConfiguration**

- **自动注入了 RedisTemplate<`Object, Object`>：xxxTemplate**

- **自动注入了 StringRedisTemplate：k，v 都是 String**

- **底层只要我们使用 StringRedisTemplate、RedisTemplate 就可以操作 redis**

**redis 环境搭建：**

1. **阿里云按量付费 redis，经典网络**
2. **申请 redis 的公网连接地址**
3. **修改白名单，允许 0.0.0.0/0 访问**

### 2.2 RedisTemplate

```java
@Test
public void testRedis() {
	ValueOperations<String, String> operations = redisTemplate.opsForValue();
	operations.set("hello", "world");

	String helloValue = operations.get("hello");
	log.info("k: hello, v: {}", helloValue);
}
```

### 2.3 切换至 Jedis

```xml
<!--导入jedis-->
<dependency>
	<groupId>redis.clients</groupId>
	<artifactId>jedis</artifactId>
</dependency>
```

```yaml
spring:
  redis:
      host: xxx
      port: 6379
      password: xxx
	  client-type: jedis
      jedis:
        pool:
          max-active: 10
```

