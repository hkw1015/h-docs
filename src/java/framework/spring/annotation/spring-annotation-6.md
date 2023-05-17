---
title: 声明式事务应用
date: 2021-12-11
category: 常用框架
tag:
  - Spring 注解
---

## 1. 环境搭建

**（1）导入依赖【数据源、数据库驱动、spring-jdbc模块】**

```xml
<!--数据源-->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.2.6</version>
</dependency>
<!--数据库驱动-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.22</version>
</dependency>
<!--spring-jdbc模块-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>5.3.5</version>
</dependency>
```

**（2）配置 数据源、JdbcTemplate（Spring 提供的简化数据库操作的工具）**

```java
@ComponentScan(value = {"com.hkw.annotation.service", "com.hkw.annotation.dao"})
@Configuration
public class TxConfig {

    @Bean
    public DataSource dataSource() {
        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setUsername("root");
        druidDataSource.setPassword("root");
        druidDataSource.setUrl("jdbc:mysql://localhost:3306/dbo_test");
        druidDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        return druidDataSource;
    }

    @Bean
    public JdbcTemplate jdbcTemplate() {
        // Spring 对 @Configuration 类会特殊处理，给容器中加组件的方法，多次调用都只是从容器中获取组件
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource());
        return jdbcTemplate;
    }
}
```

**（3）创建数据库表、UserService、UserDao 类**

tb_user  表：

```sql
CREATE TABLE `tb_user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `name` varchar(255) DEFAULT NULL COMMENT '姓名',
  `age` int DEFAULT NULL COMMENT '年龄',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表';
```

UserService 类：

```java
@Service
public class UserService {

    @Autowired
    private UserDao userDao;
    
    public void insertUser() {
        userDao.insert();
    }
}
```

UserDao 类：

```java
@Repository
public class UserDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void insert() {
        String sql = "insert into tb_user(`name`, age) values(?, ?)";
        String name = UUID.randomUUID().toString().substring(0, 5);
        int age = 18;
        jdbcTemplate.update(sql, name, age);
        System.out.println("插入成功~~~");
    }
}
```

**（4）测试代码**

```java
@Test
public void test18() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(TxConfig.class);
    UserService userService = context.getBean(UserService.class);
    userService.insertUser();
}
```

![image-20211211140827014](http://img.hl1015.top/blog/image-20211211140827014.png)

查看数据库表中数据（插入成功）：

![image-20211211140901998](http://img.hl1015.top/blog/image-20211211140901998.png)

## 2. 声明式事务的使用

**（1）测试无事务的情况**

UserService 类改造：

```java
@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    public void insertUser() {
        userDao.insert();
        int i = 10 / 0; // 制造一个异常
    }
}
```

再次运行上面的测试代码：

![image-20211211141240616](http://img.hl1015.top/blog/image-20211211141240616.png)

控制台报出了**算术异常**，我们查看数据库表中的数据（虽然报错了，但数据还是插入成功了）：

![image-20211211141439269](http://img.hl1015.top/blog/image-20211211141439269.png)

但是我们希望在程序出现异常的时候，对于数据库的添加或者修改操作能够撤回（即回滚），这时候我们就需要用到事务

**（2）添加声明式事务**

- 在方法上标注 @Transactional 注解，表示当前方法是一个事务方法

  ```java
  @Transactional
  public void insertUser() {
      userDao.insert();
      int i = 10 / 0;
  }
  ```

- 在配置类上添加 @EnableTransactionalManagement 注解，开启基于注解的事务管理功能

  ```java
  @EnableTransactionManagement
  @ComponentScan(value = {"com.hkw.annotation.service", "com.hkw.annotation.dao"})
  @Configuration
  public class TxConfig {
  	...
  }
  ```

- 配置事务管理器来控制事务

  ```java
  // 注册事务管理器
  @Bean
  public PlatformTransactionManager platformTransactionManager() {
      return new DataSourceTransactionManager(dataSource());
  }
  ```

**（7）测试有事务的情况**

再次运行上面的测试代码：

![image-20211211143244928](http://img.hl1015.top/blog/image-20211211143244928.png)

同样还是报了异常，这时我们查看数据库表中的数据（数据插入失败）：

![image-20211211143347224](http://img.hl1015.top/blog/image-20211211143347224.png)

声明式事务保证了方法的原子性和一致性，其中的 SQL 操作要么都成功，要么都失败！