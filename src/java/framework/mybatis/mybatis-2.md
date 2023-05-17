---
title: 基本用法
date: 2021-11-03
category: 常用框架
tag:
  - MyBatis
---

## 1. Hello World

### 1.1 物理建模

在本地新建一个数据库，新建一张表 t_emp 并往表中插入几条数据

```sql
CREATE DATABASE `mybatis-example`;

USE `mybatis-example`;

CREATE TABLE `t_emp`(
emp_id INT AUTO_INCREMENT,
emp_name CHAR(100),
emp_salary DOUBLE(10,5),
PRIMARY KEY(emp_id)
);

INSERT INTO `t_emp`(emp_name,emp_salary) VALUES("zhagnsan",500);
INSERT INTO `t_emp`(emp_name,emp_salary) VALUES("lisi",600);
INSERT INTO `t_emp`(emp_name,emp_salary) VALUES("wangwu",700);
```

![image-20211024105804028](http://img.hl1015.top/blog/image-20211024105804028.png)

### 1.2 逻辑建模

**（1）新建一个 maven 工程**

![image-20211023224032441](http://img.hl1015.top/blog/image-20211023224032441.png)

**（2）创建 Java 实体类**

> 实体类是现实世界中某一个具体或抽象的概念对应，是软件开发过程中，为了管理现实世界中的数据而设计的模型。
>
> 实体类的多个不同的叫法：
>
> domain【领域模型】 
>
> entity【实体】 
>
> POJO【Plain Old Java Object，普通 Java 对象】 
>
> Java Bean【一个 Java 类】

①先导入 lombok 依赖，目的是简化 Bean 开发 和 日志开发

```xml
<!--lombok-->
<dependency>
	<groupId>org.projectlombok</groupId>
	<artifactId>lombok</artifactId>
	<version>1.18.10</version>
	<optional>true</optional>
</dependency>
```

②创建 Employee 实体类

```java
/**
 * 和数据库表 t_emp 对应的实体类
 * Java 的实体类中，属性的类型不要使用基本数据类型，要使用包装类型，因为包装类型可以赋值为 null，表示空，而基本数据类型不可以
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    private Integer empId;

    private String empName;

    private Double empSalary;
}
```

### 1.3 搭建框架开发环境

①导入相关依赖

```xml
<!-- Mybatis核心 -->
<dependency>
	<groupId>org.mybatis</groupId>
	<artifactId>mybatis</artifactId>
	<version>3.5.7</version>
</dependency>
<!-- junit测试 -->
<dependency>
	<groupId>junit</groupId>
	<artifactId>junit</artifactId>
	<version>4.12</version>
	<scope>test</scope>
</dependency>
<!-- MySQL驱动 -->
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
	<version>8.0.21</version>
</dependency>
```

②准备配置文件

**[1]MyBatis 全局配置文件**

> 习惯上命名为 mybatis-coonfig.xml，这个文件名仅仅只是建议，并非强制要求。将来整合 Spring 之后，这个配置文件可以省略。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- environments表示配置Mybatis的开发环境，可以配置多个环境，在众多具体环境中，使用default属性指定实际运行时使用的环境。default属性的取值是environment标签的id属性的值。 -->
    <environments default="development">
        <!-- environment表示配置Mybatis的一个具体的环境 -->
        <environment id="development">
            <!-- Mybatis的内置的事务管理器 -->
            <transactionManager type="JDBC"/>
            <!-- 配置数据源 -->
            <dataSource type="POOLED">
                <!-- 建立数据库连接的具体信息 -->
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis-example?serverTimezone=GMT%2B8"/>
                <property name="username" value="root"/>
                <property name="password" value="root"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <!-- Mapper注册：指定Mybatis映射文件的具体位置 -->
        <!-- mapper标签：配置一个具体的Mapper映射文件 -->
        <!-- resource属性：指定Mapper映射文件的实际存储位置，这里需要使用一个以类路径根目录为基准的相对路径 -->
        <!-- 对Maven工程的目录结构来说，resources目录下的内容会直接放入类路径，所以这里我们可以以resources目录为基准 -->
        <mapper resource="mappers/EmployeeMapper.xml"/>
    </mappers>
</configuration>
```

**<span style="color:red">注意</span>**：配置文件存放的位置是 src/main/resources 目录下

**[2]MyBatis 映射文件**

> 相关概念：**ORM**（**O**bject **R**elationship **M**apping）对象关系映射。
>
> - 对象：Java 的实体类对象
> - 关系：关系型数据库
> - 映射：二者之间的对应关系
>
> 下表列举的是最简单的单表映射（一个表和一个类）：
>
> | Java概念 | 数据库概念 |
> | :------: | :--------: |
> |    类    |     表     |
> |   属性   |  字段/列   |
> |   对象   |  记录/行   |

在 src/main/resources 目录下，创建 mappers 目录，并创建 EmployeeMapper.xml

![image-20211024102732956](http://img.hl1015.top/blog/image-20211024102732956.png)

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!-- mapper是根标签，namespace属性：在Mybatis全局范围内找到一个具体的Mapper配置 -->
<!-- 引入接口后，为了方便通过接口全类名来找到Mapper配置文件，所以通常将namespace属性设置为接口全类名 -->
<mapper namespace="com.hkw.mybatis.mapper.EmployeeMapper">
    <!-- 编写具体的SQL语句，使用id属性唯一的标记一条SQL语句 -->
    <!-- resultType属性：指定封装查询结果的Java实体类的全类名 -->
    <select id="selectByEmpId" resultType="com.hkw.mybatis.entity.Employee">
        <!-- Mybatis负责把SQL语句中的#{}部分替换成“?”占位符，在#{}内部还是要声明一个见名知意的名称 -->
        select
            emp_id as empId,
            emp_name as empName,
            emp_salary as empSalary
        from
            t_emp
        where emp_id = #{empId}
    </select>
</mapper>
```

**<span style="color:red">注意</span>**：EmployeeMapper.xml 所在的目录要和 mybatis-config.xml 中使用 mapper 标签配置的一致

### 1.4 junit 测试

```java
public class MaBatisTest {

    @Test
    public void testSelectEmployee() throws IOException {
        // 1.创建SqlSessionFactory对象
        // ①声明Mybatis全局配置文件的路径
        String mybatisConfigFilePath = "mybatis-config.xml";

        // ②以输入流的形式加载Mybatis配置文件
        InputStream inputStream = Resources.getResourceAsStream(mybatisConfigFilePath);

        // ③基于读取Mybatis配置文件的输入流创建SqlSessionFactory对象
        SqlSessionFactory sessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        // 2.使用SqlSessionFactory对象开启一个会话
        SqlSession session = sessionFactory.openSession();

        // 3.根据Mapper配置文件的名称空间+SQL语句的id找到具体的SQL语句
        // 格式是：名称空间.SQL语句的id
        String statement = "com.hkw.mybatis.mapper.EmployeeMapper.selectByEmpId";

        // 要传入SQL语句的参数
        Integer empId = 1;

        // 执行SQL语句
        Object result = session.selectOne(statement, empId);

        System.out.println("emp = " + result);

        // 4.关闭SqlSession
        session.close();
    }
}
```

测试运行，控制台打印结果如下：

![image-20211024110257673](http://img.hl1015.top/blog/image-20211024110257673.png)

说明：

- SqlSession：代表 **Java 程序** 和 **数据库** 之间的**会话**（HttpSession 是 Java 程序和浏览器之间的会话）
- SqlSessionFactory：是 "生产" SqlSession 的 "工厂"
- 工厂模式：如果创建某一个对象，使用的过程基本固定，那么我们就可以创建这个对象的相关代码封装到一个 "工厂类" 中，以后都使用这个工厂类来 "生产" 我们需要的对象

## 2. HelloWorld 加强版

### 2.1 加入日志

**①目的**

在 Mybatis 工作过程中，通过打印日志的方式，将要执行的 SQL 语句打印出来。

**②操作**

[1]导入依赖

```xml
<!-- log4j日志 -->
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>
```

[2]加入 log4j 的配置文件

![image-20211024112228965](http://img.hl1015.top/blog/image-20211024112228965.png)

支持 XML 和 properties 属性文件两种形式 。无论使用哪种形式，文件名是固定的：

- log4j.xml
- log4j.properties

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
    
<log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">
    
    <appender name="STDOUT" class="org.apache.log4j.ConsoleAppender">
        <param name="Encoding" value="UTF-8" />
        <layout class="org.apache.log4j.PatternLayout">
            <param name="ConversionPattern" value="%-5p %d{MM-dd HH:mm:ss,SSS} %m  (%F:%L) \n" />
        </layout>
    </appender>
    <logger name="java.sql">
        <level value="debug" />
    </logger>
    <logger name="org.apache.ibatis">
        <level value="info" />
    </logger>
    <root>
        <level value="debug" />
        <appender-ref ref="STDOUT" />
    </root>
</log4j:configuration>
```

**③日志的级别**

FATAL(致命) > ERROR(错误) > WARN(警告) > INFO(信息) > DEBUG(调试)

从左到右打印的内容越来越详细

**④STDOUT**

是 standard output 的缩写，意思是标准输出。对于 Java 程序来说，打印到标准输出就是打印到控制台。

**⑤打印效果**

![image-20211025211203589](http://img.hl1015.top/blog/image-20211025211203589.png)

### 2.2 关联外部属性文件

**①需求**

在实际开发时，同一套代码往往会对应多个不同的具体服务器环境，使用的数据库连接参数也不同。为了更好地维护这些信息，我们建议把数据库连接信息提取到 MyBatis 全局配置文件外边。

**②做法**

在 resources 目录下创建 jdbc.properties 配置文件

```properties
dev.driver=com.mysql.cj.jdbc.Driver
dev.url=jdbc:mysql://localhost:3306/mybatis-example?serverTimezone=GMT%2B8
dev.username=root
dev.password=root

test.driver=com.mysql.cj.jdbc.Driver
test.url=jdbc:mysql://test.com:3306/mybatis-example?serverTimezone=GMT%2B8
test.username=root
test.password=root

product.driver=com.mysql.cj.jdbc.Driver
product.url=jdbc:mysql://prod.com:3306/mybatis-example?serverTimezone=GMT%2B8
product.username=root
product.password=root
```

在 MyBatis 全局配置文件中指定外部 jdbc.properties 文件的位置

```xml
<!-- 指定外部文件的位置 -->
<properties resource="jdbc.properties"/>
```

![image-20211025212328366](http://img.hl1015.top/blog/image-20211025212328366.png)

在需要具体属性值的时候使用 ${key} 格式引用属性文件中的值

![image-20211025212717427](http://img.hl1015.top/blog/image-20211025212717427.png)

### 2.3 用上 Mapper 接口

> MyBatis 中的 Mapper 接口相当于以前的 Dao，但是区别在于，Mapper 仅仅只是建接口即可，我们不需要提供实现类

**①思路**

![image-20211025213405958](http://img.hl1015.top/blog/image-20211025213405958.png)

**②调整 junit 测试代码**

```java
public class ImprovedMybatisTest {

    private SqlSession session;

    // junit会在每一个@Test方法前执行@Before方法
    @Before
    public void init() throws IOException {
        session = new SqlSessionFactoryBuilder()
                .build(
                        Resources.getResourceAsStream("mybatis-config.xml"))
                .openSession();
    }

    // junit会在每一个@Test方法后执行@After方法
    @After
    public void clear() {
        session.commit();
        session.close();
    }
}
```

**③完成 Mapper 接口**

创建 EmployeeMapper 接口

![image-20211024104028185](http://img.hl1015.top/blog/image-20211024104028185.png)

```java
public interface EmployeeMapper {
    Employee selectByEmpId(Integer empId);
}
```

- 方法名和 SQL 的 id 一致
- 方法返回值和 resultType 一致
- 方法的参数和 SQL 的参数一致
- 接口的全类名和映射配置文件的名称空间一致

**④最终的 junit 测试方法**

```java
@Test
public void testMapperInterface() {
    
    // 1.根据 EmployeeMapper接口的 Class 对象获取 Mapper 接口类型的对象
    EmployeeMapper employeeMapper = session.getMapper(EmployeeMapper.class);
        
    // 2.调用 EmployeeMapper接口的方法完成对数据库的操作
    Emp emp = employeeMapper.selectEmployee(1L);
    
    // 3.打印查询结果
    System.out.println("emp = " + emp);
}
```

### 2.4 增删改操作

**①insert**

SQL 语句

```sql
<insert id="insertEmp">
	<!-- 现在在这条SQL语句中，#{}中的表达式需要被用来从Employee emp实体类中获取emp_name的值、emp_salary的值 -->
	<!-- 而我们从实体类中获取值通常都是调用getXxx()方法 -->
	<!-- 而getXxx()方法、setXxx()方法定义了实体类的属性 -->
	<!-- 定义属性的规则是：把get、set去掉，剩下部分首字母小写 -->
	<!-- 所以我们在#{}中使用getXxx()方法、setXxx()方法定义的属性名即可 -->
	insert into t_emp(emp_name,emp_salary) values(#{empName},#{empSalary})
</insert>
```

Java 代码中的 Mapper 接口

```java
public interface EmployeeMapper {

    Employee selectByEmpId(Integer empId);

    int insertEmp(Employee emp);
}
```

Java 代码中的 junit 测试代码

```java
@Test
public void testSaveEmployee() {

	EmployeeMapper employeeMapper = session.getMapper(EmployeeMapper.class);

	// 创建要保存到数据库的对象
	Employee employee = new Employee();

	// 给实体类对象设置具体属性值
	employee.setEmpName("xiaoming");
	employee.setEmpSalary(1000.00);

	// 执行保存操作
	int result = employeeMapper.insertEmp(employee);

	// 打印受影响的行数
	System.out.println("result = " + result);
}
```

测试运行，控制台打印结果如下：

![image-20211025215338819](http://img.hl1015.top/blog/image-20211025215338819.png)

![image-20211025215547260](http://img.hl1015.top/blog/image-20211025215547260.png)

**②delete**

SQL 语句

```sql
<delete id="deleteByEmpId" parameterType="java.lang.Integer">
	delete from t_emp where emp_id = #{empId}
</delete>
```

Java 代码中的 Mapper 接口

```java
public interface EmployeeMapper {

    Employee selectByEmpId(Integer empId);

    int insertEmp(Employee emp);

    int deleteByEmpId(Integer empId);
}
```

Java 代码中的 junit 测试代码

```java
@Test
public void testRemoveEmployee() {

	EmployeeMapper employeeMapper = session.getMapper(EmployeeMapper.class);

	int result = employeeMapper.deleteByEmpId(1);

	System.out.println("result = " + result);
}
```

测试运行，控制台打印结果如下：

![image-20211025220349544](http://img.hl1015.top/blog/image-20211025220349544.png)

![image-20211025220810684](http://img.hl1015.top/blog/image-20211025220810684.png)

**③update**

SQL 语句

```sql
<update id="updateByEmp">
	update t_emp set emp_name = #{empName},emp_salary = ${empSalary} where emp_id = #{empId}
</update>
```

Java 代码中的 Mapper 接口

```java
public interface EmployeeMapper {

    Employee selectByEmpId(Integer empId);

    int insertEmp(Employee emp);

    int deleteByEmpId(Integer empId);

    int updateByEmp(Employee emp);
}
```

Java 代码中的 junit 测试代码

```java
@Test
public void testUpdateEmployee() {

	EmployeeMapper employeeMapper = session.getMapper(EmployeeMapper.class);

	Employee employee = new Employee(2, "LISI", 6666.66);

	int result = employeeMapper.updateByEmp(employee);

	System.out.println("result = " + result);
}
```

测试运行，控制台打印结果如下：

![image-20211025221452633](http://img.hl1015.top/blog/image-20211025221452633.png)

![image-20211025221507521](http://img.hl1015.top/blog/image-20211025221507521.png)

## 3. 给 SQL 语句传参

### 3.1 #{} 方式

MyBatis 会在运行过程中，把配置文件中 SQL 语句里面的 #{} 转换为 ? 占位符，发送给数据库执行。

配置文件中的 SQL：

```sql
<delete id="deleteByEmpId">
	delete from t_emp where emp_id = #{empId}
</delete>
```

实际执行的 SQL：

```sql
delete from t_emp where emp_id = ?
```

### 3.2 ${} 方式

会根据 ${} 来拼接字符串

**①SQL 语句**

```sql
<select id="selectByEmpName" resultType="com.hkw.mybatis.entity.Employee">
	select
		emp_id as empId,
		emp_name as empName,
		emp_salary as empSalary
	from
		t_emp
	where emp_name like '%${empName}%'
</select>
```

**②Mapper 接口**

注意：由于 Mapper 接口中方法名是作为 SQL 语句标签的 id，不能重复，所以 **<span style="color:red">Mapper 接口中不能出现重名的方法，不允许重载！</span>**

```java
public interface EmployeeMapper {

    Employee selectByEmpId(Integer empId);

    int insertEmp(Employee emp);

    int deleteByEmpId(Integer empId);

    int updateByEmp(Employee emp);

    Employee selectByEmpName(@Param("empName") String empName);
}
```

**③junit 测试**

```java
@Test
public void test$() {

	EmployeeMapper employeeMapper = session.getMapper(EmployeeMapper.class);

	Employee employee = employeeMapper.selectByEmpName("wang");

	System.out.println("employee = " + employee);
}
```

测试运行，控制台打印结果如下：

![image-20211026112338767](http://img.hl1015.top/blog/image-20211026112338767.png)

**④实际打印的 SQL**

```sql
select emp_id as empId, emp_name as empName, emp_salary as empSalary from t_emp where emp_name like '%wang%'
```

**⑤应用场景举例**

在 SQL 语句中，数据库表的表名不确定，需要外部动态传入，此时不能使用 #{}，因为 SQL 语句不允许表名位置使用问号占位符，此时只能使用 ${}。其他情况，**<span style="color:red">只要能用 #{} 肯定不用 ${}</span>**，避免 SQL 注入。

## 4. 数据输入

### 4.1 MyBatis 总体机制概括

![image-20211026205008170](http://img.hl1015.top/blog/image-20211026205008170.png)

### 4.2 概念说明

这里数据输入具体是指上层方法（例如 Service 方法）调用 Mapper 接口时，数据传入的形式。

- 简单类型：只包含一个值的数据类型
  - 基本数据类型：int、byte、short、double、......
  - 基本数据类型的包装类型：Integer、Character、Double、......
  - 字符串类型：String
- 复杂类型：包含多个值的数据类型
  - 实体类类型：Employee、Department、......
  - 集合类型：List、Set、Map、......
  - 数组类型：int[]、String[]、......
  - 复合类型：List\<Employee\>、实体类中包含集合......

### 4.3 单个简单类型参数

**①Mapper 接口中抽象方法的声明**

```java
Employee selectByEmpId(Integer empId);
```

**②SQL 语句**

```xml
<select id="selectByEmpId" resultType="com.hkw.mybatis.entity.Employee">
	select
		emp_id as empId,
		emp_name as empName,
		emp_salary as empSalary
	from
		t_emp
	where emp_id = #{empId}
</select>
```

### 4.4 实体类类型参数

**①Mapper 接口中抽象方法的声明**

```java
int insertEmployee(Employee employee);
```

**②SQL 语句**

```xml
<insert id="insertEmployee">
	insert into t_emp(emp_name,emp_salary) values(#{empName},#{empSalary})
</insert>
```

**③对应关系**

![image-20211026210452622](http://img.hl1015.top/blog/image-20211026210452622.png)

**④结论**

MyBatis 会根据 #{} 中传入的数据，加工成 getXxx() 方法，通过反射在实体类中调用这个方法，从而获取到对应的数据，填充到 #{} 这个位置。

### 4.5 零散的简单类型数据

**①Mapper 接口中抽象方法的声明**

```java
int updateEmployee(@Param("empId") Integer empId,@Param("empSalary") Double empSalary);
```

**②SQL 语句**

```xml
<update id="updateEmployee">
	update t_emp set emp_salary=#{empSalary} where emp_id=#{empId}
</update>
```

**③对应关系**

![image-20211026211100860](http://img.hl1015.top/blog/image-20211026211100860.png)

### 4.6 Map 类型参数

**①Mapper 接口中抽象方法的声明**

```java
int updateEmployeeByMap(Map<String, Object> paramMap);
```

**②SQL 语句**

```xml
<update id="updateEmployeeByMap">
	update t_emp set emp_salary=#{empSalaryKey} where emp_id=#{empIdKey}
</update>
```

**③junit 测试**

```java
@Test
public void testUpdateEmpNameByMap() {
    
    EmployeeMapper mapper = session.getMapper(EmployeeMapper.class);
    
    Map<String, Object> paramMap = new HashMap<>();
    
    paramMap.put("empSalaryKey", 999.99);
    paramMap.put("empIdKey", 5);
    
    int result = mapper.updateEmployeeByMap(paramMap);
    
    System.out.println("result = " + result);
}
```

**④对应关系**

#{} 中写 Map 中的 key

**⑤使用场景**

有很多零散的参数需要传递，但是没有对应的实体类类型可以使用，使用 @Param 注解一个一个传入又太麻烦了，所以可以都封装到 Map 中。

## 5. 数据输出

> 数据输出总体上有两种形式：
>
> - 增删改操作返回的受影响行数：直接使用 int 或 long 类型接收即可
> - 查询操作的查询结果

### 5.1 返回单个简单类型数据

**①Mapper 接口中的抽象方法**

```java
int selectEmpCount();
```

**②SQL 语句**

```xml
<select id="selectEmpCount" resultType="int">
	select count(*) from t_emp
</select>
```

MyBatis 内部给常用的数据类型设定了很多别名。以 int 类型为例，可以写的名称有：int、integer、Integer、java.lang.Integer、Int、INT、INTEGER 等等。

**③junit 测试**

```java
@Test
public void testEmpCount() {

	EmployeeMapper employeeMapper = session.getMapper(EmployeeMapper.class);

	int count = employeeMapper.selectEmpCount();

	System.out.println("count = " + count);
}
```

### 5.2 返回实体类对象

**①Mapper 接口中的抽象方法**

```java
Employee selectEmployee(Integer empId);
```

**②SQL 语句**

```xml
<!-- 编写具体的SQL语句，使用id属性唯一的标记一条SQL语句 -->
<!-- resultType属性：指定封装查询结果的Java实体类的全类名 -->
<select id="selectEmployee" resultType="com.hkw.mybatis.entity.Employee">
    <!-- Mybatis负责把SQL语句中的#{}部分替换成“?”占位符 -->
    <!-- 给每一个字段设置一个别名，让别名和Java实体类中属性名一致 -->
    select emp_id empId,emp_name empName,emp_salary empSalary from t_emp where emp_id=#{maomi}
</select>
```

通过给数据库表字段加别名，让查询结果的每一列都和 Java 实体类中属性对应起来。

**③增加全局配置自动识别对应关系**

在 **<span style="color:blue">MyBatis 全局配置文件</span>** 中，做了下面的配置，select 语句中可以不给字段设置别名

```xml
<!-- 在全局范围内对Mybatis进行配置 -->
<settings>
    <!-- 具体配置 -->
    <!-- 从org.apache.ibatis.session.Configuration类中可以查看能使用的配置项 -->
    <!-- 将mapUnderscoreToCamelCase属性配置为true，表示开启自动映射驼峰式命名规则 -->
    <!-- 规则要求数据库表字段命名方式：单词_单词 -->
    <!-- 规则要求Java实体类属性名命名方式：首字母小写的驼峰式命名 -->
    <setting name="mapUnderscoreToCamelCase" value="true"/>
</settings>
```

### 5.3 返回 Map 类型

适用于 SQL 查询返回的各个字段综合起来并不和任何一个现有的实体类对应，没法封装到实体类对象中。【**<span style="color:red">但能够封装成实体类类型的，就不考虑使用 Map 类型</span>**】

**①Mapper 接口中的抽象方法**

```java
Map<String,Object> selectEmpNameAndMaxSalary();
```

**②SQL 语句**

```xml
<!-- 返回工资最高的员工的姓名和他的工资 -->
<select id="selectEmpNameAndMaxSalary" resultType="map">
        SELECT
            emp_name 员工姓名,
            emp_salary 员工工资,
            (SELECT AVG(emp_salary) FROM t_emp) 部门平均工资
        FROM t_emp WHERE emp_salary=(
            SELECT MAX(emp_salary) FROM t_emp
        )
</select>
```

**③junit 测试**

```java
@Test
public void testQueryEmpNameAndSalary() {

	EmployeeMapper employeeMapper = session.getMapper(EmployeeMapper.class);

	Map<String, Object> resultMap = employeeMapper.selectEmpNameAndMaxSalary();

	Set<Map.Entry<String, Object>> entrySet = resultMap.entrySet();

	for (Map.Entry<String, Object> entry : entrySet) {
		String key = entry.getKey();
		Object value = entry.getValue();
		System.out.println(key + "=" + value);
	}
}
```

### 5.4 返回 List 类型

查询结果返回多个实体类对象，希望把多个实体类对象放在 List 集合中返回。此时不需要任何特殊处理，在 resultType 属性中还是设置实体类类型即可。

**①Mapper 接口中的抽象方法**

```java
List<Employee> selectAll();
```

**②SQL 语句**

```xml
<select id="selectAll" resultType="com.hkw.mybatis.entity.Employee">
	select emp_id empId,emp_name empName,emp_salary empSalary from t_emp
</select>
```

**③junit 测试**

```java
@Test
public void testSelectAll() {

	EmployeeMapper employeeMapper = session.getMapper(EmployeeMapper.class);

	List<Employee> employeeList = employeeMapper.selectAll();

	for (Employee employee : employeeList) {
		System.out.println("employee = " + employee);
	}

}
```

### 5.5 返回自增主键

**①使用场景**

例如：保存订单信息。需要保存 Order 对象和 List\<OrderItem\>。其中，OrderItem 对应的数据库表，包含一个外键，指向 Order 对应表的主键。

在保存 List\<OrderItem\> 的时候，需要使用下面的 SQL：

```sql
insert into t_order_item(itemm_name,item_price,item_count,order_id) values(...)
```

这里需要用到的 order_id，是在保存 Order 对象时，数据库表以自增的方式产生的，需要特殊办法拿到这个自增的主键值。至于，为什么不能通过查询最大主键的方式解决这个问题，参考下图：

![image-20211026222255322](http://img.hl1015.top/blog/image-20211026222255322.png)

**②在 Mapper 配置文件中设置方式**

[1]Mapper 接口中的抽象方法

```sql
int insertEmployee(Employee employee);
```

[2]SQL 语句

```xml
<!-- useGeneratedKeys属性字面意思就是“使用生成的主键” -->
<!-- keyProperty属性可以指定主键在实体类对象中对应的属性名，Mybatis会将拿到的主键值存入这个属性 -->
<insert id="insertEmployee" useGeneratedKeys="true" keyProperty="empId">
    insert into t_emp(emp_name,emp_salary) values(#{empName},#{empSalary})
</insert>
```

[3]junit 测试

```java
@Test
public void testSaveEmp() {
    
    EmployeeMapper employeeMapper = session.getMapper(EmployeeMapper.class);
    
    Employee employee = new Employee();
        
    employee.setEmpName("john");
    employee.setEmpSalary(666.66);
    
    employeeMapper.insertEmployee(employee);
    
    System.out.println("employee.getEmpId() = " + employee.getEmpId());
    
}
```

**③注意**

MyBatis 是将自增主键的值设置到实体类对象中，而 **<span style="color:blue">不是以 Mapper 接口方法返回值</span>** 的形式返回

**④不支持自增主键的数据库**

对于不支持自增型主键的数据库（例如 Oracle），则可以使用 selectKey 子元素：selectKey 元素将会首先运行，id 会被设置，然后插入语句会被调用

```xml
<insert id="insertEmployee" parameterType="com.hkw.mybatis.entity.Employee"  databaseId="oracle">
	<selectKey order="BEFORE" keyProperty="id" resultType="integer">
		select employee_seq.nextval from dual 
	</selectKey>	
	insert into orcl_employee(id,last_name,email,gender) values(#{id},#{lastName},#{email},#{gender})
</insert>
```

或者是

```xml
<insert id="insertEmployee" parameterType="com.hkw.mybatis.entity.Employee" databaseId="oracle">
	<selectKey order="AFTER" keyProperty="id" resultType="integer">
		select employee_seq.currval from dual 
	</selectKey>	
	insert into orcl_employee(id,last_name,email,gender) values(employee_seq.nextval,#{lastName},#{email},#{gender})
</insert>
```

### 5.6 数据库表字段和实体类属性对应关系

**①别名**

将字段的别名设置成和实体类属性一致

```xml
<!-- 编写具体的SQL语句，使用id属性唯一的标记一条SQL语句 -->
<!-- resultType属性：指定封装查询结果的Java实体类的全类名 -->
<select id="selectEmployee" resultType="com.hkw.mybatis.entity.Employee">
    <!-- Mybatis负责把SQL语句中的#{}部分替换成“?”占位符 -->
    <!-- 给每一个字段设置一个别名，让别名和Java实体类中属性名一致 -->
    select emp_id empId,emp_name empName,emp_salary empSalary from t_emp where emp_id=#{maomi}
</select>
```

> 关于实体属性的约定：
>
> getXxx() 方法，setXxx() 方法把方法名中的 get 或 set 去掉，首字母小写。

**②全局配置自动识别驼峰命名规则**

在 MyBatis 全局配置文件中加入如下配置：

```xml
<!-- 使用settings对Mybatis全局进行设置 -->
<settings>
    <!-- 将xxx_xxx这样的列名自动映射到xxXxx这样驼峰式命名的属性名 -->
    <setting name="mapUnderscoreToCamelCase" value="true"/>
</settings>
```

SQL语句中可以不使用别名

```xml
<!-- Employee selectEmployee(Integer empId); -->
<select id="selectEmployee" resultType="com.hkw.mybatis.entity.Employee">
    select emp_id,emp_name,emp_salary from t_emp where emp_id=#{empId}
</select>
```

**③使用 resultMap**

使用resultMap标签定义对应关系，再在后面的 SQL 语句中引用这个对应关系

```xml
<!-- 专门声明一个resultMap设定column到property之间的对应关系 -->
<resultMap id="selectEmployeeByRMResultMap" type="com.hkw.mybatis.entity.Employee">
    
    <!-- 使用id标签设置主键列和主键属性之间的对应关系 -->
    <!-- column属性用于指定字段名；property属性用于指定Java实体类属性名 -->
    <id column="emp_id" property="empId"/>
    
    <!-- 使用result标签设置普通字段和Java实体类属性之间的关系 -->
    <result column="emp_name" property="empName"/>
    <result column="emp_salary" property="empSalary"/>
</resultMap>
    
<!-- Employee selectEmployeeByRM(Integer empId); -->
<select id="selectEmployeeByRM" resultMap="selectEmployeeByRMResultMap">
    select emp_id,emp_name,emp_salary from t_emp where emp_id=#{empId}
</select>
```

