---
title: AOP
date: 2021-08-23
category: 常用框架
tag:
  - Spring
---

## 1. 什么是 AOP

- **面向切面编程**

  利用 AOP 可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。

- **通俗描述**

  不通过修改源代码的方式，在主干功能里添加新功能

- **使用登录的功能来说明 AOP**

  ![image-20210822161043989](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822161043989.png)

## 2. AOP 底层原理

- **AOP 底层使用动态代理**

  有两种情况的动态代理：

  （1）**有接口的情况，使用 JDK 动态代理** --- 创建接口实现类代理对象，增强类的方法

  （2）**没有接口的情况，使用 CGLIB 动态代理** --- 创建子类的代理对象，增强类的方法

- **JDK 动态代理**

  （1）**使用 JDK 动态代理，使用 Proxy 类里面的 newProxyInstance() 方法创建代理对象**

  ![image-20210822175854706](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822175854706.png)

  ![image-20210822180032905](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822180032905.png)

  （2）**newProxyInstance 方法**

  方法有 **<span style="color:red">3 个参数</span>**

  ① **<span style="color:blue">类加载器（一般写调用类的加载器，类.class.getClassLoader()）</span>**

  ② **<span style="color:blue">增强方法所在的类需要实现的接口，支持多个接口</span>**

  ③ **<span style="color:blue">实现这个接口 InvocationHandler，创建代理对象，写增强的部分</span>**

  （3）编写 JDK 动态代理代码

  ①创建接口，定义方法

  ```java
  public interface UserDao {
      void add();
  }
  ```

  ②创建接口实现类，实现方法

  ```java
  public class UserDaoImpl implements UserDao {
      @Override
      public void add() {
          System.out.println("UserDaoImpl add ...");
      }
  }
  ```

  ③使用 Proxy 类创建接口代理对象

  ```java
  public class JDKProxy {
      public static void main(String[] args) {
          UserDao userDao = (UserDao) Proxy.newProxyInstance(JDKProxy.class.getClassLoader(), new Class[]{UserDao.class},new UserDaoHandler(new UserDaoImpl()));
          userDao.add();
      }
  }
  
  // 创建代理对象的代码
  class UserDaoHandler implements InvocationHandler {
      // 需要将我们要增强的类通过构造器传递进来
      private Object obj;
  
      public UserDaoHandler(Object obj) {
          this.obj = obj;
      }
  
      // invoke方法里写我们的增强代码
      @Override
      public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
  
          // 方法执行之前
          System.out.println("在" + method.getName() + "方法执行之前的增强代码");
  
          // 执行被增强的方法
          Object object = method.invoke(obj, args);
  
          // 方法执行之后
          System.out.println("在" + method.getName() + "方法执行之后的增强代码");
  
          return object;
      }
  }
  ```

  执行结果：

  ![image-20210822180929405](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822180929405.png)

## 3. AOP 术语

- **连接点**

  连接点指的是横切关注点和程序代码的连接，叫连接点

  **<span style="color:red">即类中可以被增强的方法</span>**

- **切入点**

  切入点指的是用户真正处理的连接点，叫切入点

  **<span style="color:red">即实际被增强的方法</span>**

  在 Spring 中切入点通过 org.springframework.aop.Pointcut 接口进行描述，它使用类和方法作为连接点的查询条件

- **通知（增强）**

  通知就是增强的代码。比如前置增强的代码、后置增强的代码、异常增强代码。返回结果通知代码，这些就叫通知。

  **<span style="color:red">即实际增强的逻辑部分</span>**

  通知有多种类型：**<span style="color:blue">前置通知、后置通知、环绕通知、异常通知、返回结果通知</span>**

- **切面**

  **<span style="color:red">含有通知代码的类</span>**

- **横切关注点**

  我们 **<span style="color:red">可以添加增强代码的位置</span>**，比如前置位置、后置位置、异常位置和返回通知

- **目标**

  目标对象就是被关注的对象，或者 **<span style="color:red">被代理的对象</span>**

- **代理**

  **<span style="color:red">为了拦截目标对象方法，而被创建出来的那个对象</span>**

## 4. AOP 操作

- **准备工作**

  （1）Spring 框架一般都是基于 AspectJ 实现 AOP 操作

  AspectJ 不是 Spring 的组成部分，是独立的 AOP 框架，一般把 AspectJ 和 Spring 框架放一起使用，进行 AOP 操作。

  （2）基于 AspectJ 实现 AOP 操作

  ①基于 xml 配置文件实现

  ②基于注解方式实现（实际中使用）

  （3）在项目工程中引入 AOP 相关依赖

  ![image-20210823215750245](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210823215750245.png)

  （4）切入点表达式

  ①切入点表达式的作用：指定对哪个类里面的方法进行增强

  ②语法结构

  ```java
  execution([权限修饰符][返回类型][类全路径][方法名称][参数列表])
  ```

  举例1：对 com.hkw.dao.BookDao 类里面的 add 方法进行增强

  ```java
  execution(* com.hkw.dao.BookDao.add(..))
  ```

  举例2：对 com.hkw.dao.BookDao 类里面的所有方法进行增强

  ```java
  execution(* com.hkw.dao.BookDao.*(..))
  ```

  举例3：对 com.hkw.dao包里面所有类，类里面的所有方法进行增强

  ```java
  execution(* com.hkw.dao.*.*(..))
  ```

- **AspectJ 注解**

  （1）在 Spring 的配置文件中，开启注解扫描和开启 AspectJ 生成代理对象

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xmlns:context="http://www.springframework.org/schema/context"
         xmlns:aop="http://www.springframework.org/schema/aop"
         xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                              http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
                              http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">
      <!-- 开启注解扫描 -->
      <context:component-scan base-package="com.hkw.spring5.proxy"></context:component-scan>
  
      <!-- 开启 Aspect 生成代理对象-->
      <aop:aspectj-autoproxy></aop:aspectj-autoproxy>
  </beans>
  ```

  （2）创建一个类，在类里面定义方法

  ```java
  @Component
  public class Student {
      public void add() {
          System.out.println("add ... ");
      }
  }
  ```

  （3）创建增强类（编写增强逻辑）

  在增强类中，创建方法，让不同方法代表不同通知

  ```java
  // 切面
  @Component
  @Aspect // 生成代理对象
  public class StudentProxy {
  
      // 前置通知
      @Before(value = "execution(* com.hkw.spring5.proxy.Student.add(..))")
      public void before() {
          System.out.println("before ... ");
      }
  
      // 后置通知
      @After(value = "execution(* com.hkw.spring5.proxy.Student.add(..))")
      public void after() {
          System.out.println("after ... ");
      }
  
      // 返回结果通知
      @AfterReturning(value = "execution(* com.hkw.spring5.proxy.Student.add(..))")
      public void afterReturning() {
          System.out.println("afterReturning ... ");
      }
  
      // 环绕通知
      @Around(value = "execution(* com.hkw.spring5.proxy.Student.add(..))")
      public void around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
          System.out.println("around 环绕之前 ... ");
          proceedingJoinPoint.proceed();
          System.out.println("around 环绕之后 ... ");
      }
  
      // 异常通知
      @AfterThrowing(value = "execution(* com.hkw.spring5.proxy.Student.add(..))")
      public void afterThrowing() {
          System.out.println("afterThrowing ... ");
      }
  }
  ```

  测试一下

  ```java
  @Test
  public void testAOP() {
      // 1.加载配置类
      ApplicationContext ioc = new ClassPathXmlApplicationContext("bean9.xml");
  
      // 2.获取配置中创建的对象
      Student student = ioc.getBean("student", Student.class);
  
      // 3.输出查看结果
      System.out.println(student);
      student.add();
  }
  ```

  测试结果：

  ![image-20210823220945179](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210823220945179.png)

  （4）相同切入点的提取（切入点表达式的重用）

  分为 3 个步骤：

  ①在切面类中定义一个空的方法

  ```java
  public static void pointcut() {};
  ```

  ②在方法上使用 @Pointcut 注解定义一个切入点表达式

  ```java
  // 抽取相同的切入点表达式(使用@Pointcut)
  @Pointcut(value = "execution(* com.hkw.spring5.proxy.Student.add(..))")
  public static void pointcut() {};
  ```

  ③其他的通知注解中使用 方法名() 的形式引用方法上定义的切入点表达式

  ```java
  // 前置通知
  @Before("pointcut()")
  public void before() {
      System.out.println("before ... ");
  }
  ```

  （5）当多个切面类对同一个方法进行增强时，可以设置优先级

  在切面类上添加 @Order 注解，@Order(数字类型值)，数值类型值越小，代表优先级越高

  ```java
  // 切面
  @Component
  @Aspect // 生成代理对象
  @Order(1)
  public class StudentProxy {}
  ```

  （6）使用完全注解开发

  创建配置类，不需要创建 xml 配置文件

  ```java
  @Configuration
  @ComponentScan(basePackages = {"com.hkw"})
  @EnableAspectJAutoProxy(proxyTargetClass = true) // 默认为false，设为true表示开启 Aspect 生成代理对象
  public class ConfigAop {
  }
  ```

- **AspectJ 配置文件**

  （1）创建两个类，增强类和被增强类，创建方法

  （2）在 Spring 配置文件中创建两个类对象

  ```xml
  <!--创建对象-->
  <bean id="student" class="com.hkw.spring5.proxy.Student"></bean>
  <bean id="studentProxy" class="com.atguigu.spring5.proxy.StudentProxy"></bean>
  ```

  （3）在 Spring 配置文件中配置切入点

  ```xml
  <!--配置 aop 增强-->
  <aop:config>
      <!--切入点-->
      <aop:pointcut id="p" expression="execution(* com.atguigu.spring5.proxy.Student.add(..))"/>
      <!--配置切面-->
      <aop:aspect ref="studentProxy">
          <!--增强作用在具体的方法上-->
          <aop:before method="before" pointcut-ref="p"/>
      </aop:aspect>
  </aop:config>
  ```

  