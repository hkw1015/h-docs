---
title: 数据库连接池
date: 2021-09-14
category: Java
tag:
 - JDBC
---

## 1. JDBC 数据库连接池的必要性

（1）在使用开发基于数据库的 web 程序时，传统的设计模式是按以下步骤：

- ①在主程序(如 servlet、beans)中建立数据库连接
- ②进行 sql 操作
- ③断开数据库连接

（2）这种模式开发，存在的问题：

- ①**普通的 JDBC 数据库连接使用 DriverManager 来获取**，每次向数据库建立连接的时候都要将 Connection 加载到内存中，再验证用户名和密码(得花费0.05s~1s的时间)。需要数据库连接的时候，就向数据库要求一个，执行完成后再断开连接。这样的方式将会消耗大量的资源和时间。数据库的连接资源并没有得到很好的利用。若同时有几百人甚至几千人在线，频繁的进行数据库连接操作将占用很多的系统资源，严重的甚至会造成服务器的崩溃。
- ②**对于每一次数据库连接，使用完后都得断开**。否则，如果程序出现异常而未能关闭，将会导致数据库系统中的内存泄露，最终将导致重启数据库。(回忆：何为 Java 的内存泄露?)
- ③**这种开发不能控制被创建的连接对象数**，系统资源会被毫无顾及地分配出去，如果连接过多，也可能导致内存泄漏，服务器崩溃。

## 2. 数据库连接池技术

（1）为解决传统开发中的数据库连接问题，可以采用数据库连接池技术。

（2）**数据库连接池的基本思想**：就是为数据库连接建立一个 "缓冲池"。预先在缓存池中放入一定数量的连接，当需要建立数据库连接时，只需从 "缓冲池" 中取出一个，使用完毕之后再放回去。

（3）**数据库连接池**负责分配、管理和释放数据库连接，它**允许应用程序重复使用一个现有的数据库连接，而不是重新建立一个**。

（4）数据库连接池在初始化时将创建一定数量的数据库连接放到连接池中，这些数据库连接的数量是由**最小数据库连接数**来设定的。无论这些数据库连接是否使用，连接池都将一直保证至少拥有这么多的连接数量。连接池的最大数据库连接数量限定了这个连接池能占有的最大连接数，当应用程序向连接池请求的连接数超过最大连接数量时，这些请求将被加入到等待队列中。

![image-20210914172610735](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914172610735.png)

（5）工作原理

![image-20210914172631073](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914172631073.png)

（6）数据库连接池的优点

- ①**资源重用**
  - 由于数据库连接得以重用，避免了频繁创建，释放连接引起的大量性能开销。在减少系统消耗的基础上，另一方面也增加了系统运行环境的平稳性。
- ②**更快的系统反应速度**
  - 数据库连接池在初始化过程中，往往已经创建了若干数据库连接置于连接池中备用。此时连接的初始化工作均已完成。对于业务请求处理而言，直接利用现有可用连接，避免了数据库连接初始化和释放过程的时间开销，从而减少了系统的响应时间。
- ③**新的资源分配手段**
  - 对于多应用共享同一数据库的系统而言，可在应用层通过数据库连接池的配置，实现某一应用最大可用数据库连接数的限制，避免某一应用独占所有的数据库资源。
- ④**统一的连接管理，避免数据库连接泄露**
  - 在较为完善的数据库连接池实现中，可根据预先的占用超时设定，强制回收被占用连接，从而避免了常规数据库操作中可能出现的资源泄露。

## 3. 多种开源的数据库连接池

（1）JDBC 的数据库连接池使用 javax.sql.DataSource 来表示，DataSource 只是一个接口，该接口通常由服务器（Weblogic，WebSphere，Tomcat）提供实现，也有一些开源组织提供实现。

- ①**DBCP** 是 Apache 提供的数据库连接池。Tomcat服务器自带dbcp数据库连接池，速度相对 c3p0 较快，但因自身原因存在 BUG，Hibernate3 已不再提供支持。
- ②**C3P0** 是一个开源组织提供的一个数据库连接，速度相对较慢，稳定性还可以。Hibernate 官方推荐使用。
- ③**Proxool** 是 sourceforge 下的一个开源项目数据库连接池，有监控连接池的功能，稳定性较c3p0差一点。
- ④**BoneCP** 是一个开源组织提供的数据库连接池，速度快
- ⑤**Druid** 是阿里提供的数据库连接池，据说是集 DBCP、C3P0、Proxool 优点于一身的数据库连接池，但是速度不确定比 BoneCP 快。

（2）DataSource 通常被称为数据源，它包含连接池和连接池管理两个部分，习惯上也经常把 DataSource 称为连接池。

（3）DataSource 用来取代 DriverManager 来获取 Connection，获取速度快，同时可以大幅度提高数据库访问速度。

（4）特别注意：

数据源和数据库连接不同，数据源无需创建多个，它是产生数据连接的工厂，因此整个应用只需要一个数据源。



**Druid（德鲁伊）数据库连接池**

Druid 是阿里巴巴开源平台上一个数据库连接池实现，它结合了 C3P0、DBCP、Proxool 等 DB 池的有点，同时加入了日志监控，可以很好地监控 DB 池连接和 SQL 的执行情况，可以说是针对监控而生的 DB 连接池，**可以说是目前最好的连接池之一**。

封装进 JDBCUtil 工具类

```java
public class JDBCUtil {
	
	private static DataSource source;
	
	static {
		try {
			InputStream is = ClassLoader.getSystemClassLoader().getResourceAsStream("druid.properties");
			Properties prop = new Properties();
			prop.load(is);
			source = DruidDataSourceFactory.createDataSource(prop);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 使用 Druid 数据库连接池技术获取连接
	 * @return
	 * @throws Exception
	 */
	public static Connection getConnection() throws Exception {
		Connection conn = source.getConnection();
		return conn;
	}
 }
```

其中，src 下的配置文件内容为：【druid.properties】

```properties
url=jdbc:mysql://localhost:3306/students?serverTimezone=GMT%2B8
username=root
password=root
driverClassName=com.mysql.cj.jdbc.Driver

initialSize=10 # 初始化时连理物理连接的个数
maxActive=10 # 最大连接数
```

测试一下：

![image-20210914173315179](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914173315179.png)