---
title: ActiveRecord（活动记录）
date: 2021-11-03
category: 常用框架
tag:
  - MyBatis-Plus
---

ActiveRecord（活动记录），是一种领域模型模式，特点是一个模型类对应关系型数据库中的一个表，而模型类的一个实例对应表中的一行记录。

ActiveRecord 一直广受动态语言（PHP、Ruby 等）的喜爱，而 Java 作为准静态语言，对于 ActiveRecord 往往只能感叹其优雅，所以 MP 也在 AR 道路上进行了一定的探索。

## 1. 如何使用 AR 模式

仅仅需要让实体类继承 Model 类且实现主键指定方法，即可开发 AR 之旅

```java
@TableName("tbl_employee")
@Data
public class Employee extends Model<Employee> {

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

	......

    @Override
    protected Serializable pkVal() {
        return this.id;
    }
}
```

## 2. AR 基本 CRUD

**（1）插入操作**

```java
/**
 * public boolean insert();
 */
@Test
public void testARInsert() {
	Employee employee = new Employee();
	employee.setLastName("wangwu");
	employee.setAge(35);
	employee.setEmail("wangwu@163.com");
	employee.setGender(1);

	boolean result = employee.insert();
	System.out.println("result = " + result);
}
```

![image-20211130090909514](http://img.hl1015.top/blog/image-20211130090909514.png)

**（2）修改操作**

```java
/**
 * public boolean updateById();
 */
@Test
public void testARUpdate() {
	Employee employee = new Employee();
	employee.setId(11);
	employee.setLastName("wangwu666");
	employee.setEmail("wangwu666@163.com");

	boolean result = employee.updateById();
	System.out.println("result = " + result);
}
```

![image-20211130091133142](http://img.hl1015.top/blog/image-20211130091133142.png)

**（3）查询操作**

```java
/**
 * public T selectById();
 * public T selectById(Serializable id);
 * public List<T> selectAll();
 * public List<T> selectList(Wrapper wrapper);
 * public int selectCount(Wrapper wrapper);
 */
@Test
public void testARSelect() {
	Employee employee = new Employee();
	employee.setId(11);

	Employee employee1 = employee.selectById();
	Employee employee2 = employee.selectById(10);
	List<Employee> employees1 = employee.selectAll();
	List<Employee> employees2 = employee.selectList(new EntityWrapper().eq("last_name", "Tom"));
	int count = employee.selectCount(new EntityWrapper().eq("gender", 1));
	
	System.out.println("employee(id=11) = " + employee1);
	System.out.println("employee(id=10) = " + employee2);
	System.out.println("employees(all) = " + employees1);
	System.out.println("employees(wrapper) = " + employees2);
	System.out.println("count = " + count);
}
```

![image-20211130112452873](http://img.hl1015.top/blog/image-20211130112452873.png)

**（4）删除操作**

```java
/**
 * public boolean deleteById();
 * public boolean deleteById(Serializable id);
 * public boolean delete(Wrapper wrapper);
 */
@Test
public void testARDelete() {
	Employee employee = new Employee();
	employee.setId(11);

	boolean delete1 = employee.deleteById();
	boolean delete2 = employee.deleteById(10);
	boolean delete3 = employee.delete(new EntityWrapper().eq("last_name", "Black"));

	System.out.println("delete1(id=11) = " + delete1);
	System.out.println("delete1(id=10) = " + delete2);
	System.out.println("delete3(wrapper) = " + delete3);
}
```

![image-20211130130313938](http://img.hl1015.top/blog/image-20211130130313938.png)

**（5）分页复杂操作**

```java
/**
 * public Page<T> selectPage(Page<T> page, Wrapper<T> wrapper);
 */
@Test
public void testARPage() {
	Employee employee = new Employee();

	Page<Employee> employeePage = employee.selectPage(new Page<>(1, 2), null);
	System.out.println("employeePage = " + employeePage);
	System.out.println("records = " + employeePage.getRecords());
}
```

![image-20211130130826627](http://img.hl1015.top/blog/image-20211130130826627.png)

## 3. AR 小结

（1）AR 模式提供了一种更加便捷的方式实现 CRUD 操作，其本质还是调用的 MyBatis  对应的方法，类似于语法糖

> 语法糖是指计算机语言中添加的某种语法，这种语法对原本语言的功能开发并没有影响，可以更方便开发者使用，可以避免出错的机会，让程序可读性更好

（2）到此，我们简单领略了 MyBatis-Plus 的魅力与高效率，值得注意的一点是，我们提供了强大的代码生成器，可以快速生成各类代码，真正做到了即开即用