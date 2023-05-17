---
title: 自动装配
date: 2021-12-11
category: 常用框架
tag:
  - Spring 注解
---

## 1. @Autowired、@Qualifier、@Primary

自动装配：Spring 利用依赖注入（DI），完成对 IOC 容器中各个组件的依赖关系组件的赋值

- @Autowired：自动注入
  - 默认优先按照类型去容器中找对应的组件：ioc.getBean(UserDao.class);
  - 如果找到多个相同类型的组件，再将属性的名称作为组件的 id 去容器中查找：ioc.getBean("userDao");
  - 自动装配默认一定要将属性赋值完成，没有找到就会报错，可以使用  `@Autowired(required = false)` 来防止找不到报错
- @Qualifier：使用 @Qualifier 指定需要装配的组件的 id，而不是使用属性名
- @Primary：让 Spring 进行自动装配的时候，默认使用首选的 Bean，也可以继续使用 @Qualifier 指定需要装配的 Bean 的名字

> @Autowired 注解可以标注在：**构造器、参数、方法、属性** 上，都是从容器中获取参数组件的值
>
> （1）标注在方法位置，使用 @Bean + 方法（带参数），参数是从容器中获取的，默认不写 @Autowired 效果是一样的，都能自动装配
>
> （2）标注在构造器上，如果组件类中只有一个参数的构造器，这个有参构造器的 @Autowired 可以省略，参数位置的组件可以自动从容器中获取

**（1）Autowired**

UserDao 类：

```java
@Repository
public class UserDao {
}
```

UserService 类：

```java
@ToString
@Service
public class UserService {

    @Autowired
    private UserDao userDao;
}
```

新建一个 AutoAssembleConfig 配置类：

```java
@Configuration
@ComponentScan({"com.hkw.annotation.service", "com.hkw.annotation.dao"})
public class AutoAssembleConfig {
}
```

测试代码：

```java
@Test
public void test13() {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AutoAssembleConfig.class);

	UserService userService = context.getBean(UserService.class);
	System.out.println("userService = " + userService);

	UserDao userDao = context.getBean(UserDao.class);
	System.out.println("userDao = " + userDao);
}
```

![image-20211207090913416](http://img.hl1015.top/blog/image-20211207090913416.png)

<font color="red">可以发现给  userService 自动装配的 userDao 和单独从容器中获取的 userDao 两者是相同的</font>

**（2）@Qualifier**

UserService 类：

```java
@ToString
@Service
public class UserService {

    @Qualifier("userDao666")
    @Autowired
    private UserDao userDao;
}
```

配置类：

```java
@Configuration
@ComponentScan({"com.hkw.annotation.service", "com.hkw.annotation.dao"})
public class AutoAssembleConfig {

    @Bean("userDao666")
    public UserDao userDao666() {
        return new UserDao();
    }
}
```

测试类：

```java
@Test
public void test13() {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AutoAssembleConfig.class);

	UserService userService = context.getBean(UserService.class);
	System.out.println("userService = " + userService);

	UserDao userDao = context.getBean("userDao666", UserDao.class);
	System.out.println("userDao = " + userDao);
}
```

![image-20211207093628961](http://img.hl1015.top/blog/image-20211207093628961.png)

**（3）@Primary**

UserDao 类：

```java
@ToString
@Data
@Repository
public class UserDao {
    
    private String msg = "init";
}
```

UserService 类：

```java
@ToString
@Service
public class UserService {

    @Autowired
    private UserDao userDao;
}
```

配置类：

```java
@Configuration
@ComponentScan({"com.hkw.annotation.service", "com.hkw.annotation.dao"})
public class AutoAssembleConfig {

    @Primary
    @Bean("userDao1")
    public UserDao userDao1() {
        UserDao userDao = new UserDao();
        userDao.setMsg("@Bean create userDao1");
        return userDao;
    }

    @Bean("userDao2")
    public UserDao userDao2() {
        UserDao userDao = new UserDao();
        userDao.setMsg("@Bean create userDao2");
        return userDao;
    }
}
```

测试类：

```java
@Test
public void test13() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AutoAssembleConfig.class);

    UserService userService = context.getBean(UserService.class);
    System.out.println("userService = " + userService);
}
```

![image-20211207094115245](http://img.hl1015.top/blog/image-20211207094115245.png)

如果在 UserService 类中添加上 @Qualifier 注解，指定组件 id，这时以 id 为准，@Primary 失效

```java
@ToString
@Service
public class UserService {

    @Qualifier("userDao2")
    @Autowired
    private UserDao userDao;
}
```

再次运行上面的测试代码：

![image-20211207094440710](http://img.hl1015.top/blog/image-20211207094440710.png)

## 2. @Resource、@Inject

Spring 还支持使用 @Resource（JSR250） 和 @Inject（JSR330）【Java 规范的注解】

- @Resource：可以和 @Autowired 一样实现自动装配功能，默认是**按组件名称进行装配**的
- @Inject：需要导入 javax.inject 的包，和 @Autowired 的功能一样，只是没有 required = false 的属性

**（1）@Resource**

UserService 类：

```java
@ToString
@Service
public class UserService {

    @Resource
    private UserDao userDao;
}
```

配置类：

```java
@Configuration
@ComponentScan({"com.hkw.annotation.service", "com.hkw.annotation.dao"})
public class AutoAssembleConfig {

    @Bean("userDao")
    public UserDao userDao1() {
        UserDao userDao = new UserDao();
        userDao.setMsg("@Bean create userDao");
        return userDao;
    }
}
```

测试代码：

```java
@Test
public void test13() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AutoAssembleConfig.class);

    UserService userService = context.getBean(UserService.class);
    System.out.println("userService = " + userService);
}
```

![image-20211207131540298](http://img.hl1015.top/blog/image-20211207131540298.png)

**（2）@inject**

首先导入 inject 需要的依赖包：

```xml
<dependency>
   <groupId>javax.inject</groupId>
   <artifactId>javax.inject</artifactId>
   <version>1</version>
</dependency>
```

UserService 类：

```java
@ToString
@Service
public class UserService {

    @Inject
    private UserDao userDao;
}
```

再次运行上面的测试代码：

![image-20211207131837272](http://img.hl1015.top/blog/image-20211207131837272.png)

## 3. xxxAware 接口

自定义组件想要使用 Spring 容器底层的一些组件（ApplicationContext，BeanFactory，xxx），可以通过实现 xxxAware 接口，在创建对象的时候，调用接口规定的方法注入相关组件，把 Spring 底层一些组件注入到自定义的 Bean 中：【原理】xxxAware 功能使用 xxxProcessor 实现（例如 ApplicationContextAware ===》ApplicationContextAwareProcessor）

GetApplicationContext 类：

```java
@Data
@Component
public class GetApplicationContext implements ApplicationContextAware {

    private ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        System.out.println("通过 aware 接口注入到 Bean 中的 ioc 容器：" + applicationContext);
        this.applicationContext = applicationContext;
    }
}
```

配置类：

```java
@Configuration
@ComponentScan("com.hkw.annotation.aware")
public class AwareConfig {
}
```

测试代码：

```java
@Test
public void test14() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AwareConfig.class);
    System.out.println("context = " + context);
}
```

![image-20211207230950279](http://img.hl1015.top/blog/image-20211207230950279.png)

## 4. @Profile

@Profile 注解：Spring 为我们提供的可以根据当前环境，动态地激活和切换一系列组件的功能

> 我们以不同环境下，使用不同的数据源为例演示 @Profile 的用法

（1）首先引入数据源所需的依赖

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.2.6</version>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.22</version>
</dependency>
```

（2）配置类

`先不加 @Profile`

```java
@Configuration
public class ProfileConfig {

    @Bean
    public DataSource devDateSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUsername("root");
        dataSource.setPassword("root");
        dataSource.setUrl("jdbc:mysql://localhost:3306/dev");
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        return dataSource;
    }

    @Bean
    public DataSource testDateSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUsername("root");
        dataSource.setPassword("root");
        dataSource.setUrl("jdbc:mysql://localhost:3306/test");
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        return dataSource;
    }

    @Bean
    public DataSource prodDateSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUsername("root");
        dataSource.setPassword("root");
        dataSource.setUrl("jdbc:mysql://localhost:3306/prod");
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        return dataSource;
    }
}
```

（3）测试代码

```java
@Test
public void test15() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(ProfileConfig.class);
    String[] beanNamesForType = context.getBeanNamesForType(DataSource.class);
    for (String beanName : beanNamesForType) {
        System.out.println(beanName);
    }
}
```

![image-20211208090839331](http://img.hl1015.top/blog/image-20211208090839331.png)

可以看到我们能拿到所有环境下的数据源，但我们需要在不同环境下使用不同的数据源，无关的数据源不让使用

（4）配置类调整

```java
@Configuration
public class ProfileConfig {

    @Profile("dev")
    @Bean
    public DataSource devDateSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUsername("root");
        dataSource.setPassword("root");
        dataSource.setUrl("jdbc:mysql://localhost:3306/dev");
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        return dataSource;
    }

    @Profile("test")
    @Bean
    public DataSource testDateSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUsername("root");
        dataSource.setPassword("root");
        dataSource.setUrl("jdbc:mysql://localhost:3306/test");
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        return dataSource;
    }

    @Profile("prod")
    @Bean
    public DataSource prodDateSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUsername("root");
        dataSource.setPassword("root");
        dataSource.setUrl("jdbc:mysql://localhost:3306/prod");
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        return dataSource;
    }
}
```

（5）测试

**方式一：使用命令行动态参数【在虚拟机参数位置 -Dspring.profiles.active=test】**

![image-20211208092904842](http://img.hl1015.top/blog/image-20211208092904842.png)

![image-20211208092959932](http://img.hl1015.top/blog/image-20211208092959932.png)

再次运行上面的测试代码：

![image-20211208093033074](http://img.hl1015.top/blog/image-20211208093033074.png)

**方式二：代码设置需要激活的环境**

```java
@Test
public void test16() {
    // 1、创建一个 applicationContext
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
    // 2、设置需要激活的环境
    context.getEnvironment().setActiveProfiles("dev","test");
    // 3、注册主配置类
    context.register(ProfileConfig.class);
    // 4、启动刷新容器
    context.refresh();

    String[] beanNamesForType = context.getBeanNamesForType(DataSource.class);
    for (String beanName : beanNamesForType) {
        System.out.println(beanName);
    }
}
```

![image-20211208093529673](http://img.hl1015.top/blog/image-20211208093529673.png)