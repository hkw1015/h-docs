---
title: 条件构造器 EntityWrapper
date: 2021-11-03
category: 常用框架
tag:
  - MyBatis-Plus
---

## 1. EntityWrapper 简介

（1）MyBatis-Plus 通过 EntityWrapper（简称 EW，MP 封装的一个查询条件构造器）或者 Condition（与 EW 类似）来让用户自由的构建查询条件，简单便捷，没有额外的负担，能够有效提高开发效率

（2）实体包装器，主要用于处理 SQL 拼接，排序，实体参数查询等

<font color="red">（3）注意：使用的是数据库字段，不是 Java 属性</font>

（4）条件参数说明：

![image-20211129212306363](http://img.hl1015.top/blog/image-20211129212306363.png)

## 2. 使用 EntityWrapper 的方式实现如下需求

需求：分页查询 tbl_employee 表中，年龄在 18 ~ 55 之间性别为男且姓名为 Tom 的所有用户

```java
@Test
public void testEntityWrapperSelect() {
	EntityWrapper<Employee> wrapper = new EntityWrapper<>();
	wrapper.between("age", 18 ,50)
			.eq("gender", 1)
			.eq("last_name", "Tom");

	List<Employee> employees = employeeMapper.selectPage(new Page<>(1, 2), wrapper);
	System.out.println("employees = " + employees);
}
```

![image-20211129213436791](http://img.hl1015.top/blog/image-20211129213436791.png)

## 3. 带条件的查询

```java
@Test
public void testWrapperSelect() {
	EntityWrapper<Employee> wrapper = new EntityWrapper<>();
	wrapper.eq("gender", 1).ge("age", 30);

	List<Employee> employees = employeeMapper.selectList(wrapper);
	System.out.println("employees = " + employees);
}
```

![image-20211129214049085](http://img.hl1015.top/blog/image-20211129214049085.png)

## 4. 带条件的修改

```java
@Test
public void testWrapperUpdate() {
	Employee employee = new Employee();
	employee.setLastName("lisi");
	employee.setEmail("lisi@163.com");

	EntityWrapper<Employee> wrapper = new EntityWrapper<>();
	wrapper.eq("gender", 1).eq("last_name", "zhangsan");

	Integer result = employeeMapper.update(employee, wrapper);
	System.out.println("result = " + result);
}
```

![image-20211129214834374](http://img.hl1015.top/blog/image-20211129214834374.png)

## 5. 带条件的删除

```java
@Test
public void testWrapperDelete() {
	EntityWrapper<Employee> wrapper = new EntityWrapper<>();
	wrapper.eq("gender", 1).eq("last_name", "lisi");

	Integer result = employeeMapper.delete(wrapper);
	System.out.println("result = " + result);
}
```

![image-20211129215127521](http://img.hl1015.top/blog/image-20211129215127521.png)

## 6. 使用 Condition 的方式实现查询

```java
@Test
public void testConditionDelete() {
	Wrapper wrapper = Condition.create().between("age", 18, 50)
			.eq("gender", 1)
			.eq("last_name", "Tom");

	List employees = employeeMapper.selectPage(new Page<>(1, 2), wrapper);
	System.out.println("employees = " + employees);
}
```

![image-20211129215738146](http://img.hl1015.top/blog/image-20211129215738146.png)

## 7. 小结

- MyBatis-Plus：EntityWrapper、Condition（条件构造器）
- MyBatis：MBG、xxxExample -> Criteria【QBC（Query By Criteria）】
- Hibernate：通用 Mapper