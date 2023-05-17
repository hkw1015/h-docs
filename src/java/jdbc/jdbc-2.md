---
title: 获取数据库连接
date: 2021-09-14
category: Java
tag:
 - JDBC
---

## 0. 准备工作

由于这里使用的是 MySQL 8，所以以 MySQL 8 做示例

MySQL8 数据库驱动下载地址：[https://dev.mysql.com/downloads/connector/j/](https://dev.mysql.com/downloads/connector/j/)

![image-20210914152740939](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914152740939.png)

## 1. 要素一：Driver 接口实现类

Driver 接口介绍

（1）java.sql.Driver 接口是所有 JDBC 驱动程序要实现的接口，这个接口是提供给数据库厂商使用的，不同的数据库厂商提供不同的实现。

（2）在程序中不需要直接去访问实现了 Driver 接口的类，而是由驱动程序管理器类（java.sql.DriverManager）去调用这些 Driver 实现。

（3）Oracle 的驱动：oracle.jdbc.driver.OracleDriver

**MySQL 的驱动：com.mysql.jdbc.Driver（mysql 8 之前）和 com.mysql.cj.jdbc.Driver（mysql 8 之后）**

## 2. 要素二：URL

（1）JDBC URL 用于标识一个被注册的驱动程序，驱动程序管理器通过这个 URL 选择正确的驱动程序，从而建立到数据库的连接。

（2）JDBC URL 的标准由三部分组成，各部分间用冒号分隔。

```
jdbc:子协议:子名称
```

- **协议**：JDBC URL中的协议总是 jdbc
- **子协议**：子协议用于标识一个数据库驱动程序
- **子名称**：一种标识数据库的方法，子名称可以依不同的子协议而变化，用子名称的目的是为了定位数据库提供足够的信息，包含主机名（对应服务端的 ip 地址），端口号，数据库名。

（3）举例

![image-20210914153505421](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914153505421.png)

（4）MySQL 的连接 URL 编写方式

```
jdbc:mysql://主机名称:mysql服务端口号/数据库名称?参数=值&参数=值
比如：
jdbc:mysql://localhost:3306/test
```

## 3. 要素三：用户名和密码

举例：

```
username: root
password: 123456
```

## 4. 数据库连接方式举例

**准备工作**

第一步，Eclipse 中新建一个 java 工程

第二步，右键工程，New > Folder，取名 lib

![image-20210914153923956](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914153923956.png)

第三步，将下载的 MySQL 8 的数据库驱动压缩包解压后，将其中的驱动 jar 包复制到 lib 目录下

![image-20210914153957312](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914153957312.png)

第四步，右键 lib 下的 mysql-connector-java-8.0.21.jar 包，选择 Build Path > Add to Build Path

![image-20210914154051898](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914154051898.png)

可以看到添加成功后的效果

![image-20210914154111776](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914154111776.png)

### 4.1 连接方式一

```java
// 获取数据库的方式一
@Test
public void testConnection1() throws Exception {
	// 获取 Driver 实现类对象
	// MySQL 8 以上，driver 需要换成 com.mysql.cj.jdbc.Driver
	Driver driver = new com.mysql.cj.jdbc.Driver();

	// MySQL8以上，url里后缀需要追加上?serverTimezone=GMT%2B8
	String url = "jdbc:mysql://localhost:3306/students?serverTimezone=GMT%2B8";
	// 将用户名和密码封装在 Properties 中
	Properties info = new Properties();
	info.setProperty("user", "root");
	info.setProperty("password", "root");

	Connection conn = driver.connect(url,info);	

	System.out.println(conn); 
}
```

### 4.2 连接方式二

```java
// 获取数据库的方式二
// 对方式一的迭代，不出现第三方的 API，使得程序具有更好的可移植性
@Test
public void testConnection2() throws Exception {
	// 1.获取 Driver 实现类对象，使用反射来实现
	Class clazz = Class.forName("com.mysql.cj.jdbc.Driver");
	Driver driver = (Driver) clazz.newInstance();
	
	// 2.提供要连接的数据库的 url
    String url = "jdbc:mysql://localhost:3306/students?serverTimezone=GMT%2B8";
    
    // 3.提供需要的用户名和密码
    Properties info = new Properties();
    info.setProperty("user", "root");
    info.setProperty("password", "root");
    
    // 4.获取连接
    Connection conn = driver.connect(url, info);
    
    System.out.println(conn);
}
```

### 4.3 连接方式三

```java
// 获取数据库的方式三
// 使用 DriverManager
@Test
public void testConnection3() throws Exception {
	// 1.获取 Driver 实现类对象，使用反射来实现
	Class clazz = Class.forName("com.mysql.cj.jdbc.Driver");
	Driver driver = (Driver) clazz.newInstance();
	
	// 2.提供另外三个连接的基本信息
    String url = "jdbc:mysql://localhost:3306/students?serverTimezone=GMT%2B8";
    String user = "root";
    String password = "root";
    
    // 3.注册驱动
    DriverManager.deregisterDriver(driver);
    
    // 4.获取连接
    Connection conn = DriverManager.getConnection(url, user, password);
    
    System.out.println(conn);
}
```

### 4.4 连接方式四

```java
// 获取数据库的方式四
// 可以只是加载驱动，不用显示地注册驱动了
@Test
public void testConnection4() throws Exception {
	// 1.提供另外三个连接的基本信息
	String url = "jdbc:mysql://localhost:3306/students?serverTimezone=GMT%2B8";
	String user = "root";
	String password = "root";
		
    // 2.加载Driver
    Class.forName("com.mysql.cj.jdbc.Driver"); // 虽说省了还是支持 MySQL,但是最好别省
    // 相较于方式三，可以省略如下的操作：
    // Driver driver = (Driver) clazz.newInstance();
    // 注册驱动
    // DriverManager.deregisterDriver(driver);
    // 为什么?因为在 mysql 的实现类中，静态代码块中声明了 DriverManager.deregisterDriver(new Driver()); 的操作
    
    // 4.获取连接
    Connection conn = DriverManager.getConnection(url, user, password);
    
    System.out.println(conn);
}
```

### 4.5 连接方式五（最终版）

```java
// 获取数据库的方式五(final版)
// 将数据库连接需要的 4 个基本信息声明在配置文件中，通过读取配置文件的方式，获取连接
/**
 * 此方法的好处?
 * 1.实现了数据和代码的分离，实现了解耦
 * 2.如果需要修改配置文件信息，可以避免程序重新打包
 */
@Test
public void testConnection5() throws Exception {
    // 1.读取配置文件中的 4 个基本信息
    InputStream is = ConnectionTest.class.getClassLoader().getResourceAsStream("jdbc.properties");
    
    Properties pro = new Properties();
    pro.load(is);
    
    String user = pro.getProperty("user");
    String password = pro.getProperty("password");
    String url = pro.getProperty("url");
    String driverClass = pro.getProperty("driverClass");
    
    // 2.加载驱动
    Class.forName(driverClass);
    
    // 3.获取连接
    Connection conn = DriverManager.getConnection(url, user, password);
    
    System.out.println(conn);
}
```