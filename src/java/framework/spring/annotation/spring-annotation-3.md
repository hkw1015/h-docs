---
title: 属性赋值
date: 2021-12-11
category: 常用框架
tag:
  - Spring 注解
---

## 1. @Value

- 基本数值
- SpEL，例如：`#{10 - 5}`
- ${}：取出配置文件中的值（在运行环境变量里面的值）

Person 实体类：

```java
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Person {

    @Value("张三")
    private String name;

    @Value("#{20 - 2}")
    private int age;
}
```

PropertySet1 配置类：

```java
@Configuration
public class PropertySet1 {

    @Bean
    public Person person() {
        return new Person();
    }
}
```

测试代码：

```java
@Test
public void test12() {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(PropertySet1.class);

	Person person = context.getBean("person", Person.class);
	System.out.println("person = " + person);

	context.close();
}
```

![image-20211205113225651](http://img.hl1015.top/blog/image-20211205113225651.png)

## 2. @PropertySource

**使用 @PropertySource 注解读取外部配置文件中的 k/v 保存到运行的环境变量中，加载完外部的配置文件以后使用 ${} 取出配置文件的值**

在 resources 类路径下新建一个 person.properties 配置文件：

![image-20211205224944978](http://img.hl1015.top/blog/image-20211205224944978.png)

内容如下：

```properties
person.nickname=zhangsan
```

Person 实体类：

```java
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Person {

    @Value("张三")
    private String name;

    @Value("#{20 - 2}")
    private int age;

    @Value("${person.nickname}")
    private String nickname;
}
```

PropertySet1 配置类：

```java
@Configuration
@PropertySource(value = "classpath:/person.properties")
public class PropertySet1 {

    @Bean
    public Person person() {
        return new Person();
    }
}
```

再次运行上面的测试代码：

![image-20211205225622614](http://img.hl1015.top/blog/image-20211205225622614.png)

我们也可以从运行环境中获取到这个 nickname 的值：

```java
@Test
public void test12() {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(PropertySet1.class);

	Person person = context.getBean("person", Person.class);
	System.out.println("person = " + person);

	ConfigurableEnvironment environment = context.getEnvironment();
	String nickname = environment.getProperty("person.nickname");
	System.out.println("nickname = " + nickname);
}
```

![image-20211205233149944](http://img.hl1015.top/blog/image-20211205233149944.png)

