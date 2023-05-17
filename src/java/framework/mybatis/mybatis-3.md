---
title: 映射关联关系
date: 2021-11-03
category: 常用框架
tag:
  - MyBatis
---

## 1. 概念

### 1.1 关联关系的概念说明

**①数量关系**

主要体现在数据库表中

- 一对一
  - 夫妻关系，人和身份证号
- 一对多
  - 用户和用户的订单，锁和钥匙
- 多对多
  - 老师和学生，部门和员工

**②关联关系的方向**

主要体现在 Java 实体类中

- 双向：双方都可以访问到对方
  - Customer：包含 Order 的集合属性
  - Order：包含单个 Customer 的属性
- 单向：双方中只有一方能够访问到对方
  - Customer：不包含 Order 的集合属性，访问不到 Order
  - Order：包含单个 Customer 的属性

### 1.2 创建模型

**①创建实体类**

```java
@Data
public class Customer {

    private Integer customerId;

    private String customerName;

    private List<Order> orderList; // 体现的是对多的关系
}
```

```java
@Data
public class Order {

    private Integer orderId;

    private String orderName;

    private Customer customer; // 体现的是对一的关系
}
```

**②创建数据库表并插入测试数据**

```sql
CREATE TABLE `t_customer` (
	 `customer_id` INT NOT NULL AUTO_INCREMENT, 
	 `customer_name` CHAR(100), 
	 PRIMARY KEY (`customer_id`) 
);
CREATE TABLE `t_order` ( 
	`order_id` INT NOT NULL AUTO_INCREMENT, 
	`order_name` CHAR(100), 
	`customer_id` INT, 
	PRIMARY KEY (`order_id`) 
); 
INSERT INTO `t_customer` (`customer_name`) VALUES ('c01');
INSERT INTO `t_order` (`order_name`, `customer_id`) VALUES ('o1', '1'); 
INSERT INTO `t_order` (`order_name`, `customer_id`) VALUES ('o2', '1'); 
INSERT INTO `t_order` (`order_name`, `customer_id`) VALUES ('o3', '1');
```

> 实际开发中，一般在开发过程中，不给数据库表设置外键约束，原因是避免调试不方便。
>
> 一般是功能开发完成，再加外键约束检查 是否有 bug。

## 2. 对一

### 2.1 创建 OrderMapper 接口

```java
public interface OrderMapper {

    Order selectOrderWithCustomer(Integer orderId);
}
```

### 2.2 创建 OrderMapper.xml 配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!-- mapper是根标签，namespace属性：在Mybatis全局范围内找到一个具体的Mapper配置 -->
<!-- 引入接口后，为了方便通过接口全类名来找到Mapper配置文件，所以通常将namespace属性设置为接口全类名 -->
<mapper namespace="com.hkw.mybatis.mapper.OrderMapper">
    <!-- 创建resultMap实现“对一”关联关系映射 -->
    <!-- id属性：通常设置为这个resultMap所服务的那条SQL语句的id加上“ResultMap” -->
    <!-- type属性：要设置为这个resultMap所服务的那条SQL语句最终要返回的类型 -->
    <resultMap id="selectOrderWithCustomerResultMap" type="com.hkw.mybatis.entity.Order">
        <!-- 先设置Order自身属性和字段的对应关系 -->
        <id column="order_id" property="orderId"/>
        <result column="order_name" property="orderName"/>

        <!-- 使用association标签配置“对一”关联关系 -->
        <!-- property属性：在Order类中对一的一端进行引用时使用的属性名 -->
        <!-- javaType属性：一的一端类的全类名 -->
        <association property="customer" javaType="com.hkw.mybatis.entity.Customer">
            <!-- 配置Customer类的属性和字段名之间的对应关系 -->
            <id column="customer_id" property="customerId"/>
            <result column="customer_name" property="customerName"/>
        </association>
    </resultMap>

    <!-- Order selectOrderWithCustomer(Integer orderId); -->
    <select id="selectOrderWithCustomer" resultMap="selectOrderWithCustomerResultMap">
        select
            order_id,order_name,c.customer_id,customer_name
        from
            t_order o
        left join t_customer c on o.customer_id = c.customer_id
        where o.order_id = #{orderId}
    </select>
</mapper>
```

对应关系可以参考下图：

![image-20211027215737573](http://img.hl1015.top/blog/image-20211027215737573.png)

### 2.3 在 MyBatis 全局配置文件中注册 Mapper 配置文件

```xml
<mappers>
	<!-- Mapper注册：指定Mybatis映射文件的具体位置 -->
	<!-- mapper标签：配置一个具体的Mapper映射文件 -->
	<!-- resource属性：指定Mapper映射文件的实际存储位置，这里需要使用一个以类路径根目录为基准的相对路径 -->
	<!-- 对Maven工程的目录结构来说，resources目录下的内容会直接放入类路径，所以这里我们可以以resources目录为基准 -->
	<mapper resource="mappers/OrderMapper.xml"/>
</mappers>
```

### 2.4 junit 测试

```java
@Test
public void testRelationshipToOne() {
    OrderMapper orderMapper = session.getMapper(OrderMapper.class);
    
    // 查询Order对象，检查是否同时查询了关联的Customer对象
    Order order = orderMapper.selectOrderWithCustomer(2);
    System.out.println("order = " + order);
}
```

测试运行，控制台打印结果如下：

![image-20211027220247981](http://img.hl1015.top/blog/image-20211027220247981.png)

### 2.5 关键词

在 "对一" 关联关系中，我们的配置比较多，但是关键词就只有：**association** 和 **javaType**

## 3. 对多

### 3.1 创建 Mapper 接口

```java
public interface CustomerMapper {

    Customer selectCustomerWithOrderList(Integer customerId);
}
```

### 3.2 创建 CustomerMapper.xml 配置文件

![image-20211028070830779](http://img.hl1015.top/blog/image-20211028070830779.png)

在 MyBatis 全局配置文件中注册 Mapper 配置文件

```xml
<mappers>
	<!-- Mapper注册：指定Mybatis映射文件的具体位置 -->
	<!-- mapper标签：配置一个具体的Mapper映射文件 -->
	<!-- resource属性：指定Mapper映射文件的实际存储位置，这里需要使用一个以类路径根目录为基准的相对路径 -->
	<!-- 对Maven工程的目录结构来说，resources目录下的内容会直接放入类路径，所以这里我们可以以resources目录为基准 -->
	<mapper resource="mappers/CustomerMapper.xml"/>
</mappers>
```

### 3.3 配置关联关系和 SQL 语句

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!-- mapper是根标签，namespace属性：在Mybatis全局范围内找到一个具体的Mapper配置 -->
<!-- 引入接口后，为了方便通过接口全类名来找到Mapper配置文件，所以通常将namespace属性设置为接口全类名 -->
<mapper namespace="com.hkw.mybatis.mapper.CustomerMapper">
    <!-- 配置resultMap实现从Customer到OrderList的“对多”关联关系 -->
    <resultMap id="selectCustomerWithOrderListResultMap" type="com.hkw.mybatis.entity.Customer">
        <!-- 映射Customer本身的属性 -->
        <id column="customer_id" property="customerId"/>
        <result column="customer_name" property="customerName"/>

        <!-- collection标签：映射“对多”的关联关系 -->
        <!-- property属性：在Customer类中，关联“多”的一端的属性名 -->
        <!-- ofType属性：集合属性中元素的类型 -->
        <collection property="orderList" ofType="com.hkw.mybatis.entity.Order">
            <!-- 映射Order的属性 -->
            <id column="order_id" property="orderId"/>
            <result column="order_name" property="orderName"/>
        </collection>
    </resultMap>

    <!-- Customer selectCustomerWithOrderList(Integer customerId); -->
    <select id="selectCustomerWithOrderList" resultMap="selectCustomerWithOrderListResultMap">
        select
            c.customer_id,c.customer_name,o.order_id,o.order_name
        from
            t_customer c
        left join t_order o on c.customer_id = o.customer_id
        where c.customer_id = #{customerId}
    </select>
</mapper>
```

对应关系可以参考下图：

![image-20211028070612051](http://img.hl1015.top/blog/image-20211028070612051.png)

### 3.4 junit 测试

```java
@Test
public void testRelationshipToMulti() {

	CustomerMapper customerMapper = session.getMapper(CustomerMapper.class);

	// 查询Customer对象同时将关联的Order集合查询出来
	Customer customer = customerMapper.selectCustomerWithOrderList(1);

	System.out.println("customer.getCustomerId() = " + customer.getCustomerId());
	System.out.println("customer.getCustomerName() = " + customer.getCustomerName());

	List<Order> orderList = customer.getOrderList();
	for (Order order : orderList) {
		System.out.println("order = " + order);
	}

}
```

测试运行，控制台打印结果如下：

![image-20211028071130755](http://img.hl1015.top/blog/image-20211028071130755.png)

### 3.5 关键词

在 "对多" 关联关系中，同样有很多配置，但是提炼出来最关键的就是：**collection** 和 **ofType**

## 4. 分步查询

### 4.1 概念和需求

为了实现延迟加载，对 Customer 和 Order 的查询必须分开，分成两步来做，才能够实现。为此，我们需要单独查询 Order，也就是需要在 Mapper 配置文件中，单独编写查询 Order 集合数据的 SQL 语句。

### 4.2 具体操作

**①编写查询 Customer 的 SQL 语句**

```xml
<!-- Customer selectCustomerWithLazyOrderList(Integer customerId); -->
<select id="selectCustomerWithLazyOrderList" resultMap="selectCustomerWithLazyOrderListResultMap">
	select customer_id,customer_name from t_customer where customer_id = #{customerId}
</select>
```

**②编写查询 Order 的 SQL 语句**

```xml
<!-- List<Order> selectOrderListByCustomerId(Integer customerId); -->
<select id="selectOrderListByCustomerId" resultType="com.hkw.mybatis.entity.Order">
	select order_id,order_name from t_order where customer_id = #{customerId}
</select>
```

**③引用 SQL 语句**

```xml
<resultMap id="selectCustomerWithLazyOrderListResultMap" type="com.hkw.mybatis.entity.Customer">
	<!-- 映射Customer本身的属性 -->
	<id column="customer_id" property="customerId"/>
	<result column="customer_name" property="customerName"/>

	<!-- orderList集合属性的映射关系，使用分步查询 -->
	<!-- 在collection标签中使用select属性指定要引用的SQL语句 -->
	<!-- select属性值的格式是：Mapper配置文件的名称空间.SQL语句id -->
	<!-- column属性：指定Customer和Order之间建立关联关系时所依赖的字段 -->
	<collection property="orderList"
				select="com.hkw.mybatis.mapper.CustomerMapper.selectOrderListByCustomerId"
				column="customer_id"/>
</resultMap>
```

> 扩展，多列值封装 map 传递：
>
> 分步查询时通过 column 指定，将对应的列的数据传递过去，但我们有时候需要传递多列数据，这时候使用<span style="color:red">**{key1=column1,key2=column2,...}**</span> 的形式。
>
> assocation 或者 collection 标签的 fetchType=eager/lazy 可以覆盖全局的延迟加载策略，指定 **立即加载(eager)** 或者 **延迟加载(lazy)**

**④各个要素之间的对应关系**

![image-20211028074759559](http://img.hl1015.top/blog/image-20211028074759559.png)

**⑤junit 测试**

```java
@Test
public void testRelationshipByStepSelect() {

	CustomerMapper customerMapper = session.getMapper(CustomerMapper.class);

	// 查询Customer对象同时将关联的Order集合查询出来
	Customer customer = customerMapper.selectCustomerWithLazyOrderList(1);

	System.out.println("customer.getCustomerId() = " + customer.getCustomerId());
	System.out.println("customer.getCustomerName() = " + customer.getCustomerName());

	List<Order> orderList = customer.getOrderList();
	for (Order order : orderList) {
		System.out.println("order = " + order);
	}

}
```

测试运行，控制台打印结果如下：

![image-20211028090513471](http://img.hl1015.top/blog/image-20211028090513471.png)

## 5. 延迟加载

### 5.1 概念

查询到 Customer 的时候，不一定会使用 Order 的 List 集合数据。如果 Order 的集合数据始终没有使用，那么这部分数据占用的内存就浪费了。对此，我们希望不一定会被用到的数据，能够在需要使用的时候再去查询。

例如：对 Customer 进行 1000 次查询中，其中只有 15 次会用到 Order 的集合数据，那么就在需要使用时才去查询能够大幅度节约内存空间。

**<span style="color:blue">延迟加载</span>** 的概念：对于实体类关联的属性在 **<span style="color:blue">需要使用</span>** 时才查询，也叫 **<span style="color:blue">懒加载</span>**。

### 5.2 配置

![image-20211028093816123](http://img.hl1015.top/blog/image-20211028093816123.png)

参考自：[mybatis – MyBatis 3 | 配置](https://mybatis.org/mybatis-3/zh/configuration.html#settings)

**①较低版本**

```xml
<!-- 使用settings对Mybatis全局进行设置 -->
<settings>
    <!-- 开启延迟加载功能：需要配置两个配置项 -->
    <!-- 1、将lazyLoadingEnabled设置为true，开启懒加载功能 -->
    <setting name="lazyLoadingEnabled" value="true"/>

    <!-- 2、将aggressiveLazyLoading设置为false，关闭“积极的懒加载” -->
    <setting name="aggressiveLazyLoading" value="false"/>
</settings>
```

**②较高版本**

```xml
<!-- Mybatis全局配置 -->
<settings>
    <!-- 开启延迟加载功能 -->
    <setting name="lazyLoadingEnabled" value="true"/>
</settings>
```

### 5.3 junit 测试

```java
@Test
public void testSelectCustomerWithOrderList() throws InterruptedException {

	CustomerMapper mapper = session.getMapper(CustomerMapper.class);

	Customer customer = mapper.selectCustomerWithOrderList(1);

	// 这里必须只打印“customerId或customerName”这样已经加载的属性才能看到延迟加载的效果
	// 这里如果打印Customer对象整体则看不到效果
	System.out.println("customer = " + customer.getCustomerName());

	// 先指定具体的时间单位，然后再让线程睡一会儿
	TimeUnit.SECONDS.sleep(5);

	List<Order> orderList = customer.getOrderList();

	for (Order order : orderList) {
		System.out.println("order = " + order);
	}
}
```

测试运行，控制台打印结果如下：

![image-20211028095259066](http://img.hl1015.top/blog/image-20211028095259066.png)

从打印结果可以看到效果：刚开始先查询 Customer 本身，需要用到 OrderList 的时候才发送 SQL 语句去查询

### 5.4 关键词总结

我们是在 "对多" 关系中举例说明延迟加载的，在 "对一" 中配置方法基本一样。

|   关联关系   |                         配置项关键词                         |           所在配置文件            |
| :----------: | :----------------------------------------------------------: | :-------------------------------: |
|     对一     |               association 标签 / javaType 属性               |  Mapper 配置文件中的 resulteMap   |
|     对多     |                collection 标签 / ofType 属性                 |  Mapper 配置文件中的 resulteMap   |
|   对一分步   |         association 标签 / select 属性 / column 属性         |  Mapper 配置文件中的 resulteMap   |
|   对多分步   |         collection 标签 / select 属性 / column 属性          |  Mapper 配置文件中的 resulteMap   |
| 延迟加载[低] | lazyLoadingEnabled 设置为 true<br />aggressiveLazyLoading 设置为 false | MyBatis 全局配置文件中的 settings |
| 延迟加载[高] |                lazyLoadingEnabled 设置为 true                | MyBatis 全局配置文件中的 settings |

## 6. 多对多关联关系需要中间表

### 6.1 如果不使用中间表

![image-20211028100748900](http://img.hl1015.top/blog/image-20211028100748900.png)

在某一个表中，使用一个字段保存多个 "外键" 值，这将导致无法使用SQL语句进行关联查询。

### 6.2 使用中间表

![image-20211028100839934](http://img.hl1015.top/blog/image-20211028100839934.png)

这样就可以使用SQL进行关联查询了，只是有可能需要三张表进行关联。

### 6.3 中间表设置主键

**①方案一：另外设置一个专门的主键字段**

![image-20211028101012017](http://img.hl1015.top/blog/image-20211028101012017.png)

**②方案二：使用联合主键**

![image-20211028101057094](http://img.hl1015.top/blog/image-20211028101057094.png)

使用联合主键时，只要多个字段的组合不重复即可，单个字段内部是可以重复的。