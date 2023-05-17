---
title: 框架概述
date: 2021-08-23
category: 常用框架
tag:
  - Spring
---

## 1. Spring 是轻量级的开源 JavaEE 框架

- **轻量级理解：体积小、引用的 jar 包少**

## 2. Spring 可以解决企业应用开发的复杂性

## 3. Spring 有两大核心部分：IOC 和 AOP

- **IOC：控制反转，把创建对象过程交给 Spring 进行管理**
- **AOP：面向切面，不修改源码情况下进行功能增强**

![image-20210821084319424](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/java_note/image-20210821084319424.png)

## 4. Spring 特点

- **方便解耦，简化开发**
- **Aop 编程支持**
- **方便程序调试**
- **方便和其他框架进行整合**
- **方便进行事务操作**
- **降低 API 开发难度**

## 5. Spring 5 入门

### 5.1 下载 Spring 5

- **下载 Spring 最新稳定版 5.2.8**

![image-20210821083358883](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/java_note/image-20210821083358883.png)

> GA(Genernal Availability)：正式发布的版本，官方推荐使用此版本。在国外都是用 GA 来说明 release 版本的。
>
> PRE：预览版，内部测试版。主要是给开发人员测试和找 BUG 用的，不建议使用。
>
> SNAPSHOT：快照版，可以稳定使用，且仍在继续改进版本。

- **下载地址：**[https://repo.spring.io/release/org/springframework/spring/](https://repo.spring.io/release/org/springframework/spring/)

![image-20210821083819530](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/java_note/image-20210821083819530.png)

![image-20210821083900168](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/java_note/image-20210821083900168.png)

### 5.2 打开 IDEA，创建普通 Java 工程

![image-20210821084158117](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/java_note/image-20210821084158117.png)

![image-20210821084207297](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/java_note/image-20210821084207297.png)

![image-20210821084217667](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/java_note/image-20210821084217667.png)

### 5.3 导入 Spring 5 相关的 jar 包

![image-20210821084253362](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/java_note/image-20210821084253362.png)

- **解压下载好的 zip 包，在 lib 下可以找到 Spring 里的相关 jar 包**

![image-20210821084448778](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/java_note/image-20210821084448778.png)

- **找到对应的 4 个 jar 包，拷贝出来**

![image-20210821084545395](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/java_note/image-20210821084545395.png)

> 注意：除此之外，我们还需要一个日志 jar 包（这里使用的是 commons-logging-1.1.1.jar），不导入会报错，如下图为我们核心 IOC 所需要的所有 jar 包

![image-20210821084721889](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/java_note/image-20210821084721889.png)

- **开始导入到工程**

  （1）File > Project Structure > Module > Dependencies，点击 ‘+’ 号，选择 JARs or directories ...
  
  ![image-20210821084818589](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/java_note/image-20210821084818589.png)
  
  （2）找到对应的 jar 包目录，选中之后，点击ok
  
  ![image-20210821084906036](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/java_note/image-20210821084906036.png)
  
  ​	可以在 External Libraries 中看到我们刚导入的jar包
  
  ​	![image-20210821084945945](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/java_note/image-20210821084945945.png)

### 5.4 入门案例

- **创建一个普通类，在这个类中创建一个普通方法**

  ```java
  public class User {
      public void add() {
          System.out.println("add ...");
      }
  }
  ```

- **创建 Spring 的配置文件，在配置文件中配置创建的对象**

  > 注意：Spring 的配置文件使用 xml 格式

  （1）我们在 src 下创建我们的 bean1.xml（src > New > XML Configuration File > Spring Config）

​	![image-20210821220443347](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210821220443347.png)

​	![image-20210821220520801](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210821220520801.png)

  （2）bean1.xml 内容如下

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
      <!-- 配置User对象创建 -->
      <bean id="user" class="com.hkw.spring5.User"></bean>
  </beans>
  ```

  > 注意：id 一般为类名小写（唯一标识），class 为全类名

  （3）测试

  创建一个用于测试的类，编写单元测试

  ```java
  @Test
  public void test1() {
      // 1.加载Spring的配置文件
      ApplicationContext applicationContext = new ClassPathXmlApplicationContext("bean1.xml");
  
      // 2.获取配置中创建的对象
      User user = applicationContext.getBean("user",User.class);
  
      // 3.输出查看结果
      System.out.println(user);
      user.add();
  }
  ```

  ![image-20210821220953135](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210821220953135.png)