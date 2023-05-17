---
title: 面向对象(上)
category: Java
tag:
  - Java 基础
---

## 1. 类与对象

- **面向对象学习的三条主线**

  （1）类与类的成员：属性、方法、构造器、代码块、内部类

  （2）面向对象的三大特征：封装性、继承性、多态性、（抽象性）

  （3）关键字：this、package、import、super、final、abstract、interface等

- **面向对象与面向过程（理解）**

  面向过程：强调的是功能行为。

  面向对象：将功能封装进对象，强调了具备功能的对象。

- **完成一个项目（或功能）的思路**

  （1）是否已经存在具有相关功能结构的对象，如果存在，直接调用；

  （2）如果此对象不存在，则需要自己创建一个对象；

  （3）如果发现创建此对象的类不存在，则需要创建一个具备相关功能的类。

- **面向对象中两个重要的概念**

  类（class）：对一类事物的描述，抽象的，概念的。

  对象（object、instance）：实实在在存在的一个个体，是具体的，形象的。

  二者的关系：对象，是由类派生的，创建的。

- **面向对象思想落地实现的规则**

  （1）创建一个类，并设计类的内部结构：属性、方法、构造器、代码块、内部类；

  （2）创建类的对象（最主要的方法：new()）；

  （3）通过“对象.方法”或“对象.属性”的方式，实现相关的功能的调用。

补充：几个概念的使用说明

​		①创建类的对象 = 类的实例化 = 实例化类

​		②属性 = 成员变量 = field = 域

​		③方法 = 成员方法 = method



## 2. 类的结构之一：属性

- **成员变量（属性） VS 局部变量**

  （1）相同点

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①变量声明的格式相同：`数据类型 变量名 = 变量值`；

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②先声明，后使用；

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③都有一定的作用域。

  （2）不同点

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①声明的位置

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;成员变量：声明在类内部，方法体外。

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;局部变量：声明在方法内，构造器内，代码块内，方法形参等位置。

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②成员变量可以有权限修饰符，而局部变量没有权限修饰符

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;权限修饰符：`private < 缺省 < protected < public`；

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;权限修饰符的作用：表明所修饰的结构被调用的范围的大小。

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③局部变量在使用前，一定要初始化，没有默认初始值；属性有默认初始值（同数组一样）；形参来说，不能在方法声明处赋值，而应在方法调用时赋值。

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;④在内存中分配的位置不同，属性在堆空间中，局部变量在栈空间中。



## 3. 类的结构之二：方法

- **方法**

  可以理解为类中对相关功能代码的封装。

- **方法的声明**

```java
举例：
public void sleep() {}
public int getAge() {
    return 18;
}
```

格式：

```java
权限修饰符 返回值类型 方法名(形参列表) {方法体}
```

说明：

（1）权限修饰符：表明所修饰的方法被调用的范围的大小，可以使用的权限修饰符：`private < 缺省 < protected < public`；

（2）返回值类型：方法分为返回值类型和无返回值类型（用void代替）。

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果方法有返回值，则需要：

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①声明具体的返回值类型；

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②必须在方法体内部使用return关键字返回满足返回值类型的变量或常量。

（3）方法名，要求：满足标识符命名的规则和规范，“见名知意”。

（4）形参列表：参数类型1 参数名1，参数类型2 参数名2，...【根据实际问题的需要，声明形参即可】

（5）方法体：封装具体功能的实现。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;额外说明：

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①方法 = 成员方法 = 函数 = method；

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②return的作用：<1>返回一个具体的值 <2>结束一个方法；

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③方法内部可以调用当前类的属性、方法（递归方法）。

- **方法的重载**

（1）方法重载的概念

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;同一个类中，相同方法名，不同参数列表的多个方法之间，彼此构成重载。

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总结：“两同一不同” “一不同”：参数个数不同、参数类型不同。

（2）构成重载的举例

```java
public void getSum(int i, int j) {
	System.out.println(i + j);
}

public void getSum(double d1, double d2) {
	System.out.println(d1 + d2);
}

public void getSum(int i, int j, int k) {
	System.out.println(i + j + k);
}
```

（3）如何确定类中某一个方法的调用：方法名-->参数列表

- **可变个数形参的方法**

（1）使用说明

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①可变个数形参的方法的使用 --- 是jdk 5.0的新特性；

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②格式：数据类型 ... 变量名；

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③特点：在赋值时，可以给此形参赋值的个数为：0个，1个，2个，......；

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;④可变个数形参的方法与同名方法之间构成重载；

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⑤可变个数形参的方法与同名的使用数组作为参数的方法不能同时存在；

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⑥如果方法有多个形参，需要将可变个数形参放在形参的最后声明；

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⑦一个方法的形参中，最多只能有一个可变参数的形参。

（2）举例

```java
public void show(String ... strs) {
    for(int i = 0;i < strs.length;i++) {
        System.out.println(strs[i]);
    }
}
// 调用时：
t.show("AA","BB");
t.show();
t.show(new String[]{"AA","BB"});
```



## 4. 面向对象的特征一：封装性

- **面向对象的特征一：封装与隐藏**

  > 问题引入：
  >
  > 在声明好类以后，我们可以创建类的对象，通过对象调用属性，给属性赋值。但在实际情境中，我们给属性赋值，往往有一些限制条件（比如：Animal类legs属性，就不能赋值为负数和奇数，但是此“复杂”的限制条件不可能在属性声明的位置上添加，我们只能通过方法的方式加入限制条件，给属性赋值，体现在：setXxx()）。

- **封装性思想具体的代码体现**

  体现一：私有化（private）类的属性，同时提供公共的方法去设置（setXxx()）和获取			（getXxx()）；

  体现二：在类中声明 public 和 private 的方法，其中 private 的方法只能在类内部被调用；

  体现三：在包下声明一个类，希望此类只能在包内部使用，可以将类的权限修饰符声明为：缺省的；

  体现四：单例模式。

- **Java中的四种权限修饰符---广义上的封装性的体现**

  （1）权限从小到大的顺序为：`private < 缺省 < protected < public`

  （2）具体的修饰范围：

![image-20210810005846234](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210810005846234.png)

​	（3）权限修饰符可用来修饰的结构说明

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4种权限修饰符都可以用来修饰类中的属性、方法、构造器、内部类；

  &nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;类的修饰只能是：public 和缺省。

- **封装性的理解**

  封装性中的4种权限的作用：使用4种权限修饰类及类内部的成员，体现类及类的内部成员被调用时的权限的大小（换句话说，表示类及类的内部成员在被调用时的可见性的大小）。



## 5. 类的结构之三：构造器

- **构造器（构造方法）：类的第三个成员 Constructor**

  构造器的作用：①创建类的对象；②可以初始化对象。

- **使用说明**

  （1）在一个类中，如果没有显示地声明类的构造器的话，那么系统会默认提供一个空参的构造器。在一个类中，一旦显示地声明了类的构造器的话，那么系统就不再提供默认的空参构造器了。

  （2）声明构造器的格式：

```java
权限修饰符 类名（形参列表）{
    
}
```

​	（3）一个类定义多个构造器之间，彼此构成重载。

​	（4）结论：类中一定会有构造器。

- **属性赋值顺序**

  ①默认初始化；

  ②显示初始化（学习了代码块之后还可以在代码块里对属性进行初始化）；

  ③构造器初始化；

  ④有了对象以后，通过“对象.属性”或“对象.方法”的方式，给属性赋值。

  说明：赋值的先后顺序：①-②-③-④，其中步骤①②③只执行一次。



## 6. 关键字：this

- **对this的理解**

  当前对象 或 当前正在创建的对象

- **可以调用的结构**

  属性、方法、构造器

- **this 调用属性、方法**

  在类的方法中，可以通过“this.变量”或“this.方法”的方式，显示地调用当前类中声明的属性和方法。但很多时候，我们都选择忽略此“this”，但是如果发现方法名的形参名和属性名相同了，那么为了区分形参和属性，我们必须通过“this.”的方式，表明调用的是属性，而非形参。

- **this 调用构造器**

  （1）我们在构造器中使用“this（形参列表）”的方式，来调用当前类的指定构造器；

  （2）在构造器内部，不可以使用“this（形参列表）”的方式调用自己这个构造器；

  （3）如果有一个类有n个构造器，那么最多只能有n-1个构造器中使用“this（形参列表）”；

  （4）规定：“this（形参列表）”必须声明在构造器的首行；

  （5）一个构造器中，最多只能声明一个“this（形参列表）”结构。



## 7. 关键字：package/import

- **package 的使用**

  （1）package：包；

  （2）作用：为了方便地对Java类进行统一管理；

  （3）package + 包名：包名属于标识符，满足标识符命名的规则和规范：xxx.yyy.zzz;

  （4）“package + 包名”声明在java源文件的首行；

  （5）每“.”一次，代表着一层文件目录。

- **常见的包**

![image-20210810011913433](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210810011913433.png)

- **import 的使用**

  （1）import：导入；

  （2）作用：我们可以在源文件中使用 import 导入其他包下的结构：类、接口等；

  （3）如果我们在源文件中，调用当前包下的结构，可以省略 import 结构；

  （4）如果我们在源文件中，调用的是 java.lang 包下的结构，可以省略 import 结构；

  （5）格式：import + 类的全类名；

  （6）比如“import java.util.*”表示：可以导入 java.util 包下的所有结构；

  （7）如果源文件中使用了来自于不同包下的同名的类，则其中一个必须使用全类名的方式进行调用；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;比如：java.util.Date 和 java.sql.Date

  （8）如果已经可以导入a包下的所有结构，则如果调用a包的子包的结构的话，仍需要使用 import；

  （9）import static :表示可以导入指定类或接口的静态结构：属性、方法。