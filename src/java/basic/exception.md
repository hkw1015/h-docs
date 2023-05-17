---
title: 异常处理
dcategory: Java
tag:
  - Java 基础
---

## 1. 异常

- **异常的体系结构**

  ```java
  java.lang.Throwable
  
   	|----- java.lang.Error：错误
  
   			|---- StackOverflowError
  
   			|---- OOM
  
   	|-----java.lang.Exception：异常
  
   			|----- 编译时异常(非RuntimeException)：执行javac.exe命令时，报出的异常
  
   			|----- 运行时异常(RuntimeException)：执行java.exe命令时，报出的异常
  ```

- **Error：错误**

  （1）java 虚拟机无法解决的严重问题；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;比如：JVM系统内部错误、资源耗尽等严重情况。例：StackOverflowError 和 OOM。

  （2）一般不编写针对性的代码进行处理。

- **Exception：异常**

  （1）其他因编程错误或偶然的外在因素导致的一般性问题；

  （2）可以使用针对性的代码进行处理。

- **从程序执行过程，看编译时异常和运行时异常**

![image-20210810130838634](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210810130838634.png)

编译时异常（非RuntimeException）：执行 javac.exe 命令时，报出的异常；

运行时异常（RuntimeException）：执行 java.exe 命令时，报出的异常。

- **常见的异常**

  （1）算术异常：ArithmeticException

  ```java
  @Test
  public void test1() {
  	int num = 10;
  	System.out.println(num / 0);
  }
  ```

  （2）类型转换异常：ClassCastException

  ```java
  @Test
  public void test2() {
  	Object obj = new String("AA");
  	Date date  = (Date)obj;
  }
  ```

  （3）数组下标越界异常：ArrayIndexOutOfBoundsException

  ```java
  @Test
  public void test3() {
  	int[] arr = new int[10];
  	System.out.println(arr[10]);
  }
  ```

  （4）空指针异常：NullPointerException

  ```java
  @Test
  public void test4() {
  //	int[] arr = null;
  //	System.out.println(arr[0]);
  		
  	String s = "Tom";
  	s = null;
  	System.out.println(s.toString());
  }
  ```

  （5）数值格式化异常：NumberFormatException

  ```java
  @Test
  public void test5() {
  	String s = "abc123";
  	int num = Integer.parseInt(s);
  	System.out.println(num);
  }
  ```

## 2. 异常的处理

- **java异常处理的抛抓模型**

  （1）过程一：“抛”

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;程序在正常的执行过程中，一旦出现异常，就会在相应的代码处生成相应的异常类的对象，并将此对象抛出。一旦异常对象抛出，程序就不会再执行后面的逻辑代码。

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;异常对象的抛出的两种情况：	①自动抛出；②手动抛出（在方法内部使用 throw 的方式）。

  （2）过程二：“抓”

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;可以理解为异常处理的方式：①try-catch-finally；②throws。

- **异常处理方式一：try-catch-finally**

  ```java
  try{
  	可能出现异常的代码；
  } catch(Exception1 e1) {
  	处理方式1；
  }catch(Exception2 e2) {
  	处理方式2；
  }...
  finally{
  	一定会被执行的代码；
  }
  ```

  说明：

  ①finally 是可选的；

  ②try 中包裹的可能出现异常的代码。程序执行过程中，一旦出现异常，就会抛出一个异常类的对象。此异常对象就会在下边的 catch 语句中进行匹配，一旦匹配成功，就进入执行具体的处理方法的处理；

  ③多个 catch 语句中的异常类型如果是子父类关系，必须将子类异常类型声明在父类异常类型的上面；

  ④一旦匹配成功某一个 catch 语句，执行完以后，就跳出当前的 try-catch 结构，不会继续匹配下面的 catch；

  ⑤在 try 中声明的变量，出了其所在的一对{}之后，就不可以再被调用；

  ⑥catch 中异常处理的常见方式：①sout(e.getMessage())；②e.printStackTrace；// 打印堆栈信息；

  ⑦一旦在 catch 中处理了异常信息，那么程序就可以继续执行；

  ⑧开发中，针对于运行时异常，一般就不进行异常的处理了。

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;针对于编译时异常，一定需要考虑异常的处理，否则，编译不通过。

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;处理以后的效果，可以理解为将一个编译时异常延迟到运行时才可能出现。

  ⑨try-catch-finally 结构可以嵌套使用。

- **finally 的说明**

  （1）finally：将一定会被执行的代码写在 finally 中；

  （2）不管try、catch中是否存在未被处理的异常，也不管try、catch中是否存在return的情况，finally中的代码都一定会被执行。

  （3）什么样的代码会被声明在 finally 中？

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;涉及到流操作、网络操作中的Socket资源、数据库连接资源，必须考虑手动关闭时，需要将这些关闭操作声明在finally中。

  **【面试题】final、finally、finalize的区别？**

  final：
  
  ​        &nbsp;有三种用法：修饰类、变量和方法。
  
  ​        &nbsp;①修饰类时，表明该类不能被继承；
  
  ​        &nbsp;②修饰变量时，表明该变量在使用时不能被改变，所以在声明时需要给变量进行初始化（如果是成员变量，也可以在声明处先不赋值，但在构造器内要对改成员变量赋值）；
  
  ​        &nbsp;③修饰方法时，表明该方法只能使用，在子类中不能被重写。
  
  finally：
  
  ​        &nbsp;通常是放在 try...catch 后面构造最终代码执行块，无论程序是正常还是异常，这部分代码都会执行，一般将释放资源的代码写在里面。
  
  finalize：
  
  ​        &nbsp;finalize() 是 Object 类里定义的方法，这个方法是垃圾收集器在销毁对象时调用的，但该方法被调用并不意味着 gc 会立即回收该对象。
  
  **【类似】HashMap 、LinkedHashMap 的区别？**
  
  HashMap 是 Map 接口的主要实现类，是线程不安全的，底层是数组+链表+红黑树（jdk1.8新增），根据键的 hashCode 值存储数据，也可以根据值获取数据，可以存储 null 键和 null 值。
  
  LinkedHashMap 是 HashMap 的子类，底层维护了一个双向链表，在添加数据的同时，它能够记录添加的先后顺序，在遍历时，可以按照添加的先后顺序遍历。

- **异常处理方式二：“throws  + 异常处理类型”的方式**

  （1）格式：在方法声明的最后，使用“throws 异常类型1，异常类型2...”的方式，将异常抛出；

  （2）“throws 异常类型1，异常类型2...”这种方式将可能产生的异常对象抛给了方法的调用者。

- **体会开发中应该如何选择两种处理方式？**

  （1）对比处理方式一：

  ​        &nbsp;try-catch-finally：真正地将异常给处理了；

  ​        &nbsp;throws：只是将异常向上抛出，并没有从根本上处理掉此异常。

  （2）如何选择使用哪种处理方式处理异常？

  ​        &nbsp;①如果涉及到资源的关闭等操作，需要使用 try-catch-finally，而不能用 throws；

  ​        &nbsp;②在项目中，针对于某个 method1() 的某些逻辑中涉及到的多个方法的调用，此多个方法如果异常，习惯上使用 throws 的方式，然后在 method1() 中统一使用 try-catch-finally 进行处理；

  ​        &nbsp;③父类被重写的方法如果没有抛出异常，则子类重写的方法内部如果有异常，只能使用 try-catch-finally；



## 3. 手动抛出异常对象

- **使用说明**

  在方法内部使用 throw 的方式抛出异常

- **【面试题】**

  throws 和 throw 的区别？

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

- **举例**

```java
// 举例1：
class Student{
	int id;
	public void regist(int id) throws Exception{
		if(id > 0) {
			this.id = id;
		} else {
			// 手动创建一个异常类的对象，并throw出去
			// throw new RuntimeException("输入的学号不合法");
			throw new Exception("输入的学号不合法");
		}
	}
    
	@Override
	public String toString() {
		return "Student [id=" + id + "]";
	}
}

// 举例2：
// 若返回值是 0 , 代表相等; 若为正数，代表当前对象大；负数代表当前对象小
@Override
public int compareTo(Object o) {
    if(o == this) {
        return 0;
    }

    if(o instanceof ComparableCircle) {
        ComparableCircle c = (ComparableCircle)o;
        return Double.compare(this.getRadius(), c.getRadius());
    }

    throw new RuntimeException("传入的数据类型不一致！");
}
```



## 4. 自定义异常类

```java
/*
 * 1.继承于现的异常类。通常会继承于 RuntimeException 或者 Exception
 * 2.定义重载的构造器
 * 3.提供一个全局常量：serialVersionUID，唯一的识别当前类本身
 */
public class MyException extends Exception {
	static final long serialVersionUID = -7034896939L;
	
	public MyException(){}
	
	public MyException(String msg){
		super(msg);
	}
}

// 技巧：参照 Exception 或 RuntimeException 的定义
```

