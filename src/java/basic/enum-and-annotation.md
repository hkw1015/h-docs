---
title: 枚举类和注解
category: Java
tag:
  - Java 基础
---

## 1. 枚举类的使用

- **枚举类的理解**

  如果一个类中的对象的个数是有限可列的，那么我们说此类是一个枚举类。

  --> 如何定义枚举类？

  方法一：自定义枚举类；

  方法二：jdk 5.0 新增了enum 的方式。

- **如何自定义枚举类？步骤**

```java
class Season {
	// 1.提供类的对象的属性
	private final String seasonName;
	private final String seasonDesc;
	
	// 2.提供构造器,私的
	private Season(String seasonName,String seasonDesc) {
		this.seasonName = seasonName;
		this.seasonDesc = seasonDesc;
	}
	
	// 3.提供当前枚举类的对象
	public static final Season SPRING = new Season("春天", "春暖花开");
	public static final Season SUMMER = new Season("夏天", "夏日炎炎");
	public static final Season AUTUMN = new Season("秋天", "秋高气爽");
	public static final Season WINTER = new Season("冬天", "寒冬凛冽");

	public String getSeasonName() {
		return seasonName;
	}
	public String getSeasonDesc() {
		return seasonDesc;
	}
	@Override
	public String toString() {
		return "Season [seasonName=" + seasonName + ", seasonDesc=" + seasonDesc + "]";
	}		
}
```

- **jdk 5.0 之后可以使用 enum 定义枚举类**

  ①使用 enum 关键字定义枚举类；

  ②声明当前枚举类的对象，相应的 public static final 省略不写；

  ③多个枚举类对象之间是使用“,”连接，结尾使用“;”结束。

```java
interface Info {
	void show();
}

enum Season1 implements Info {
	// 1.提供当前枚举类的对象(要求在enum类中，一上来就要声明几个枚举类对象）
	SPRING("春天", "春暖花开") {
		public void show() {
			System.out.println("春天在哪里？");
		}
	},
	SUMMER("夏天", "夏日炎炎") {
		public void show() {
			System.out.println("夏天夏天就要过去");
		}
	},
	AUTUMN("秋天", "秋高气爽") {
		public void show() {
			System.out.println("秋天是用来分手的季节");
		}
	},
	WINTER("冬天", "寒冬凛冽") {
		public void show() {
			System.out.println("冬天里的一把火");
		}
	};
	
	// 2.提供类的对象的属性
	private final String seasonName;
	private final String seasonDesc;
	
	// 3.提供构造器,私的
	private Season1(String seasonName,String seasonDesc) {
		this.seasonName = seasonName;
		this.seasonDesc = seasonDesc;
	}
	
	public String getSeasonName() {
		return seasonName;
	}
    
	public String getSeasonDesc() {
		return seasonDesc;
	}
    
	@Override
	public String toString() {
		return "Season1 [seasonName=" + seasonName + ", seasonDesc=" + seasonDesc + "]";
	}
}
```

- **使用 enum 定义枚举类之后，枚举类常用方法**

```java
// 1.values():返回所枚举类对象构成的数组
Season1[] season1s = Season1.values();
for(int i = 0;i < season1s.length;i++){
	System.out.println(season1s[i]);
	season1s[i].show();
}

// 2.valueOf(String objectName):根据给定的枚举类对象的对象名，返回对应的枚举类对象
String objName = "SUMMER";
// objName = "SUMMER1"; // 如果输入的参数没找到对应的枚举类对象，就会报 java.lang.IllegalArgumentException
Season1 sea = Season1.valueOf(objName);
System.out.println(sea);
```

- **使用 enum 定义枚举类之后，如何让枚举类对象分别实现接口**

```java
SPRING("春天", "春暖花开") {
	public void show() {
		System.out.println("春天在哪里？");
	}
},
SUMMER("夏天", "夏日炎炎") {
	public void show() {
		System.out.println("夏天夏天就要过去");
	}
},
AUTUMN("秋天", "秋高气爽") {
	public void show() {
		System.out.println("秋天是用来分手的季节");
	}
},
WINTER("冬天", "寒冬凛冽") {
	public void show() {
		System.out.println("冬天里的一把火");
	}
};
```



## 2. 注解的使用

- **注解的理解**

  Annotation 其实就是代码里的特殊标记，这些标记可以在编译，类加载，运行时被读取，并执行相应的处理。通过使用Annotation，程序员可以在不改变逻辑的情况下，在源文件中嵌入一些补充信息。

  jdk 5.0 中增加了Annotation（注解）

  格式：@interface

- **jdk 提供的三个常用注解**

  @Override：限定重写父类方法，该注解只能用于方法；

  @Deprecated：用于表示某个程序元素（类，方法等）已过时；

  @SuppressWarning：抑制编译器警告。

- **如何自定义注解**

  参照 @SuppressWarning 定义即可。

  ```java
  @Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE, TYPE_USE})
  @Retention(RetentionPolicy.RUNTIME)
  @Repeatable(MyAnnotations.class)
  public @interface MyAnnotation {
  	String[] value() default "hello";
  }
  ```

- **元注解：对现有的注解进行解释说明的注解**

  ```java
   * @Retention：用于表示所修饰的注解的生命周期
   * 				SOURCE 、 CLASS(默认行为) 、 RUNTIME
   * @Target：用于表示所修饰的注解可以修饰的结构
   * @Documented：指定被该元 Annotation 修饰的 Annotation 将被 javadoc 工具提取成文档
   * @Inherited：被它修饰的 Annotation 将具继承性
  ```

  元数据对现有数据进行解释说明的数据。

  String name = “Tom”; //其中 String，name可以看做 Tom 的元数据。

- **如何获取注解信息：反射中会涉及**

  前提：注解需要其生命周期为：RUNTIME。

