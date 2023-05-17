---
title: 批量插入
date: 2021-09-14
category: Java
tag:
 - JDBC
---

**层次一：使用 Statement实现**

**层次二：使用 PreparedStatement 替换 Statement**

**层次三：使用 addBatch() / executeBatch() / clearBatch()**

MySQL 服务器是默认关闭批处理的，我们需要通过一个参数，让 MySQL 开启批处理的支持

```
?rewriteBatchedStatements=true # 写在配置文件的url的后面
```

使用更新的 mysql 驱动：mysql-connector-java-5.1.37-bin.jar

**层次四：设置连接为不允许自动提交数据**

```java
@Test
public void testInsert() {
	Connection conn = null;
	PreparedStatement ps = null;
	try {
		long start = System.currentTimeMillis();
		conn = JDBCUtil.getConnection();
		
		// 设置不允许自动提交数据
		conn.setAutoCommit(false);
		
		String sql = "insert ...";
		ps = conn.prepareStatement(sql);
		for (int i = 1; i <= 1000000; i++) {
			ps.setObject(1, "name_" + i);
			
			// 1."攒"sql
			ps.addBatch();
			
			if (i % 500 == 0) { // 每 500 条批量执行一次
				// 2.执行batch
				ps.executeBatch();
				
				// 3.清空 batch
				ps.clearBatch();
			}
		}
		
		// 提交事务
		conn.commit();
		
		long end = System.currentTimeMillis();
		
		System.out.println("花费的时间为：" + (end - start) + "ms");
		conn.setAutoCommit(true);
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		JDBCUtil.closeResource1(conn, ps);
	}
}
```

