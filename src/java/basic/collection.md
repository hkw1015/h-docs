---
title: 集合
category: Java
tag:
  - Java 基础
---

## 1. 数组与集合

- **内存中多个相同数据类型的存储“容器”：①数组 ②集合**

  对应的，数据的持久化：①数据库 ②文件（.txt,.jpg,...） ③xml文件

- **数组存储的特点**

  ①一旦初始化，其长度就确定了；

  ②存储有序的、重复的数据；

  ③声明的类型，就决定了只能操作此类型的元素。

  数组存储的弊端：

  ①一旦初始化，其长度就不可变；

  ②数组中涉及到数据的增删改查的方法比较少，不及集合；

  ③不能存放无序的、要求不可重复的数据。

- **集合存储的优点**

  （1）使用集合，可以不用考虑长度问题，直接添加即可；

  （2）集合中提供了丰富的方法，便于数据的操作（CRUD）；

  （3）操作的数据特点更丰富，可以存储无序的、不可重复的；有序的、可重复的；键值对特点。

- **数据结构研究的问题**

  （1）数据与数据之间的逻辑关系：一对一，一对多，多对多；

  （2）数据的存储结构：①顺序存储（典型：一维数组）②链式存储。

  ```java
  // 单向链表
  class A {
  	A next;
  }
  // 双向链表
  class A {
  	A prev;
  	A next;
  }
  // 二叉树
  class A {
  	A left;
  	A right;
  }
  ```

  



## 2. Collection 接口及其子接口

- **单列集合框架结构**

![image-20210810215103442](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210810215103442.png)

- **Collection接口常用方法**

  ①add(Object obj) / addAll(Collection coll) / size() / isEmpty() / clear()

  ②remove(Object obj) / removeAll(Collection coll) / contains(Object obj) / 		containsAll(Collection coll) / retainsAll(Collection coll) （取交集）/ equals(Object obj)

  ③hashCode()

  ④Collection和数组之间的交换：toArray()

   数组 ---> Collection：Arrrays.asList(T ... t)

  ⑤遍历Collection：iterator() / 增强for

  说明：向 Collection 集合中添加数据，要求数据所在的类要重写 equals()；

  代码示例：

  ```java
  Collection coll = new ArrayList();
  
  // 1.add(E e)：将元素e添加到集合coll中
  coll.add("AA");
  coll.add("BB");
  coll.add(123);
  coll.add(new Date());
  
  // 2.size()：获取集合中添加元素的个数
  System.out.println(coll.size());
  
  // 3.addAll(Collection<? extends E> c)：将c集合中的元素添加到当前的集合中
  Collection coll1 = new ArrayList();
  coll1.add("CC");
  coll1.add(456);
  coll.addAll(coll1);
  
  System.out.println(coll.size());
  System.out.println(coll);
  
  // 4.isEmpty()：return size == 0;判断当前集合的元素个数是否为0
  System.out.println(coll.isEmpty());
  
  // 5.clear()：清空当前集合的元素
  coll.clear();
  System.out.println(coll.isEmpty());
  
  // 6.contains(Object o)：判断当前集合是否包含o
  // contains方法在判断时会调用o对象的所在类的equals()
  boolean b = coll.contains("AA");
  coll.add(new String("Tom"));
  System.out.println(coll.contains(new String("Tom"))); // true
  coll.add(new Person("hkw",22));
  System.out.println(coll.contains(new Person("hkw",22))); // true 重写equals方法之后返回true
  // 所以我们向Collection接口的实现类的对象中添加数据obj时，要求所在类要重写equals()
  
  // 7.containsAll(Collection<?> c)：判断形参c中的所有元素是否都存在于当前集合中
  Collection coll2 = Arrays.asList(123,456,789);
  System.out.println(coll.containsAll(coll2));
  coll.add(123);
  coll.add(456);
  coll.add(789);
  System.out.println(coll.containsAll(coll2)); // [Tom, 456, 789]
  
  // 8.remove(Object o)：从当前集合中移除obj元素
  coll.remove(123);
  coll.remove(new Person("hkw",22));
  System.out.println(coll);
  
  // 9.removeAll(Collection<?> c)：差集：从当前集合中移除c中和当前集合交集的元素，修改当前集合并返回
  Collection coll3 = Arrays.asList(456,678);
  coll.removeAll(coll3);
  System.out.println(coll); // [Tom, 789]
  
  // 10.retainAll(Collection<?> c)：交集：获取当前集合中和c集合的交集，修改当前集合并返回
  Collection coll4 = Arrays.asList(678,789);
  coll.retainAll(coll4);
  System.out.println(coll); // [789]
  
  // 11.equals(Object o)：要想返回true，需要当前集合和形参集合的元素都相同
  Collection coll5 = Arrays.asList(789);
  System.out.println(coll.equals(coll5)); // true
  
  // 12.hashCode()：返回当前对象的哈希值
  System.out.println(coll.hashCode());
  
  // 13.toArray()：集合--->数组
  coll.add("AA");
  coll.add("BB");
  coll.add("CC");
  Object[] objects = coll.toArray();
  for (int i = 0; i < objects.length; i++) {
  	System.out.println(objects[i]);
  }
  // 拓展：数组--->集合：调用Arrays类的静态方法asList()
  List<String> list = Arrays.asList(new String[]{"AA", "BB", "CC"});
  System.out.println(list); // [AA, BB, CC]
  
  List list1 = Arrays.asList(new int[]{123,456});
  System.out.println(list1); // [[I@573fd745]
  
  List<Integer> list2 = Arrays.asList(new Integer[]{123,456});
  System.out.println(list2); // [123, 456]
  
  // 14.iterator()：返回Iterator接口的实例，用于遍历集合元素
  Iterator iterator = coll.iterator();
  
  // 遍历方式
  // hasNext()：判断是否有下一个元素(默认游标在第一个集合元素之前)
  // next()：①指针下移 ②将下移后集合位置上的元素返回
  // remove()：内部定义了remove()，可以在遍历的时候，删除集合中的元素，此方法不同于集合直接调用remove()
  while(iterator.hasNext()) {
  	if ("AA".equals(iterator.next())) {
  		iterator.remove();
  	}
  }
  
  Iterator iterator1 = coll.iterator();
  while(iterator1.hasNext()) {
  	System.out.print(iterator1.next() + " "); // 789 BB CC
  }
  ```

  

- **List接口**

  （1）存储的数据特点

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存储有序的，可重复的数据 ---> 底层：“动态”数组

  （2）常用方法（记住）

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①增：add(Object obj) / *addAll(Collection coll);

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②删：remove(Object obj) / remove(int index);

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③改：set(int index,Object obj)

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;④查：get(int index)

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⑤插：add(int index,Object obj)

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⑥遍历：iterator() / 增强for循环 / 一般for循环

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⑦长度：size()

  （3）常用实现类

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①ArrayList：List接口的主要实现类，线程不安全，随机访问效率高，底层使用数组存储；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（使用Collections工具类的synchronizedList(ArrayList list)可以将ArrayList转换为线程安全的。）

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②LinkedList：对于频繁的插入和删除操作，效率高，建议使用此类，底层使用双向链表存储；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LinkedList独有的方法：removeFirst();&nbsp;removeLast();&nbsp;addFirst();&nbsp;addLast();

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③Vector：List 接口的古老实现类，是线程安全的，可以存储有序的，可重复的数据。

  **【面试题】ArrayList / LinkedList / Vector 异同？**

  （4）ArrayList、LinkedList、Vector 的底层实现？

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①ArrayList

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;jdk 7：默认情况下，底层创建长度为 10 的 Object[]；

  ```java
  // 源码分析
  ArrayList list = new ArrayList(); // 底层创建了长度是10的Object[]类型的数组elementData
  list.add(1);
  list.add(2);
  ...
  list.add(10);
  // 当添加的元素个数超过底层数组的长度，导致底层数组容量不够时，就会进行扩容，默认情况下，扩容为原来容量的1.5倍
  // 同时将原有的数组中的数据复制到新的数组中
  list.add(11);
  // 结论：建议开发中使用带参的构造器：ArrayList list = new ArrayList(int capacity);
  ```

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;jdk8：默认情况下，先提供长度为 0 的数组，当首次添加数据时，再提供一个长度为 10 的 Object[];

  ```java
  ArrayList list = new ArrayList(); // 底层的Object[]类型的数组elementData初始化为{}
  list.add(1);// 第一次调用添加add()时，底层才创建长度为10的数组，并将元素添加进去
  // 后续的添加和扩容操作于jdk7中无异
  ```

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;扩容机制：当添加到底层数组容量盛不下时（首次扩容默认是添加第11个元素时），默认扩容为原来的 1.5 倍。

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;启示：开发中，建议根据实际数量的多少，使用带参的构造器。

  ```java
  ArrayList list = new ArrayLis(int initCapacity);
  ```

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;小结：jdk7 中的 ArrayList 的对象的创建类似于单例的饿汉式，而 jdk8 中的 ArrayList 的对象的创建类似于单例的懒汉式，延迟了数组的创建，节省内存

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②LinkedList

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在创建 LinkedList 对象时，会生成 first/last 两个节点（Node）对象，默认值都为 null，在第一次添加时，会新建一个 Node 节点对象，并且将节点对象赋值给 first 和 last，Node 对象里有三个属性，分别是：item，next，prev，数据存在 item 中，next 是存储下一个节点的对象，prev 是存储上一个节点的对象。

  ```java
  // 源码分析
  LinkedList list = new LinkedList(); // 内部声明了Node类型的first和last属性，默认值为null
  list.add(123); // 将123封装到Node中，创建了Node对象
  ```

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其中的 Node 对象定义为如下：体现了 LinkedList 的双向链表的说法

  ```java
  private static class Node<E> {
      E item;
      Node<E> next;
      Node<E> prev;
  
      Node(Node<E> prev, E element, Node<E> next) {
          this.item = element;
          this.next = next;
          this.prev = prev;
      }
  }
  ```

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③Vector：jdk7 和 jdk8 中通过 Vector() 的构造器创建对象时，底层都创建了长度为10的数组，在扩容方面，默认扩容为原来数组长度的2倍

  （5）存储元素的要求

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向 List 集合中添加数据，要求数据所在的类要重写 equals();

- **ArrayList 中的常用方法**

```java
// 1.public void add(int index, E element)：在index位置插入element元素
list.add(1,"BB");
System.out.println(list); // [123, BB, 456, AA, Person{name='John', age=22}]

// 2.public boolean addAll(Collection<? extends E> c)：从index位置开始将c中的所有元素添加进来
List list1 = Arrays.asList(678,789);
list.addAll(list1);
System.out.println(list); // [123, BB, 456, AA, Person{name='John', age=22}, 678, 789]

// 3.public E get(int index)：获取指定index位置的元素
System.out.println(list.get(3)); // AA

// 4.public int indexOf(Object o)：返回o在集合中首次出现的位置，如果不存在，返回-1
System.out.println(list.indexOf(456)); // 2

// 5.public int lastIndexOf(Object o)：返回o在集合中末次出现的位置，如果不存在，返回-1
list.add(456);
System.out.println(list.lastIndexOf(456)); // 7

// 6.public E remove(int index)：移除指定index位置上的元素，并返回此元素
Object remove = list.remove(0);
System.out.println(remove); // 123
System.out.println(list); // [BB, 456, AA, Person{name='John', age=22}, 678, 789, 456]

// 7.public E set(int index, E element)：设置指定index位置上的元素为element
list.set(1,"CC");
System.out.println(list); // [BB, CC, AA, Person{name='John', age=22}, 678, 789, 456]

// 8.public List<E> subList(int fromIndex, int toIndex)：返回从fromIndex到toIndex位置的左闭右开区间的子集合
// 对原集合没有影响
List list2 = list.subList(2,5);
System.out.println(list); // [BB, CC, AA, Person{name='John', age=22}, 678, 789, 456]
System.out.println(list2); // [AA, Person{name='John', age=22}, 678]
```

**【ArrayList 的一个小面/笔试题】**

```java
// 考查点：区分list中remove(int index)和remove(Object o)
ArrayList list = new ArrayList();
list.add(1);
list.add(2);
list.add(3);
list.remove(2); // remove(int index)
System.out.println(list);
list.remove(new Integer(2)); // remove(Object o)
System.out.println(list);
```



- **Set接口**

  （1）存储数据的特点

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存储无序的、不可重复的数据

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**理解 Set 的无序性和不可重复性：**

  ```java
  以 HashSet 为例说明：
  
  ①无序性：不等于随机性，无序性指的是存储的数据在底层数组中并非按照数组索引的顺序添加，而是根据数据的哈希值决定的
  
  ②不可重复性：保证添加的元素按照equals()判断时，不能返回true，即，相同的元素只能添加一个
  ```

  （2）元素添加方式

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向 HashSet / LinkedHashSet 中添加数据的过程：哈希算法

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向 Set 中添加元素 a，首次根据元素 a 所在类的 hashCode()，计算哈希值，此哈希值就决定了元素 a 在底层数组中的存储位置。如果要存储的位置上没有元素，则元素 a 直接添加成功，如果要存储的位置上已经有其他元素 b 存储了，则此时需要调用元素 a 所在类的 equals()，将元素 b 作为参数传入，判断 a 与 b 是否相等。如果返回 true，则认为元素 a 与元素 b 是相同的，则元素 a 添加不成功，如果返回 false，则认为元素 a 与元素 b 不相同，则元素 a 仍能添加成功，此时元素 a 与元素 b 以链表方式存储。（jdk7：元素 b 指向元素 a，jdk8：元素 a 指向元素 b，"七上八下" ）

  （3）常用方法

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set 中定义的方法都是在 Collection 中声明过的，即：Set 中没有额外定义新的方法。

  （4）常用实现类

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①HashSet：Set 的主要实现类：底层使用数组+链表存储

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LinkedList：是 HashSet 的子类，底层使用数组+链表，在数据添加的同时，记录数据添加的顺序（使用了双向链表），因此在遍历时，可以实现按照添加顺序遍历。

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②TreeSet：可以实现按照添加数据的某一个属性排序，并按照此排序遍历，底层使用红黑树存储。

  （5）存储的元素的要求

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;针对于 HashSet 和 LinkedList：

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①元素所在的类要重写 hashCode() 和 equals();

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②保证 hashCode() 和 equals() 重写的时候，保持一致性；

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;即相等的对象必须具有相等的散列码(即相同属性值的对象，也即 equals 比较返回 true，计算出来的 hash 值也要一样)

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;【重写两个方法的小技巧：对象中用作 equals() 方法比较的 Field ，都应该用来计算 hashCode】

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;针对 TreeSet：

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;不需要元素所在的类重写 hashCode() 和 equals()，但是需要考虑排序的问题。

  （6）TreeSet 的使用

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①使用说明：

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<1>必须向 TreeSet 中添加同一个类型的对象；

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<2>默认情况下，包装类、String 都可以添加到 TreeSet 中，而且默认按照从小到大的顺序存储。

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②常用的排序方式：自然排序、定制排序

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;自然排序：

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<1>要求添加的元素所在的类要实现 Comparable 接口；

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<2>重写 Comparable 接口中的 compareTo()，指明按照哪个属性实现排序;

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<3>将多个元素添加到 TreeSet 中即可。

  ```java
  public class User implements Comparable {
      private String name;
  	private int age;
  	...
  	@Override
  	public boolean equals(Object o) {...}
  
  	@Override
  	public int hashCode() {...}
  
  	// 按照姓名从大到小排序，年龄从小到大排列
  	@Override
  	public int compareTo(Object o) {
  		if (o instanceof User) {
  			User user = (User) o;
  			int compare = -this.name.compareTo(user.name);
  			if (compare != 0) {
  				return compare;
  			} else {
  				return Integer.compare(this.age,user.age);
  			}
  		} else {
  			throw new RuntimeException("输入的类型不匹配");
  		}
  	}
  }
  
  Set set = new TreeSet();
  set.add(new User("Tom",12));
  set.add(new User("Jerry",32));
  set.add(new User("Jom",2));
  set.add(new User("Mike",65));
  set.add(new User("Jack",34));
  set.add(new User("Jack",56));
  
  Iterator iterator = set.iterator();
  while (iterator.hasNext()) {
  	System.out.println(iterator.next());
  }
  
  // 排序结果如下：
  // User{name='Tom', age=12}
  // User{name='Mike', age=65}
  // User{name='Jom', age=2}
  // User{name='Jerry', age=32}
  // User{name='Jack', age=34}
  // User{name='Jack', age=56}
  ```

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定制排序：

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<1>提供实现 Comparator 接口的实现类的对象；

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<2>重写 Comparator 接口中的 compare();

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<3>将此接口实现类的对象作为参数传递到 TreeSet 的构造器中；

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<4>将 compare() 中涉及到的类的对象添加到 TreeSet 中。

  ```java
  Comparator comparator = new Comparator() {
  	// 按照年龄从小到大排列
  	@Override
  	public int compare(Object o1, Object o2) {
  		if (o1 instanceof User && o2 instanceof User) {
  			User user1 = (User) o1;
  			User user2 = (User) o2;
  			return Integer.compare(user1.getAge(),user2.getAge());
  		} else {
  			throw new RuntimeException("输入的数据类型不匹配");
  		}
  	}
  };
  
  Set set = new TreeSet(comparator);
  set.add(new User("Tom",12));
  set.add(new User("Jerry",32));
  set.add(new User("Jom",2));
  set.add(new User("Mike",65));
  set.add(new User("Jack",34));
  set.add(new User("Jack",56));
  
  Iterator iterator = set.iterator();
  while (iterator.hasNext()) {
  	System.out.println(iterator.next());
  }
  
  // 排序结果如下：
  // User{name='Jom', age=2}
  // User{name='Tom', age=12}
  // User{name='Jerry', age=32}
  // User{name='Jack', age=34}
  // User{name='Jack', age=56}
  // User{name='Mike', age=65}
  ```

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③说明

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<1>在 TreeSet 中判断两个元素是否相等的标准，不再是使用 hashCode() 和 equals()，

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;而是依据 Comparable 接口中的 compareTo(Object obj)（针对于自然排序），

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;或者 Comparator 接口中的 compare(Object obj1,Object obj2)（针对于定制排序）；

     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<2>向 TreeSet 中添加的元素所在的类，可以不用重写 hashCode() 和 equals()。



## 3. Iterator 接口

> java 定义的一个迭代器接口，用于遍历 Collection（List 或 Set）

举例：

```java
Collection coll = new ArrayList();
coll.add(123);
coll.add(new Person("Tom",12));
coll.add(456);
coll.add(new String("AA"));
Iterator iterator = coll.iterator();
while(iterator.hasNext()) { // hasNext():判断集合中是否还下一个元素
	// next():①指针下移 ②下移以后，集合当前位置上的元素返回
	System.out.println(iterator.next());
}
```

图示：

![image-20210810224700454](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210810224700454.png)

增强for循环：

```java
@Test
public void test3() {
	Collection coll = new ArrayList();
	coll.add(123);
	coll.add(new Person("Tom", 12));
	coll.add(456);
	coll.add(new String("AA"));
		
	// 格式：for(集合元素的类型 局部变量 : 集合引用){}
	for(Object obj : coll) {
		System.out.println(obj);
	}
	System.out.println("**********************");
		
	// java8 中 foreach()
	coll.forEach(System.out::println);
		
	// 使用增强for循环遍历数组
	System.out.println("**********************");
		
	String[] arr = new String[]{"AA", "BB", "CC"};
	for(String s : arr) {
		System.out.println(s);
	}	
}
```



## 4. Map接口

> 双列集合框架：Map

- **存储数据特点**

  ![image-20210811083904184](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210811083904184.png)

  Map：存储的是键值对（key-value 对特点的数据）

  ①一个 key-value 构成一个 entry 对象；

  ②Map 中所有的 key 都是无序的、不可重复的，即使用 Set 进行存储；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*（HashMap --> HashSet，LinkedHashMap --> LinkedHashSet，TreeMap --> TreeSet）

  ③Map 中所有的 value 都是无序的，可重复的，即使用 Collection 进行存储；

  ④所有的 entry 是无序的、不可重复的，即使用 Set 进行存储；

  ⑤Set 的底层就是使用对应的 Map 结构，进行数据的存储的。

- **常用方法**

  ①增：put(Object key,Object value)

  ②删：remove(Object key)

  ③改：put(Object key,Object value)

  ④查：get(Object key)

  ⑤长度：size()

  ⑥遍历：keySet() / values() / entrySet()

- **常用实现类**

  （1）HashMap：是 Map 的主要实现类，是线程不安全的，效率高，可以存储 null 的 key 和 null 的 value，底层使用数组+链表+红黑树（jdk8 新增）；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LinkedHashMap：是 HashMap 的子类，在添加数据的同时，记录数据添加的先后顺序（使用双向链表），便于在遍历时，能按照添加的顺序实现遍历；

  （2）TreeMap：可以按照key中对象的相应的属性进行排序，便于遍历时，能按照属性的大小顺序实现遍历；

  （3）HashTable：是 Map 的古老实现类：线程安全的，效率低，不可以存储 null 的 key 和 null 的 value，底层使用数组+链表+红黑树；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Properties：是 HashTable 的子类，主要用于处理属性文件，键和值都是 String 类型。

  **【面试题】HashMap 和 HashTable 的区别**

  相同点：①都实现了 Map；②底层的实现结构；

  不同点：HashMap是线程不安全的，HashTable 是线程安全的；

  HashMap 初始容量为16，每次扩容是原来的2倍，而 HashTable 初始容量是11，每次扩容是原来的2倍加1。

- **内存结构说明（难点）**

  HashMap的底层实现原理：

  （1）jdk 7：数组+链表  jdk 8：数组+链表+红黑树

  jdk 7中：

  ```java
  // jdk7情况下：
  HashMap map = new HashMap(); 
  // 在实例化以后，底层创建了长度为16的一维数组Entry[] table
  // 加载因子：0.75，临界值（threshold）：16*0.75=12;
  map.put(key1, value1);
  // 首先，调用 key1 所在类的 hashCode() 计算 key1 的哈希值，此哈希值经过某种算法以后，得到在 Entry 数组中的存放位置：
  //   如果此位置上的数据为空，此时的 key-value 添加成功，---情况1
  //   如果此位置上的数据不为空(意味着此位置上已经存在了一个或多个数据(以链表形式存在))，比较 key1 和已经存在的一个或多个数据的哈希值：
  //     如果 key1 的哈希值与已经存在的数据的哈希值都不相同，此时 key-value 添加成功，---情况2
  //     如果key1的哈希值与已经存在的某个数据的哈希值相同，则继续比较，调用 key1 所在类的 equals() 方法：
  //       如果 equals() 返回 false，则 key-value 添加成功，---情况3
  //       如果 equals() 返回 true，则使用 value1 替换掉原来的值
  // **关于情况2和情况3，此时key1-value1和原来的数据以链表的方式进行存储**
  
  // 在不断添加的过程中，会涉及到扩容问题，当超出临界值(且要存放的位置非空时)默认的扩容方式：扩容为原来容量的2倍，并将原有的数据复制过来
  ```

  jdk 8中（相较于jdk 7的区别）：

  ①new HashMap(); // 底层没有创建一个长度为16的数组

  ②jdk8 底层的数组是：Node[]，而非Entry[]

  ③首次调用 put() 方法，底层才创建长度为 16 的数组

  ④jdk7 底层结构只有：数组+链表，jdk8 中底层结构：数组+链表+红黑树

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当数组的某一个索引位置上的元素以链表形式存在的数据个数 >  8 且当前数组的长度 >  64时，此时索引位置上的所有数据改为使用红黑树存储

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;【提醒：开发中，建议使用 HashMap map = new HashMap(int initialCapacity);  // initialCapacity:决定了底层数组的长度】

  **一些重要参数说明：**

  ```java
  DEFAULT_LOAD_FACTOR = 0.75f; // HashMap的默认加载因子：0.75
  DEFAULT_INITIAL_CAPACITY = 1 << 4; // HashMap的默认容量：16
  ===> threshold = DEFAULT_INITIAL_CAPACITY * DEFAULT_LOAD_FACTOR // 扩容的临界值=默认容量*加载因子
  TREEIFY_THRESHOLD = 8; // Bucket中的链表长度大于该默认值(8)，转化为红黑树
  MIN_TREEIFY_CAPACITY = 64; // 桶中的Node被树化时最小的hash表容量：64
  ```

- **读取配置文件的操作实现**

```java
// Properties 的使用(掌握):读取配置信息
@Test
public void test4() {

	Properties pros = new Properties();

	FileInputStream fis = null;
	try {
		fis = new FileInputStream(new File("jdbc.properties"));
		pros.load(fis); // 加载流
		// 读取数据
		String name = pros.getProperty("userName");
		String pwd = pros.getProperty("password");
		System.out.println("name = " + name + ",pwd = " + pwd);
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		if(fis != null) {
			try {
				fis.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}	
}
```



## 5. Collections 工具类的使用

**reverse(List)**：反转List中元素的顺序；

**shuffle(List)**：对List集合元素进行随机排序；

**sort(List)**：根据元素的自然顺序对自定List集合元素做升序排序；

**sort(List,Comparator)**：根据指定的Comparator产生的顺序对List集合元素进行排序；

**swap(List,int i,int j)**：将指定List集合中的i处元素和j处元素进行交换；

**Object max(Collection)**：根据元素的自然排序，返回给定集合中的最大元素；

**Object max(Collection,Comparator)**：根据Comparator指定的顺序，返回给定集合中的最大元素；

**Object min(Collection)**：根据元素的自然排序，返回给定集合中的最小元素；

**Object min(Collection,Comparator)**：根据Comparator指定的顺序，返回给定集合中的最小元素；

**int frequency(Collection,Object)**：返回给定集合中指定元素的出现次数；

**void copy(List dest ,List src)**：将src中的内容复制到dest中；

**boolean replaceAll(List list,Object oldValue,Object newValue)**：使用新值替换List集合中所有的旧值。

以及：

![image-20210811090632917](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210811090632917.png)

可以将线程不安全的 ArrayList 和 HashMap 转换为线程安全。

**【面试题：Collection和Collections的区别？】**

Collection：是 java 中集合类的一个顶级接口，它的直接继承接口是 List 和 Set，另外它也提供了对集合对象进行基本操作的通用接口方法。

Collections：是一个服务于 java 的 Collection 框架的工具类，包含了各种有关集合操作的静态多态方法。