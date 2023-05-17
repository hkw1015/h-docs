---
title: 了解自动配置原理
date: 2021-09-08
category: 常用框架
tag:
  - SpringBoot 基础
---

## 1. SpringBoot 特点

### 1.1 依赖管理

- **父工程做依赖管理**

  ```xml
  <!--依赖管理-->
  <parent>
  	<groupId>org.springframework.boot</groupId>
  	<artifactId>spring-boot-starter-parent</artifactId>
  	<version>2.3.4.RELEASE</version>
  </parent>
  
  <!--它的父项目-->
   <parent>
  	<groupId>org.springframework.boot</groupId>
  	<artifactId>spring-boot-dependencies</artifactId>
  	<version>2.3.4.RELEASE</version>
  </parent>
  
  <!--几乎声明了所有开发中常用的依赖的版本号,自动版本仲裁机制-->
  ```

- **开发导入 starter 场景启动器**

  1、见到很多 spring-boot-starter-* ： *就某种场景

  2、只要引入starter，这个场景的所有常规需要的依赖我们都自动引入

  3、SpringBoot 所有支持的 [场景](https://docs.spring.io/spring-boot/docs/current/reference/html/using-spring-boot.html#using-boot-starter)

  4、见到的  *-spring-boot-starter： 第三方为我们提供的简化开发的场景启动器。
  
  5、所有场景启动器最底层的依赖

  ```xml
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <version>2.3.4.RELEASE</version>
    <scope>compile</scope>
  </dependency>
  ```

- **无需关注版本号，自动版本仲裁**

  1、引入依赖默认都可以不写版本

  2、引入非版本仲裁的 jar，要写版本号

- **可以修改默认版本号**

  1、查看 spring-boot-dependencies 里面规定当前依赖的版本用的 key

  2、在当前项目里面重写配置

  ```xml
  <properties>
  	<mysql.version>5.1.43</mysql.version>
  </properties>
  ```

### 1.2 自动配置

- **自动配好 Tomcat**

  - 引入 Tomcat 依赖
  - 配置 Tomcat

  ```xml
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <version>2.3.4.RELEASE</version>
    <scope>compile</scope>
  </dependency>
  ```

- **自动配好 SpringMVC**

  - 引入 SpringMVC 全套组件
  - 自动配好 SpringMVC 常用组件（功能）

- **自动配好 Web 常见功能，如：字符编码问题**

  - SpringBoot 帮我们配置好了所有 web 开发的常见场景

- **默认的包结构**

  - 主程序所在包及其下面的所有子包里面的组件都会被默认扫描进来

  - 无需以前的包扫描配置

  - 想要改变扫描路径

    - @SpringBootApplication(scanBasePackages="***")

    - 或者 @ComponentScan 指定扫描路径

      ```java
      @SpringBootApplication
      // 等同于
      @SpringBootConfiguration
      @EnableAutoConfiguration
      @ComponentScan("com.atguigu.boot")
      ```

- **各种配置拥有默认值**

  - 默认配置最终都是映射到某个类上，如：MultipartProperties
  - 配置文件的值最终会绑定到某个类上，这个类会在容器中创建对象

- **按需加载所有自动配置项**

  - 非常多的 starter
  - 引入了哪些场景，这个场景的自动配置才会开启
  - SpringBoot 所有的自动配置功能都在 spring-boot-autoconfigure 包里面

- **......**

## 2. 容器功能

### 2.1 组件添加

#### 1、@Configuration

- 基本使用

- Full 模式与 Lite 模式
  - 实例
  - 最佳实战
    - 配置类组件之间无依赖关系用 Lite 模式加速容器启动过程，减少判断
    - 配置类组件之间有依赖关系，方法会被调用得到之前单实例组件，用 Full 模式
  
  ```java
  /**
   * 1、配置类里面使用 @Bean 标注在方法上给容器注册组件，默认也是单实例的
   * 2、配置类本身也是组件
   * 3、proxyBeanMethods：代理 bean 的方法
   *    Full（proxyBeanMethods = true）：保证每个 @Bean 方法被调用多少次返回的组件都是单实例的
   *    Lite（proxyBeanMethods = false）：每个 @Bean 方法被调用多少次返回的组件都是新创建的
   *    组件依赖时必须使用 Full 模式（默认），其他视情况开启 Lite 模式（proxyBeanMethods = false）
   */
  @Configuration(proxyBeanMethods = true) // 告诉 SpringBoot 这是一个配置类（== 配置文件）
  public class MyConfig {
  
      @Bean("user01")
      public User user() {
          User user = new User("hkw", 23);
          user.setPet(pet());
          return user;
      }
  
      @Bean("myPet01")
      public Pet pet() {
          Pet pet = new Pet("myPet01");
          return pet;
      }
  }
  ```
  
  ```java
  @SpringBootApplication
  public class MainApplication {
  
      public static void main(String[] args) {
          // 返回 IOC 容器
          ConfigurableApplicationContext run = SpringApplication.run(MainApplication.class, args);
  
          // 查看容器中的组件
          String[] beanDefinitionNames = run.getBeanDefinitionNames();
          for (String definitionName : beanDefinitionNames) {
              System.out.println(definitionName);
          }
  
          System.out.println("====================从容器中获取组件====================");
  
          // 从容器中获取组件
          // 如果 @Configuration(proxyBeanMethods = true) 代理对象调用方法，SpringBoot 总会检查这个组件在容器中是否有，来保证组件单实例
          User user1 = run.getBean("user01", User.class);
          User user2 = run.getBean("user01", User.class);
          System.out.println("user01=" + user1);
          System.out.println(user1 == user2); // true
  
          Pet pet = run.getBean("myPet01", Pet.class);
          System.out.println("myPet01=" + pet);
  
          // proxyBeanMethods = true 时：true
          // proxyBeanMethods = true 时：false
          System.out.println(user1.getPet() == pet);
  
          // proxyBeanMethods = true 时：
          // myConfig=com.hkw.springboot2.config.MyConfig$$EnhancerBySpringCGLIB$$447db02b@43d455c9
          // proxyBeanMethods = false 时：
          // myConfig=com.hkw.springboot2.config.MyConfig@7f34a967
          MyConfig myConfig = run.getBean(MyConfig.class);
          System.out.println("myConfig=" + myConfig);
      }
  }
  ```

#### 2、@Bean、@Component、@Controller、@Service、@Repository

> @Controller 控制层类，@Service 业务层类，@Repository 持久层类，@Component 无法归类到前 3 种时就称为组件。

#### 3、@ComponentScan、@Import

```java
// 开启包扫描并设置扫描路径
@ComponentScan(value = "com.hkw")
// 给容器中自动创建出这两个类型的组件，默认组件的名字就是全类名
@Import({User.class, DBHelper.class})
```

[@Import 高级用法](https://www.bilibili.com/video/BV1gW411W7wy?p=8)

#### 4、@Conditional

> 条件装配：满足 Conditioinal 指定的条件，则进行组件注入

![image-20210828132236210](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210828132236210.png)

### 2.2 原生配置文件导入

#### 1、@ImportResource

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="user02" class="com.hkw.springboot2.bean.User">
        <property name="name" value="zhangsan"></property>
        <property name="age" value="18"></property>
    </bean>

    <bean id="myCat" class="com.hkw.springboot2.bean.Pet">
        <property name="name" value="chouchou"></property>
    </bean>
</beans>
```

```java
@ImportResource(value = "classpath:bean1.xml")
```

### 2.3 配置绑定

> 如何使用 Java 读取到 properties 文件中的内容，并且把它封装到 JavaBean 中，以供随时使用（java 实现）
>
> ```java
> public class getProperties {
>     public static void main(String[] args) throws FileNotFoundException, IOException {
>         Properties pps = new Properties();
>         pps.load(new FileInputStream("a.properties"));
>         Enumeration enum1 = pps.propertyNames(); // 得到配置文件的名字
>         while (enum1.hasMoreElements()) {
>             String strKey = (String) enum1.nextElement();
>             String strValue = pps.getProperty(strKey);
>             System.out.println(strKey + "=" + strValue);
>             // 封装到JavaBean。
>         }
>     }
> }
> ```

#### 1、@ConfigurationProperties

application.properties

```properties
mycar.brand=BYD
mycar.price=100000
```

两种方式实现配置绑定

#### **方式一：@EnableConfigurationProperties + @ConfigurationProperties**

```java
@Data
@ConfigurationProperties(prefix = "mycar")
public class Car {

    private String brand;
    
    private Integer price;
}
```

```java
@Configuration
@EnableConfigurationProperties(Car.class)
// 1、开启 Car 配置绑定功能
// 2、把 Car 这个组件自动注册到容器中
public class MyConfig {
}
```

#### **方式二：@Component + @ConfigurationProperties**

```java
@Data
@Component
@ConfigurationProperties(prefix = "mycar")
public class Car {

    private String brand;

    private Integer price;
}
```

## 3. 自动配置原理入门

### 3.1 引导加载自动配置类

```java
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(
    excludeFilters = {@Filter(
    type = FilterType.CUSTOM,
    classes = {TypeExcludeFilter.class}
), @Filter(
    type = FilterType.CUSTOM,
    classes = {AutoConfigurationExcludeFilter.class}
)}
)
public @interface SpringBootApplication {
```

#### 1、@SpringBootConfiguration

> @Configuration：代表当前类是一个配置类

#### 2、@ComponentScan

> 指定扫描哪些类为组件，Spring 注解

#### 3、@EnableAutoConfiguration

```java
@AutoConfigurationPackage
@Import({AutoConfigurationImportSelector.class})
public @interface EnableAutoConfiguration {
```

##### @AutoConfigurationPackage

> 自动配置包？指定了默认的包规则

```java
@Import({Registrar.class}) // 给容器中导入了一个组件
public @interface AutoConfigurationPackage {
// 利用 Register 给容器中导入一系列组件
// 将指定的一个包下的所有组件导入进来？ 默认 MainApplication（启动类） 所在包下
```

![image-20210829102518897](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210829102518897.png)

##### @Import(AutoConfigurationImportSelector.class)

```java
1、利用 getAutoConfigurationEntry(annotationMetadata); 给容器中批量导入一些组件
2、调用 List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes) 获取到所有需要导入到容器中的配置类
3、利用工厂加载器加载 Map<String, List<String>> loadSpringFactories(@Nullable ClassLoader classLoader); 得到所有的组件
4、从 META-INF/spring.factories 位置来加载一个文件。
  默认扫描我们当前系统里面所有 META-INF/spring.factories 位置的文件
```

![image-20210829103520161](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210829103520161.png)

```properties
# 文件里面写死了 spring-boot 一启动就要给容器中加载的所有配置类
# spring-boot-autoconfigure-2.3.4.RELEASE.jar/META-INF/spring.factories
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration,\
org.springframework.boot.autoconfigure.aop.AopAutoConfiguration,\
org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration,\
org.springframework.boot.autoconfigure.batch.BatchAutoConfiguration,\
org.springframework.boot.autoconfigure.cache.CacheAutoConfiguration,\
org.springframework.boot.autoconfigure.cassandra.CassandraAutoConfiguration,\
org.springframework.boot.autoconfigure.context.ConfigurationPropertiesAutoConfiguration,\
org.springframework.boot.autoconfigure.context.LifecycleAutoConfiguration,\
org.springframework.boot.autoconfigure.context.MessageSourceAutoConfiguration,\
org.springframework.boot.autoconfigure.context.PropertyPlaceholderAutoConfiguration,\
org.springframework.boot.autoconfigure.couchbase.CouchbaseAutoConfiguration,\
org.springframework.boot.autoconfigure.dao.PersistenceExceptionTranslationAutoConfiguration,\
org.springframework.boot.autoconfigure.data.cassandra.CassandraDataAutoConfiguration,\
org.springframework.boot.autoconfigure.data.cassandra.CassandraReactiveDataAutoConfiguration,\
......
```

### 3.2、按需加载自动配置项

> 虽然我们 127 个场景的所有自动配置在启动的时候会默认全部加载 --- XxxAutoConfiguration，但是配置类底层会有条件装配规则（@CondititonalXxx），最终会按需配置。

### 3.3 修改默认配置

```java
@Bean
@ConditionalOnBean(MultipartResolver.class)  // 容器中有这个类型组件
@ConditionalOnMissingBean(name = DispatcherServlet.MULTIPART_RESOLVER_BEAN_NAME) // 容器中没有这个名字 multipartResolver 的组件
public MultipartResolver multipartResolver(MultipartResolver resolver) {
	// 给 @Bean 标注的方法传入了对象参数，这个参数的值就会从容器中找。
	// SpringMVC multipartResolver。防止有些用户配置的文件上传解析器不符合规范
	// Detect if the user has created a MultipartResolver but named it incorrectly
	return resolver;
}
// 给容器中加入了文件上传解析器;
```

SpringBoot 默认会在底层配好所有的组件，但是如果用户自己配置了，以用户的优先

```java
@Bean
@ConditionalOnMissingBean
public CharacterEncodingFilter characterEncodingFilter() {
}
```

#### **总结**

- SpringBoot 先加载所有的自动配置类 XxxAutoConfiguration
- 每个自动配置类按照条件进行生效，默认都会绑定配置文件指定的值。XxxProperties 里面拿，XxxProperties 和配置文件进行了绑定
- 生效的配置类就会给容器中装配很多组件
- 只要容器中有这些组件，相当于这些功能就有了
- 定制化配置
  - 用户直接自己 @Bean 替换底层的组件
  - 用户去看这个组件是获取的配置文件什么值就去修改配置文件的默认值
  - **<span style="color:red">XxxAutoCOnfiguration ---> 组件 ---> XxxProperties 里面拿值 ---> application.properties</span>**

### 3.4 最佳实践

- 引入场景依赖
  - [https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.build-systems.starters](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.build-systems.starters)
- 查看自动配置了哪些
  - 自己分析，引入场景对应的自动配置一般都生效了
  - 配置文件中 debug=true 开启自动配置报告（Negative：不生效 / Positive：生效）
- 是否需要修改
  - 参照文档修改配置项
    - [https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#application-properties](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#application-properties)
    - 自己分析，XxxProperties 绑定了配置文件的哪些
  - 自定义加入或者替换组件
    - @Bean、@Component、...
  - 自定义器 XxxCustomizer
  - ......

## 4. 开发小技巧

### 4.1 Lombok

> 简化 Bean 开发 & 简化日志开发

第一步，IDEA 中搜索安装 lombok 插件

第二步，引入相关依赖

```xml
<dependency>
	<groupId>org.projectlombok</groupId>
	<artifactId>lombok</artifactId>
</dependency>
```

```java
// ===============================简化 JavaBean 开发===================================
@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
@EqualsAndHashCode
public class User {

    private String name;
	
    private Integer age;
}



// ================================简化日志开发===================================
@Slf4j
@RestController
public class HelloController {

    @RequestMapping("/hello")
    public String handle(){
        
        log.info("请求进来了....");
        
        return "Hello, Spring Boot 2!";
    }
}
```

### 4.2 dev-tools

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-devtools</artifactId>
	<optional>true</optional>
</dependency>
```

> 项目或者页面修改以后：Ctrl+F9；

### 4.3 Spring Initializr（项目初始化向导）

![image-20210829113148821](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210829113148821.png)

#### 0、选择我们需要的开发场景

![image-20210829113507277](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210829113507277.png)

#### 1、自动依赖引入

![image-20210829113711659](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210829113711659.png)

#### 2、自动创建项目结构

![image-20210829113943851](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210829113943851.png)

#### 3、自动编写好主启动类

![image-20210829114055227](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210829114055227.png)