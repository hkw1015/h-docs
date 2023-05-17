---
title: JdbcTemplate
date: 2021-08-23
category: 常用框架
tag:
  - Spring
---

## 1. 概念和准备

- **什么是 JdbcTemplate**

  Spring 框架对 JDBC 进行封装，使用 JdbcTemplate 方便实现对数据库进行操作

- **准备工作**

  （1）引入相关 jar 包

  ![image-20210823224228196](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210823224228196.png)

  （2）在 Spring 配置文件中配置数据库连接池

  ```xml
  <!-- 引入外部属性文件 -->
  <context:property-placeholder location="classpath:jdbc.properties"/>
  
  <!-- 配置连接池 -->
  <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
      <property name="driverClassName" value="${prop.driverClassName}"></property>
      <property name="url" value="${prop.url}"></property>
      <property name="username" value="${prop.username}"></property>
      <property name="password" value="${prop.password}"></property>
  </bean>
  ```

  （3）配置 JdbcTemplate 对象，注入数据源 dataSource

  ```xml
  <!-- 配置JdbcTemplate对象，注入dataSource -->
  <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
      <property name="dataSource" ref="dataSource"></property>
  </bean>
  ```

  （4）创建 service 接口及实现类、dao 接口及实现类

  在配置文件中开启注解扫描

  ```xml
  <!-- 开启注解扫描 -->
  <context:component-scan base-package="com.hkw"></context:component-scan>
  ```

  service 层中注入 dao 对象

  ```java
  @Service
  public class UserServiceImpl implements UserService {
      @Autowired
      private UserDao userDao = new UserDaoImpl();
  }
  ```

  dao 层中注入 JdbcTemplate 对象

  ```java
  @Repository
  public class UserDaoImpl implements UserDao {
      @Autowired
      private JdbcTemplate jdbcTemplate;
  }
  ```

## 2. JdbcTemplate 操作数据库

### 添加

（1）创建数据库对应实体 User 类（ORM 思想）

```java
public class User {
    private Integer id;
    private String username;
    private String password;
    private String email;
    ...
}
```

（2）编写 service 和 dao

①在 dao 中编写数据库添加的实现

②调用 JdbcTemplate 对象里的 update() 方法实现添加操作

![image-20210823225210214](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210823225210214.png)

> **里面有两个参数：**
>
> **String sql 代表 sql 语句**
>
> **Object ... args 可变参数代表设置占位符的值**

UserDao

```java
public interface UserDao {
    int insertUser(Object ... args);
}
```

UserDaoImpl

```java
@Repository
public class UserDaoImpl implements UserDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int insertUser(Object ... args) {
        String sql = "insert into t_user(username,password,email) values(?.?.?)";
        int update = jdbcTemplate.update(sql, args);
        return update;
    }
}
```

UserService

```java
public interface UserService {
    // 注册用户
    boolean registUser(User user);
}
```

UserServiceImpl

```java
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Override
    public boolean registUser(User user) {
        int i = userDao.insertUser(user.getUsername(), user.getPassword(), user.getEmail());
        boolean flag = (i == 1) ? true : false;
        return flag;
    }
}
```

测试一下

```java
@Test
public void testRegistUser() throws SQLException {
    ApplicationContext ioc = new ClassPathXmlApplicationContext("bean10.xml");
    UserServiceImpl userServiceImpl = ioc.getBean("userServiceImpl", UserServiceImpl.class);
    User user = new User();
    user.setUsername("john");
    user.setPassword("111222");
    user.setEmail("john@123.com");
    System.out.println(userServiceImpl.registUser(user));
}
```

测试结果：

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/JdbcTemplate%E6%93%8D%E4%BD%9C%E6%95%B0%E6%8D%AE%E5%BA%93%E4%B9%8B%E6%B7%BB%E5%8A%A0%E4%B8%80%E6%9D%A1%E8%AE%B0%E5%BD%95.gif)

### 修改和删除

UserDao

```java
int updateUser(Object... args);

int deleteUserById(int id);
```

UserDaoImpl

```java
@Override
public int updateUser(Object... args) {
    String sql = "update t_user set username = ?,password = ?,email = ? where id = ?";
    int update = jdbcTemplate.update(sql, args);
    return 0;
}

@Override
public int deleteUserById(int id) {
    String sql = "delete from t_user where id = ?";
    int update = jdbcTemplate.update(sql, args);
    return 0;
}
```

UserService

```java
boolean updateUser(User user);

boolean deleteUser(Integer id);
```

UserServiceImpl

```java
@Override
public boolean updateUser(User user) {
    int i = userDao.updateUser(user.getUsername(), user.getPassword(), user.getEmail(), user.getId());
    boolean flag = (i == 1) ? true : false;
    return flag;
}

@Override
public boolean deleteUser(Integer id) {
    int i = userDao.deleteUserById(id);
    boolean flag = (i == 1) ? true : false;
    return flag;
}
```

测试一下

修改

```java
@Test
public void testUpdateUser() {
    ApplicationContext ioc = new ClassPathXmlApplicationContext("bean10.xml");
    UserServiceImpl userServiceImpl = ioc.getBean("userServiceImpl", UserServiceImpl.class);
    User user = new User();
    user.setId(21);
    user.setUsername("john1");
    user.setPassword("222333");
    user.setEmail("john1@321.com");
    System.out.println(userServiceImpl.updateUser(user));
}
```

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/JdbcTemplate%E6%93%8D%E4%BD%9C%E6%95%B0%E6%8D%AE%E5%BA%93%E4%B9%8B%E4%BF%AE%E6%94%B9%E4%B8%80%E6%9D%A1%E8%AE%B0%E5%BD%95.gif)

删除

```java
@Test
public void testDeleteUser() {
    ApplicationContext ioc = new ClassPathXmlApplicationContext("bean10.xml");
    UserServiceImpl userServiceImpl = ioc.getBean("userServiceImpl", UserServiceImpl.class);
    System.out.println(userServiceImpl.deleteUser(21));
}
```

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/JdbcTemplate%E6%93%8D%E4%BD%9C%E6%95%B0%E6%8D%AE%E5%BA%93%E4%B9%8B%E5%88%A0%E9%99%A4%E4%B8%80%E6%9D%A1%E8%AE%B0%E5%BD%95.gif)

### 查询返回某个值

（1）比如，我们要查询某个表中一共有几条记录，返回的就是某个值

（2）使用 JdbcTemplate 实现查询返回某个值

```java
Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
```

> **里面有两个参数：**
>
> **String sql 代表 sql 语句**
>
> **Class requiredType 代表返回类型的 Class 对象****

UserDao

```java
int selectCount();
```

UserDaoImpl

```java
@Override
public int selectCount() {
    String sql = "select count(*) from t_user";
    Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
    return count;
}
```

UserService

```java
int getTotalNumberOfUsers();
```

UserServiceImpl

```java
@Override
public int getTotalNumberOfUsers() {
    int count = userDao.selectCount();
    return count;
}
```

测试一下

```java
@Test
public void testGetTotalNumberOfUsers() {
    ApplicationContext ioc = new ClassPathXmlApplicationContext("bean10.xml");
    UserServiceImpl userServiceImpl = ioc.getBean("userServiceImpl", UserServiceImpl.class);
    System.out.println(userServiceImpl.getTotalNumberOfUsers());
}
```

测试结果：

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/JdbcTemplate%E6%93%8D%E4%BD%9C%E6%95%B0%E6%8D%AE%E5%BA%93%E4%B9%8B%E6%9F%A5%E8%AF%A2%E8%BF%94%E5%9B%9E%E6%9F%90%E4%B8%AA%E5%80%BC.gif)

### 查询返回对象

（1）比如查询某个用户信息

（2）使用 JdbcTemplate 实现查询返回对象

```java
User user = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(User.class), id);
```

> **里面有三个参数：**
>
> **String sql 代表 sql 语句**
>
> **RowMapper rowMapper 接口代表返回不同类型的数据，使用这个接口里面的实现类完成数据封装**
>
> **Object ... args 可变参数代表设置占位符的值**

UserDao

```java
User selectUserById(Integer id);
```

UserDaoImpl

```java
@Override
public User selectUserById(Integer id) {
    String sql = "select * from t_user where id = ?";
    User user = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(User.class),id);
    return user;
}
```

UserService

```java
User getUser(Integer id);
```

UserServiceImpl

```java
@Override
public User getUser(Integer id) {
    User user = userDao.selectUserById(id);
    return user;
}
```

测试一下

```java
@Test
public void testGetUser() {
    ApplicationContext ioc = new ClassPathXmlApplicationContext("bean10.xml");
    UserServiceImpl userServiceImpl = ioc.getBean("userServiceImpl", UserServiceImpl.class);
    User user = userServiceImpl.getUser(19);
    System.out.println(user);
}
```

测试结果

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/JdbcTemplate%E6%93%8D%E4%BD%9C%E6%95%B0%E6%8D%AE%E5%BA%93%E4%B9%8B%E6%9F%A5%E8%AF%A2%E8%BF%94%E5%9B%9E%E5%AF%B9%E8%B1%A1.gif)

### 查询返回对象集合

（1）比如：查询用户分页列表或所有用户

（2）使用 JdbcTemplate 实现查询返回对象集合

```java
List<User> userList = jdbcTemplate.query(sql, newBeanPropertyRowMapper<>(User.class));
```

> **里面有三个参数：**
>
> **String sql 代表 sql 语句**
>
> **RowMapper rowMapper 接口代表返回不同类型的数据，使用这个接口里面的实现类完成数据封装**
>
> **Object ... args 可变参数代表设置占位符的值**

UserDao

```java
List<User> selectAllUserList();
```

UserDaoImpl

```java
@Override
public List<User> selectAllUserList() {
    String sql = "select * from t_user";
    List<User> userList = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(User.class));
    return userList;
}
```

UserService

```java
List<User> getAllUserList();
```

UserServiceImpl

```java
@Override
public List<User> getAllUserList() {
    List<User> userList = userDao.selectAllUserList();
    return userList;
}
```

测试一下

```java
@Test
public void testGetAllUserList() {
    ApplicationContext ioc = new ClassPathXmlApplicationContext("bean10.xml");
    UserServiceImpl userServiceImpl = ioc.getBean("userServiceImpl", UserServiceImpl.class);
    List<User> userList = userServiceImpl.getAllUserList();
    userList.forEach(System.out::println);
}
```

测试结果：

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/JdbcTemplate%E6%93%8D%E4%BD%9C%E6%95%B0%E6%8D%AE%E5%BA%93%E4%B9%8B%E6%9F%A5%E8%AF%A2%E8%BF%94%E5%9B%9E%E9%9B%86%E5%90%88%E5%AF%B9%E8%B1%A1.gif)

### 批量操作

（1）批量操作：操作表里的多条数据

（2）使用 JdbcTemplate 实现批量操作

```java
int[] ints = jdbcTemplate.batchUpdate(sql, batchArgs);
```

> **里面有两个参数：**
>
> **String sql 代表 sql 语句**
>
> **List batchArgs 代表批量的占位符的 List 集合**

UserDao

```java
int[] batchInsertUser(List<Object[]> batchArgs);

int[] batchUpdateUser(List<Object[]> batchArgs);

int[] batchDeleteUser(List<Object[]> batchArgs);
```

UserDaoImpl

```java
@Override
public int[] batchInsertUser(List<Object[]> batchArgs) {
    String sql = "insert into t_user(username,password,email) values(?,?,?)";
    int[] ints = jdbcTemplate.batchUpdate(sql, batchArgs);
    return ints;
}

@Override
public int[] batchUpdateUser(List<Object[]> batchArgs) {
    String sql = "update t_user set username = ?,password = ?,email = ? where id = ?";
    int[] ints = jdbcTemplate.batchUpdate(sql, batchArgs);
    return ints;
}

@Override
public int[] batchDeleteUser(List<Object[]> batchArgs) {
    String sql = "delete from t_user where id = ?";
    int[] ints = jdbcTemplate.batchUpdate(sql, batchArgs);
    return ints;
}
```

UserService

```java
boolean batchAddUser(List<Object[]> batchArgs);

boolean batchUpdateUser(List<Object[]> batchArgs);

boolean batchDeleteUser(List<Object[]> batchArgs);
```

UserServiceImpl

```java
@Override
public boolean batchAddUser(List<Object[]> batchArgs) {
    int[] ints = userDao.batchInsertUser(batchArgs);
    boolean flag = (ints.length > 0) ? true : false;
    System.out.println("ints: " + ints);
    return flag;
}

@Override
public boolean batchUpdateUser(List<Object[]> batchArgs) {
    int[] ints = userDao.batchUpdateUser(batchArgs);
    boolean flag = (ints.length > 0) ? true : false;
    System.out.println("ints: " + ints);
    return flag;
}

@Override
public boolean batchDeleteUser(List<Object[]> batchArgs) {
    int[] ints = userDao.batchDeleteUser(batchArgs);
    boolean flag = (ints.length > 0) ? true : false;
    System.out.println("ints: " + ints);
    return flag;
}
```

测试一下

批量添加

```java
@Test
public void testBatchAddUser() {
    ApplicationContext ioc = new ClassPathXmlApplicationContext("bean10.xml");
    UserServiceImpl userServiceImpl = ioc.getBean("userServiceImpl", UserServiceImpl.class);
    List<Object[]> batchArgs = new ArrayList<>();
    Object[] o1 = {"test1","111111","test1@168.com"};
    Object[] o2 = {"test2","222222","test2@168.com"};
    Object[] o3 = {"test3","333333","test3@168.com"};
    batchArgs.add(o1);
    batchArgs.add(o2);
    batchArgs.add(o3);
    System.out.println(userServiceImpl.batchAddUser(batchArgs));
}
```

批量修改

```java
@Test
public void testBatchUpdateUser() {
    ApplicationContext ioc = new ClassPathXmlApplicationContext("bean10.xml");
    UserServiceImpl userServiceImpl = ioc.getBean("userServiceImpl", UserServiceImpl.class);
    List<Object[]> batchArgs = new ArrayList<>();
    Object[] o1 = {"test11","1111","test11@168.com",22};
    Object[] o2 = {"test22","222","test22@168.com",23};
    Object[] o3 = {"test33","33333","test33@168.com",24};
    batchArgs.add(o1);
    batchArgs.add(o2);
    batchArgs.add(o3);
    System.out.println(userServiceImpl.batchUpdateUser(batchArgs));
}
```

批量删除

```java
@Test
public void testBatchDeleteUser() {
    ApplicationContext ioc = new ClassPathXmlApplicationContext("bean10.xml");
    UserServiceImpl userServiceImpl = ioc.getBean("userServiceImpl", UserServiceImpl.class);
    List<Object[]> batchArgs = new ArrayList<>();
    Object[] o1 = {22};
    Object[] o2 = {23};
    Object[] o3 = {24};
    batchArgs.add(o1);
    batchArgs.add(o2);
    batchArgs.add(o3);
    System.out.println(userServiceImpl.batchDeleteUser(batchArgs));
}
```

测试结果：

批量添加

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/JdbcTemplate%E6%93%8D%E4%BD%9C%E6%95%B0%E6%8D%AE%E5%BA%93%E4%B9%8B%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0.gif)

批量修改

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/JdbcTemplate%E6%93%8D%E4%BD%9C%E6%95%B0%E6%8D%AE%E5%BA%93%E4%B9%8B%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9.gif)

批量删除

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/JdbcTemplate%E6%93%8D%E4%BD%9C%E6%95%B0%E6%8D%AE%E5%BA%93%E4%B9%8B%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4.gif)

