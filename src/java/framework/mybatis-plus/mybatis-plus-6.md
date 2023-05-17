---
title: 代码生成器
date: 2021-11-03
category: 常用框架
tag:
  - MyBatis-Plus
---

（1）MP 提供了大量的自定义设置，生成的代码完全能够满足各类型的需求

（2）MP 的代码生成器和 MyBatis MBG 代码生成器对比：

- MP 的代码生成器都是基于 Java 代码来生成，MBG 基于 xml 文件进行代码生成
- MyBatis 的代码生成器可生成：实体类、Mapper 接口、Mapper 映射文件
- MP 的代码生成器可生成：实体类（可以选择是否支持 AR）、Mapper 接口、Mapper 映射文件、Service 层、Controller 层

（3）表及字段命名策略选择

在 MP 中，我们建议数据库表名和表字段名采用驼峰命名方式，如果采用下划线命名方式，需要开启全局下划线开关，如果表名字段命名方式不一致，需要使用注解指定，我们建议最好保持一致。

这么做的原因是为了避免在对应实体类时产生的性能消耗，这样字段不用做映射就能直接和实体类对应。当然如果项目里不用考虑这点性能消耗，那么你采用下划线也是没问题的，只需要在生成代码时配置 dbColumnUnderline 属性就可以。

## 1. 代码生成器依赖

（1）模板引擎

MP 的代码生成器默认使用的是 Apache 的 Velocity 模板，当然也可以更换为别的模板技术，例如 freemarker，此处不做过多的介绍。

```xml
<!-- Apache Velocity -->
<dependency>
	<groupId>org.apache.velocity</groupId>
	<artifactId>velocity-engine-core</artifactId>
	<version>2.0</version>
</dependency>
```

（2）加入 slf4j，查看日志输出信息

```xml
<!-- slf4j -->
<dependency>
	<groupId>org.slf4j</groupId>
	<artifactId>slf4j-api</artifactId>
	<version>1.7.7</version>
</dependency>
<dependency>
	<groupId>org.slf4j</groupId>
	<artifactId>slf4j-log4j12</artifactId>
	<version>1.7.7</version>
</dependency>
```

## 2. MP 代码生成器示例代码

```java
@Test
public void testGenerator() {
	// 全局配置
	GlobalConfig config = new GlobalConfig();
	config.setActiveRecord(true) // 是否支持AR模式
			.setAuthor("hl1015") // 作者
			.setOutputDir("D:\\mycode\\mp02\\src\\main\\java") // 生成路径
			.setFileOverride(true) // 文件覆盖
			.setServiceName("%sService") // 设置生成的service接口名首字母是否为I
			.setIdType(IdType.AUTO) // 主键策略
			.setBaseResultMap(true)
			.setBaseColumnList(true);

	// 数据源配置
	DataSourceConfig dsConfig = new DataSourceConfig();
	dsConfig.setDbType(DbType.MYSQL)
			.setUrl("jdbc:mysql://localhost:3306/mp?serverTimezone=GMT%2B8")
			.setDriverName("com.mysql.cj.jdbc.Driver")
			.setUsername("root")
			.setPassword("root");

	// 策略配置
	StrategyConfig stConfig = new StrategyConfig();
	stConfig.setCapitalMode(true) // 全局大写命名
			.setDbColumnUnderline(true) // 表名 字段名 是否使用下滑线命名
			.setNaming(NamingStrategy.underline_to_camel) // 数据库表映射到实体的命名策略
			.setInclude("tbl_employee") // 生成的表
			.setTablePrefix("tbl_") // 表前缀
			.setInclude("tbl_employee"); // 需要生成的表

	// 包名策略
	PackageConfig pkConfig = new PackageConfig();
	pkConfig.setParent("com.hl1015.mp")
			.setMapper("mapper")
			.setController("controller")
			.setService("service")
			.setEntity("beans")
			.setXml("mapper");

	// 整合以上配置
	AutoGenerator ag = new AutoGenerator()
			.setGlobalConfig(config)
			.setDataSource(dsConfig)
			.setStrategy(stConfig)
			.setPackageInfo(pkConfig);

	ag.execute();
}
```

运行上面的测试方法，结果如下：

![image-20211130140204388](http://img.hl1015.top/blog/image-20211130140204388.png)

![image-20211130140232348](http://img.hl1015.top/blog/image-20211130140232348.png)

生成的 xxxMapper.xml 文件中帮我们开启了二级缓存，我们不需要使用，可以自行注释

![image-20211130145233077](http://img.hl1015.top/blog/image-20211130145233077.png)

## 3. ServiceImpl 说明

EmployeeServiceImpl 继承了 ServiceImpl 类，MyBatis-Plus 通过这种方式为我们注入了 EmployeeMapper，这样可以使用 service 层默认为我们提供的很多方法，也可以调用我们自己在 dao 层编写的操作数据库的方法。

![image-20211130140956711](http://img.hl1015.top/blog/image-20211130140956711.png)

![image-20211130141125375](http://img.hl1015.top/blog/image-20211130141125375.png)