---
title: 使用 PreparedStatement 实现 CRUD 操作
date: 2021-09-14
category: Java
tag:
 - JDBC
---

## 1. 操作和访问数据库

（1）数据库连接被用于数据库服务器发送命令和 SQL 语句，并接受数据库服务器返回的结果。其实一个数据库连接就是一个 Socket 连接。

（2）在 java.sql 包中有 3 个接口分别定义了对数据库的调用的不同方式：

- Statement：用于执行静态 SQL 语句并返回它所生成结果的对象
- PreparedStatement：SQL 语句被预编译存储在此对象中，可以使用此对象多次高效地执行该语句
- CallableStatement：用于执行 SQL 存储过程

![image-20210914155243218](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914155243218.png)

## 2. 使用 Statement 操作数据库的弊端

（1）通过 Connection 对象的 createStatement() 方法创建该对象，该对象用于执行静态的 SQL 语句，并且返回执行结果。

（2）Statement 接口中定义如下方法用于执行 SQL 语句：

```java
int executeUpdate(String sql):执行更新操作 INSERT、UPDATE、DELETE
ResultSet executeQUery(String sql):执行查询操作 SELECT
```

（3）使用Statement操作数据库存在的弊端：

- 问题一：存在拼串操作，繁琐
- 问题二：存在 SQL 注入问题

（4）SQL 注入是利用某些系统没有对用户输入的数据进行充分的检查，而在用户输入数据中注入非法的 SQL 语句段或命令，如：

```sql
SELECT 
user,password 
FROM 
user_table
WHERE user='1' OR 'AND password ='=1 OR '1'='1';
```

从而利用系统的 SQL 引擎完成恶意行为的做法。

（5）对于 Java 而言，要防范 SQL 注入，只要用 PreparedStatement（从 Statement 扩展而来）取代 Statement 就可以了。

![image-20210914155748525](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914155748525.png)

## 3. PreparedStatement 的使用

### 3.1 PreparedStatement 介绍

（1）可以通过 Connection 对象的 preparedStatement(String sql) 方法获取 PreparedStatement 对象

（2）PreparedStatement 接口是 Statement 的子接口，它表示一条预编译过的 SQL 语句

（3）PreparedStatement 对象代表的 SQL 语句中的参数用问号(?)来表示，调用 PreparedStatement 对象的 setXxx() 方法来设置这些参数，setXxx() 方法有两个参数，第一个参数是要设置的 SQL 语句中的参数的索引（从 1 开始），第二个是设置的 SQL 语句中的参数的值

### 3.2 PreparedStatement VS Statement

（1）代码的可读性和可维护性

（2）**PreparedStatement 能最大可能提高性能**：

- DBServer 会对**预编译**语句提供性能优化。因为预编译语句有可能被重复调用，所以语句在被 DBServer 的编译器编译后的执行代码被缓存下来，那么下次调用时只要是相同的预编译语句就不需要编译，只要将参数直接传入编译过的语句执行代码中就会得到执行。
- 在 statement 语句中，即便是相同操作但因为数据内容不一样，所以整个语句本身不能匹配，没有缓存语句的意义，事实是没有数据库会对普通语句编译后的执行代码缓存，这样每执行一次都要对传入语句的编译一次。
- 语法检查、语义检查、翻译成二进制命令、缓存

（3）PreparedStatement 可以防止 SQL注入

### 3.3 Java 与 SQL 对应数据类型转换表

| **Java类型**       | **SQL类型**              |
| ------------------ | ------------------------ |
| boolean            | BIT                      |
| byte               | TINYINT                  |
| short              | SMALLINT                 |
| int                | INTEGER                  |
| long               | BIGINT                   |
| String             | CHAR,VARCHAR,LONGVARCHAR |
| byte array         | BINARY,VAR BINARY        |
| java.sql.Date      | DATE                     |
| java.sql.Time      | TIME                     |
| java.sql.Timestamp | TIMESTAMP                |

### 3.4 使用 PreparedStatement 实现增、删、改操作

**（1）向 stuinfo 表中添加一条记录**

![image-20210914160508035](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914160508035.png)

具体代码如下：

```java
// 向stuinfo表中添加一条记录
@Test
public void testInsert1() {
	
	Connection conn = null;
	PreparedStatement ps = null;
	try {
		// 1.读取配置文件中的4个基本信息
		InputStream is = ClassLoader.getSystemClassLoader().getResourceAsStream("jdbc.properties");
		
		Properties pro = new Properties();
		pro.load(is);
		
		String user = pro.getProperty("user");
		String password = pro.getProperty("password");
		String url = pro.getProperty("url");
		String driverClass = pro.getProperty("driverClass");
		
		// 2.加载驱动
		Class.forName(driverClass);
		
		// 3.获取连接
		conn = DriverManager.getConnection(url, user, password);
		
		// 4.预编译sql语句，返回PreparedStatement的实例
		String sql = "INSERT INTO stuinfo(stuName,gender,seat,age) VALUES(?,?,?,?)";
		ps = conn.prepareStatement(sql);
		
		// 5.填充占位符
		ps.setString(1, "张三");
		ps.setString(2, "男");
		ps.setInt(3, 10001);
		ps.setInt(4, 18);
		
		// 6.执行操作
		ps.execute();
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		// 7.资源的关闭
		try {
			if(ps != null)
			ps.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		try {
			if(conn != null)
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
```

执行结果如下：

![image-20210914160631837](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914160631837.png)

可以看到表中已经添加了一条数据

![image-20210914160651961](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914160651961.png)

由于不管是增删改查中的哪一个对于数据库的操作，都需要建立连接、创建 sql 并执行、关闭资源，而其中只有 创建 sql 并执行 是不同的，建立连接和关闭资源的操作是通用的，所以我们可以将建立连接和关闭连接的操作封装进我们自己定义的一个工具类（JDBCUtils）中。

JDBCUtil.java 代码如下：

```java
/**
 * 	操作数据库的工具类
 * @author Administrator
 *
 */
public class JDBCUtil {
	
	/**
	 * 获取数据库的连接
	 * @return
	 * @throws Exception
	 */
	public static Connection getConnection() throws Exception {
		// 1.读取配置文件中的 4 个基本信息
		InputStream is = ClassLoader.getSystemClassLoader().getResourceAsStream("jdbc.properties");
		
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
		
		return conn;
	}
	
	/**
	 * 关闭 连接 和 Statement
	 * @param conn
	 * @param ps
	 */
	public static void closeResource(Connection conn,Statement ps) {
		try {
			if(ps != null)
			ps.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		try {
			if(conn != null)
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
```

这样，原来的添加操作就可以简化为如下：

```java
@Test
public void testInsert2() {
	Connection conn = null;
	PreparedStatement ps = null;
	try {
        // 获取连接
		conn = JDBCUtil.getConnection();
		
		// 预编译 sql 语句，返回 PreparedStatement 的实例
        String sql = "INSERT INTO stuinfo(stuName,gender,seat,age) VALUES(?,?,?,?)";
        ps = conn.prepareStatement(sql);
        
        // 填充占位符
        ps.setString(1, "李四");
        ps.setString(2, "男");
        ps.setInt(3, 10002);
        ps.setInt(4, 18);
        
        // 执行操作
        ps.execute();
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        // 资源的关闭
        JDBCUtil.closeResource(conn, ps);
    }
}
```

**（2）修改 stuinfo 表中的一条记录**

```java
@Test
public void testUpdate() {
	Connection conn = null;
	PreparedStatement ps = null;
	try {
	 	// 1.获取连接
		conn = JDBCUtil.getConnection();
			
        // 2.预编译 sql 语句，返回 PreparedStatement 的实例
        String sql = "UPDATE stuinfo set stuName = ? WHERE id = ?";
        ps = conn.prepareStatement(sql);
        
        // 3.填充占位符
        ps.setString(1, "王五");
        ps.setInt(2, 1);
        
        // 4.执行操作
        ps.execute();
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        // 5.资源的关闭
        JDBCUtil.closeResource(conn, ps);
    }
}
```

执行结果如下：

![image-20210914161408769](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914161408769.png)

**（3）实现通用的增删改操作**

```java
/**
 * 实现通用的增删改操作
 * 要求:sql 中占位符的个数要与可变形参 args 的长度相同
 * @param sql
 * @param args
 */
public void update(String sql,Object ...args) {
	Connection conn = null;
	PreparedStatement ps = null;
    try {
        // 1.获取连接
        conn = JDBCUtil.getConnection();
        
        // 2.预编译 sql 语句，返回 PreparedStatement 的实例
        ps = conn.prepareStatement(sql);
        
        // 3.填充占位符
        for (int i = 0; i < args.length; i++) {
            ps.setObject(i + 1, args[i]);
        }
        
        // 4.执行操作
        ps.execute();
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        // 5.资源的关闭
        JDBCUtil.closeResource(conn, ps);
    }
}
```

测试一下（删除操作）：

```java
@Test
public void testDelete() {
	String sql = "DELETE FROM stuinfo WHERE id = ?";
	update(sql,3);
}
```

测试结果如下：

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/%E6%B5%8B%E8%AF%95JDBC%E9%80%9A%E7%94%A8%E7%9A%84%E5%A2%9E%E5%88%A0%E6%94%B9%E6%96%B9%E6%B3%95-%E5%88%A0%E9%99%A4.gif)

### 3.5 使用 PreparedStatement 实现查询操作

因为查询操作会返回一个结果集对象 ResultSet，所以在 JDBCUtil 中需要再重载一个加上关闭 ResultSet 的方法

```java
/**
 * 关闭 连接、Statement 和 ResultSet
 * @param conn
 * @param ps
 */
public static void closeResource(Connection conn,Statement ps,ResultSet rs) {
	try {
        if(ps != null)
        ps.close();
    } catch (SQLException e) {
        e.printStackTrace();
    }
    try {
        if(conn != null)
        conn.close();
    } catch (SQLException e) {
        e.printStackTrace();
    }
    try {
        if(rs != null)
        rs.close();
    } catch (SQLException e) {
        e.printStackTrace();
    }
}
```

查询方式一

```java
@Test
public void testQuery1() {
	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;
	try {
		// 1.获取连接
		conn = JDBCUtil.getConnection();
			
        // 2.预编译 sql 语句，返回 PreparedStatement 的实例
        String sql = "SELECT * FROM stuinfo WHERE id = ?";
        ps = conn.prepareStatement(sql);
        
        // 3.填充占位符
        ps.setObject(1, 1);
        
        // 4.执行，并返回结果集
        rs = ps.executeQuery();
        
        // 5.处理结果集
        // next():判断结果集的下一条是否有数据，如果有数据返回 true，并指针下移，如果没有数据，返回 false，指针不会下移
		if(rs.next()) {
            // 获取当前这条数据的各个字段的值
            int id = rs.getInt(1);
            String stuName = rs.getString(2);
            String gender = rs.getString(3);
            int seat = rs.getInt(4);
            int age = rs.getInt(5);
            
            Stuinfo stuinfo = new Stuinfo(id,stuName,gender,seat,age);
            System.out.println(stuinfo);
		}
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		// 6.资源的关闭
		JDBCUtil.closeResource(conn, ps,rs);
	}
}
```

其中的 Stuinfo 对象是我们为对象关系映射的 stuinfo 表定义的一个类

查询结果如下：

![image-20210914162301077](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914162301077.png)

仍然，像增删改那样，我们为查询 stuinfo 表操作实现一个通用的方法

```java
/**
 * 针对 stuinfo 表实现一个通用的查询方法
 * @param sql
 * @param args
 */
public Stuinfo queryForStuinfo(String sql,Object ...args) {
	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;
    try {
        // 1.获取连接
        conn = JDBCUtil.getConnection();
        
        // 2.预编译sql语句，返回PreparedStatement的实例
        ps = conn.prepareStatement(sql);
        
        // 3.填充占位符
        for (int i = 0; i < args.length; i++) {
            ps.setObject(i + 1, args[i]);
        }
    
        // 4.执行，并返回结果集
        rs = ps.executeQuery();
        
        // 5.处理结果集
        // 获取结果集的元数据
        ResultSetMetaData rsmd = rs.getMetaData();
    
        // 通过rsmd获取结果集中的列数
        int columnCount = rsmd.getColumnCount();
        
        // next():判断结果集的下一条是否有数据，如果有数据返回 true，并指针下移，如果没有数据，返回 false，指针不会下移
        if(rs.next()) {
            Stuinfo stuinfo = new Stuinfo();
            // 处理结果集中一行数据的每一列
            for (int i = 0; i < columnCount; i++) {
            	// 获取列值
            	Object columnValue = rs.getObject(i + 1);
            	
            	// 获取每个列的列名 getColumnName (不推荐)
                // 获取每个列的别名 getColumnLabel (推荐)
            	String columnName = rsmd.getColumnLabel(i + 1);
            	
            	// 给 stuinfo 对象指定的 columnName 属性赋值上 columnValue，通过反射实现(★★★)
            	Field field = Stuinfo.class.getDeclaredField(columnName);
            	field.setAccessible(true);
            	field.set(stuinfo, columnValue);
            }
    
            return stuinfo;
        }
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        // 6.资源的关闭
        JDBCUtil.closeResource(conn, ps,rs);
    }
    return null;
}
```

<span style="color:red">注：针对于表的字段名与类的属性名不一致的情况：</span>

①必须声明 sql 时，使用类的属性名来命名字段的别名

②使用 ResultSetMetaData 时，需要使用 getColumnLabel() 来替换 getColumn()，获取列的别名

说明：如果 sql 中没有给字段取别名，getColumnLabel() 默认获取列名

测试一下：

```java
@Test
public void testQueryForStuinfo() {
	String sql = "SELECT * FROM stuinfo WHERE id = ?";
	Stuinfo stuinfo = queryForStuinfo(sql, 1);
	System.out.println(stuinfo);
}
```

测试结果如下：

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/%E4%B8%BAstuinfo%E8%A1%A8%E7%9A%84%E6%9F%A5%E8%AF%A2%E6%93%8D%E4%BD%9C%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E9%80%9A%E7%94%A8%E7%9A%84%E6%96%B9%E6%B3%95.gif)

**（1）实现不同表的通用查询方法(针对查询一行数据)**

```java
/*
 * 针对于不同的表的查询操作，返回表中的一条记录
 */
public <T> T getInstance(Class<T> clazz,String sql,Object ... args) {
	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;
	try {
		// 1.获取连接
		conn = JDBCUtil.getConnection();
		
		// 2.预编译 sql 语句，返回 PreparedStatement 的实例
		ps = conn.prepareStatement(sql);
		
		// 3.填充占位符
		for (int i = 0; i < args.length; i++) {
			ps.setObject(i + 1, args[i]);
		}
		
		// 4.执行，并返回结果集
		rs = ps.executeQuery();
		
		// 5.处理结果集
		// 获取结果集的元数据
		ResultSetMetaData rsmd = rs.getMetaData();
		
		// 通过 rsmd 获取结果集中的列数
		int columnCount = rsmd.getColumnCount();
		
		// next():判断结果集的下一条是否有数据，如果有数据返回true，并指针下移，如果没有数据，返回false，指针不会下移
		if(rs.next()) {
			T t = clazz.newInstance();
			// 处理结果集中一行数据的每一列，给t对象的指定属性赋值
			for (int i = 0; i < columnCount; i++) {
				// 获取列值
				Object columnValue = rs.getObject(i + 1);
				
				// 获取每个列的列名 getColumnName (不推荐)
				// 获取每个列的别名 getColumnLabel (推荐)
				String columnName = rsmd.getColumnLabel(i + 1);
				
				// 给 stuinfo 对象指定的 columnName 属性赋值上 columnValue，通过反射实现(★★★)
				Field field = clazz.getDeclaredField(columnName);
				field.setAccessible(true);
				field.set(t, columnValue);
			}
			
			return t;
		}
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		// 6.资源的关闭
		JDBCUtil.closeResource(conn, ps,rs);
	}
	return null;
}
```

测试一下：在数据库 students 中加入一张 job 表

我们测试查询两个表的第一行

![image-20210914163540376](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914163540376.png)

![image-20210914163553368](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914163553368.png)

测试代码如下：

```java
@Test
public void testGetInstance() {
	String sql1 = "SELECT * FROM stuinfo WHERE id = ?";
	Stuinfo instance1 = getInstance(Stuinfo.class, sql1, 1);
	System.out.println(instance1);
							
	String sql2 = "SELECT job_id AS jobId,job_title AS jobTitle,min_salary AS minSalary,max_salary AS maxzSalary FROM job WHERE job_id = ?";
	Job instance2 = getInstance(Job.class, sql2, "AC_ACCOUNT");
	System.out.println(instance2);
}
```

测试结果如下：

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/%E6%B5%8B%E8%AF%95%E4%B8%8D%E5%90%8C%E8%A1%A8%E7%9A%84%E9%80%9A%E7%94%A8%E6%9F%A5%E8%AF%A2%E4%B8%80%E8%A1%8C%E6%95%B0%E6%8D%AE%E7%9A%84%E6%96%B9%E6%B3%95.gif)

**（2）实现不同表的通用查询方法(针对查询多行数据)**

```java
/*
 * 针对于不同的表的查询操作，返回表中的多条条记录
 */
public <T> List<T> getForList(Class<T> clazz,String sql,Object ... args) {
	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;
	try {
		// 1.获取连接
		conn = JDBCUtil.getConnection();
		
		// 2.预编译 sql 语句，返回 PreparedStatement 的实例
		ps = conn.prepareStatement(sql);
		
		// 3.填充占位符
		for (int i = 0; i < args.length; i++) {
			ps.setObject(i + 1, args[i]);
		}
		
		// 4.执行，并返回结果集
		rs = ps.executeQuery();
		
		// 5.处理结果集
		// 获取结果集的元数据
		ResultSetMetaData rsmd = rs.getMetaData();
		
		// 通过rsmd获取结果集中的列数
		int columnCount = rsmd.getColumnCount();
		
		// 创建集合对象
		ArrayList<T> list = new ArrayList<T>();
		// next():判断结果集的下一条是否有数据，如果有数据返回true，并指针下移，如果没有数据，返回false，指针不会下移
		while(rs.next()) {
			T t = clazz.newInstance();
			// 处理结果集中一行数据的每一列，给t对象的指定属性赋值
			for (int i = 0; i < columnCount; i++) {
				// 获取列值
				Object columnValue = rs.getObject(i + 1);
				
				// 获取每个列的列名 getColumnName (不推荐)
				// 获取每个列的别名 getColumnLabel (推荐)
				String columnName = rsmd.getColumnLabel(i + 1);
				
				// 给 stuinfo 对象指定的 columnName 属性赋值上 columnValue，通过反射实现(★★★)
				Field field = clazz.getDeclaredField(columnName);
				field.setAccessible(true);
				field.set(t, columnValue);
			}
			list.add(t);
		}
		
		return list;
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		// 6.资源的关闭
		JDBCUtil.closeResource(conn, ps,rs);
	}
	return null;
}
```

测试一下：

```java
@Test
public void testGetForList() {
	String sql1 = "SELECT * FROM stuinfo";
	List<Stuinfo> list1 = getForList(Stuinfo.class, sql1);
	list1.forEach(System.out::println);
	
	String sql2 = "SELECT job_id AS jobId,job_title AS jobTitle,min_salary AS minSalary,max_salary AS maxzSalary FROM job WHERE job_id <> ?";
	List<Job> list2 = getForList(Job.class, sql2, "AC_ACCOUNT");
	list2.forEach(System.out::println);
}
```

测试结果如下：

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/%E6%B5%8B%E8%AF%95%E4%B8%8D%E5%90%8C%E8%A1%A8%E7%9A%84%E9%80%9A%E7%94%A8%E6%9F%A5%E8%AF%A2%E5%A4%9A%E8%A1%8C%E6%95%B0%E6%8D%AE%E7%9A%84%E6%96%B9%E6%B3%95.gif)

### 3.6 PreparedStatement 除了解决 Statement 拼串、sql 注入问题之外，PreparedStatement 还有哪些好处？

（1）PreparedStatement 可以操作 Blob(二进制流)的数据，而 Statement 做不到

（2）PreparedStatement 可以实现更高效的批量操作

### 3.7 JDBC API 小结

**（1）两种思想**

- ①**面向接口编程**思想
- ②**ORM** 思想(Object relational mapping)
  - 一个数据表对应一个java类
  - 表中的一条记录对应 java 类的一个对象
  - 表中的一个字段对应 java 类的一个属性

注：sql 是需要结合列名和表的属性名来写的，注意起别名

**（2）两种技术**

- ①JDBC **结果集的元数据**：ResultMetaData
  - 获取列数：getColumnCount()
  - 获取列的别名：getColumnLabel()
- ②通过**反射**，创建指定类的对象，获取指定的属性并赋值