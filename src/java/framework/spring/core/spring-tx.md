---
title: 事务管理
date: 2021-08-23
category: 常用框架
tag:
  - Spring
---

## 1. 事务实现的分类

- **声明式事务**

  指的是通过注解的方式对事务的各种特性进行控制和管理

- **编程式事务**

  指的是通过编码的方式实现事务的声明

  ```java
  Connection conn = JdbcUtils.getConnection();
  try {
      conn.setAutoCommit(false); // 必须自己 commit()
      // 一系列业务相关的 jdbc 操作
      conn.commit(); // 提交事务
  } catch(Exception e) {
      conn.rollback();
  } finally {
      JdbcUtils.close(conn); // 释放连接
  }
  ```

## 2. Spring 声明式事务的介绍

- **事务添加到 JavaEE 三层结构中的 Service 层（业务逻辑层）**

- **Spring 中进行声明式事务管理，底层使用的是 AOP 原理**

- **PlatformTransactionManager 类的简单介绍**

  **<span style="color:red">PlatformTransactionManager 接口，提供所有事务的操作规范。我们使用 DataSource 数据库连接池，使用的事务管理器是 DataSourceTransactionManager 类</span>**

  ![image-20210824000039726](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210824000039726.png)

  实现事务管理的底层 AOP 原理图

  ![image-20210824000311094](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210824000311094.png)

## 3. 声明式事务管理（注解 @Transactional）的使用

- **配置 Spring 事务需要的切面类 DataSourceTransactionManager**

  ```xml
  <!-- 配置DataSourceTransactionManager事务管理器===事务的切面类 -->
  <bean id="dataSourceTransactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
      <property name="dataSource" ref="dataSource"></property>
  </bean>
  ```

- **在 Spring 配置文件中加入 tx 名称空间**

  ```xml
  xmlns:tx="http://www.springframework.org/schema/tx"
  http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd
  ```

  ![image-20210824000759072](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210824000759072.png)

- **配置启用 Spring 的事务注解 @Transactional**

  ```java
  <!-- 配置启用spring的事务注解@Transaction -->
  <tx:annotation-driven transaction-manager="dataSourceTransactionManager"></tx:annotation-driven>
  ```

- **在 service 层中需要的业务类或方法上添加 @Transactional 注解**

  （1）@Transactional，这个注解可以添加到类上，也可以添加到方法上

  （2）如果把这个注解添加到类上，则为这个类里的所有方法都添加事务

  （3）如果把这个注解添加到方法上，则为这个方法添加事务

  ```java
  @Transactional
  @Override
  public boolean updateUser(User user) {
      int i = userDao.updateUser(user.getUsername(), user.getPassword(), user.getEmail(), user.getId());
      boolean flag = (i == 1) ? true : false;
      return flag;
  }
  ```

- **@Transactional 中的属性**

  ![image-20210824001517470](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210824001517470.png)

  （1）**<span style="color:red">propagation：事务传播行为</span>**

  多个事务方法之间的调用，是通过 **事务传播行为** 进行管理的

  事务的传播特性，有以下几种类型：

  | 传播属性         | 描述                                                         |
  | ---------------- | ------------------------------------------------------------ |
  | **REQUIRED**     | 如果有事务在运行，当前的方法就在这个事务内运行，否则，就启动一个新的事务，并在自己的事务内运行 |
  | **REQUIRES_NEW** | 当前的方法必须启动新事务，并在它自己的事务内运行，如果有事务正在运行，应该将它挂起 |
  | SUPPORTS         | 如果有事务在运行，当前的方法就在这个事务内运行，否则它可以不运行在事务中 |
  | NOT_SUPPORTED    | 当前的方法不应该运行在事务中，如果有运行的事务，将它挂起     |
  | MANDATORY        | 当前的方法必须运行在事务内部，如果没有正在运行的事务，就抛出异常 |
  | NEVER            | 当前的方法不应该运行在事务中，如果有运行的事务，就抛出异常   |
  | NESTED           | 如果有事务在运行，当前的方法就应该在这个事务的嵌套事务内运行，否则，就启动一个新的事务，并在它自己的事务内运行 |

  ![image-20210824002803882](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210824002803882.png)

  （2）**<span style="color:red">isolation：事务隔离级别</span>**

  MySQL 数据库提供 4 种隔离级别

  | 隔离级别                        | 描述                                                         |
  | :------------------------------ | ------------------------------------------------------------ |
  | **READ UNCOMMITED**（读未提交） | 允许事务读取未被其他事务提交的变更。脏读、不可重复读、幻读都会出现。 |
  | **READ COMMITED**（读已提交）   | 只允许事务读取已经被其他事务提交的变更。可以避免脏读、但不可重复读和幻读问题仍然可能出现。 |
  | **REPEATABLE READ**（可重复读） | 确保事务可以从一个字段种读取相同的值，在这个事务持续期间，禁止其他事务对这个字段进行更新，可以避免脏读和不可重复读，但幻读的问题仍然存在。 |
  | **SERIALIZABLE**（串行化）      | 确保事务可以从表中读取相同的行，在这个事务持续期间，禁止其他事务对该表执行查询、更新和删除操作，所有并发问题都能避免，但性能十分低下。 |

  ![image-20210824003818381](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210824003818381.png)

  （3）**<span style="color:red">timeout：超时时间</span>**

  ①事务需要在一定时间内进行提交，如果不提交就进行回滚

  ②默认值是 -1，设置时间以秒为单位进行计算

  （4）**<span style="color:red">readOnly：是否只读</span>**

  ①读：查询操作 写：添加/修改/删除

  ②readOnly 默认值 false，表示可以查询，可以添加/修改/删除

  ③设置 readOnly 为 true，只能做查询操作

  （5）**<span style="color:red">rollbackFor：回滚</span>**

  设置出现哪些异常时进行事务回滚

  （6）**<span style="color:red">noRollbackFor：不回滚</span>**

  设置出现哪些异常时不进行事务回滚

## 4. xml 配置式事务声明

第一步：去掉所有的 @Transactional 注解

第二步：在 Spring 配置文件中做如下配置

```xml
<!--1 创建事务管理器-->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <!--注入数据源-->
    <property name="dataSource" ref="dataSource"></property>
</bean>

<!--2 配置通知-->
<tx:advice id="txadvice">
    <!--配置事务参数-->
    <tx:attributes>
        <!--指定哪种规则的方法上面添加事务-->
        <tx:method name="updateUser" propagation="REQUIRED"/>
    </tx:attributes>
</tx:advice>

<!--3 配置切入点和切面-->
<aop:config>
    <!--配置切入点-->
    <aop:pointcut id="pt" expression="execution(*com.hkw.spring5.service.*.*(..))"/>
    <!--配置切面-->
    <aop:advisor advice-ref="txadvice" pointcut-ref="pt"/>
</aop:config>
```

## 5. 完全注解声明式事务

```java
// 创建配置类，使用配置类替代 xml 配置文件
@Configuration //配置类
@ComponentScan(basePackages = "com.hkw") //组件扫描
@EnableTransactionManagement //开启事务
public class TxConfig {
    // 创建数据库连接池
    @Bean
    public DruidDataSource getDruidDataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/book?serverTimezone=GMT%2B8");
        dataSource.setUsername("root");
        dataSource.setPassword("root");
        return dataSource;
    }
    
    // 创建 JdbcTemplate 对象
    @Bean
    public JdbcTemplate getJdbcTemplate(DataSource dataSource) {
        //到 ioc 容器中根据类型找到 dataSource
        JdbcTemplate jdbcTemplate = new JdbcTemplate();
        //注入 dataSource
        jdbcTemplate.setDataSource(dataSource);
        return jdbcTemplate;
    }
    
    // 创建事务管理器
    @Bean
    public DataSourceTransactionManager getDataSourceTransactionManager(DataSource dataSource) {
        DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
        transactionManager.setDataSource(dataSource);
        return transactionManager;
    }
}
```

