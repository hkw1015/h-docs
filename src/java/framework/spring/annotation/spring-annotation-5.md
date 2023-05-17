---
title: AOP 应用
date: 2021-12-11
category: 常用框架
tag:
  - Spring 注解
---

面向切面编程：在程序运行期间动态地将某段代码切入到指定方法指定位置运行的编程方式【基于动态代理】

## 1. 思路

以 **动态日志打印** 功能为例子进行 AOP 演示：

1. 导入 aop 模块：Spring AOP（spring-aspects）

   ```xml
   <dependency>
       <groupId>org.springframework</groupId>
       <artifactId>spring-aspects</artifactId>
       <version>5.3.5</version>
   </dependency>
   ```

2. 定义一个业务逻辑类（MathCalculator）：在业务逻辑运行的时候将日志进行打印【方法之前、方法运行结束、方法正常返回、方法出现异常、xxx】

3. 定义一个日志切面类（LogAspects）：切面类里面的方法需要动态感知 MathCalculator 中的方法运行到哪里了然后执行

   > 通知方法：
   >
   > - **前置通知（@Before）：在目标方法运行之前运行**
   > - **后置通知（@After）：在目标方法运行结束之后运行【无论方法正常结束还是异常结束】**
   > - **返回通知（@AfterReturning）：在目标方法正常返回之后运行**
   > - **异常通知（@AfterThrowing）：在目标方法出现异常之后运行**
   > - **环绕通知（@Around）：动态代理，手动推进目标方法运行【proceedingJoinPoint.proceed()】**

4. 给切面类的目标方法标注通知注解，告诉方法何时何地运行

5. 将切面类和业务逻辑类（目标方法所在类）都加入到容器中

6. 告诉 Spring 容器哪一个类是切面类（给切面类上加一个 @Aspect 注解）

7. 给配置类中加 @EnableAspectJAutoProxy 【开启基于注解的 AOP 模式】

## 2. 案例实操

（1）**业务逻辑类**

```java
public class MathCalculator {

    /**
     * 加
     */
    public int add(int i, int j) {
        return i + j;
    }

    /**
     * 减
     */
    public int subtract(int i, int j) {
        return i - j;
    }

    /**
     * 乘
     */
    public int multiply(int i, int j) {
        return i * j;
    }

    /**
     * 除
     */
    public int divide(int i, int j) {
        return i / j;
    }
}
```

**（2）AOP 切面类**

```java
@Aspect
public class LogAspects {

    @Pointcut("execution(* com.hkw.annotation.aop.MathCalculator.*(..))")
    public void pointcut() {
    }

    @Before("pointcut()")
    public void logStart(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("方法名：" + methodName + "，参数列表：" + Arrays.asList(joinPoint.getArgs()));
    }

    @After("pointcut()")
    public void logEnd(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("方法名：" + methodName + "，运行结束");
    }

    @AfterReturning(value = "pointcut()", returning = "result")
    public void logReturn(JoinPoint joinPoint, Object result) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("方法名：" + methodName + "，正常返回，运行结果：" + result);
    }

    @AfterThrowing(value = "pointcut()", throwing = "exception")
    public void logException(JoinPoint joinPoint, Exception exception) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("方法名：" + methodName + "，出现异常，异常信息：" + exception);
    }
}
```

**（3）配置类**

```java
@EnableAspectJAutoProxy(proxyTargetClass = true) // 默认为false，设为true表示开启Aspect生成代理对象
@Configuration
public class AopConfig {

    // 业务逻辑类
    @Bean
    public MathCalculator mathCalculator() {
        return new MathCalculator();
    }

    // 切面类
    @Bean
    public LogAspects logAspects() {
        return new LogAspects();
    }
}
```

**（4）测试代码**

```java
@Test
public void test17() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AopConfig.class);
    MathCalculator calculator = context.getBean(MathCalculator.class);
    calculator.add(10, 20);
    calculator.divide(10, 0);
}
```

![image-20211211090141658](http://img.hl1015.top/blog/image-20211211090141658.png)

## 3. 原理总结

（1）@EnableAspectJAutoProxy 开启 AOP 功能

（2）@EnableAspectJAutoProxy 给容器中注册一个组件 AnnotationAwareAspectJAutoProxyCreator

（3）AnnotationAwareAspectJAutoProxyCreator 是一个后置处理器

（4）容器的创建流程：

- [1]registerBeanPostProcessors() 注册后置处理器，创建 AnnotationAwareAspectJAutoProxyCreator 对象
- [2]finishBeanFactoryInitialization() 初始化剩下的单实例 Bean
  - ①创建业务逻辑组件和切面组件
  - ②AnnotationAwareAspectJAutoProxyCreator 拦截组件的创建过程
  - ③组件创建完成之后，判断组件是否需要增强
    - 是：会将切面类中的通知方法，包装成增强器（Advisor），给业务逻辑组件创建一个代理对象【默认基于 CGLIB 动态代理，接口时为 JDK 动态代理】

（5）执行目标方法

- [1]代理对象执行方法
- [2]CglibAopProxy.intercept()
  - ①得到目标方法的拦截器链（增强器包装成拦截器 MethodInterceptor）
  - ②利用拦截器的链式机制，依次进入每一个拦截器进行执行
  - ③执行效果
    - 正常执行：前置通知  -》 目标方法 -》 后置通知 -》 返回通知
    - 出现异常：前置通知  -》 目标方法 -》 后置通知 -》 异常通知