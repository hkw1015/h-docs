---
title: 反射机制
category: Java
tag:
  - Java 基础
---

## 1. Class 的理解

- **反射的内容**

  ①Class 的理解；

  ②获取 Class 的实例；

  ③反射的应用一：动态地创建运行时类的对象：newInstance()；

  ④反射的应用二：获取运行时类中完整的类的结构：属性、方法、构造器、父类、包、 注解。。。；

  ⑤反射的应用三：调用运行时类中的指定的结构：属性、方法、构造器。

- **Class 的理解（一个 Class 实例对应着一个运行时类）**

  （1）java.lang.Class：是反射的源头；

  （2）java 源文件经过编译（javac.exe）以后，会生成一个或多个字节码文件（.class），使用 java.exe 命令，将指定的字节码文件加载（使用类的加载器）到内存中，则加载到内存中的字节码文件对应的类，我们就称为运行时类。此运行时类本身就充当了 Class 的实例；

  （3）运行时类一旦加载到内存中，就会随着 JVM 的存在而存在，即运行时类只被加载一次。

- **反射：体现 java 语言的动态的特性**

  ```java
  // 根据传入类的全类名，动态的创建对应的运行时类的对象
  public Object getInstance(String className) throws Exception {
  	Class clazz = Class.forName(className);
  	return clazz.newInstance();
  }
  ```



## 2. 获取 Class 实例

> 加载到内存中的运行时类，会缓存一定的时间，在此时间之内，我们可以通过不同的方式，来获取此运行时类

- **获取 Class 实例的几种方式（前三种需要掌握）**

  方法一：调用当前类的静态属性 class

  ```java
  Class clazz = Person.class;
  ```

  方法二：调用对象的 getClass()

  ```java
  Person person = new Person();
  
  Class clazz = person.getClass();
  ```

  方法三：调用 Class 的静态方法 forName(String className)<span style="color:red"> <--- 使用最多</span>

  ```java
  Class clazz = Class.forName("com.hkw.java.Person");
  ```

  方法四：通过类的加载器获取

  ```java
  Class clazz = Reflection.class.getClassLoader().loadClass("com.hkw.java.Person");
  ```

- **总结**

  创建类的方式？

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①new + 构造器；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②反射；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③调用类的静态方法。（比如：Calendar.getInstance()；创建 Xxx 的对象，使用 XxxBuilder 或 XxxFactory 内部提供的静态方法用于返回 Xxx 的实例）



## 3. 了解 ClassLoader

- **类的加载过程---了解**

  编译以后生成的字节码文件，需要使用 JVM 提供的类加载器，才可以将字节码文件加载到内存中，生成运行时类。

- **类加载器的分类**

  ![image-20210811160653148](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210811160653148.png)

- **加载执行的流程**

  ![image-20210811161553434](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210811161553434.png)

- **使用 ClassLoader 加载 src 目录下的配置文件**

  ```java
  public static void loadProperties(String propertiseAddress) throws Exception {
  	// 方式一：自己new输入流，此时配置文件默认是在当前工程/module下
  	Properties pro = new Properties();
  	
  	/*FileInputStream fis = new FileInputStream(propertiseAddress);
  	pro.load(fis);
  	
  	String user = (String)pro.get("user");
  	String pswd = (String)pro.get("pswd");
  	
  	System.out.println(user);
  	System.out.println(pswd);
  	
  	try{}
  	finally {
  		fis.close();
  	}*/
  	
  	// 方式二：通过类加载器getResourceAsStream获取输入流，此时配置文件默认是在src下（通常我们也是将配置文件放在src下）
  	InputStream inputStream = TestClassLoad.class.getClassLoader().getResourceAsStream(propertiseAddress);
  	
  	pro.load(inputStream);
  	
  	String user = (String)pro.get("user");
  	String pswd = (String)pro.get("pswd");
  	
  	System.out.println(user);
  	System.out.println(pswd);
  	
  	try{}
  	finally {
  		inputStream.close();
  	}
  }
  ```



## 4. 通过反射创建运行时类的对象

```java
public static void main(String[] args) {
    Class clazz = Person.class;
    Person p = null;
    try {
        p = (Person) clazz.newInstance();
        p.setName("张三");
        p.setAge(22);
    } catch (Exception e) {
        e.printStackTrace();
    }
    System.out.println(p);
}

// 打印结果：Person [name=张三, age=22]
```

说明：我们在创建一个类时，通常建议提供一个空参构造器，原因：

①子类对象实例化时，子类构造器的首行，默认调用父类空参的构造器；

②如果通过反射，动态地创建此类对象的话，默认使用的 newInstance() 就会调用空参的构造器。



## 5. 通过反射获取运行时类的完整结构

```java
// 获取运行时类的方法
@Test
public void test1() {
	Class clazz = Person.class;
	
	// getMethods():获取运行时类及其父类中声明为public的方法
	/*Method[] methods = clazz.getMethods();
	for (Method method : methods) {
		System.out.println(method);
	}*/
	
	// getDeclaredMethods():获取运行时类中声明的所有方法（不包含父类，与权限修饰符无关）
	/*Method[] declaredMethods = clazz.getDeclaredMethods();
	for (Method method : declaredMethods) {
		System.out.println(method);
	}*/
}

// 获取运行时类实现的接口
@Test
public void test2() {
	Class clazz = Person.class;
	
	Class[] interfaces = clazz.getInterfaces();
	for (Class class1 : interfaces) {
		System.out.println(class1);
	}
}

// 获取运行时类的父类
@Test
public void test3() {
	Class clazz = Person.class;
	
	Class superclass = clazz.getSuperclass();
	System.out.println(superclass);
}
```



## 6. 调用运行类的某一结构

- **调用指定的属性**

  （1）获取运行类中的指定的属性：getDeclaredField(String fieldName);

  （2）保证此属性是可访问的：field.setAccessible(true);

  （3）修改此属性值：field.set(Object obj, Object fieldValue);

  （4）获取此属性值：field.get(Object obj)。

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果上述的属性是静态的，则 Object obj 可以使用当前类来充当。

  ```java
  // 调用运行时类指定的属性
  @Test
  public void test4() throws Exception {
  	Class clazz = Class.forName("afafa.Person");
  	
  	Person p = (Person) clazz.newInstance();
  	p.setName("hl1015");
  	p.setAge(22);
  	System.out.println(p);
  	System.out.println("*****************************");
  	
  	Field name = clazz.getDeclaredField("name");
  	Field age = clazz.getDeclaredField("age");
  	name.setAccessible(true);
  	age.setAccessible(true);
  	name.set(p, "HL1015");
  	age.set(p, 21);
  	System.out.println(p);
  }
  ```

- **调用指定的方法**

  （1）获取运行时类中的指定的方法：getDeclaredMethod(String methodName, Class ... params);

  （2）保证此方法是可访问的：method.setAccessible(true);

  （3）调用此方法：invoke(Object obj, Object ... paramValues)。

  ```java
  // 调用运行时类指定的方法
  @Test
  public void test5() throws Exception {
  	Class<?> clazz = Class.forName("afafa.Person");
  	
  	Person p = (Person) clazz.newInstance();
  	
  	Method setName = clazz.getDeclaredMethod("setName", String.class);
  	Method setAge = clazz.getDeclaredMethod("setAge", int.class);
  	Method show = clazz.getDeclaredMethod("show");
  	
  	setName.setAccessible(true);
  	setAge.setAccessible(true);
  	show.setAccessible(true);
  	
  	setName.invoke(p, "HL1015");
  	setAge.invoke(p, 23);
  	show.invoke(p);
  	
  	System.out.println(p);
  }
  ```

- **调用指定的构造器**

  （1）获取指定参数的构造器：getDeclaredConstructor(Class ... params);

  （2）保证此构造器是可以调用的：setAccessible(true);

  （3）调用指定的构造器，创建运行时类的对象：constructor.newInstance(Object ... params)。

  ```java
  // 调用运行时类指定的构造器
  @Test
  public void test6() throws Exception {
  	Class clazz = Class.forName("afafa.Person");
  	
  	Constructor con = clazz.getDeclaredConstructor(String.class, int.class);
  	
  	Person p = (Person) con.newInstance("黄康伟", 21);
  	
  	System.out.println(p);
  }
  ```

  