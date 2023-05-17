---
title: 泛型
category: Java
tag:
  - Java 基础
---

## 1. 泛型在集合中的使用

- **在集合中使用泛型的例子**

  ```java
  @Test
  public void test1() {
  	List list = new ArrayList();
  	list.add(89);
  	list.add(76);
  	list.add(66);
  	list.add(54);
  	// 问题一：类型不安全
  	list.add("AA");
  
  	for(int i = 0;i < list.size();i++) {
  		Object obj = list.get(i);
  		// 问题二：需要强转，一方面繁琐，另一方面可能报ClassCastException
  		int score = (Integer) obj;
  		System.out.println(score);
  	}
  }
  ```

  例子1：

  ```java
  @Test
  public void test2() {
  	List<Integer> list = new ArrayList<Integer>();
  	list.add(67);
  	list.add(54);
  	list.add(87);
  	// list.add("MM");
  
  	Iterator<Integer> iterator = list.iterator();
  	while(iterator.hasNext()){
  		Integer score = iterator.next();
  		System.out.println(score);
  	}
  
      // 不允许。
      // List<int> list = new ArrayList<int>();
  }
  ```

  例子2：

  ```java
  @Test
  public void test3() {
  	HashMap<String,Integer> map = new HashMap<>(); // 类型推断：int[] arr = {1,2,3};
  
  	map.put("Tom", 12);
  	map.put("Lilei", 23);
  	map.put("HanMeimei", 33);
  	map.put("Jim", 14);
  	// map.put(12, "Jerry");
  
  	Set<Map.Entry<String,Integer>> entrySet = map.entrySet();
  	Iterator<Map.Entry<String,Integer>> iterator =entrySet.iterator();
  	while(iterator.hasNext()){
  		Entry<String, Integer> entry = iterator.next();
  		System.out.println(entry.getKey() + "-->" + entry.getValue());
  	}
  }
  ```

- **总结**

  （1）泛型参数只能使用引用数据类型，不能使用基本数据类型；

  （2）集合中，如果没有使用泛型，则默认使用 Object 类型；

  ​        &nbsp;如果集合中使用泛型，则集合的相关属性、方法中，凡是使用到类或接口泛型参数的地方，都要调整为具体的泛型类型。

  （3）什么时候使用泛型呢？

  ​        &nbsp;首先，类或接口应该声明为泛型类、泛型接口；

  ​        &nbsp;其次，在实例化类时，就可以指明泛型参数的类型。



## 2. 自定义泛型类、接口、方法

```java
// 自定义泛型类
public class Order<T> { // T：泛型参数
	
	String orderName;
	int orderId;
	T t;
	
	public Order() {}
	
	public Order(String orderName,int orderId,T t) {
		this.orderName = orderName;
		this.orderId = orderId;
		this.t = t;
	}
	
	// 如下两个方法，不是泛型方法
	public T getT() {
		return t;
	}
	public void setT(T t) {
		this.t = t;
	}
	
	public void show() {
		System.out.println("name = " + orderName + "t = " + t);
		
		// 不能在 catch 中使用泛型参数
        // try {
        //	
        // } catch(T e) {
        //		e.printStackTrace();
        // }
	}
	
	// 在静态方法中，不可以使用类的泛型
    //	public static void display() {
    //		System.out.println("t = " + t);
    //	}
	
	// 泛型方法：泛型方法所在的类，不一定是泛型类，普通类也可以
	public static <E> List<E> fromArrayToList(E[] arr, List<E> list) {
		for(E e : arr) {
			list.add(e);
		}
		return list;
	}
}

// 子类1：
public class SubOrder<T> extends Order<T> {
	public void info(T t){
		setT(t);
	}
}

// 子类2：
// 在提供泛型类的子类时，可以指明泛型参数的类型。一旦指明，子类继承父类的结构中，凡是使用泛型参数的地方都调整为具体的泛型的类型（比如：Integer）
public class SubOrder1 extends Order<Integer> {

}

// 测试：
@Test
public void test1(){
	// 没使用泛型的情况，则泛型类型默认为Object类型
	Order order = new Order();
    Object t = order.getT();

    // 实例化泛型类时，可以指明泛型参数的类型(比如：String)。一旦指明，内部的属性、方法、构造器等凡是使用泛型参数的地方，都调整为具体的泛型参数的类型(比如：String)
    Order<String> order1 = new Order<>();
    order1.setT("order_a");
    String t1 = order1.getT();

    SubOrder1 sub1 = new SubOrder1();
    sub1.setT(12);
}

// 举例:
// DAO:data(base) access object
public class DAO<T> {
	
	// 增
	public void add(T t) {
	}
	
	// 删
	public T remove(int id) {
		return null;
	}
	
	// 改
	public void update(int id,T t) {
	}
	
	// 查
	public T get(int id) {
		return null;
	}
	
	public List<T> getAll() {
		return null;
	}
}

// 子类1：
public class CustomerDAO extends DAO<Customer> {
}

//  子类2：
public class OrderDAO extends DAO<Order> {
}
```



## 3. 泛型与继承的关系

```java
/*
 * 规则：
 * 如果A类是B类的父类，则List<A>不是List<B>的父类，他们是并列结构的。
 * 推广：①G<A>也不是G<B>的父类。
 * 	   ②A<G>是B<G>的父类。
 */
@Test
public void test1() {
	Object obj = null;
	String str = null;
	obj = str;
	
	Object[] arr1 = null;
	Integer[] arr2 = null;
	arr1 = arr2;
	
	List<Object> list1 = null;
	List<String> list2 = new ArrayList<String>();
	// 不成立
	// list1 = list2;
	/*
	 * 反证法：list1 = list2;
	 * list1.add(123);
	 * 相当于将123添加到了list2中，而list2中声明只让String添加进来，导致出错。
	 */
	Collection<String> coll = null;
	coll = list2;
}
```



## 4. 通配符

- **通配符的使用**

  ```java
  List<?> 是 List<A> 的父类，其中A代表任何一个类；
  
  推广：G<?> 是 G<A> 的父类，其中G,A代表任何一个确定的类。
  ```

- **涉及通配符的集合数据的写入和读取**

```java
List<Object> list1 = null;
List<String> list2 = new ArrayList<String>();
		
List<?> list = null;
list = list1;
list = list2;
// 写入：不可以向声明为通配符的结构中写入数据
// list.add("AA");
// 唯独可以写入null
list.add(null);
		
// 读取：可以读取声明为通配符的结构中的数据
Iterator<?> iterator = list.iterator();
while(iterator.hasNext()) {
	Object obj = iterator.next();		
}
```

- **有限制条件的通配符的使用**

```java
/*
 * 限制条件的通配符的使用：
 * ? extends A:
 * 	可以将G<B>或G<A>赋值给G<? extends A>。其中B类是A类的子类。
 * ? super A:
 * 可以将G<B>或G<A>赋值给G<? super A>。其中B类是A类的父类。
 */
@Test
public void test3() {
	List<?> list = null;
	List<? extends Number>  list1 = null;
	List<? super Number> list2 = null;
	
	List<Object> list3 = null;
	List<Number> list4 = null;
	List<Integer> list5 = null;
	// 说明：所有基本数据类型的包装类都继承自Number类
	
	// list1 = list3;
	list1 = list4;
	list1 = list5;
	
	list2 = list3;
	list2 = list4;
	// list2 = list5;
}
```

