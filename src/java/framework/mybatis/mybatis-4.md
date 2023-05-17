---
title: 动态 SQL
date: 2021-11-03
category: 常用框架
tag:
  - MyBatis
---

## 1. 简介

MyBatis 框架的动态 SQL 技术是一种根据特定条件动态拼接 SQL 语句的功能，它存在的意义是为了解决拼接 SQL 语句字符串时的痛点问题。

> One of the most powerful features of MyBatis has always been its Dynamic SQL capabilities. If you have any experience with JDBC or any similar framework, you understand how painful it is to conditionally concatenate strings of SQL together, making sure not to forget spaces or to omit a comma at the end of a list of columns. Dynamic SQL can be downright painful to deal with.
>
> MyBatis的一个强大的特性之一通常是它的动态 SQL 能力。如果你有使用 JDBC 或其他相似框架的经验，你就明白条件地串联 SQL 字符串在一起是多么的痛苦，确保不能忘了空格或在列表的最后省略逗号。动态 SQL 可以彻底处理这种痛苦。

## 2. if 和 where 标签

```xml
<!-- List<Employee> selectEmployeeByCondition(Employee employee); -->
<select id="selectEmployeeByCondition" resultType="com.hkw.mybatis.entity.Employee">
	select emp_id,emp_name,emp_salary from t_emp
	<!-- where标签会自动去掉“标签体内前面多余的and/or” -->
	<where>
		<!-- 使用if标签，让我们可以有选择的加入SQL语句的片段。这个SQL语句片段是否要加入整个SQL语句，就看if标签判断的结果是否为true -->
		<!-- 在if标签的test属性中，可以访问实体类的属性，不可以访问数据库表的字段 -->
		<if test="empName != null">
			<!-- 在if标签内部，需要访问接口的参数时还是正常写#{} -->
			or emp_name = #{empName}
		</if>
		<if test="empSalary &gt; 2000">
			or emp_salary > #{empSalary}
		</if>
		<!--
		 第一种情况：所有条件都满足 WHERE emp_name = ? or emp_salary > ?
		 第二种情况：部分条件满足 WHERE emp_salary > ?
		 第三种情况：所有条件都不满足 没有where子句
		 -->
	</where>
</select>
```

## 3. set 标签

### 3.1 相关业务需求举例

实际开发时，对一个实体类对象进行更新，往往不是更新所有字段，而是更新一部分字段，此时页面上的表单往往不会给不修改的字段提供表单项。

```html
<form action="" method="">
    
	<input type="hidden" name="userId" value="5232" />
	
	年  龄：<input type="text" name="userAge" /><br/>
	性  别：<input type="text" name="userGender" /><br/>
	坐  标：<input type="text" name="userPosition" /><br/>
	<!-- 用户名：<input type="text" name="userName" /><br/>   -->
	<!-- 余  额：<input type="text" name="userBalance" /><br/>-->
	<!-- 等  级：<input type="text" name="userGrade" /><br/>  -->
	
	<button type="submit">修改</button>
	
</form>
```

例如上面的表单，如果服务器端接收表单时，使用的是 User 这个实体类，那么 userName、userBalance、userGrade 接收到的数据就是 null。

如果不加判断，直接用 User 对象去更新数据库，在 Mapper 配置文件中又是每一个字段都更新，那就会把 userName、userBalance、userGrade 设置为 null 值，从而造成数据库表中对应数据被破坏。

此时需要我们在 Mapper 配置文件中，对 update 语句的 set 子句进行定制，此时就可以使用动态 SQL 的 set 标签。

### 3.2 实际配置方式

```xml
<!-- void updateEmployeeDynamic(Employee employee); -->
<update id="updateEmployeeDynamic">
	update t_emp
	<!-- set emp_name = #{empName},emp_salary = #{empSalary} -->
	<!-- 使用set标签动态管理set子句，并且动态去掉两端多余的逗号 -->
	<set>
		<if test="empName != null">
			emp_name = #{empName},
		</if>
		<if test="empSalary &lt; 3000">
			emp_salary = #{empSalary},
		</if>
	</set>
	where emp_id = #{empId}
	<!--
		 第一种情况：所有条件都满足 SET emp_name = ?, emp_salary = ?
		 第二种情况：部分条件满足 SET emp_salary = ?
		 第三种情况：所有条件都不满足 update t_emp where emp_id = ?
			没有set子句的update语句会导致SQL语法错误
	 -->
</update>
```

## 4. trim 标签

使用 trim 标签控制条件部分两端是否包含某些字符。

- prefix 属性：指定要动态添加的前缀
- suffix 属性：指定要动态添加的后缀
- prefixOverrides 属性：指定要动态去掉的前缀，使用 "|" 分隔有可能的多个值
- suffixOverrides 属性：指定要动态去掉的后缀，使用 "|" 分隔有可能的多个值

```xml
<!-- List<Employee> selectEmployeeByConditionByTrim(Employee employee); -->
<select id="selectEmployeeByConditionByTrim" resultType="com.hkw.mybatis.entity.Employee">
	select emp_id,emp_name,emp_age,emp_salary,emp_gender
	from t_emp
	<!-- prefix属性指定要动态添加的前缀 -->
	<!-- suffix属性指定要动态添加的后缀 -->
	<!-- prefixOverrides属性指定要动态去掉的前缀，使用“|”分隔有可能的多个值 -->
	<!-- suffixOverrides属性指定要动态去掉的后缀，使用“|”分隔有可能的多个值 -->
	<!-- 当前例子用where标签实现更简洁，但是trim标签更灵活，可以用在任何有需要的地方 -->
	<trim prefix="where" suffixOverrides="and|or">
		<if test="empName != null">
			emp_name=#{empName} and
		</if>
		<if test="empSalary &gt; 3000">
			emp_salary>#{empSalary} and
		</if>
		<if test="empAge &lt;= 20">
			emp_age=#{empAge} or
		</if>
		<if test="empGender == 'male'">
			emp_gender=#{empGender}
		</if>
	</trim>
</select>
```

## 5. choose / when / otherwise 标签

在多个分支条件中，仅执行一个。

- 从上到下依次执行条件判断
- 遇到的第一个满足条件的分支会被采纳
- 被采纳分支后面的分支都将不被考虑
- 如果所有的 when 分支都不满足，那么就执行 otherwise 分支

```xml
<!-- List<Employee> selectEmployeeByConditionByChoose(Employee employee); -->
<select id="selectEmployeeByConditionByChoose" resultType="com.hkw.mybatis.entity.Employee">
	select emp_id,emp_name,emp_salary from t_emp
	where
	<choose>
		<when test="empName != null">emp_name = #{empName}</when>
		<when test="empSalary &lt; 3000">emp_salary &lt; 3000</when>
		<otherwise>1 = 1</otherwise>
	</choose>
	<!--
	 第一种情况：第一个 when 满足条件 where emp_name = ?
	 第二种情况：第二个 when 满足条件 where emp_salary < 3000
	 第三种情况：两个 when 都不满足 where 1 = 1 执行了 otherwise
	 -->
</select>
```

## 6. foreach 标签

### 6.1 基本用法

用批量插入举例

```xml
<!--
    collection属性：要遍历的集合
    item属性：遍历集合的过程中能得到每一个具体对象，在item属性中设置一个名字，将来通过这个名字引用遍历出来的对象
    separator属性：指定当foreach标签的标签体重复拼接字符串时，各个标签体字符串之间的分隔符
    open属性：指定整个循环把字符串拼好后，字符串整体的前面要添加的字符串
    close属性：指定整个循环把字符串拼好后，字符串整体的后面要添加的字符串
    index属性：这里起一个名字，便于后面引用
        遍历List集合，这里能够得到List集合的索引值
        遍历Map集合，这里能够得到Map集合的key
 -->
<foreach collection="empList" item="emp" separator="," open="values" index="myIndex">
    <!-- 在foreach标签内部如果需要引用遍历得到的具体的一个对象，需要使用item属性声明的名称 -->
    (#{emp.empName},#{myIndex},#{emp.empSalary},#{emp.empGender})
</foreach>
```

### 6.2 批量更新时的注意点

上面批量插入的例子本质上是一条 SQL 语句，而实现批量更新则需要多条 SQL 语句拼起来，用分号分开，也就是一次性发送多条 SQL 语句让数据库执行。此时需要在 **<span style="color:blue">数据库连接信息的 URL 地址</span>** 中设置：

```properties
dev.url=jdbc:mysql://localhost:3306/mybatis-example?allowMultiQueries=true
```

对应的 foreach 标签如下：

```xml
<!-- int updateEmployeeBatch(@Param("empList") List<Employee> empList) -->
<update id="updateEmployeeBatch">
    <foreach collection="empList" item="emp" separator=";">
        update t_emp set emp_name=#{emp.empName} where emp_id=#{emp.empId}
    </foreach>
</update>
```

### 6.3 关于 foreach 标签的 collection 属性

如果没有给接口中 List 类型的参数使用 @Param 注解指定一个具体的名字，那么在 collection 属性中默认可以使用 collection 或 list 来应用这个 list 集合。这一点可以通过异常信息看出来：

```java
Parameter 'empList' not found. Available parameters are [collection, list]
```

在实际开发中，为了避免隐晦的表达造成一定的误会，建议使用 @Param 注解明确声明变量的名称，然后在 foreach 标签的 collection 属性中按照 @Param 注解指定的名称来引用传入的参数。

## 7. sql 标签

### 7.1 抽取重复的 SQL 片段

```xml
<!-- 使用sql标签抽取重复出现的SQL片段 -->
<sql id="mySelectSql">
	select emp_id,emp_name,emp_age,emp_salary,emp_gender from t_emp
</sql>
```

### 7.2 引用已抽取的 SQL 片段

```xml
<!-- 使用include标签引用声明的SQL片段 -->
<include refid="mySelectSql"/>
```

