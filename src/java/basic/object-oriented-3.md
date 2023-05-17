---
title: 面向对象(下)
category: Java
tag:
  - Java 基础
---

## 1. 关键词：static

- **可以用来修饰的结构**

  属性、方法、代码块、内部类

- **static 修饰属性：静态变量（或类变量）**

  ①将属性按照是否使用 static 修饰，分为类变量和实例变量

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;类变量：类创建的多个对象共用同一套类变量；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;实例变量：类创建的每个对象各自拥有一套实例变量。

  ②类的某一个对象可以调用类变量，其对类变量的修改，会导致其他对象调用此类变量时，是修改过了的，而类的某一个对象修改了实例变量，不会影响其他对象同名的实例变量的值；

  ③类变量，随着类的加载而加载，实例变量，随着对象的创建而加载；

  ④内存中，实例变量存储在堆空间中，类变量存储在静态域中，而静态域存储在方法区。

- **static修饰方法**

  ①随着类的加载而加载；

  ②在静态方法内部：能调用静态的属性或静态的方法，不能调用非静态的属性或非静态的方法；

  在非静态方法内部：能调用静态的属性或静态的方法，也能调用非静态的属性或非静态的方法；

- **如何使用static关键字？**

  （1）什么样的属性适合声明为 static？

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①类的多个对象要共享此唯一的数据；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②类中的常量。

  （2）什么样的方法适合声明为 static？

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①工具类中的方法（比如：Arrays工具类）；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②操作静态变量的方法，通常为静态的。

- **举例**

  单例模式、工具类：Arrays / Math / Collections / XxxUtils / XxxFactory



## 2. 单例模式

- **设计模式的说明**

  （1）设计模式是在大量的实践中总结和理论优化之后的代码结构、编程风格以及解决问题的思考方式；

  （2）总结出了一共23种经典的设计模式。

- **单例模式**

  （1）要解决的问题

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保证在整个软件系统中，对某个类只能存在一个对象实例。

  （2）实现方式的对比

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;实现方式有：饿汉式 和 懒汉式；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;饿汉式：线程安全的创建方式；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;懒汉式：延迟对象的加载，节省内存空间，是线程不安全的创建方式。

  （3）具体代码的实现

```java
// 饿汉式1
class Singleton1 {
	// 1.私有化构造器
	private Singleton1() {
		
	}
	
	// 2.内部创建当前类的实例，使用private static修饰
	private static Singleton1 singleton = new Singleton1();
	
	// 3.通过get()方法返回当前类的实例，使用public static修饰
	public static Singleton1 getInstance() {
		return singleton;
	}
}

// 饿汉式2
class Singleton2 {
	private Singleton2() {
		
	}
	
	private static Singleton2 singleton = null;
	
	// 代码块里进行实例化
	{
		singleton = new Singleton2();
	}
	
	public static Singleton2 getInstance() {
		return singleton;
	}
}

// 懒汉式
class Singleton3 {
	private Singleton3() {
		
	}
	
	private static Singleton3 singleton;
	
	public static Singleton3 getInstance() {
		if(singleton == null) {
			singleton = new Singleton3();
		}
		return singleton;
	}
}
```



## 3. main()的使用说明

（1）main() 作为程序的入口；

（2）作为一个类的普通的静态方法；

（3）mian() 可以作为用户与程序交互的一种方式（类似于Scanner）。

传入参数值：java 类名 参数值1 参数值2 参数值3 ...

注意：此时传入的参数值都是 String 类型。

```java
public static void main(String[] args) {
	// 方法体；
}
```

> 1.权限修饰符：private < 缺省 < protected < public
>
> 2.修饰方法的特殊关键字：static final abstract 
>
> 3.方法的返回值类型：void / 具体的数据类型 （方法体中一定会有return)
>
> 4.方法名：需要满足标识符的命名规则和规范；见名知意
>
> 5.形参列表：方法的重载；可变个数形参的方法；参数传递机制；多态性
>
> 6.方法体：体现方法的具体功能



## 4. 类的结构之四：代码块

> 代码块（初始化块）：类的第四个成员（重要性较属性、方法、构造器差一些）

- **代码块的作用**

  用来初始化类或对象的信息

- **分类**

  静态代码块 和 非静态代码块

- **静态代码块**

  （1）可以输出语句；

  （2）随着类的加载而加载，只执行一次；

  （3）作用：用来初始化类的信息；

  （4）静态代码块内部只能调用当前类的静态的属性或方法，不能调用非静态的结构；

  （5）静态代码块的执行要早于非静态代码块；

  （6）多个静态代码块之间，是按照声明的先后顺序执行的。

- **非静态代码块**

  （1）可以输出语句；

  （2）随着对象的创建而执行，每创建一个对象，就执行一次；

  （3）作用：用来初始化对象的信息；

  （4）非静态代码块内部能调用当前类的静态的属性或方法，也能调用非静态的属性或方法。

  （5）多个非静态代码块之间，是按照声明的先后顺序执行的。

- **属性赋值顺序**

  ①默认初始化；

  ②显示初始化/在代码块中给属性初始化；

  ③构造器初始化；

  ④有了对象以后，通过“对象.属性”或“对象.方法”的方式，给属性赋值。

  说明：赋值的先后顺序：①-②-③-④，其中步骤①②③只执行一次。



## 5. 关键字：final

> final：最终的

- **可以用来修饰的结构**

  类、变量、方法

- **具体使用说明**

  （1）final 修饰类：表明该类不可被继承。比如：String 类；

  （2）final 修饰变量：表明此变量的值不能再被改变，即此变量实际上是一个常量。

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;final 修饰成员变量：此变量是一个常量。可以考虑赋值的方式有：

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①显示赋值；②代码块中赋值；③构造器中赋值。

  （3）final 修饰方法：表明此方法不能被重写。比如：Object 类中的 getClass()；



## 6. 关键字：abstract

> abstract：抽象的

- **可以用来修饰的结构**

  类、方法

- **具体使用说明**

  （1）abstract 修饰类：抽象类

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①抽象类是不可以被实例化的；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②实际开发中，我们都会去提供抽象类的子类，由子类实例化，使用父类中声明的结构；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③抽象类中一定存在构造器。构造器的作用：方便子类对象实例化时调用；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;④抽象方法所在的类一定是抽象类，反之，抽象类中可以没有声明抽象方法。

   

  （2）abstract 修饰方法：抽象方法

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①子类继承抽象的父类以后，如果重写了所有的抽象方法，则此子类就不是一个抽象类，就可以实例化；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②子类继承抽象的父类以后，如果没重写完所有的抽象方法，则此子类仍是一个抽象类，不可以实例化。

- **注意点**

  ①抽象性依赖于继承性；

  ②不能用来修饰属性、构造器等结构；

  ③不和能 private / final / static 共用。

- **abstract 的应用实例**

  举例一：抽象类 GeometricObject (提供抽象方法：findArea())及其子类Circle 、MyRetangle。

  举例二：InputStream 抽象类及其内部的抽象方法：read()。



## 7. 关键字：interface

> interface：接口

- **使用说明**

  （1）类与接口是并列的两个结构；

  （2）接口使用interface关键字定义；

  （3）接口中可以声明的结构：属性、方法；

  ​     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①接口中不能声明构造器！意味着接口不能实例化；

  ​     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②属性：接口中定义的属性都声明为：public static final的（默认有，可以省略）。

  ​     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③方法：jdk7 以及以前版本，接口中定义的方法都是抽象方法，声明为：

  ```java
  public abstract（默认有，可以省略）。
  ```

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;jdk8 开始，接口中除了定义抽象方法之外，还可以定义静态方法、默认方法。

  （4）接口，实际上可以看成是一种标准、一种规范；

  （5）java 类和接口之间是实现（implements）关系，而且是可以多实现的。

  ```java
  格式：
  class SubClass extends SuperClass implements 接口1，接口2，接口3，...{}
  ```

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果 java 类实现了某个或某几个接口，则需要重写接口中的所有抽象方法，方可实例化；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果 java 类实现了某个或某几个接口，没重写接口中所有的抽象方法，则此类必须声明为抽象类。

  （6）接口与接口之间是继承关系，而且可以多继承；

  （7）接口与实现类之间的多态性。

- **体会面向接口编程的思想**

![image-20210810111155422](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210810111155422.png)

jdbc 当中规定了很多的接口，用于规范 java 应用程序如何操作具体的数据库。

对于程序员来讲，只需要面向这套接口编程即可。

- **java8 中针对接口的新特性**

  （1）jdk8 中可以额外定义静态方法和默认方法。

  （2）具体的使用：

  ​    &nbsp;&nbsp;&nbsp;&nbsp;知识点1：接口中的静态方法，不能被实现类直接调用，只能通过接口自己来调用

  ​    &nbsp;&nbsp;&nbsp;&nbsp;知识点2：可以通过实现类的对象调用接口中声明的默认方法

  ​    &nbsp;&nbsp;&nbsp;&nbsp;知识点3：如果父类和接口中声明了同名同参数的方法，则子类继承父类，实现接口以后，在没重写此方法的情况下，默认调用的父类中的方法。---"类优先"原则

  ​    &nbsp;&nbsp;&nbsp;&nbsp;知识点4：接口冲突：实现类实现了两个接口，而两个接口中定义了同名同参数的方法，则实现类默认情况下就报错。

  ​    &nbsp;&nbsp;&nbsp;&nbsp;    &nbsp;&nbsp;&nbsp;&nbsp;要求：实现类必须要重写同名同参数的方法。

  ​    &nbsp;&nbsp;&nbsp;&nbsp;知识点5：通过“接口.super.方法”的方式调用实现的接口中的被重写的方法



## 8. 类的结构之五：内部类

> 内部类：类的第五个成员

- **定义**

  我们可以在一个类A的内部，声明另一个类B，此时，类A：外部类，类B：内部类。

- **内部类的分类**

  成员内部类（静态的 vs 非静态的） vs 局部内部类

- **说明**

  一方面，作为类：

     &nbsp;&nbsp;&nbsp;&nbsp;①内部可以声明属性、方法、构造器；

     &nbsp;&nbsp;&nbsp;&nbsp;②可以被 abstract 修饰；

     &nbsp;&nbsp;&nbsp;&nbsp;③可以被 final 修饰。

  另一方面，作为外部类的成员：

     &nbsp;&nbsp;&nbsp;&nbsp;①可以被4种权限修饰符修饰；

     &nbsp;&nbsp;&nbsp;&nbsp;②可以调用外部的属性、方法等结构；

     &nbsp;&nbsp;&nbsp;&nbsp;③可以被 static 修饰。

- **成员内部类**

  （1）如何创建成员内部类的对象？（静态的、非静态的）

  ```java
  // 如何创建静态的成员内部类对象
  Person.Dog dog = new Person.Dog(); // 错误的：Person.new Dog()
  dog.show();
  // 如何创建非静态的成员内部类对象
  // Person.Bird bird = new Person.Bird();//错误的
  Person p = new Person();
  Person.Bird bird = p.new Bird(); // 错误的：new p.Bird();
  bird.display("麻雀");
  ```

  （2）如何在成员内部类中调用外部类的结构？

  ```java
  class Person{
  	String name;
  
  	class Bird{
  		String name;
  
  		public void display(String name){
  			System.out.println(name); // 形参
  			System.out.println(this.name); // Bird 的属性
  			System.out.println(Person.this.name); // Person 的属性
  		}
  	}
  }
  ```

- **局部内部类**

```java
// 此情况开发中很少见
public void method(){
	
	// 局部内部类
	class InnerClass{
		
	}
	
}

// 较为常见的
// 返回一个实现了 Comparable 的类的对象
public Comparable getInstance(){
	
	// 写法一：提供实现了接口的内部类
//		class MyComparable implements Comparable{
//
//			@Override
//			public int compareTo(Object o) {
//				return 0;
//			}
//			
//		}
//		
//		
//		return  new MyComparable();
	
	// 写法二：返回接口的匿名实现类的匿名对象
	return new Comparable(){

		@Override
		public int compareTo(Object o) {
			return 0;
		}
		
	};
}
```

