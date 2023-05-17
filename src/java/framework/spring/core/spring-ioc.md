---
title: IOC 容器
date: 2021-08-23
category: 常用框架
tag:
  - Spring
---

## 1. IOC 底层原理

- **什么是 IOC（inversion of control）**

（1）控制反转，将对象的创建和对象之间的调用关系，都交由 Spring 去管理

（2）使用 IOC 目的：降低耦合度

（3）入门案例就是 IOC 的实现

- **底层原理**

  三大原理：xml 解析、工厂模式、反射

![image-20210821225139096](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210821225139096.png)

  > 注意：IOC 中除了使用工厂模式，还加入了 xml 解析和反射来实现进一步解耦

  IOC 过程分析：

  第一步：xml 配置文件，配置创建的对象

  ```xml
  <!-- 配置User对象创建 -->
  <bean id="user" class="com.hkw.spring5.User"></bean>
  ```

  第二步：比如有 UserService 和 UserDao 类，**IOC 会有一个工厂类负责** UserDao 类**对象的创建**

  ```java
  class UserFactory {
      public static UserDao getDao() {
          String classValue = 对应.xml文件中的<bean>中的class属性的值 ---> 1.通过xml解析得到
  
          // 2.通过反射创建对象
          Class clazz = Class.forName(classValue);
          return (UserDao) clazz.newInstance();
      }
  }
  ```

## 2. IOC 的接口

- **IOC 的思想基于 IOC 容器完成，IOC 容器底层就是对象工厂**

- **Spring 提供了两种实现 IOC 容器的方式（两个接口）**

  （1）**BeanFactory**

  IOC 容器最基本的实现，是 Spring 内部的使用接口，不提供开发人员进行使用

  > 注意：在加载配置文件时不会创建对象，只在获取或使用对象（ getBean() 时才创建对象）

  （2）**ApplicationContext**

  BeanFactory 的子接口，提供了更多更强大的功能，一般提供给开发人员进行使用

  > 注意：在加载配置文件时就会创建对象

  （3）**思考：哪种方式更好？**

  答案：ApplicationContext。原因：耗时耗资源的操作（创建对象），在项目启动的时候就进行处理会更合适，服务器（Tomcat）启动过程中就去创建我们项目中所需的对象，而不是什么时候用什么时候创建，当服务器启动时去执行加载配置的代码，把创建对象的过程在服务器启动的时候就去完成，之后的操作中用到对象的话，我们直接去用就可以了。

- **ApplicationContext 接口里的实现类**

  > **问题：在 IDEA 中如何查看一个类/接口的层次结构？**
  >
  > 答：光标停留在我们想要查看的类/接口上，快捷键 ctrl + h 进行查看

  （1）我们查看下 ApplicationContext 的结构

  ![image-20210822094707353]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822094707353.png)

  （2）两个主要实现类的区别

  **主要体现在加载配置文件的路径传递上的区别**，就拿加载下图的 bean1.xml 来说

  ![image-20210822094928952]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822094928952.png)

  ①**FileSystemXmlApplicationContext**

  在加载配置文件时，配置文件的路径写：在我们系统的完整的盘符路径

  IDEA 中具体可以这样得到：

  首先，选中具体要加载的配置文件，右键 > Copy > Copy Path

  ![image-20210822095400387]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822095400387.png)

  然后，会跳出进一步的路径选择，选择 1.Absolute Path 即可

  ![image-20210822095509767]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822095509767.png)

  加载配置文件.xml

  ```java
  ApplicationContext applicationContext = new FileSystemXmlApplicationContext("D:\\IdeaProjects\\spring5_demo\\src\\bean1.xml");
  ```

  ②**ClassPathXmlApplicationContext**

  加载配置文件时，配置文件的路径写：在项目 src 下的路径

  ![image-20210822095756566]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822095756566.png)

  加载配置文件.xml

  ```java
  ApplicationContext applicationContext = new ClassPathXmlApplicationContext("bean1.xml");
  ```

- **BeanFactory 接口的结构**

  ![image-20210822154405241](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822154405241.png)

## 3. IOC 操作-Bean 管理

- **什么是 Bean 管理？**

  其实 Bean 管理指的是两个操作：

  （1）**Spring 创建对象**

  （2）**Spring 向创建的对象中注入属性**

- **Bean 管理的实现有两种方式**

  （1）**基于 xml 配置文件方式实现**

  （2）**基于注解方式实现**

- **实现方式（xml 方式）**

  （1）**首先，创建对象的实现**

  bean.xml 配置文件的方式

  ```xml
  <!-- 配置User对象创建 -->
  <bean id="user" class="com.hkw.spring5.User"></bean>
  ```

  > 说明：
  >
  > 1.在 Spring 配置文件中，使用 bean 标签，标签里添加对应属性，就可以实现对象的创建
  >
  > 2.在 bean 标签中有很多属性，这里简单介绍常用的属性
  >
  > ​	**id 属性：唯一标识**
  >
  > ​	**class 属性：类全路径（包类路径）**
  >
  > ​	其他一些不常用的：name（作用的和 id 类似，早期的 Struct1 用，现在 Spring 中基本上使用 id）
  >
  > 3.**创建对象时，默认是执行类的无参构造方法完成对象创建**

  验证：在我们的 User 类生成显式的无参构造方法，在里面输出一些内容

  ```java
  public User() {
      System.out.println("解析xml方式默认调用无参构造方法创建对象");
  }
  ```

  运行我们的单元测试方法

  ```java
  @Test
  public void test1() {
  	// 1.加载 Spring 的配置文件
      ApplicationContext applicationContext = new ClassPathXmlApplicationContext("bean1.xml");
      
      // 2.获取配置中创建的对象
      User user = applicationContext.getBean("user", User.class);
      
      // 3.输出查看结果
      System.out.println(user);
      user.add();
  }
  ```

  可以看到控制台打印了无参构造里输出的内容，说明默认执行了无参构造方法

  ![image-20210822101830988]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822101830988.png)

（2）**其次，为创建的对象注入属性**

DI（Dependency injection）：依赖注入，就是注入属性

两种方式：①<span style="color:red">通过 set 方法进行注入</span> ②<span style="color:red">通过有参构造方法注入</span>

## 4. 基于 xml 配置文件方式实现 Bean 管理

- **通过<span style="color:green"> set 方法 </span>进行注入**

  首先，创建一个类（User 类），在里面定义若干个属性，并生成 get、set 方法

  ```java
  public class User {
  
      private String name;
      private int age;
      
      public User() {
          System.out.println("解析xml方式默认调用无参构造方法创建对象");
      }
  
      public User(String name, int age) {
          this.name = name;
          this.age = age;
      }
  
      public void add() {
          System.out.println("add ...");
      }
  
      public String getName() {
          return name;
      }
  
      public void setName(String name) {
          this.name = name;
      }
  
      public int getAge() {
          return age;
      }
  
      public void setAge(int age) {
          this.age = age;
      }
  }
  ```

  然后编写 xml 配置文件（bean1.xml）

  ```xml
  <!-- 配置User对象创建 -->
  <bean id="user" class="com.hkw.spring5.User">
      <!-- set方法注入属性 -->
      <!-- 使用property标签完成属性注入 name:类里面的属性名称 value:向属性中注入的值 -->
      <property name="name" value="hkw"></property>
      <property name="age" value="22"></property>
  </bean>
  ```

  测试一下

  ```java
  @Test
  public void test1() {
      // 1.加载 Spring 的配置文件
      ApplicationContext applicationContext = new ClassPathXmlApplicationContext("bean1.xml");
  
      // 2.获取配置中创建的对象
      User user = applicationContext.getBean("user", User.class);
  
      // 3.输出查看结果
     System.out.println("name = " + user.getName() + " , age = " + user.getAge());
  }
  ```

  ![image-20210822102824549]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822102824549.png)

  > 这里再了解一种简化配置的 **p名称空间** 注入的方式
  >
  > 第一步，添加 p名称空间 到配置文件中
  >
  > ```xml
  > xmlns:p="http://www.springframework.org/schema/p"
  > ```
  >
  > ![image-20210822103321623]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822103321623.png)
  >
  > 第二步，进行属性注入，在 bean 标签中进行操作（p:属性名="属性值"）
  >
  > ```xml
  > <!-- 配置User对象创建 -->
  > <bean id="user" class="com.hkw.spring5.User" p:name="黄康伟" p:age="20"></bean>
  > ```
  >
  > ![image-20210822103500610]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822103500610.png)
  >
  > **另外再了解一些关于 xml 注入其他类型的情况**
  >
  > ①null
  >
  > 使用 null标签
  >
  > ```xml
  > <!-- 配置User对象创建 -->
  > <bean id="user" class="com.hkw.spring5.User">
  >     <property name="name">
  >         <null/>
  >     </property>
  >     <property name="age" value="22"></property>
  > </bean>
  > ```
  >
  > 测试结果：
  >
  > ![image-20210822104428965]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822104428965.png)
  >
  > ②特殊符号
  >
  > ​	两种方式：
  >
  > ![image-20210822104329698]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822104329698.png)
  >
  > ```java
  > <!-- 配置User对象创建 -->
  > <bean id="user" class="com.hkw.spring5.User">
  >     <property name="name">
  >         <value><![CDATA[<<hkw>>]]></value>
  >     </property>
  >     <property name="age" value="22"></property>
  > </bean>
  > ```
  >
  > 测试结果：
  >
  > ![image-20210822104353162]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822104353162.png)

- **通过 <span style="color:green">有参构造方法</span> 注入属性**

  bean1.xml 里配置如下：

  ```xml
  <!-- 配置User对象创建 -->
  <bean id="user" class="com.hkw.spring5.User">
      <!-- 有参构造方法注入属性 -->
      <constructor-arg name="name" value="hkw1"></constructor-arg>
      <constructor-arg name="age" value="18"></constructor-arg>
  </bean>
  ```

  测试结果：

  ![image-20210822105417369]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822105417369.png)

- **注入属性之 <span style="color:green">注入外部 Bean</span>**

  （1）创建两个类 service 类和 dao 类

  （2）在 service 调用 dao 里面的方法

  （3）在 spring 配置文件中进行配置

  ![image-20210822105710022]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822105710022.png)

  UserDao

  ```java
  public interface UserDao {
      void add();
  }
  ```

  UserDaoImpl

  ```java
  public class UserDaoImpl implements UserDao {
  
      @Override
      public void add() {
          System.out.println("UserDaoImpl add ...");
      }
  }
  ```

  UserService

  ```java
  public class UserService {
      // 创建 UserDao 类型属性，生成 set 方法
      private UserDao userDao;
  
      public void setUserDao(UserDao userDao) {
          this.userDao = userDao;
      }
  
      public void add() {
          userDao.add();
      }
  }
  ```

  在 Spring 配置文件 .xml 中进行配置

  ```xml
  <!-- service 对象创建 -->
  <bean id="userService" class="com.hkw.spring5.service.UserService">
      <!-- 注入 userDao 对象
           name 属性：类里面属性名称
           ref 属性：创建 userDao 对象 bean 标签 id 值
       -->
      <property name="userDao" ref="userDaoImpl"></property>
  </bean>
  <!-- dao 对象创建 -->
  <bean id="userDaoImpl" class="com.hkw.spring5.dao.UserDaoImpl"></bean>
  ```

  测试一下

  ```java
  @Test
  public void test2() {
      // 1.加载Spring的配置文件
      ApplicationContext applicationContext = new ClassPathXmlApplicationContext("bean1.xml");
  
      // 2.获取配置中创建的对象
      UserService userService = applicationContext.getBean("userService", UserService.class);
      
      // 3.调用方法
      userService.add();
  }
  ```

  结果如下：

  ![image-20210822110257428]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822110257428.png)

- **注入属性之 <span style="color:green">注入内部 Bean</span>**

  （1）一对多关系：部门和员工

  一个部门有多个员工，一个员工属于一个部门

  部门是 **一**，员工是 **多**

  （2）在实体类之间表示一对多关系，员工表示所属部门，使用对象类型属性进行表示

  我们创建 Department（部门）和 Employee（员工）两个类

  Department

  ```java
  public class Department {
      private String dName;
  
      public void setdName(String dName) {
          this.dName = dName;
      }
  }
  ```

  Employee

  ```java
  public class Employee {
      private String name;
      private String gender;
      private Department department;
  
      public void setName(String name) {
          this.name = name;
      }
  
      public void setGender(String gender) {
          this.gender = gender;
      }
  
      public void setDepartment(Department department) {
          this.department = department;
      }
  }
  ```

  在 Spring 配置文件 .xml 中进行配置

  ```xml
  <!-- Employee 对象创建 -->
  <bean id="employee" class="com.hkw.spring5.bean.Employee">
      <!-- 设置普通类型属性 -->
      <property name="name" value="hkw"></property>
      <property name="gender" value="男"></property>
      <!-- 设置对象类型属性 -->
      <property name="department">
          <bean class="com.hkw.spring5.bean.Department">
              <property name="dName" value="技术部"></property>
          </bean>
      </property>
  </bean>
  ```

  测试一下（在 Employee 和 Department 类中重写 toString()）

  ```java
  @Test
  public void test3() {
      // 1.加载Spring的配置文件
      ApplicationContext applicationContext = new ClassPathXmlApplicationContext("bean1.xml");
  
      // 2.获取配置中创建的对象
      Employee employee = applicationContext.getBean("employee", Employee.class);
  
      // 3.输出查看结果
      System.out.println(employee.toString());
  }
  ```

  结果如下：

  ![image-20210822111303032]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822111303032.png)

- **注入属性之 <span style="color:green">级联赋值</span>**

  级联赋值，将类中相关联的对象属性类型附上值

  第一种方式：

  ```xml
  <!-- 级联操作 第一种写法 -->
  <!-- Employee 对象创建 -->
  <bean id="employee" class="com.hkw.spring5.bean.Employee">
      <!-- 设置普通类型属性 -->
      <property name="name" value="Lucy"></property>
      <property name="gender" value="女"></property>
      <property name="department" ref="department"></property>
  </bean>
  
  <bean id="department" class="com.hkw.spring5.bean.Department">
      <property name="dName" value="财务部"></property>
  </bean>
  ```

  

  第二种方式：

  > 前提：Employee 类中要有对应的 get 方法
  >
  > Employee 中：
  >
  > ```java
  > public Department getDepartment() {
  >     return department;
  > }
  > ```

  ```xml
  <!-- 级联操作 第二种写法 -->
  <!-- Employee 对象创建 -->
  <bean id="employee" class="com.hkw.spring5.bean.Employee">
      <!-- 设置普通类型属性 -->
      <property name="name" value="Mary"></property>
      <property name="gender" value="女"></property>
      <property name="department" ref="department"></property>
      <property name="department.dName" value="人事部"></property>
  </bean>
  
  <bean id="department" class="com.hkw.spring5.bean.Department"></bean>
  ```

- **注入属性之 <span style="color:green">注入集合/数组属性</span>**

  创建一个 Student 类，在里面定义上不同类型的集合/数组属性

  ```java
  public class Student {
      // 数组类型属性
      String[] courses;
  
      // List集合类型属性
      List<String> list;
  
      // Set集合类型属性
      Set<String> set;
  
      // Map集合类型属性
      Map<String,String> map;
  
      public void setCourses(String[] courses) {
          this.courses = courses;
      }
  
      public void setList(List<String> list) {
          this.list = list;
      }
  
      public void setSet(Set<String> set) {
          this.set = set;
      }
  
      public void setMap(Map<String, String> map) {
          this.map = map;
      }
  }
  ```

  在 Spring 配置文件 .xml 中进行配置

  ```java
  <bean id="student" class="com.hkw.spring5.collectionType.Student">
      <!-- 数组类型属性注入 -->
      <property name="courses">
          <array>
              <value>数学</value>
              <value>语文</value>
              <value>英语</value>
          </array>
      </property>
      <!-- List类型属性注入 -->
      <property name="list">
          <list>
              <value>list1</value>
              <value>list2</value>
              <value>list3</value>
              <value>list3</value>
          </list>
      </property>
      <!-- Set类型属性注入 -->
      <property name="set">
          <set>
              <value>set1</value>
              <value>set2</value>
              <value>set3</value>
              <value>set3</value>
          </set>
      </property>
      <!-- Map类型属性注入 -->
      <property name="map">
          <map>
              <entry key="1" value="map1"></entry>
              <entry key="2" value="map2"></entry>
              <entry key="3" value="map3"></entry>
          </map>
      </property>
  </bean>
  ```

  测试一下

  ```java
  @Test
  public void test4() {
      // 1.加载 Spring 的配置文件
      ApplicationContext applicationContext = new ClassPathXmlApplicationContext("bean1.xml");
  
      // 2.获取配置中创建的对象
      Student student = applicationContext.getBean("student", Student.class);
  
      // 3.输出查看结果
      System.out.println(student.toString());
  }
  ```

  测试结果：

  ![image-20210822112819221]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822112819221.png)

  > **注入对象集合** 怎么做呢？
  >
  > ![image-20210822112925388]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822112925388.png)
  >
  > 创建一个 Course 类：
  >
  > ```java
  > public class Course {
  >     private String cName;
  > 
  >     public void setcName(String cName) {
  >         this.cName = cName;
  >     }
  > }
  > ```
  >
  > Student 类中加入存放 Course 的 list 集合属性，设置 set 方法，并设置一个 get 的方法
  >
  > ```java
  > // List中放对象
  > List<Course> courseList;
  > 
  > public void setCourseList(List<Course> courseList) {
  >     this.courseList = courseList;
  > }
  > 
  > // 获取 courseList 集合
  > public List<Course> getCourseList() {
  >     return courseList;
  > }
  > ```
  >
  > 在 Spring 配置文件 .xml 中进行配置
  >
  > ```java
  > <bean id="student" class="com.hkw.spring5.collectionType.Student">
  >     <property name="courseList">
  >         <list>
  >             <ref bean="course1"></ref>
  >             <ref bean="course2"></ref>
  >             <ref bean="course3"></ref>
  >         </list>
  >     </property>
  > </bean>
  > 
  > <bean id="course1" class="com.hkw.spring5.collectionType.Course">
  >     <property name="cName" value="java"></property>
  > </bean>
  > 
  > <bean id="course2" class="com.hkw.spring5.collectionType.Course">
  >     <property name="cName" value="mysql"></property>
  > </bean>
  > 
  > <bean id="course3" class="com.hkw.spring5.collectionType.Course">
  >     <property name="cName" value="html"></property>
  > </bean>
  > ```
  >
  > 测试一下
  >
  > ```java
  > @Test
  > public void test5() {
  >     // 1.加载 Spring 的配置文件
  >     ApplicationContext applicationContext = new ClassPathXmlApplicationContext("bean1.xml");
  > 
  >     // 2.获取配置中创建的对象
  >     Student student = applicationContext.getBean("student", Student.class);
  > 
  >     // 3.输出查看结果
  >     System.out.println(student.getCourseList());
  > }
  > ```
  >
  > 测试结果：
  >
  > ![image-20210822113132478]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822113132478.png)
  >
  > 
  >
  > **抽取注入集合的元素**
  >
  > 在配置文件中配置 util
  >
  > ![image-20210822113631940]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822113631940.png)
  >
  > ```xml
  > <beans xmlns="http://www.springframework.org/schema/beans"
  >        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  >        xmlns:util="http://www.springframework.org/schema/util"
  >        xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
  >                             http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util.xsd">
  > ```
  >
  > 在 Student 类中添加获取 list 集合的方法：
  >
  > ```java
  > public List<String> getList()  {
  >     return list;
  > }
  > ```
  >
  > 在 Spring 配置文件 .xml 中进行配置
  >
  > ```java
  > <util:list id="list">
  >     <value>语</value>
  >     <value>数</value>
  >     <value>英</value>
  >     <value>化</value>
  >     <value>生</value>
  >     <value>物</value>
  > </util:list>
  > 
  > <bean id="student" class="com.hkw.spring5.collectionType.Student">
  >     <property name="list" ref="list"></property>
  > </bean>
  > ```
  >
  > 测试一下
  >
  > ```java
  > @Test
  > public void test6() {
  >     // 1.加载 Spring 的配置文件
  >     ApplicationContext applicationContext = new ClassPathXmlApplicationContext("bean2.xml");
  > 
  >     // 2.获取配置中创建的对象
  >     Student student = applicationContext.getBean("student", Student.class);
  > 
  >     // 3.输出查看结果
  >     System.out.println(student.getList());
  > }
  > ```
  >
  > 测试结果：
  >
  > ![image-20210822114032224]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822114032224.png)

## 5. IOC 操作-Bean 管理之 FactoryBean

- **Spring 中有两种类型的 Bean**

  （1）普通 Bean（就比如我们自己定义的 Bean）

  （2）工厂 Bean（FactoryBean）

  （3）二者区别

  ①普通 Bean：在配置文件中定义 Bean 类型就是返回类型

  ②工厂 Bean：在配置文件中定义 Bean 类型可以和返回类型不一样

  （4）工厂 Bean 的使用

  第一步，创建一个类，让这个类作为工厂 Bean，实现接口 FactoryBean

  第二步，实现接口里的方法，在实现的方法中定义返回的类型

  ​	主要实现接口里的 getObject()，定义返回的 Bean

  ![image-20210822114615330]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822114615330.png)

  ​	实现 FactoryBean 接口的时候指定泛型，这里使用的 Course 类指定

  ```java
  public class FactoryBean implements org.springframework.beans.factory.FactoryBean<Course> {
      
      // 定义返回bean
      @Override
      public Course getObject() throws Exception {
          Course course = new Course();
          course.setcName("Java程序设计");
          return course;
      }
  
      @Override
      public Class<?> getObjectType() {
          return null;
      }
  
      @Override
      public boolean isSingleton() {
          return false;
      }
  }
  ```

  在 Spring 配置文件 .xml 中进行配置

  ```xml
  <bean id="factoryBean" class="com.hkw.spring5.factorybean.FactoryBean"></bean>
  ```

  测试一下

  ```java
  @Test
  public void test7() {
      // 1.加载 Spring 的配置文件
      ApplicationContext applicationContext = new ClassPathXmlApplicationContext("bean3.xml");
  
      // 2.获取配置中创建的对象
      Course course = applicationContext.getBean("factoryBean", Course.class);
  
      // 3.输出查看结果
      System.out.println(course.toString());
  }
  ```

  测试结果：

  ![image-20210822115029210]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822115029210.png)

## 6. IOC 操作-Bean 管理之 Bean 的作用域

- **在 Spring 中，可以设置创建的 Bean 实例是单实例还是多实例**

- **在 Spring 中，默认情况下，Bean 是单实例对象**

  新建一个 Book 类

  ```java
  public class Book {
      private String bname;
      private int price;
  
      public void setBname(String bname) {
          this.bname = bname;
      }
  
      public void setPrice(int price) {
          this.price = price;
      }
  }
  ```

  在 Spring 配置文件 .xml 中进行配置

  ```xml
  <bean id="book" class="com.hkw.spring5.beanScope.Book"></bean>
  ```

  测试一下

  ```java
  @Test
  public void test8() {
      // 1.加载 Spring 的配置文件
      ApplicationContext applicationContext = new ClassPathXmlApplicationContext("bean4.xml");
  
      // 2.获取配置中创建的对象
      Book book1 = applicationContext.getBean("book", Book.class);
      Book book2 = applicationContext.getBean("book", Book.class);
  
      // 3.输出查看结果
      System.out.println(book1);
      System.out.println(book2);
  }
  ```

  测试结果：

  ![image-20210822130947716]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822130947716.png)

  结果显示，两个对象指向堆空间的引用地址是一样的，说明默认是单实例

- **如何设置单实例还是多实例**

  （1）在 Spring 配置文件的 bean 标签中有个 scope 属性可以用来设置单实例还是多实例

  （2）scope 的四个属性值

  **<span style="color:blue">singleton</span>**：也是默认值，表示是单实例对象

  **<span style="color:blue">prototype</span>**：表示是多实例对象

  **<span style="color:blue">request</span>**：每次 HTTP 请求都会创建一个新的 Bean（web 环境下）

  **<span style="color:blue">session</span>**：同一会话下共享一个 Bean（web 环境下）

  下面演示下多实例的设置

  在 Spring 配置文件 .xml 中进行配置

  ```xml
  <bean id="book" class="com.hkw.spring5.beanScope.Book" scope="prototype"></bean>
  ```

  还是上面的代码，测试结果：

  ![image-20210822131759168]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822131759168.png)

  （3）singleton 和 prototype 的区别

  第一，singleton 单实例，prototype 多实例。

  第二，设置 scope 的值为 singleton 时，加载 Spring 配置文件时就会创建单实例对象；设置 scope 的值为 prototype 时，不是在加载 Spring 配置文件时创建对象，而是在调用 getBean() 方法时创建对象。

## 7. IOC 操作-Bean 管理之 Bean 的生命周期

- **生命周期的理解**

  从对象创建到对象销毁的过程

- **Bean 的生命周期**

  （1）通过构造器创建 Bean 实例（无参构造器）

  （2）为 Bean 的属性设置值和对其他 Bean 引用（调用 set 方法）

  （3）调用 Bean 的初始化方法（需要进行配置初始化的方法）

  （4）Bean 可以使用了（对象获取到了）

  （5）当容器关闭时，调用 Bean 的销毁的方法（需要进行配置销毁的方法）

- **演示 Bean 的生命周期**

  新建一个 Order 类

  ```java
  public class Order {
      private String oname;
  
      // 无参构造
      public Order() {
          System.out.println("第一步，执行无参构造方法创建Bean实例");
      }
  
      public void setOname(String oname) {
          System.out.println("第二步，调用set方法设置属性值");
          this.oname = oname;
      }
  
      // 创建执行初始化的方法(需要进行配置 init-method属性：init-method="initMehtod")
      public void initMethod() {
          System.out.println("第三步，执行初始化的方法");
      }
  
      // 创建执行销毁的方法(需要进行配置 destroy-method属性：destroy-method="destroyMethod")
      public void destroyMethod() {
          System.out.println("第五步，执行销毁的方法");
      }
  }
  ```

  在 Spring 配置文件 .xml 中进行配置

  ```xml
  <bean id="order" class="com.hkw.spring5.bean.Order" init-method="initMethod" destroy-method="destroyMethod">
      <property name="oname" value="手机"></property>
  </bean>
  ```

  测试一下

  ```java
  @Test
  public void test9() {
      // 1.加载 Spring 的配置文件
      ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("bean5.xml");
  
      // 2.获取配置中创建的对象
      Order order = applicationContext.getBean("order", Order.class);
      System.out.println("第四步，获取创建的Bean实例对象");
  
      // 3.输出查看结果
      System.out.println(order);
  
      // 4.手动调用销毁实例的方法
      applicationContext.close();
  }
  ```

  测试结果：

  ![image-20210822132906408]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822132906408.png)

- **添加 Bean 的后置处理器，Bean 的生命周期，一共 7 步（★★★）**

  （1）通过构造器创建 Bean 实例（无参构造器）

  （2）为 Bean 的属性设置值和对其他 Bean 引用（调用 set 方法）

  （3）**把 Bean 实例传递给 Bean 的后置处理器的方法 postProcessBeforeInitialization**

  （4）调用 Bean 的初始化的方法（需要进行配置初始化的方法）

  （5）**把 Bean 实例传递给 Bean 的后置处理器的方法 postProcessAfterInitialization**

  （6）Bean 可以使用了（对象获取到了）

  （7）当容器关闭时，调用 Bean 的销毁的方法（需要进行配置销毁的方法）

- **演示添加了后置处理器的效果**

  创建一个 MyBeanPost 类，实现 BeanPostProcess 接口，**重写接口里的 postProcessBeforeInitialization 和 postProcessAfterInitialization 两个方法**

  ```java
  public class MyBeanPost implements BeanPostProcessor {
      @Override
      public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
          System.out.println("在初始化之前执行的方法");
          return null;
      }
  
      @Override
      public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
          System.out.println("在初始化之后执行的方法");
          return null;
      }
  }
  ```

  在 Spring 配置文件 .xml 中进行配置

  ```xml
  <!-- 配置后置处理器 -->
  <bean id="myBeanPost" class="com.hkw.spring5.bean.MyBeanPost"></bean>
  ```

  测试一下

  ```java
  @Test
  public void test10() {
      // 1.加载 Spring 的配置文件
      ClassPathXmlApplicationContext ioc = new ClassPathXmlApplicationContext("bean6.xml");
  
      // 2.获取配置中创建的对象
      Employee employee = ioc.getBean("employee", Employee.class);
  
      // 3.输出查看结果
      System.out.println(employee);
  }
  ```

  测试结果：

  ![image-20210822134045434]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822134045434.png)

## 8. IOC 操作-Bean 管理之 xml 自动装配

- **什么是自动装配**

  根据指定装配规则（属性名称或者属性类型），Spring 自动将匹配的属性进行注入

- **演示自动装配**

  （1）根据属性名称自动注入（byName）

  在 Spring 配置文件 .xml 中进行配置

  ```xml
  <!-- 实现自动装配
      bean标签属性 autowire，配置自动装配
          byName 根据属性名称注入，注入值bean的id值和类属性名称一样
          byType 根据属性类型注入
  -->
  <bean id="employee" class="com.hkw.spring5.bean.Employee" autowire="byName"></bean>
  <bean id="department" class="com.hkw.spring5.bean.Department">
      <property name="dName" value="测试自动装配"></property>
  </bean>
  ```

  （2）根据属性类型自动注入（byType）

  在 Spring 配置文件 .xml 中进行配置

  ```xml
  <!-- 实现自动装配
      bean标签属性 autowire，配置自动装配
          byName 根据属性名称注入，注入值bean的id值和类属性名称一样
          byType 根据属性类型注入
  -->
  <bean id="employee" class="com.hkw.spring5.bean.Employee" autowire="byType"></bean>
  <bean id="department" class="com.hkw.spring5.bean.Department">
      <property name="dName" value="测试自动装配"></property>
  </bean>
  ```

  测试结果：

  ![image-20210822135843332]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822135843332.png)

## 9. IOC 操作-Bean 管理之 引入外部属性文件

> 比如我们要配置数据库连接池（德鲁伊）

- **方式一：直接配置数据库信息**

  （1）引入 jar 包

  ![image-20210822140117537]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822140117537.png)

  ![image-20210822140144176]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822140144176.png)

  在 Spring 配置文件 .xml 中进行配置

  ```xml
  <!-- 直接配置数据库连接池 -->
  <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
      <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"></property>
      <property name="url" value="jdbc:mysql://localhost:3306/students?serverTimezone=GMT%2B8"></property>
      <property name="username" value="root"></property>
      <property name="password" value="root"></property>
  </bean>
  ```

- **方式二：引入外部属性文件配置数据库连接池**

  （1）创建外部属性文件，properties 格式文件，里面配置数据库连接信息

  ```properties
  prop.driverClassName=com.mysql.cj.jdbc.Driver
  prop.ur=jdbc:mysql://localhost:3306/students?serverTimezone=GMT%2B8
  prop.username=root
  prop.password=root
  ```

  （2）把外部 properties 文件引入到 Spring 配置文件中

  第一步，引入 context 名称空间

  ```xml
  xmlns:context="http://www.springframework.org/schema/context"
  http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
  ```

  ![image-20210822140623025]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822140623025.png)

  第二步，引入外部属性文件和配置数据库连接池

  ```xml
  <!-- 引入外部属性文件 -->
  <context:property-placeholder location="jdbc.properties"/>
  <!-- 配置连接池 -->
  <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
      <property name="driverClassName" value="${prop.driverClassName}"></property>
      <property name="url" value="$${prop.ur}"></property>
      <property name="username" value="${prop.username}"></property>
      <property name="password" value="${prop.password}"></property>
  </bean>
  ```

## 10. 基于注解方式实现 Bean 管理（★★★★★）

- **什么是注解**

  （1）注解是代码特殊标记，格式：@注解名称（属性名称=属性值，属性名称=属性值，...）

  （2）使用注解，注解作用在类上面，方法上面，属性上面

  （3）使用注解的目的：简化 xml 配置

- **<span style="color:red">Spring 针对 Bean 管理中创建对象提供注解</span>**

  - **<span style="color:red">@Component：普通对象</span>**
  - **<span style="color:red">@Service：业务逻辑层/service 层</span>**
  - **<span style="color:red">@Controller：web 表现层</span>**
  - **<span style="color:red">@Repository：dao 层/持久层</span>**

  > 注意：上面的 4 个注解功能是一样的，都可以用来创建 Bean 实例。
  >
  > @Scope 可以修改 Bean 的 scope 属性，默认不标注此注解表示单例。

- **基于注解方式实现对象创建**

  第一步，引入依赖

  ![image-20210822141631635]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822141631635.png)

  第二步，开启组件扫描（前提：引入 context 名称空间）

  ```xml
  <!-- 开启组件扫描
          1 如果扫描多个包，多个包使用逗号隔开
          2 扫描包上层目录
       -->
  <!--    <context:component-scan base-package="com.hkw.spring5.bean,com.hkw.spring5.dao,..."></context:component-scan>-->
  <context:component-scan base-package="com.hkw"></context:component-scan>
  ```

  第三步，在类上面添加创建对象注解

  ```java
  // 注解里面的value属性值可以省略不写
  // 默认值(id)是类名称的首字母小写 例：OrderService -> orderService
  @Component(value = "orderService")
  public class OrderService {
      public void add() {
          System.out.println("OrderService add ... ");
      };
  }
  ```

  测试一下

  ```java
  @Test
  public void test12() throws SQLException {
      // 1.加载 Spring 的配置文件
      ClassPathXmlApplicationContext ioc = new ClassPathXmlApplicationContext("bean8.xml");
  
      // 2.获取配置中创建的对象
      OrderService orderService = ioc.getBean("orderService", OrderService.class);
  
      // 3.输出查看结果
      System.out.println(orderService);
      orderService.add();
  }
  ```

  测试结果：

  ![image-20210822142121034]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822142121034.png)

- **开启注解扫描的细节**

  使用 context:include-filter 指定扫描包时要包含的类

  使用 context:exclude-filter 指定扫描包时不包含的类

  ```xml
  <!--示例 1
      use-default-filters="false" 表示不使用默认 filter，自己配置 filter
      context:include-filter ，设置扫描哪些内容
  -->
  <context:component-scan base-package="com.hkw" use-default-filters="false">
      <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
  </context:component-scan>
  
  <!--示例 2
      下面配置扫描包所有内容
      context:exclude-filter： 设置哪些内容不进行扫描
  -->
  <context:component-scan base-package="com.hkw">
      <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
  </context:component-scan>
  ```

- **使用注解方式实现属性注入**

  （1）@Autowired：根据属性类型进行自动装配

  > 注意：使用 @Autowired 注解，不需要 get/set 方法

  第一步，创建 service 和 dao 类，在 service 和 dao 类上添加创建对象注解

  第二步，在 service 注入 dao 对象，在 service 类中添加 dao 类属性，在属性上面使用注解

  ```java
  @Service
  public class UserService {
      // 定义 dao 类型属性
      // 不需要添加 set 方法
      // 添加注入属性注解
      @Autowired
      private UserDao userDao;
      
      public void add() {
          System.out.println("service add.......");
          userDao.add();
      }
  }
  ```

  > **<span style="color:red">多个同类型的 Bean 如何装配？</span>**
  >
  > 如果同个资源类型的 Bean 不止一个，默认根据 @Autowired 注解标记的成员变量名作为 id 查找 Bean，进行装配★，再找不到就报错
  >
  > @Autowired 注解中有一个属性，叫 required 是必须，必要的意思，默认值是 true，表示被标注的 Bean 对象必须要有值注入，如果找不到注入值，就报错；如果找不到，又不希望它报错，可以把 required 值改为 false，则此对象的值可以为 null。

  （2）@Qualifier：根据属性名称（id）进行注入

  > @Qualifier 一般和 @Autowired 一起使用

  ```java
  // 定义 dao 类型属性
  // 不需要添加 set 方法//添加注入属性注解
  @Autowired // 根据类型进行注入
  @Qualifier(value = "userDaoImpl1") // 根据名称进行注入
  private UserDao userDao;
  ```

  （3）@Resource：可以根据类型注入，也可以根据名称注入

  > javax 下的包，Spring 中不推荐使用

  ```java
  // @Resource //根据类型进行注入
  @Resource(name = "userDaoImpl1") // 根据名称进行注入
  private UserDao userDao;
  ```

  （4）@Value：注入普通类型属性

  ```java
  @Value(value = "abc")
  private String name;
  ```

  **（5）完全注解开发**

  创建配置类，替代 xml 配置文件

  ```java
  @Configuration // 标注为配置类，替代xml配置文件
  @ComponentScan(basePackages = "com.hkw") // 开启组件扫描
  public class SpringConfig {
  }
  ```

  测试一下

  ```java
  @Test
  public void testSpringConfig() throws SQLException {
      // 1.加载配置类
      ApplicationContext ioc = new AnnotationConfigApplicationContext(SpringConfig.class);
  
      // 2.获取配置中创建的对象
      OrderService orderService = ioc.getBean("orderService", OrderService.class);
  
      // 3.输出查看结果
      System.out.println(orderService);
      orderService.add();
  }
  ```

  测试结果：

  ![image-20210822144348370]( https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210822144348370.png)

