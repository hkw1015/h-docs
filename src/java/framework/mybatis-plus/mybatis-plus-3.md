---
title: 入门 HelloWorld
date: 2021-11-03
category: 常用框架
tag:
  - MyBatis-Plus
---

## 1. 通用 CRUD

（1）提出问题 

假设我们已存在一张 tbl_employee 表，且已有对应的实体类 Employee，实现 tbl_employee  表的 CRUD 操作我们需要做什么呢？

（2）实现方式

- 基于 MyBatis

需要编写 EmployeeMapper 接口，并手动编写 CRUD 方法，提供 EmployeeMapper.xml 映射文件，并手动编写每个方法对应的 SQL 语句

- 基于 MP

只需要创建 EmployeeMapper 接口，并继承 BaseMapper 接口，这就是使用 MP 需要完成的所有操作，甚至不需要创建 SQL 映射文件

```java
public interface EmployeeMapper extends BaseMapper<Employee> {
}
```

## 2. 插入操作

```java
/**
 * 插入操作
 */
@Test
public void testInsert() {
	// 初始化 Employee 对象
	Employee employee = new Employee();
	employee.setLastName("MP1");
	employee.setEmail("mp1@163.com");
	employee.setGender(1);
	employee.setAge(18);
	
	// 插入数据库
	Integer result = employeeMapper.insert(employee);
	System.out.println("result = " + result);
}
```

运行上面的测试代码，报出如下异常，提示我们 id 字段不匹配，原因主要是主键策略配置不对

![image-20211129110857568](http://img.hl1015.top/blog/image-20211129110857568.png)

解决方案 1：通过 **@TableId：主键注解** ，因为表对应的是数据库主键自增策略，所以选用 IdType.AUTO

![image-20211129135811910](http://img.hl1015.top/blog/image-20211129135811910.png)

![image-20211129135700702](http://img.hl1015.top/blog/image-20211129135700702.png)

解决方案 2：配置 MP 全局策略

```xml
<bean id="globalConfiguration" class="com.baomidou.mybatisplus.entity.GlobalConfiguration">
	<!-- 全局的主键策略 -->
	<property name="idType" value="0"/>
</bean>

<!-- 别忘了在 sqlSessionFactoryBean 中注入上面的全局策略配置 -->
<bean id="sqlSessionFactoryBean" class="xxx.MybatisSqlSessionFactoryBean">
    ......
    <!-- 注入 MP 全局策略配置 -->
    <property name="globalConfig" ref="globalConfiguration"/>
</bean>
```

再次运行测试代码，这次报错提示我们表名不存在

![image-20211129145445656](http://img.hl1015.top/blog/image-20211129145445656.png)

解决方案 1：通过 **@TableName：表名注解** 指定表名 "tbl_employee"

![image-20211129161701684](http://img.hl1015.top/blog/image-20211129161701684.png)

解决方案 2：配置 MP 全局策略

```xml
<bean id="globalConfiguration" class="com.baomidou.mybatisplus.entity.GlobalConfiguration">
	...
    <!-- 全局的表前缀策略配置 -->
	<property name="tablePrefix" value="tbl_"/>
</bean>
```

**驼峰命名问题解决**

解决方案 1：通过 **@TableField：字段注解** - value 属性可以指定数据库字段名，exist 属性标识是否为数据库表字段

解决方案 2：配置 MP 全局策略

```xml
<bean id="globalConfiguration" class="com.baomidou.mybatisplus.entity.GlobalConfiguration">
	......
	<!-- 在 2.3 版本及以后，dbColumnUnderline 默认值就是 true【开启驼峰命名】 -->
	<property name="dbColumnUnderline" value="true"/>
</bean>
```

再次运行测试代码，成功

![image-20211129171637590](http://img.hl1015.top/blog/image-20211129171637590.png)

![image-20211129171716311](http://img.hl1015.top/blog/image-20211129171716311.png)

**对于支持主键自增的数据库插入数据时获取主键值的说明**

- MyBatis：需要通过 useGeneratedKeys 以及 keyProperty 来设置
- MP：自动将主键值回写到实体类中

```java
/**
 * 获取数据库自增主键
 */
@Test
public void testGenerateKey() {
	// 初始化 Employee 对象
	Employee employee = new Employee();
	employee.setLastName("MP2");
	employee.setEmail("mp2@163.com");
	employee.setGender(1);
	employee.setAge(18);

	// 插入数据库
	Integer result = employeeMapper.insert(employee); // 只插入非空字段，要全部字段都插入可以使用 insertAllColumn()
	System.out.println("result = " + result);
	System.out.println("key = " + employee.getId());
}
```

![image-20211129172103916](http://img.hl1015.top/blog/image-20211129172103916.png)

## 3. 更新操作

更新前：

![image-20211129194803624](http://img.hl1015.top/blog/image-20211129194803624.png)

```java
/**
 * 更新操作
 */
@Test
public void testUpdate() {
	// 初始化修改对象
	Employee employee = new Employee();
	employee.setId(6);
	employee.setLastName("MP2(updated)");
	employee.setEmail("mp2@163.com");
	employee.setGender(2);
	employee.setAge(20);

	Integer result = employeeMapper.updateById(employee); // 只更新非空字段，要全部字段都更新可以使用 updateAllColumnById()
	System.out.println("result = " + result);
}
```

![image-20211129194948661](http://img.hl1015.top/blog/image-20211129194948661.png)

更新后：

![image-20211129195014649](http://img.hl1015.top/blog/image-20211129195014649.png)

## 4. 查询操作

**（1）T selectById(Serializable id); // 根据 id 查询**

```java
@Test
public void testSelectById() {
	Employee employee = employeeMapper.selectById(1);
	System.out.println("employee = " + employee);
}
```

![image-20211129195717640](http://img.hl1015.top/blog/image-20211129195717640.png)

**（2）T selectOne(@Param("ew") T entity); // 根据多个列进行查询**

```java
@Test
public void testSelectOne() {
	Employee employee = new Employee();
	employee.setId(2);
	employee.setLastName("Jerry");

	Employee result = employeeMapper.selectOne(employee);
	System.out.println("employee = " + result);
}
```

![image-20211129200112811](http://img.hl1015.top/blog/image-20211129200112811.png)

<font color="red">注：</font>selectOne 这个方法查询返回的只是一个对象，不是一个数组，当条件匹配查询到多条记录时，执行此方法会报错。

**（3）List\<T\> selectBatchIds(@Param("coll") Collection<? extends Serializable> idList); // 根据 id 集合查询**

```java
@Test
public void testSelectBatchIds() {
	List<Integer> idList = new ArrayList<>();
	idList.add(3);
	idList.add(4);
	idList.add(5);
	idList.add(6);

	List<Employee> employees = employeeMapper.selectBatchIds(idList);
	System.out.println("employees = " + employees);
}
```

![image-20211129200822567](http://img.hl1015.top/blog/image-20211129200822567.png)

**（4）List\<T\> selectByMap(@Param("cm") Map<String, Object> cloumnMap); // 通过 Map 封装条件查询**

```java
@Test
public void testSelectByMap() {
	Map<String, Object> columnMap = new HashMap<>();
	columnMap.put("last_name", "MP1");
	columnMap.put("gender", 1);

	List<Employee> employees = employeeMapper.selectByMap(columnMap);
	System.out.println("employees = " + employees);
}
```

![image-20211129201552838](http://img.hl1015.top/blog/image-20211129201552838.png)

**（5）List\<T\> selectPageRowBounds rowBounds, @Param("ew") Wrapper\<T\> wrapper); // 分页查询[内存分页]**

```java
@Test
public void testSelectPage() {
	List<Employee> employees = employeeMapper.selectPage(new Page<>(1, 3), null);
	System.out.println("employees = " + employees);
}
```

![image-20211129202646929](http://img.hl1015.top/blog/image-20211129202646929.png)

## 5. 删除操作

**（1）Integer deleteById(); // 根据 id 删除**

```java
@Test
public void testDeleteById() {
	Integer result = employeeMapper.deleteById(6);
	System.out.println("result = " + result);
}
```

![image-20211129203543235](http://img.hl1015.top/blog/image-20211129203543235.png)

**（2）Integer deleteByMap(@Param("cm") Map<String, Object> columnMap);**

```java
@Test
public void testDeleteByMap() {
	Map<String, Object> columnMap = new HashMap<>();
	columnMap.put("last_name", "MP1");
	columnMap.put("email", "mp1@163.com");

	Integer result = employeeMapper.deleteByMap(columnMap);
	System.out.println("result = " + result);
}
```

![image-20211129204059089](http://img.hl1015.top/blog/image-20211129204059089.png)

**（3）Integer deleteBatchIds(List<? extends Serializable> idList);**

```java
@Test
public void testDeleteBatchIds() {
	List<Integer> idList = new ArrayList<>();
	idList.add(3);
	idList.add(4);

	Integer result = employeeMapper.deleteBatchIds(idList);
	System.out.println("result = " + result);
}
```

![image-20211129204411013](http://img.hl1015.top/blog/image-20211129204411013.png)

## 6. 通用 CRUD 总结

（1）以上是基本的 CRUD 操作，如你所见，我们仅仅需要继承一个 BaseMapper 即可实现大部分单表 CRUD 操作。BaseMapper 提供了多达 17 个方法给大家使用，可以极其方便的实现单一、批量、分页等操作。极大的减少开发负担，但难道这就是 MP 的强大之处？

（2）<font color="red">提出需求：</font>

现有一个需求，我们需要分页查询 tbl_employee 表中，年龄在 18 ~ 55 之间性别为男且姓名为 xxx 的所有用户，这时候我们该如何实现上述需求呢？

- MyBatis：需要在 SQL 映射文件中编写带条件查询的 SQL，并基于 PageHelper 插件完成分页，实现以上一个简单的需求，往往需要我们做很多重复单调的工作，普通的 Mapper 能够解决这类痛点吗？
- MP：依旧不用编写 SQL 语句，MP 提供了功能强大的条件构造器 EntityWrapper

