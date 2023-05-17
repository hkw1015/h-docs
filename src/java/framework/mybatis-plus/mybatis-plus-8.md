---
title: 自定义全局操作
date: 2021-11-03
category: 常用框架
tag:
  - MyBatis-Plus
---

根据 MyBatisPlus 的 AutoSqlInjector 可以自定义各种你想要的 SQL，注入到全局中，相当于自定义 MyBatisPlus 自动注入的方法。

## 1. AutoSqlInjector

- 在 Mapper 接口中定义相关的 CRUD 方法

  ![image-20211130163632225](http://img.hl1015.top/blog/image-20211130163632225.png)

- 扩展 AutoSqlInjector --- inject 方法，实现 Mapper 接口中要注入的 SQL

  ```java
  /**
   * 自定义全局操作
   */
  public class MySQLInjector extends AutoSqlInjector {
  
      /**
       * 扩展 inject 方法，完成自定义全局操作
       */
      @Override
      public void inject(Configuration configuration, MapperBuilderAssistant builderAssistant, Class<?> mapperClass, Class<?> modelClass, TableInfo table) {
          // 总体目标：将 EmployeeMapper 中定义的 selectAll，处理成对应的 MappedStatement 对象，加入到 configuration 对象中
          // 1)注入的 SQL 语句
          String sql = "select id,last_name,email,gender,age,version from " + table.getTableName();
  
          // 2)注入的方法名，一定要与 EmployeeMapper 接口中的方法名一致
          String method = "selectAll";
  
          // 3)构造 SqlSource 对象
          SqlSource sqlSource = languageDriver.createSqlSource(configuration, sql, modelClass);
  
          // 4)构造一个查询的 MappedStatement，并加入到 configuration
          this.addSelectMappedStatement(mapperClass, method, sqlSource, Employee.class, table);
      }
  }
  ```

- 在 MP 全局策略中，配置自定义注入器

  ![image-20211130163517834](http://img.hl1015.top/blog/image-20211130163517834.png)

测试自定义全局方法：

```java
/**
 * 自定义全局操作
 */
@Test
public void testMySQLInjector() {
    List<Employee> employees = employeeMapper.selectAll();
    System.out.println("employees = " + employees);
}
```

![image-20211130171232127](http://img.hl1015.top/blog/image-20211130171232127.png)

## 2. 自定义注入器的应用之逻辑删除

> 假删除、逻辑删除：并不会真正地从数据库中将数据删除，而是将当前被删除的这条数据中的一个逻辑删除字段置为删除状态【tbl_employee -> del_flag = 0 -> 1】。
>
> ①所在包：com.baomidou.mybatisplus.mapper.LogicSqlInjector
>
> ②logicDeleteValue：逻辑已删除全局值
>
> ③logicNotDeleteValue：逻辑未删除全局值
>
> ④在 POJO 的逻辑删除字段添加 @TableLogic 注解
>
> ⑤会在 MP 自带查询和更新方法的 SQL 后面，追加【逻辑删除字段】=【logicNotDeleteValue 默认值】删除方法：deleteById() 和其他 delete 方法，底层 SQL 调用的是 update tbl_xxx set 【逻辑删除字段】 = 【logicDeleteValue 默认值】

**（1）给 tbl_employee 表新增一个 逻辑删除标识（0-未删除 1-已删除）**

```sql
ALTER TABLE `mp`.`tbl_employee` 
ADD COLUMN `del_flag` int NOT NULL DEFAULT 0 COMMENT '逻辑删除标识 0-未删除 1-已删除' AFTER `version`;
```

![image-20211130213559849](http://img.hl1015.top/blog/image-20211130213559849.png)

**（2）在 MP 全局策略中，配置逻辑删除注入器**

```xml
<!-- 定义 MyBatis-Plus 的全局策略配置 -->
<bean id="globalConfiguration" class="com.baomidou.mybatisplus.entity.GlobalConfiguration">
	...
	<!-- 注入逻辑删除 -->
	<property name="sqlInjector" ref="logicSqlInjector"/>
    <!-- 逻辑已删除全局值默认值 -->
    <property name="logicDeleteValue" value="1"/>
    <!-- 逻辑未删除全局值默认值 -->
    <property name="logicNotDeleteValue" value="0"/>
</bean>

<!-- 定义 逻辑删除注入器 -->
<bean id="logicSqlInjector" class="com.baomidou.mybatisplus.mapper.LogicSqlInjector"/>
```

**（3）实体类 Employee 添加 delFlag 字段，并添加上 @TableLogic 注解**

![image-20211130215242234](http://img.hl1015.top/blog/image-20211130215242234.png)

**（4）测试逻辑删除**

```java
@Test
public void testLogicDelete() {
	Integer result = employeeMapper.deleteById(4);
	System.out.println("result = " + result);
}
```

![image-20211130215711729](http://img.hl1015.top/blog/image-20211130215711729.png)

![image-20211130215739091](http://img.hl1015.top/blog/image-20211130215739091.png)

**（5）测试删除后的查询**

```java
@Test
public void testSelectAfterLogicDelete() {
	Employee employee = employeeMapper.selectById(4);
	System.out.println("employee = " + employee);
}
```

![image-20211130215951964](http://img.hl1015.top/blog/image-20211130215951964.png)