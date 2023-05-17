---
title: 集成 MP
date: 2021-11-03
category: 常用框架
tag:
  - MyBatis-Plus
---

## 0. 创建一个 Maven 工程

![image-20211127095508329](http://img.hl1015.top/blog/image-20211127095508329.png)

## 1. 创建测试表

```sql
-- 创建库
CREATE DATABASE mp;
-- 使用库
USE mp;
-- 创建表
CREATE TABLE tbl_employee(
 id INT(11) PRIMARY KEY AUTO_INCREMENT,
 last_name VARCHAR(50),
 email VARCHAR(50),
 gender CHAR(1),
 age int
);
INSERT INTO tbl_employee(last_name,email,gender,age) VALUES('Tom','tom@atguigu.com',1,22);
INSERT INTO tbl_employee(last_name,email,gender,age) VALUES('Jerry','jerry@atguigu.com',0,25);
INSERT INTO tbl_employee(last_name,email,gender,age) VALUES('Black','black@atguigu.com',1,30);
INSERT INTO tbl_employee(last_name,email,gender,age) VALUES('White','white@atguigu.com',0,35);
```

![image-20211127095418400](http://img.hl1015.top/blog/image-20211127095418400.png)

## 2. 创建 JavaBean

（1）引入 lombok 依赖【简化 Bean 开发 和 日志开发】

```xml
<dependency>
	<groupId>org.projectlombok</groupId>
	<artifactId>lombok</artifactId>
	<version>1.18.20</version>
</dependency>
```

（2）创建 Employee 实体类

```java
@Data
@ToString
public class Employee {

    private Integer id;

    private String lastName;

    private String email;

    private Integer gender;

    private Integer age;
}
```

## 3. MP 依赖配置

（1）在 pom.xml 中加入对 MP、Spring、连接池、Junit、MySQL 驱动等依赖

```xml
<!-- mp 依赖（这里使用的版本偏老，最新的可根据 官方文档进行学习） -->
<dependency>
	<groupId>com.baomidou</groupId>
	<artifactId>mybatis-plus</artifactId>
	<version>2.3</version>
</dependency>
<!--junit -->
<dependency>
	<groupId>junit</groupId>
	<artifactId>junit</artifactId>
	<version>4.9</version>
</dependency>
<!-- log4j -->
<dependency>
	<groupId>log4j</groupId>
	<artifactId>log4j</artifactId>
	<version>1.2.17</version>
</dependency>
<!-- c3p0 -->
<dependency>
	<groupId>com.mchange</groupId>
	<artifactId>c3p0</artifactId>
	<version>0.9.5.2</version>
</dependency>
<!-- mysql -->
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
	<version>8.0.21</version>
</dependency>
<!-- spring -->
<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-context</artifactId>
	<version>4.3.10.RELEASE</version>
</dependency>
<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-orm</artifactId>
	<version>4.3.10.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>4.3.10.RELEASE</version>
</dependency>
```

<font color="red">特别说明</font>：MyBatis 及 MyBatis-Spring 依赖请勿加入项目配置，以免引起版本冲突！！！MyBatis-Plus 会自动帮你维护！

（2）加入 MyBatis 的全局配置文件（mybatis-config.xml）

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

</configuration>
```

（3）加入 log4j.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
<log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">
    <appender name="STDOUT" class="org.apache.log4j.ConsoleAppender">
        <param name="Encoding" value="UTF-8"/>
        <layout class="org.apache.log4j.PatternLayout">
            <param name="ConversionPattern" value="%-5p %d{MM-dd HH:mm:ss,SSS} %m (%F:%L) \n"/>
        </layout>
    </appender>
    <logger name="java.sql">
        <level value="debug"/>
    </logger>
    <logger name="org.apache.ibatis">
        <level value="info"/>
    </logger>
    <root>
        <level value="debug"/>
        <appender-ref ref="STDOUT"/>
    </root>
</log4j:configuration>
```

（4）加入 db.properties 连接信息配置

```properties
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/mp?serverTimezone=GMT%2B8
jdbc.username=root
jdbc.password=root
```

（5）加入 spring 的配置文件 applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:mybatis-spring="http://mybatis.org/schema/mybatis-spring"
       xsi:schemaLocation="http://mybatis.org/schema/mybatis-spring
        http://mybatis.org/schema/mybatis-spring-1.2.xsd
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context-4.0.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx-4.0.xsd">
    
    <!-- 数据源 -->
    <context:property-placeholder location="classpath:db.properties"/>
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="${jdbc.driver}"/>
        <property name="jdbcUrl" value="${jdbc.url}"/>
        <property name="user" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
    </bean>
    
    <!-- 事务管理器 -->
    <bean id="dataSourceTransactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>
    <!-- 基于注解的事务管理 -->
    <tx:annotation-driven transaction-manager="dataSourceTransactionManager"/>
    
    <!-- 配置 SqlSessionFactoryBean -->
    <bean id="sqlSessionFactoryBean" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!-- 数据源 -->
        <property name="dataSource" ref="dataSource"/>
        <property name="configLocation" value="classpath:mybatis-config.xml"/>
        <!-- 别名处理 -->
        <property name="typeAliasesPackage" value="com.hl1015.mp.beans"/>
    </bean>
    
    <!-- 配置 mybatis 扫描 mapper 接口的路径 -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.hl1015.mp.mapper"/>
    </bean>
</beans>
```

## 4. 测试

（1）测试 Spring-MyBatis 的环境，保证 OK

```java
public class Test01 {

    private ApplicationContext iocContext = new ClassPathXmlApplicationContext("applicationContext.xml");

    @Test
    public void testEnvironment() throws Exception {
        DataSource ds = iocContext.getBean("dataSource", DataSource.class);
        Connection conn = ds.getConnection();
        System.out.println("conn = " + conn);
    }
}
```

![image-20211127130037241](http://img.hl1015.top/blog/image-20211127130037241.png)

## 5. 集成 MP

MyBatis-Plus 的集成非常简单，对于 Spring，我们仅仅需要把 MyBatis 自带的 MyBatisSqlSessionFactoryBean 替换为 MP 自带的即可

```xml
<!-- 配置 SqlSessionFactoryBean -->
<!-- MyBatis 提供的：org.mybatis.spring.SqlSessionFactoryBean -->
<!-- MyBatis-Plus 提供的：com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean -->
<!-- 集成 MP，只需要将 MyBatis 自带的 MyBatisSqlSessionFactoryBean 替换为 MP 自带的即可 -->
<bean id="sqlSessionFactoryBean" class="com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean">
	<!-- 数据源 -->
	<property name="dataSource" ref="dataSource"></property>
	<property name="configLocation" value="classpath:mybatis-config.xml"></property>
	<!-- 别名处理 -->
	<property name="typeAliasesPackage" value="com.hl1015.mp.beans"></property>
</bean>
```

