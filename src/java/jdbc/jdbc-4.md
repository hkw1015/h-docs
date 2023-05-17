---
title: 操作 BLOB 类型字段
date: 2021-09-14
category: Java
tag:
 - JDBC
---

## 1. MySQL BLOB 类型字段

（1）MySQL 中，BLOB 是一个二进制大型对象，是一个可以存储大量数据的容器，它能容纳不同大小的数据。

（2）插入 BLOB 类型的数据必须使用 PreparedStatement，因为 BLOB 类型的数据无法使用字符串拼接写。

（3）MySQL 的四种 BLOB 类型(除了在存储的最大信息量上不同外，它们是等同的)。

| **类型**   | **大小(单位：字节)** |
| ---------- | -------------------- |
| TinyBlob   | 最大   255           |
| Blob       | 最大   65K           |
| MediumBlob | 最大   16M           |
| LongBlob   | 最大   4G            |

（4）实际使用中根据需要存入的数据大小定义不同的 BLOB 类型。

（5）需要注意的是：如果存储的文件过大，数据库的性能会下降。

（6）如果在指定了相关的 BLOB 类型以后，还报错：xxx too large，那么在 MySQL 的安装目录下，找 my.ini 文件加上如下的配置参数：**max_allow_packet=16M**。同时注意：修改了 my.ini 文件之后，需要重新启动 mysql 服务。

```
max_allow_packet=16M
```

## 2. 向数据库表中插入 Blob 类型的数据

首先在 students 下新建一个 img 表，里面 img 字段的类型为 mediumblob

![image-20210914165056068](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/image-20210914165056068.png)

```java
/**
 * 测试使用 PreparedStatement 操作 Blob 类型的数据
 */
public class BlobTest {
	
	// 向 img 表中插入 Blob 类型的数据
	@Test
	public void testInsert() throws Exception {
		// 1.获取连接
		Connection conn = JDBCUtil.getConnection();
		
		// 2.预编译sql
		String sql = "INSERT INTO img(id,img) VALUES(?,?)";
		PreparedStatement ps = conn.prepareStatement(sql);
		
		// 3.填充占位符
		ps.setObject(1, 1);
		FileInputStream fis = new FileInputStream(new File("桌面9.jpg"));
		ps.setBlob(2, fis);
		
		// 4.执行 SQL
		ps.execute();
		
		// 5.关闭资源
		JDBCUtil.closeResource(conn, ps);
	}
}
```

测试结果如下：

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/%E5%BE%80%E8%A1%A8%E4%B8%AD%E6%8F%92%E5%85%A5Blob%E7%B1%BB%E5%9E%8B%E7%9A%84%E6%95%B0%E6%8D%AE.gif)

## 3. 从数据库表中读取 Blob 类型的数据

就读取上面我们添加进去的图片，将图片以文件形式保存到本地

```java
// 从img表中读取 Blob 类型的数据
@Test
public void testQUery() {
	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;
	InputStream is = null;
	FileOutputStream fos = null;
	try {
        // 1.获取连接
        conn = JDBCUtil.getConnection();
        
        // 2.预编译 sql
        String sql = "SELECT * FROM img WHERE id = ?";
        ps = conn.prepareStatement(sql);
        
        // 3.填充占位符
        ps.setObject(1, 1);
        
        // 4.执行查询操作，获取结果集
        rs = ps.executeQuery();
        		
        // 6.将 bolb 类型的字段下载下来，以文件的方式保存在本地
        if (rs.next()) {
            Blob img = rs.getBlob("img");
            is = img.getBinaryStream();
            fos = new FileOutputStream(new File("下载的图片.jpg"));
            byte[] buffer = new byte[1024];
            int len;
            while((len = is.read(buffer)) != -1) {
            	fos.write(buffer, 0, len);
            }
        }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 7.关闭资源
            try {
                if (is != null)
                is.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                if (fos != null)
                fos.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            JDBCUtil.closeResource(conn, ps, rs);
        }
}
```

测试结果如下：

![img](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/mysql/%E4%BB%8E%E8%A1%A8%E4%B8%AD%E8%AF%BB%E5%8F%96Blob%E7%B1%BB%E5%9E%8B%E7%9A%84%E6%95%B0%E6%8D%AE.gif)