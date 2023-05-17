---
title: 插件机制
date: 2021-11-03
category: 常用框架
tag:
  - MyBatis-Plus
---

## 1. MyBatis 插件机制简介

**（1）插件机制**

MyBatis 通过插件（Interceptor）可以做到拦截四大对象相关方法的执行，根据需求，完成相关数据的动态改变。

- Executor
- StatementHandler
- ParameterHandler
- ResultSetHandler

**（2）插件原理**

四大对象的每个对象在创建时，都会执行 interceptorChain.pluginAll()，会经过每个插件对象的 plugin() 方法，目的是为当前的四大对象创建代理。代理对象就可以拦截到四大对象相关方法的执行，因为要执行四大对象的方法需要经过代理。

## 2. 分页插件

> 所在包：com.baomidou.mybatisplus.plugins.PaginationInterceptor

**（1）注册分页插件**

```xml
<!-- 配置 SqlSessionFactoryBean -->
<bean id="sqlSessionFactoryBean" class="com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean">
	...
	<!-- 插件注册 -->
	<property name="plugins">
		<list>
			<!-- 分页插件 -->
			<bean class="com.baomidou.mybatisplus.plugins.PaginationInterceptor"/>
		</list>
	</property>
</bean>
```

**（2）测试分页插件**

```java
@Test
public void testPaginationPlugin() {
	Page<Employee> page = new Page<>(1, 2);

	List<Employee> employees = employeeMapper.selectPage(page, null);
	System.out.println("page = " + page);
	System.out.println("employees = " + employees);
}
```

![image-20211130150602909](http://img.hl1015.top/blog/image-20211130150602909.png)

## 3. 执行分析插件

> ①所在包：com.baomidou.mybatisplus.plugins.SqlExplainInterceptor
>
> ②SQL 执行分析拦截器，只支持 MySQL 5.6.3 以上版本
>
> ③该插件的作用是分析 DELETE、UPDATE 语句，防止小白或者恶意进行 DELETE、UPDATE 全表操作
>
> ④只建议在开发环境中使用，不建议在生产环境中使用
>
> ⑤在插件的底层通过 SQL 语句分析命令：Explain 分析当前的 SQL 语句，根据结果集中的 Extra 列来判定当前是否全表操作

**（1）注册执行分析插件**

```xml
<!-- 配置 SqlSessionFactoryBean -->
<bean id="sqlSessionFactoryBean" class="com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean">
	...
	<!-- 插件注册 -->
	<property name="plugins">
		<list>
            ...
			<!-- 执行分析插件 -->
            <bean class="com.baomidou.mybatisplus.plugins.SqlExplainInterceptor">
                <!-- 当 delete、update 语句为全表操作时，停止当前操作 -->
                <property name="stopProceed" value="true"/>
            </bean>
		</list>
	</property>
</bean>
```

**（2）测试执行分析插件**

```java
@Test
public void testSqlExplainPlugin() {
	Integer delete = employeeMapper.delete(null);
	System.out.println("delete = " + delete);
}
```

![image-20211130151601859](http://img.hl1015.top/blog/image-20211130151601859.png)

## 4. 性能分析插件

> ①所在包：com.baomidou.mybatisplus.plugins.PerformanceInterceptor
>
> ②性能分析拦截器，用于输出每条 SQL 语句及其执行时间
>
> ③SQL 性能执行分析，开发环境使用 ，超过指定时间 ，停止运行，有助于发现问题
>

**（1）注册性能分析插件**

```xml
<!-- 配置 SqlSessionFactoryBean -->
<bean id="sqlSessionFactoryBean" class="com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean">
	...
	<!-- 插件注册 -->
	<property name="plugins">
		<list>
            ...
			<!-- 性能分析插件，开发环境使用，线上不推荐 -->
            <bean class="com.baomidou.mybatisplus.plugins.PerformanceInterceptor">
                <!-- sql 最大执行时长，超过这个时间，停止运行-->
                <property name="maxTime" value="200"/>
                <!-- sql 是否格式化，默认 false-->
                <property name="format" value="true"/>
            </bean>
		</list>
	</property>
</bean>
```

**（2）测试性能分析插件**

```java
@Test
public void testPerformancePlugin() {
	List<Employee> employees = employeeMapper.selectList(null);
	System.out.println("employees = " + employees);
}
```

![image-20211130152948254](http://img.hl1015.top/blog/image-20211130152948254.png)

## 5. 乐观锁插件

> ①所在包：com.baomidou.mybatisplus.plugins.OptimisticLockerInterceptor
>
> ②如果想实现如下需求：当要更新一条记录的时候，希望这条记录没有被别人更新，可以考虑乐观锁
>
> ③乐观锁的实现原理
>
> - 取出记录时，获取这个 version
> - 更新时，带上这个 version
> - 执行更新时，set version = yourVersion + 1 where version = yourVersion
> - 如果 version 不对，就更新失败
>
> ④@Version 用于注解实体字段，必须要有

**（1）注册乐观锁插件**

```xml
<!-- 配置 SqlSessionFactoryBean -->
<bean id="sqlSessionFactoryBean" class="com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean">
	...
	<!-- 插件注册 -->
	<property name="plugins">
		<list>
			...
			<!-- 乐观锁插件 -->
            <bean class="com.baomidou.mybatisplus.plugins.OptimisticLockerInterceptor"/>
		</list>
	</property>
</bean>
```

**（2）添加乐观锁标识字段**

```sql
ALTER TABLE `mp`.`tbl_employee` 
ADD COLUMN `version` int NOT NULL DEFAULT 1 COMMENT '乐观锁标识' AFTER `age`;
```

![image-20211130154101035](http://img.hl1015.top/blog/image-20211130154101035.png)

**（2）为实体类 Employee 添加乐观锁标识字段，并添加上 @Version 注解**

![image-20211130153950097](http://img.hl1015.top/blog/image-20211130153950097.png)

**（3）测试乐观锁插件**

```java
@Test
public void testOptimisticLockerPlugin() {
	Employee employee = new Employee();
    employee.setId(4);
    employee.setLastName("White2333");
    employee.setVersion(1);
	
	Integer result = employeeMapper.updateById(employee);
	System.out.println("result = " + result);
}
```

在执行上面的测试代码之前，将数据库中 id = 4 记录的 version 字段值改为 2：

![image-20211130154525572](http://img.hl1015.top/blog/image-20211130154525572.png)

执行测试代码【可以发现版本不一致时，修改操作失败】：

![image-20211130155206134](http://img.hl1015.top/blog/image-20211130155206134.png)