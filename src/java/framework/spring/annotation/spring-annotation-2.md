---
title: 生命周期
date: 2021-12-11
category: 常用框架
tag:
  - Spring 注解
---

## 1. 使用 @Bean 指定初始化和销毁方法

> Bean 的生命周期：Bean 创建 ---》 初始化 ---》 销毁 的过程
>
> 【对象创建时，如果是单实例，在容器启动时创建对象；如果是多实例，在每次获取时创建对象】

容器管理 Bean 的生命周期，我们可以自定义初始化和销毁方法，容器在 Bean 进行到当前生命周期的时候来调用我们自定义的初始化和销毁方法

- 指定初始化和销毁方法
  - xml 方式：通过 init-method 和 destroy-method 指定
  - @Bean 注解方式：通过 initMethod 和 destroy-method
- 初始化时机
  - 对象创建完成，并赋值好，调用初始化方法
- 销毁时机
  - 单实例：容器关闭的时候，调用销毁方法
  - 多实例：容器不会管理这个 Bean，所以容器不会调用销毁方法

**实操演示：**

新建一个实体类 Car：

```java
public class Car {

    public Car() {
        System.out.println("car ... constructor ...");
    }
    
    public void init() {
        System.out.println("car ... init ...");
    }

    public void destroy() {
        System.out.println("car ... destroy ...");
    }
}
```

新建一个配置类 LifeCycle：

```java
@Configuration
public class LifeCycle {

    @Bean(initMethod = "init", destroyMethod = "destroy")
    public Car car() {
        return new Car();
    }
}
```

测试代码：

```java
@Test
public void test8() {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(LifeCycle.class);
    System.out.println("容器创建完成 ...");

	context.close();
}
```

![image-20211205095229726](http://img.hl1015.top/blog/image-20211205095229726.png)

可以发现 **单实例** 情况下，当容器创建好的时候，就帮我们创建好了 Bean，并调用了初始化方法，并且在容器关闭的时候，调用了销毁方法

设置为多实例：

```java
@Scope(value = "prototype")
@Bean(initMethod = "init", destroyMethod = "destroy")
public Car car() {
	return new Car();
}
```

再次运行上面的测试代码：

![image-20211205095607820](http://img.hl1015.top/blog/image-20211205095607820.png)

加入获取 Bean 的操作：

```java
@Test
public void test8() {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(LifeCycle.class);
	System.out.println("容器创建完成 ...");

	Car car = context.getBean("car", Car.class);

	context.close();
}
```

![image-20211205100000434](http://img.hl1015.top/blog/image-20211205100000434.png)

**多实例** 情况下，当容器创建好的时候，没有帮我们创建 Bean 对象，只有在手动获取 Bean 对象的时候才创建，同样也会调用初始化方法，但是在容器关闭时没有调用销毁方法，需要我们自己手动调用销毁方法

## 2. 使用 InitializingBean 和 DisposableBean 接口

新建一个实体类 Cat：

```java
public class Cat implements InitializingBean, DisposableBean {
    
    public Cat() {
        System.out.println("cat ... constructor ...");
    }
    
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("cat ... afterPropertiesSet ...");
    }

    @Override
    public void destroy() throws Exception {
        System.out.println("cat ... destroy ...");
    }
}
```

新建一个配置类 LifeCycle1：

```java
@Configuration
public class LifeCycle1 {

    @Bean
    public Cat cat() {
        return new Cat();
    }
}
```

测试代码：

```java
@Test
public void test9() {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(LifeCycle1.class);
	System.out.println("容器创建完成 ...");

	context.close();
}
```

![image-20211205102030353](http://img.hl1015.top/blog/image-20211205102030353.png)

## 3. 使用 JSR250 的 @PostConstruct 和 @PreDestroy 注解

- @PostConstruct：在 Bean 创建完成并且属性赋值完成，执行初始化方法
- @PreDestroy：在容器销毁 Bean 之前通知我们进行清理工作

新建一个实体类 Dog：

```java
public class Dog {

    public Dog() {
        System.out.println("dog ... constructor ...");
    }

    // 对象创建并赋值之后调用
    @PostConstruct
    public void init() {
        System.out.println("dog ... @PostConstruct ...");
    }

    // 容器移除对象之前调用
    @PreDestroy
    public void destroy() {
        System.out.println("dog ... @PreDestroy ...");
    }
}
```

新建一个配置类 LifeCycle2：

```java
@Configuration
public class LifeCycle2 {

    @Bean
    public Dog dog() {
        return new Dog();
    }
}
```

测试代码：

```java
@Test
public void test10() {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(LifeCycle2.class);
	System.out.println("容器创建完成 ...");

	context.close();
}
```

![image-20211205103251902](http://img.hl1015.top/blog/image-20211205103251902.png)

## 4. 使用 BeanPostProcessor 接口【Bean 的后置处理器】

BeanPostProcessor 会帮我们在 Bean 初始化前后做一些工作 

- postProcessBeforeInitialization 方法：在初始化之前工作

  ![image-20211205104922077](http://img.hl1015.top/blog/image-20211205104922077.png)

- postProcessAfterInitialization 方法：在初始化之后工作

  ![image-20211205105146988](http://img.hl1015.top/blog/image-20211205105146988.png)

新建一个类实现 BeanPostProcessor 接口：

```java
/**
 * 后置处理器：初始化前后进行处理工作
 */
@Component
public class MyBeanPostProcessor implements BeanPostProcessor {

    // 初始化前工作
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessBeforeInitialization ... " + beanName);
        return bean;
    }

    // 初始后前工作
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessAfterInitialization ... " + beanName);
        return bean;
    }
}
```

新建一个配置类 LifeCycle3：

```java
@Configuration
@ComponentScan(value = "com.hkw.annotation")
public class LifeCycle3 {
}
```

测试代码：

```java
@Test
public void test11() {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(LifeCycle3.class);
	System.out.println("容器创建完成 ...");

	context.close();
}
```

![image-20211205110519661](http://img.hl1015.top/blog/image-20211205110519661.png)

> Spring 底层对 BeanPostProcessor 的使用：
>
> - **Bean 赋值**
> - **注入其他组件**
> - **@Autowired**
> - **生命周期注解功能**
> - **@Async，@xxx**