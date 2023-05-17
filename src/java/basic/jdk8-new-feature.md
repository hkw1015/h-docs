---
title: Java8 新特性
category: Java
tag:
  - Java 基础
---

## 一、Lambda 表达式

### 1. Lambda 使用

#### 1.1 为什么要使用 Lambda 表达式？

Lambda 表达式是一个 **匿名函数**，我们可以把表达式理解为是 **一段可以传递的代码**（将代码像数据一样进行传递），可以写出更简洁、灵活的代码，作为一种更紧凑的代码风格，使 Java 的语言表达能力得到了提升。

#### 1.2 从匿名内部类到 Lambda 的转换

举例 1：

```java
@Test
public void test1() {
    // 匿名内部类
    Runnable r1 = new Runnable() {
        @Override
        public void run() {
            System.out.println("Hello World!");
        }
    };
    r1.run();
    System.out.println("===========================================");
    // Lambda 表达式
    Runnable r2 = () -> System.out.println("Hello Lambda!");
    r2.run();
}
```

![image-20211018214929756](http://img.hl1015.top/blog/image-20211018214929756.png)

举例 2：

```java
@Test
public void test2() {
    // 使用匿名内部类作为参数传递
    Comparator<String> comp1 = new Comparator<String>() {
        @Override
        public int compare(String o1, String o2) {
            return Integer.compare(o1.length(), o2.length());
        }
    };
    // 使用Lambda表达式作为参数传递
    Comparator<String> comp2 = (o1, o2) -> Integer.compare(o1.length(), o2.length());

    TreeSet<String> treeSet1 = new TreeSet<>(comp1);
    treeSet1.add("A");
    treeSet1.add("ABC");
    treeSet1.add("AB");
    treeSet1.forEach(System.out::println);
    System.out.println("===========================================");
    TreeSet<String> treeSet2 = new TreeSet<>(comp2);
    treeSet2.add("A");
    treeSet2.add("ABC");
    treeSet2.add("AB");
    treeSet2.forEach(System.out::println);
}
```

![image-20211018215007273](http://img.hl1015.top/blog/image-20211018215007273.png)

#### 3. Lambda 表达式语法

Lambda 表达式在 Java 语言中引入了一个新的语法语法元素和操作符。这个操作符为 "**->**" ，该操作符被称为 Lambda 操作符或箭头操作符。它将 Lambda 分为两个部分：

- 左侧：指定了 Lambda 表达式需要的所有参数
- 右侧：指定了 Lambda 体，即 Lambda 表达式要执行的功能

**语法格式一**：无参，无返回值，Lambda 体只需一条语句

```java
Runnable r1 = () -> System.out.println("Hello Lambda!");
```

**语法格式二**：Lambda 体只需一个参数

```java
Consumer<String> fun1 = (arg) -> System.out.println(arg);
```

**语法格式三**：Lambda 体只需要一个参数时，参数的小括号可以省略

```java
Consumer<String> fun2 = arg -> System.out.println(arg);
```

**语法格式四**：Lambda 体需要两个参数，并且有返回值

```java
BinaryOperator<Long> bo1 = (Long x, Long y) -> {
	System.out.println("实现函数式接口!");
	return x + y;
};
```

![image-20211012170726353](http://img.hl1015.top/blog/image-20211012170726353.png)

<span style="color:blue">类型推断</span> 说明：

上述 Lambda 表达式中的参数类型都是由编译器推断得出的。Lambda 表达式中无需指定类型，程序依然可以编译，这是因为 javac 根据程序的上下文，在后台推断出了参数的类型。Lambda 表达式的类型依赖于上下文环境，是由编译器推断出来的，这就是所谓的 "类型推断"。

**语法格式五**：当 Lambda 体只有 <span style="color:red">**一条**</span> 语句时，<span style="color:red">**return**</span> 和 <span style="color:red">**大括号**</span> 可以省略

```java
BinaryOperator<Long> bo2 = (x, y) -> x + y;
```

### 2. 函数式接口

#### 2.1 什么是函数式接口

- 只包含一个抽象方法的接口，称为 **函数式接口**
- 你可以通过 Lambda 表达式来创建该接口的对象（若 Lambda 表达式抛出一个受检异常，那么该异常需要在目标接口的抽象方法上进行声明）
- 我们可以在任意函数式接口上使用 **@FunctionalInterface** 注解，这样做可以检查它是否是一个函数式接口，同时 javadoc 也会包含一条声明，说明这个接口是一个函数式接口

#### 2.2 自定义函数式接口

```java
@FunctionalInterface
public interface MyFun1 {
    int getValue();
}
```

函数式接口中使用泛型

```java
@FunctionalInterface
public interface MyFun2<T> {
    T getValue(T t);
}
```

#### 2.3 作为参数传递 Lambda 表达式

```java
public String toUpperStr(String str, MyFun2<String> fun) {
    return fun.getValue(str);
}
```

作为参数传递 Lambda 表达式：

```java
@Test
public void test4() {
    String newStr = toUpperStr("abcde", s -> s.toUpperCase());
    System.out.println("newStr = " + newStr);
}
```

<span style="color:red">作为参数传递 Lambda 表达式：为了将 Lambda 表达式作为参数传递，接收 Lambda 表达式的参数必须是与该 Lambda 表达式兼容的函数式接口的类型。</span>

#### 2.4 Java 内置四大核心函数式接口

|        函数式接口         | 参数类型 | 返回类型 |                             用途                             |
| :-----------------------: | :------: | :------: | :----------------------------------------------------------: |
| Consumer\<T\> 消费型接口  |    T     |   void   |    对类型为 T 的对象应用操作，包含方法：void accept(T t);    |
| Supplier\<T\> 供给型接口  |    无    |    T     |           返回类型为 T 的对象，包含方法：T get();            |
| Function\<T\> 函数型接口  |    T     |    R     | 对类型为 T 的对象应用操作，并返回结果，结果是 R 类型的对象，包含方法：R apply(T t); |
| Predicate\<T\> 断定型接口 |    T     | boolean  | 确定类型为 T 的对象是否满足某约束，并返回 boolean 值，包含方法 boolean test(T t); |

#### 2.5 其他接口

|                          函数式接口                          |          参数类型          |         返回类型          |                             用途                             |
| :----------------------------------------------------------: | :------------------------: | :-----------------------: | :----------------------------------------------------------: |
|                    BiFunction\<T, U, R\>                     |            T, U            |             R             | 对类型为 T, U 参数应用操作，返回 R 类型的结果，包含方法为 R apply(T t, U u); |
|            UnaryOperator\<T\> （Function 子接口）            |             T              |             T             | 对类型为 T 的对象进行一元运算，并返回 T 类型的结果，包含方法为 T apply(T t); |
|          BinaryOperator\<T\> （BiFunction 子接口）           |            T, T            |             T             | 对类型为 T 的对象进行二元运算，并返回 T 类型的结果，包含方法为 T apply(T t1, T t2); |
|                      BiConsumer\<T, U\>                      |            T, U            |           void            | 对类型为 T, U 参数应用操作，包含方法为 void accept(T t, U u); |
| ToIntFunction\<T\><br />ToLongFunction\<T\><br />ToDoubleFunction\<T\> |             T              | int<br />long<br />double |             分别计算 int、long、double 值的函数              |
| IntFunction\<R\><br />LongFunction\<R\><br />DoubleFunction\<R\> | int<br />long<br />doubleR |             R             |           参数分别为 int、long、double 类型的函数            |

### 3. 方法引用与构造器引用

#### 3.1 方法引用

当要传递给 Lambda 体的操作，已经有实现的方法了，可以使用方法引用！（实现抽象方法的参数列表，必须与方法引用的方法的参数列表保持一致！）

方法引用：使用操作符 "**::**" 将方法名和对象或类的名字分隔开来。

有如下三种主要使用情况：

- **对象 :: 实例方法**
- **类 :: 静态方法**
- **类 :: 实例方法**

例如：

```java
(x) -> System.out.println(x);
// 等同于
System.out::println
```

```java
BinaryOperator<Double> bo = (x, y) -> Math.pow(x, y);
// 等同于
BinaryOperator<Double> bo = Math::pow
```

```java
compare((x, y) -> x.equals(y), "abcdef", "abcdef");
// 等同于
compare(String::equals, "abcdef", "abcdef");
```

注意：当需要引用方法的第一个参数是调用对象，并且第二个参数是需要引用方法的第二个参数（或无参数）时：ClassName :: methodName

#### 4. 构造器引用

格式：**ClassName :: new**

与函数式接口相结合，自动与函数式接口中方法兼容，可以把构造器引用赋值给定义的方法，与构造器参数列表要与接口中抽象方法的参数列表一致！

例如：

```java
Function<Integer, MyClass> fun = (n) -> new MyClass(n);
// 等同于
Function<Integer, MyClass> fun = MyClass::new;
```

#### 5. 数组引用

格式：**type[] :: new**

例如：

```java
Function<Integer, Integer[]> fun = (n) -> new Integer[n];
// 等同于
Function<Integer, Integer[]> fun = Integer[]::new;
```

## 二、强大的 Stream API

### 1. 了解 Stream

Java 8 中有两大最为重要的改变，第一个是 Lambda 表达式，另一个则是：**Stream API（java.util.stream.\*）**

Stream 是 Java 8 中处理集合的关键抽象概念，它可以指定你希望对集合进行的操作，可以执行非常复杂的查找、过滤和映射数据等操作。使用 Stream API 对集合数据进行操作，就类似于 SQL 执行的数据库查询，也可以使用 Stream API 来并行执行操作。简而言之，Stream API 提供了一种高效且易于使用的处理数据的方式。

### 2. 什么是 Stream

#### 2.1 流（Stream）到底是什么呢？

流（Stream）是数据渠道，用于操作数据源（集合、数组等）所生成的元素序列。

**"集合讲的是数据，流讲的是计算！"**

注意：

- Stream 自己不会存储元素
- Stream 不会改变源对象，相反，它会返回一个持有结果的新的 Stream
- Stream 操作是延迟执行的，这意味着它会等到需要结果的时候才执行

#### 2.2 Stream 的三个操作

- **创建 Stream**

  一个数据源（如：集合、数组），获取一个流

- **中间操作**

  一个中间操作链，对数据源的数据进行处理

- **终止操作（终端操作）**

  一个终止操作，执行中间操作，并产生结果

![image-20211016160909570](http://img.hl1015.top/blog/image-20211016160909570.png)

### 3. 创建 Stream 流

#### 3.1 由集合创建 Stream

Java 8 中的 Collection 接口被扩展，提供了两个获取流的方法：

- default Stream\<E\> stream()：返回一个顺序流
- default Stream\<E\> parallelStream()：返回一个并行流

#### 3.2 由数组创建 Stream

Java 8 中的 Arrays 的静态方法 steam() 可以获取数组流：

- static \<T\> Stream\<T\> stream(T[] array)：返回一个流

重载形式，能够处理对应基本类型的数组：

- public static IntStream stream(int[] array)
- public static LongStream stream(long[] array)
- public static DoubleStream stream(double[] array)

#### 3.3 由值创建流

可以使用静态方法 Stream.of()，通过显示值创建一个流，它可以接收任意数量的参数。

- public static\<T\> Stream\<T\> of(T ... values)：返回一个流

#### 3.4 由函数创建流：创建无限流

可以使用静态方法 Stream.iterate() 和 Stream.generate()，创建无限流：

- 迭代

  public static\<T\> Stream\<T\>  iterate(final T seed,final UnaryOperator\<T\> f)

- 生成

  public static\<T\> Stream\<T\> generate(Supplier\<T\> s)

### 4. Stream 的中间操作

多个**中间操作**可以连接起来形成一个**流水线**，除非流水线触发终止操作，否则**中间操作不会执行任何的处理**！而在**终止操作时一次性全部处理，称为 "惰性处理"**。

#### 4.1 筛选与切片

|        方法         |                             描述                             |
| :-----------------: | :----------------------------------------------------------: |
| filter(Predicate p) |               接收 Lambda，从流中排除某些元素                |
|     distinct()      | 筛选，通过流所生成元素的 hashCode() 和 equals() 去除重复元素 |
| limit(long maxSize) |                截断流，使其元素不超过给定数量                |
|    skip(long n)     | 跳过元素，返回一个扔掉了前 n 各元素的流。若流中元素不足 n 个，则返回一个空流，与 limit(n) 互补 |

#### 4.2 映射

|              方法               |                             描述                             |
| :-----------------------------: | :----------------------------------------------------------: |
|         map(Function f)         | 接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素 |
| mapToDouble(ToDoubleFunction f) | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的 DoubleStream |
|    mapToInt(ToIntFunction f)    | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的 IntStream |
|   mapToLong(ToLongFunction f)   | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的 LongStream |
|       flatMap(Function f)       | 接收一个函数作为参数，将流中的每个值都换成另一个流，然后把所有流连接成一个流 |

#### 4.3 排序

|          方法           |                描述                |
| :---------------------: | :--------------------------------: |
|        sorted()         |  产生一个新流，其中按自然顺序排序  |
| sorted(Compatator comp) | 产生一个新流，其中按比较器顺序排序 |

### 5. Stream 的终止操作

终端操作会从流的流水线生成结果，其结果可以是任何不是流的值，例如：List、Integer，甚至是 void

#### 5.1 查找和匹配

|          方法          |                             描述                             |
| :--------------------: | :----------------------------------------------------------: |
| allMatch(Predicate p)  |                     检查是否匹配所有元素                     |
| anyMatch(Predicate p)  |                     检查至少匹配一个元素                     |
| noneMatch(Predicate p) |                   检查是否没有匹配所有元素                   |
|       findFirst        |                        返回第一个元素                        |
|       findAny()        |                    返回当前流中的任意元素                    |
|        count()         |                       返回流中元素总数                       |
|   max(Comparator c)    |                        返回流中最大值                        |
|   max(Comparator c)    |                        返回流中最小值                        |
|  forEach(Consumer c)   | 内部迭代（使用 Collection 接口需要用户去做迭代，称为 外部迭代。相反，Stream API 使用内部迭代 --- 它帮你把迭代做了） |

#### 5.2 归约

|               方法               |                           描述                           |
| :------------------------------: | :------------------------------------------------------: |
| reduce(T iden, BinaryOperator b) |      可以将流中元素反复结合起来，得到一个值，返回 T      |
|     reduce(BinaryOperator b)     | 可以将流中元素反复结合起来，得到一个值，返回 Option\<T\> |

备注：map 和 reduce 的连接通常称为 map-reduce 模式，因 Google 用它来进行网络搜索而出名。

#### 5.3 收集

|         方法         |                             描述                             |
| :------------------: | :----------------------------------------------------------: |
| collect(Collector c) | 将流转换为其他形式，接收一个 Collector 接口的实现，用于给 Stream 中元素做汇总的方法 |

Collector 接口中方法的实现决定了如何对流执行收集操作（如收集到 List、Set、Map），但是我们更多时候可以使用 Collectors 工具类，它提供了很多静态方法，可以方便地创建常见收集器实例，具体方法与操作实例如下：

|  方法  | 返回类型  |         作用          |
| :----: | :-------: | :-------------------: |
| toList | List\<T\> | 把流中元素收集到 List |

```java
List<Employee> emps = list.stream().collect(Collectors.toList());
```

| 方法  | 返回类型 |         作用         |
| :---: | :------: | :------------------: |
| toSet | Set\<T\> | 把流中元素收集到 Set |

```java
Set<Employee> emps = list.stream().collect(Collectors.toSet());
```

|     方法     |    返回类型     |            作用            |
| :----------: | :-------------: | :------------------------: |
| toCollection | Collection\<T\> | 把流中元素收集到创建的集合 |

```java
Collection<Employee> emps = list.stream().collect(Collectors.toCollection(ArrayList::new));
```

|   方法   | 返回类型 |        作用        |
| :------: | :------: | :----------------: |
| counting |   Long   | 计算流中元素的个数 |

```java
Long count = list.stream().collect(Collectors.counting());
```

|    方法    | 返回类型 |           作用           |
| :--------: | :------: | :----------------------: |
| summingInt | Integer  | 对流中元素的整数属性求和 |

```java
int total = list.stream().collect(Collectors.summingInt(Employee::getSalary()));
```

|     方法     | 返回类型 |               作用                |
| :----------: | :------: | :-------------------------------: |
| averagingInt |  Double  | 计算流中元素 Integer 属性的平均值 |

```java
double avg = list.stream().collect(Collectors.averagingInt(Employee::getSalary));
```

|      方法      |       返回类型       |                   作用                    |
| :------------: | :------------------: | :---------------------------------------: |
| summarizingInt | IntSummaryStatistics | 收集流中 Integer 属性的统计值。如：平均值 |

```java
IntSummaryStatistics iss = list.stream().collect(Collectors.summarizingInt(Employee::getSalary));
```

|  方法   | 返回类型 |         作用         |
| :-----: | :------: | :------------------: |
| joining |  String  | 连接流中的每个字符串 |

```java
String str = list.stream().map(Employee::getName).collect(Collectors.joining);
```

| 方法  |   返回类型    |         作用         |
| :---: | :-----------: | :------------------: |
| maxBy | Optional\<T\> | 根据比较器选择最大值 |

```java
Optional<Emp> max = list.stream().collect(Collectors.maxBy(comparingInt(Employee::getSalary)));
```

| 方法  |   返回类型    |         作用         |
| :---: | :-----------: | :------------------: |
| minBy | Optional\<T\> | 根据比较器选择最小值 |

```java
Optional<Emp> min = list.stream().collect(Collectors.minBy(comparingInt(Employee::getSalary)));
```

|   方法   |    返回类型    |                             作用                             |
| :------: | :------------: | :----------------------------------------------------------: |
| reducing | 归约产生的类型 | 从一个作为累加器的初始值开始，利用 BinaryOperator 与流中元素逐个结合，从而归约成单个值 |

```java
int total = list.stream().collect(Collectors.reducing(0, Employee::getSalary, Integer::sum));
```

|       方法        |      返回类型      |                作用                |
| :---------------: | :----------------: | :--------------------------------: |
| collectingAndThen | 转换函数返回的类型 | 包裹另一个收集器，对其结果转换函数 |

```java
int how = list.stream().collect(Collectors.collectingAndThen(Collectors.toList, List::size));
```

|    方法    |       返回类型       |                   作用                   |
| :--------: | :------------------: | :--------------------------------------: |
| groupingBy | Map\<K,  List\<T\>\> | 根据某属性值对流分组，属性为 K，结果为 V |

```java
Map<Emp.Status, List<Emp>> map = list.stream().collect(Collectors.groupingBy(Employee::getStatus));
```

|      方法      |         返回类型          |            作用             |
| :------------: | :-----------------------: | :-------------------------: |
| partitioningBy | Map\<Boolean, List\<T\>\> | 根据 true 或 false 进行分区 |

```java
Map<Boolean, List<Emp>> vd = list.stream().collect(Collectors.grouopingBy(Employee::getManage));
```

### 6.并行流和串行流

并行流就是把一个内容分成多个数据块，并用不同的线程分别处理每个数据块的流。

Java 8 中将并行进行了优化，我们可以很容易地对数据进行并行操作。Stream API 可以声明性地通过 parallel() 与 sequential() 在并行流与顺序流之间进行切换。

### 7.了解 Fork/Join 框架

**Fork / Join 框架**：就是在必要的情况下，将一个大任务，进行拆分(fork)成若干个小任务(拆到不可再拆时)，再将一个个的小任务运算的结果进行 join 汇总。

![image-20211016220626481](http://img.hl1015.top/blog/image-20211016220626481.png)

**Fork / Join 框架与传统线程池的区别：**

采用 "工作窃取" 模式（working-stealing）：

当执行新的任务时，它可以将其拆分分成更小的任务执行，并将小任务加到线程队列中，然后再从一个随机线程的队列中偷一个并把它放在自己的队列中。

相对于一般的线程池实现，fork/join 框架的优势在对其中包含的任务处理方式上，在一般的线程池中，如果一个线程正在执行的任务由于某些原因无法继续运行，那么该线程会处于等待状态，而在 fork/join 框架实现中，如果某个子问题由于等待另一个子问题的完成而无法继续运行，那么处理该子问题的线程会主动寻找其他尚未运行的子问题来执行，这种方式减少了线程的等待时间，提高了性能。

使用 LocalDate、LocalTime、LocalDateTime 类的实例是**不可变的对象**，分别表示使用 ISO-8601 日历系统的日期、时间、日期和时间。它们提供了简单的日期或时间，并不包含当前的时间信息，也不包含与时区相关的信息。

（注：ISO-8601日历系统是国际标准化组织制定的现代公民的日期和时间的表示法）

|                        方法                        |                             描述                             |                             示例                             |
| :------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|                       now()                        |               静态方法，根据 当前时间 创建对象               | LocalDate localDate = LocalDate.now();<br />LocalTime localTime = LocalTime.now();<br />LocalDateTime localDateTime = LocalDateTime.now(); |
|                        of()                        |            静态方法，根据 指定日期/时间 创建对象             | LocalDate localDate = LocalDate.of(2021, 10, 18);<br />LocalTime localTime = LocalTime.of(20, 5, 55);<br />LocalDateTime localDateTime = LocalDateTime.of(2021, 10, 18, 20, 5, 55); |
|     plusDays, plusWeeks, plusMonths, plueYears     |       向当前 LocalDate 对象添加几天、几周、几月、几年        |                                                              |
|   minusDays, minusWeeks, minusMonths, minusYears   |       向当前 LocalDate 对象减去几天、几周、几月、几年        |                                                              |
|                    plus, minus                     |              添加或减少一个 Duration 或 Period               |                                                              |
| withDayOfMonth, withDayOfYear, withMonth, withYear | 将月份天数、年份天数、月份 、年份修改为指定的值并返回新的 LocalDate 对象 |                                                              |
|                   getDayOfMonth                    |                    获得月份天数（1 ~ 31）                    |                                                              |
|                    getDayOfYear                    |                   获得年份天数（1 ~ 366）                    |                                                              |
|                    getDayOfWeek                    |           获得星期几（返回一个 DayOfWeek 枚举值）            |                                                              |
|                      getMonth                      |               获得月份，返回一个 Month 枚举值                |                                                              |
|                   getMonthValue                    |                      获得月份（1 ~ 12）                      |                                                              |
|                      getYear                       |                           获得年份                           |                                                              |
|                       until                        |    获得两个日期之间的 Period 对象，或者 指定 ChronoUnits     |                                                              |
|                 isBefore, isAfter                  |                      比较两个 LocalDate                      |                                                              |
|                     isLeapYear                     |                        判断是否是闰年                        |                                                              |

## 三、新时间日期 API

### 1. Instant 时间戳

用于 "时间戳" 的运算，它是以 Unix 元年（传统的设定为 UTC 时区 1970年1月1日午夜时分）开始所经历的描述进行运算

### 2. Duration 和 Period

- Duration：用于计算两个 "时间" 间隔
- Period：用于计算两个 "日期" 间隔

### 3. 日期的操纵

- TemporalAdjuster：时间校正器

  有时我们可能需要获取例如：将日期调整到 "下个周日" 等操作。

- TempoalAdjusters：该类通过静态方法提供了大量的常用 TempAdjuster 的实现

  例如获取下个周日：

  ```java
  LocalDate nextSunday = LocalDate.now.with(
  	TemporalAdjusters.next(DayOfWeek.SUNDAY)
  );
  ```

### 4. 解析与格式化

java.time.format.DateTimeFormatter 类：该类提供了三种格式化方法

- 预定义的标准格式

  ![image-20211018220136915](http://img.hl1015.top/blog/image-20211018220136915.png)

- 语言环境相关的格式

- 自定义的格式

  ![image-20211018220333692](http://img.hl1015.top/blog/image-20211018220333692.png)

### 5. 时区的处理

java 8 中加入了对时区的支持，带时区的时间分别为：ZonedDate、ZoneTime、ZoneDateTime

- 其中每个时区都对应着 ID，地区 ID 都为 "{区域}/{城市}" 的格式，例如：Asia/Shanghai 等
- ZoneId：该类中包含了所有的时区信息
- getAvailableZoneIds()：可以获取所有时区信息
- of(id)：用指定的时区信息获取 ZoneId 对象

### 6. 与传统日期处理的转换

|                              类                              |              to 遗留类               |         from 遗留类         |
| :----------------------------------------------------------: | :----------------------------------: | :-------------------------: |
|            java.time.instant<br />java.util.Date             |          Date.from(instant)          |      date.toInstant()       |
|          java.time.instant<br />java.sql.Timestamp           |       Timestamp.from(instant)        |    timestamp.toInstant()    |
|   java.time.ZonedDateTime<br />java.util.GregorianCalendar   | GregorianCalendar.from(zoneDateTime) |    cal.toZonedDateTime()    |
|            java.time.LocalDate<br />java.sql.Time            |       Date.valueOf(localDate)        |      date.toLcalDate()      |
|            java.time.LocalTime<br />java.sql.Time            |       Date.valueOf(localDate)        |     date.toLocalTime()      |
|       java.time.LocalDateTime<br />java.sql.Timestamp        |   Timestamp.valueOf(localDateTime)   | timestamp.toLocalDateTime() |
|           java.time.ZoneId<br />java.util.TimeZone           |       Timezone.getTimeZone(id)       |     timeZone.toZoneId()     |
| java.time.format.DateTimeFormatter<br />java.text.DateFormat |         formatter.toFormat()         |             无              |

## 四、接口中的默认方法与静态方法

### 1. 接口中的默认方法

Java 8 中允许接口包含具有具体实现的方法，该方法称为 "默认方法"，默认方法使用 default 关键字修饰。

```java
interface MyFunc<T> {
	T func(int a);
	
	default String getName() {
		return "Hello Java8!";
	}
}
```

接口默认方法的 "类优先" 原则

若一个接口中定义了一个默认方法，而另外一个父类或接口中又定义了同名的方法时：

- 选择父类中的方法。如果一个父类提供了具体的实现，那么接口中具有相同名称和参数的默认方法会被忽略。
- 接口冲突。如果一个父接口提供一个默认方法，而另一个接口也提供了一个具有相同名字和参数列表的方法（不管方法是否是默认方法），那么必须覆盖该方法来解决冲突。

```java
interface MyFunc {
	default String getName() {
		return "Hello Java8!";
	}
}

interface Named {
    default String getName() {
        return "Hello hkw!";
    }
}

class MyClass implements MyFunc, Named {
    public String getName() {
        return Named.super.getName();
    }
}
```

### 2. 接口中的静态方法

Java 8 中，接口中允许添加静态方法。

```java
interface Named {
	public Integer myFun();
    
    default String getName() {
        return "Hello hkw!";
    }
    
    static void show() {
        System.out.println("Hello Lambda!");
    }
}
```

## 五、Optional 类、重复注解与类型注解

### 1. Optional 类

#### 1.1 说明

Optional\<T\> 类（Java.util.Optional）是一个容器类，代表一个值存在或不存在，原来用 null 表示一个值不存在，现在 Optional 可以更好地表达这个概念，并且可以避免空指针异常。

#### 1.2 常用方法

- Optional.of(T t)：创建一个 Optional 实例
- Optional.empty()：创建一个空的 Optional 实例
- Optional.ofNullable(T t)：若 t 不为 null，创建 Optional 实例，否则创建空实例
- isPresent()：判断是否包含值
- orElse(T t)：如果调用对象包含值，返回该值，否则返回 t
- orElseGet(Supplier s)：如果调用对象包含值，返回该值，否则返回 s 获取的值
- map(Function f)：如果有值对其处理，并返回处理后的 Optional，否则返回 Optional.empty()
- flatMap(Function mapper)：与 map 类似，要求返回值必须是 Optional

### 2. 重复注解与类型注解

Java 8 对注解处理提供了两点改进：可重复的注解以及可用于类型的注解。

```java
@Target({ElementType.TYPE, ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.CONSTRUCTOR, ElementType.LOCAL_VARIABLE})
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotations {
    MyAnnotation[] value();
}
```

```java
@Repeatable(MyAnnotations.class) // 可重复
@Target({ElementType.TYPE, ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.CONSTRUCTOR, ElementType.LOCAL_VARIABLE})
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation {
    String value();
}
```

```java
@MyAnnotation("Hello")
@MyAnnotation("World")
public void show(@MyAnnotation("hkw") String str) { // 可用于类型
}
```