---
title: 面向对象(中)
category: Java
tag:
  - Java 基础
---

## 1. 面向对象的特征二：继承性

- **为什么要有类的继承（继承性的好处）？**

  ①减少了冗余，提高了代码的复用性；

  ②更好的扩展性；

  ③为多态的使用，提供前提。

![image-20210810013047426](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210810013047426.png)

- **继承性的格式**

  格式：class B extends A {}

  说明：关键字 extends：继承；（扩展、延展、延长）

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B：subclass，子类

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A：superclass，超类，父类，基类

- **子类继承父类后有了什么不同**

  （1）子类继承父类以后，就获取了父类中声明的结构：属性、方法

  ​    &nbsp;&nbsp;&nbsp;强调的是：子类可以获取父类中声明为private的结构，只是由于封装性的影响，	子类不可以直接调用罢了。

  （2）子类在继承父类的基础上，还可以定义自己特有的结构：属性、方法

- **Java 中继承的说明**

  ①子父类是相对的概念；

  ②一个父类可以被多个子类所继承，反之，一个子类只能声明一个父类（Java中的单继承性：局限性）；

  ③两个概念：直接父类、间接父类；

  ④子类通过继承的方式，可以获取直接父类和间接父类的所有的属性、方法。

- **对 java.lang.Object 类(根基类)的理解**

  ①如果一个类没有显示地声明父类的话，则默认继承 java.lang.Object 类；

  ②所有的 java 类（除了Object类）都直接或间接地继承于 java.lang.Object 类；

  ③所有的 java 类在权限允许的情况下，可以调用 java.lang.Object 类的结构。



## 2. 方法的重写

- **什么是方法的重写（override或overwrite）？**

  在子类继承父类以后，子类对父类中声明的方法进行“覆盖”或“覆写”，此对方法的“覆盖”或“覆写”就称为方法的重写。

  使用：子类重写父类的方法以后，如果通过子类的对象调用重写之后的方法，此时执行的就是子类重写父类的方法。

- **举例**

```java
class Circle {
	public double findArea() {} // 返回圆的面积
}

class Cylinder extends Circle {
	public double findArea() {} // 返回圆柱的表面积
}
```

- **重写的规则**

```java
权限修饰符 返回值类型 方法名（形参列表） throws 异常类型 {
	// 方法体
}
```

​	规则：

​    &nbsp;&nbsp;①子类重写的方法，必须与父类被重写的方法的 **“方法名（形参列表）”** 相同；

​    &nbsp;&nbsp;②子类重写的方法的权限修饰 **不小于** 父类被重写的方法的权限修饰；

​        &nbsp;&nbsp;&nbsp;&nbsp;特别强调：子类不能重写父类中声明为 private 的方法。

​    &nbsp;&nbsp;③父类被重写的方法的返回值类型是 void，则子类重写方法的返回值类型也必须为void；父类被重写方法的返回值类型不是 void，则子类重写方法的返回值类型 **不大于** 父类被重写方法的返回值类型。

​    &nbsp;    &nbsp;&nbsp;&nbsp;比如：父类的方法的返回值类型为 Person，子类方法可以返回 Person 类型或者 Person 的子类类型；

​    &nbsp;&nbsp;④子类重写方法抛出的异常类型 **不大于** 父类被重写方法抛出的异常类型。

说明：子类和父类同名同形参的方法，要么都声明为 static，要么都声明为非 static。

- **面试题**

  方法重载和方法重写的区别？

  ​        &nbsp;&nbsp;&nbsp;方法重载：同一个类中，相同方法名，不同参数列表的多个方法之间称为方法重载；

  ​        &nbsp;&nbsp;&nbsp;方法重写：子类继承父类以后，子类重写父类中方法，要求：

  ​        &nbsp;&nbsp;&nbsp;        &nbsp;&nbsp;&nbsp;①子类重写方法和父类被重写方法的 方法名（形参列表）必须相同；

  ​        &nbsp;&nbsp;&nbsp;        &nbsp;&nbsp;&nbsp;②子类重写方法的权限修饰 不小于 父类被重写方法的权限修饰；

  ​        &nbsp;&nbsp;&nbsp;        &nbsp;&nbsp;&nbsp;（子类不能重写父类中声明为 private 的方法）

  ​        &nbsp;&nbsp;&nbsp;③子类重写方法的返回值类型 不大于 父类被重写方法的返回值类型（无返回值的情况，若父类被重写方法的返回值类型为 void，则子类重写方法的返回值类型必须也为 void）；

  ​        &nbsp;&nbsp;&nbsp;④子类重写方法抛出的异常类型 不大于 父类被重写方法抛出的异常类型。

  

  **类似的面试题：**

1. throws 和 throw 的区别？

   throws：用来声明一个方法可能产生的所有异常，不做任何处理而是将异常往上抛，谁调用就抛给谁。

   ​        &nbsp;说明：①用在方法声明后面，跟的是异常类名；

   ​        &nbsp;        &nbsp;②可以跟多个异常类名，用逗号隔开；

   ​        &nbsp;        &nbsp;③表示抛出异常，由该方法的调用者来处理；

   ​        &nbsp;        &nbsp;④throws 表示出现异常的一种可能性，并不一定会发生这些异常。

   throw：用来抛出一个具体的异常类型。

   ​        &nbsp;说明：①用在方法体内，跟的是异常对象名；

   ​         &nbsp;        &nbsp;②只能抛出一个异常对象；

   ​         &nbsp;        &nbsp;③表示抛出异常，由方法体内的语句处理；

   ​         &nbsp;        &nbsp;④执行 throw 一定会抛出某种异常。

2. Collection 和 Collections 的区别？

   Collection：是 java 中集合类的一个顶级接口，它的直接继承接口是 List 和 Set，另外它也提供了对集合对象进行基本操作的通用接口方法。

   Collections：是一个服务于 java 的 Collection 框架的工具类，包含了各种有关集合操作的静态多态方法。

3. String 、StringBuffer 、StringBuilder 的区别？

   String：

   ​        &nbsp;是不可变的字符串序列，因为它底层是用 final 修饰的字符数组来保存字符串的。

   StringBuffer 和 StringBuilder：

   ​        &nbsp;相同点：都继承自 AbstractStringBuilder 类，是可变字符串序列。

   ​        &nbsp;不同点：StringBuffer 是线程安全的，效率较低；StringBuilder 是线程不安全的，效率较高。

4. final / finally / finalize 的区别？

   final：

   ​        &nbsp;有三种用法：修饰类、变量和方法。

   ​        &nbsp;①修饰类时，表明该类不能被继承；

   ​        &nbsp;②修饰变量时，表明该变量在使用时不能被改变，所以在声明时需要给变量进行初始化（如果是成员变量，也可以在声明处先不赋值，但在构造器内要对改成员变量赋值）；

   ​        &nbsp;③修饰方法时，表明该方法只能使用，在子类中不能被重写。

   finally：

   ​        &nbsp;通常是放在 try...catch 后面构造最终代码执行块，无论程序是正常还是异常，这部分代码都会执行，一般将释放资源的代码写在里面。

   finalize：

   ​        &nbsp;finalize() 是 Object 类里定义的方法，这个方法是垃圾收集器在销毁对象时调用的，但该方法被调用并不意味着 gc 会立即回收该对象。

5. ArrayList / LinkedList / Vector 的区别？

   相同点：都是 List 接口下的实现类，可以存储有序的、可重复的数据；

   不同点：

   ​        &nbsp;ArrayList：最常用的 List 实现类，底层是动态数组，可以对其中的元素进行快速反问，适合查找和遍历，不适合插入和删除；

   ​        &nbsp;LinkedList：底层是双向链表，很适合动态插入和删除操作，随机查找和遍历的效率较低；

   ​        &nbsp;Vector：底层也是数组，但是它里面加了同步锁，是线程安全的，所以性能上比 ArrayList 要差；

6. 抽象类和接口的区别？

   ①抽象类使用 abstract 关键词修饰，接口使用 interface 关键词修饰；

   ②抽象类中有构造方法，但不能实例化，接口中没有构造方法；

   ③抽象类中可以有非抽象方法，接口中一般只有抽象方法；

   ④抽象类中可以有变量，接口中只能有常量；

   ⑤抽象类只能单继承类，接口可以实现多个接口；

   ⑥实现类只能继承一个抽象类，但是可以实现多个接口。

7. sleep() 和 wait() 的区别？

   （1）定义的位置：Thread.sleep() / Object.wait()；

   （2）相同点：都可以使得当前线程进入阻塞状态；

   （3）结束阻塞的方式：sleep()：睡眠时间结束  wait()：notify()/notifyAll()；

   （4）使用上的局限性：

   ​        &nbsp;①sleep()：在任何位置都能使用；wait()：只能使用在同步结构中；

   ​        &nbsp;②如果使用在同步结构中，sleep()不会释放同步锁，wait()会释放同步锁。



## 3. 关键字：super

- **super可以理解为**

  父类的

- **可以调用的结构**

  属性、方法、构造器

- **super 调用属性、方法**

  我们可以在子类的方法或构造器中调用父类的属性或方法（前提：权限允许，可以使用“super.属性”或“super.方法”的方式。但是，多数情况下，我们都选择省略此“super.”。但是，如果子父类中出现同名的属性或者子类对父类的方法进行了重写同时又希望调用父类中被重写的方法的情况下，为了区分同名的属性和方法，可以使用“super.属性”或“super.方法”的方式，显示地表明调用的父类的属性、父类中被重写的方法）。

  明确：子类的属性不能覆盖父类中同名的属性。

- **super 调用构造器**

  ①在子类的构造器中，可以通过“super(形参列表)”的方式，显示地调用父类中指定的构造器；

  ②“super(形式列表)”结构如果使用，必须声明在子类构造器的首行；

  ③在子类构造器的首行，不能同时使用“this(形参列表)”和“super(形参列表)”；

  ④默认情况下，在子类构造器的首行，使用“super()”；

  ⑤在子类构造器的首行，要么使用“this(形参列表)”，要么使用“super(形参列表)”，没别的情况了。



## 4. 子类对象实例化全过程

- **理解**

  （1）结果上说

  ​        &nbsp;类的继承性，子类通过继承的方式获取父类中声明的结构，进而实例化子类，可通过子类的对象调用父类中声明的结构（前提：父类中声明的结构的权限允许）。

  （2）过程上说

  ​        &nbsp;在使用子类的构造器创建子类对象的过程中，我们一定会直接或间接地调用到父类的构造器，以及父类的父类的构造器，以及。。。直到加载到 Object 类的构造器。因此加载了这些类的构造器，所以才将类的结构加载内容，进而我们通过子类的对象才可以调用已经在内存中加载的结构。

  （3）整个过程中，调用过多个类的构造器，但是只创建了一个对象，即为 new 的子类对象。



## 5. 面向对象的特征三：多态性

- **多态性的理解**

  可以理解为一种事物的多种形态

- **广义上多态性的理解**

  ①方法的重载和重写；

  ②子类对象的多态性。

- **狭义上多态性的理解**

  子类对象的多态性

- **何为子类对象的多态性**

  父类的引用指向子类的对象（或子类的对象赋给父类的引用）

```java
举例：
Account acct = new SavingAccount(); // 前提：Account 是 SavingAccount 的父类
Object obj = new String("Tom");
Person p = new Student();
```

- **多态性的应用**

  虚拟方法的调用（动态绑定）：

  ​        &nbsp;在编译时（javac.exe），我们关注引用变量声明的类型，只能通过引用变量调用父类中的结构，但在运行时（java.exe），实际调用的是子类重写父类的方法。

  总结：编译看左边，运行看右边（针对方法）。

- **多态性的说明**

  多态性不适用于属性，只适用于方法。

```java
class Person {
	String id = "1001";
}
class Student extends Person {
	String id = "1002";
}

main() {
    Person p = new Student();
    sysout(p.id); // "1001"
    Student s = (Student) p;
    sysout(s.id); // "1002"
}
```

​	总结：编译和运行，都看左边（针对属性）。

- **多态性使用的前提**

  ①类的继承性；

  ②方法的重写。

- **关于向上转型和向下转型**

  （1）向上转型：多态

  （2）向下转型：在使用了多态以后，变量声明为父类的类型，如果希望通过父类类型调用子类特有的结构编译是不通过的，但是在内存中加载了子类的结构，为了能调用到子类特有的结构，我们需要使用向下转型。

  ​        &nbsp;①如何实现向下转型：使用强制转换符（）；

  ​        &nbsp;②可能出现的问题：报 ClassCastException 的异常；

  ​        &nbsp;③如何避免问题的出现：在强转前，使用instanceof进行判断，如果返回true，再强转；

  ​        &nbsp;④具体使用说明：

  ​        &nbsp;        &nbsp;a instanceof A ：判断 a 是否是 类A 的实例。如果是，返回true；如果不是，返回false。

  ​        &nbsp;        &nbsp;需要注意的问题：强转为的类型和要转换的变量的类型要具备子父类关系。



## 6. Object类的使用

- **java.lang.Object 类的使用说明**

  ①java.lang.Object 类：作为 java 类（除了此类之外）的根父类；

  ②内部只声明了唯一的空参构造器：Object()；

  ③内部定义了很多通用的方法。

- **关于类中常用方法的使用说明**

  （1）equals()

  ①java.lang.Object 类中 equals() 的定义：

  ```java
  public boolean equals(Object obj) {
  	return (this == obj);
  }
  ```

  ②像 String、Date、File、包装类重写了 Object 类中的 equals() 方法，比较的是两个对象的实体内容是否一致；

  ③对于自定义类来讲，如果没有重写 Object 类中的 equals() 方法，则仍然比较两个对象的引用地址是否相等。如果重写的话，重写的标准：比较两个对象的相关属性是否相等。

  【面试题】== 和 equals() 的区别？

  ==：比较运算符，适用于基本数据类型和引用数据类型

  ​        &nbsp;基本数据类型：比较两个变量值是否相等；

  ​        &nbsp;引用数据类型：比较两个引用类型变量的地址值是否相等（即两个引用是否指向同一个对象）。

  equals()：

  ​        &nbsp;在 Object 类中定义，对于自定义类来说，如果没有重写 Object 类中的 equals() 方法，则默认比较的是两个对象的引用地址是否相等。如果重写了 equals() 方法，就按重写的标准进行比较。

  （2）toSting()

  ①我们在输出对象的引用时，实际上就是在调用此对象的 toString() 方法；

  ②java.lang.Object 类中的 toString() 的定义：

  ```java
  public String toString() {
       return getClass().getName() + “@” + Integer.toHexString(hashCode());
  }
  ```

  即默认情况下，返回当前对象所属的类及此对象存储的地址。

  ③像String、Date、File、包装类重写了 Object 类中的 toString() 方法，返回当前对象的实体内容；

  ④对于自定义类来讲，如果没重写 Object 类中的 toString() 方法，则默认返回对象所属的类及此对象存储的地址。如果重写 toString() 的话，重写的标准：返回当前对象的属性信息。

  

## 7. 单元测试方法

​        &nbsp;（1）选中当前工程，右键 build path - add libraries - Junit - Junit 4【eclipse 玩法】

​        &nbsp;（2）创建一个java类

​        &nbsp;        &nbsp;①此类是 public 的；

​        &nbsp;        &nbsp;②此类只能声明一个空参构造器；

​        &nbsp;        &nbsp;③类名不要使用 Test。

​        &nbsp;（3）声明单元测试方法

​        &nbsp;        &nbsp;①此方法是 public 的；

​        &nbsp;        &nbsp;②此方法没有返回值；

​        &nbsp;        &nbsp;③此方法无形参。

​        &nbsp;（4）在方法的声明上，加上@Test，并导包 import org.junit.Test。



## 8. 包装类的使用

- **为什么要有包装类（封装类）？**

  为了使得基本数据类型的变量具备类的特性，给每一个基本数据类型的变量提供了一个对应的包装类。

- **基本数据类型与对应的包装类**

![image-20210810103429633](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210810103429633.png)

- **需要掌握的类型间的转换**

![image-20210810103531099](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210810103531099.png)

在 jdk1.5 的时候，增加了新特性：自动装箱、自动拆箱；

基本数据类型 ---> 包装类：自动装箱；

包装类 ---> 基本数据类型：自动拆箱；

基本数据类型、包装类 ---> String：①num + ""；②调用 String 类重载的 valueOf(xxx) 方法；

String ---> 基本数据类型、包装类：调用相对应的包装类的 parseXxx(String s)。