---
title: Java 常用类
category: Java
tag:
  - Java 基础
---

## 1. String、StringBuffer、StringBuilder

> （一）java.lang.String 类

- **特点**

  String 的不可变性

  体现：

  ①给现有的字符串添加一个新的字符串，不能在原有的字符串后面添加，而必须声明一个新的内存空间，存放新的字符串；

  ②给现有的字符串重新赋值，不能在原有的常量池对应的字符串的位置赋值，必须重新声明一个新的内存空间，存放新的字符串；

  ③现有的字符串调用 replace() 方法，仍然声明一个新的内存空间，存放修改以后的字符串。

- **内存的存储结构**

  String 声明的变量，我们称为字符串，本质上数据存放在字符串常量池中，字符串常量池存放在方法区中。

  > jdk 6：方法区（具体的实现就是永久代--->堆：新生代、老年代、永久代）；
  >
  > jdk 7：方法区取消，统一归入堆；
  >
  > jdk 8：元空间取代原的方法区

- **String 的实例化方式**

  方式一：通过字面量定义的方式；

  方式二：通过new + 构造器的方式。

  二者区别：

  ①字面量的方式：地址值对应的数据声明在方法区中的字符串常量池；

  ②new + 构造器的方式：地址值对应的数据声明在堆空间中（堆空间中对应的 String 对象里存的是对应声明在字符串常量池中的字符串（若有，则不用创建；若无，就创建）的地址值）。

  ```java
  // 方式一：通过字面量的方式
  String s1 = "hello";
  String s2 = "hello";
  		
  // 方式二：通过new + 构造器的方式
  String s3 = new String("hello");
  String s4 = new String("hello");
  		
  System.out.println(s1 == s2);// true
  System.out.println(s1 == s3);// false
  System.out.println(s3 == s4);// false
  ```

  ![image-20210811110223198](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210811110223198.png)

**【面试题】String s = new String(“abc”); 这种方式创建对象，在内存中创建了几个对象？**

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一个或两个。一个是堆空间中 new 出的结构，另一个是char[]对应的字符串常量池的："abc"（若有，则不用创建；若无，就创建）。

- **连接运算**

```java
// String的连接运算
@Test
public void test3() {
	String s1 = "hello";
	String s2 = "world";
	
	String s3 = "helloworld";
	String s4 = "hello" + "world";
	
	String s5 = "hello" + s2;
	String s6 = s1 + "world";
	String s7 = s1 + s2;
	
	System.out.println(s3 == s4); // true
	System.out.println(s3 == s5); // false
	System.out.println(s3 == s6); // false
	System.out.println(s3 == s7); // false
	System.out.println(s5 == s6); // false
	System.out.println(s5 == s7); // false
	System.out.println(s6 == s7); // false
	// 此时的 s8 就使用已存在的 s3 对应 "helloworld"
	String s8 = (s1 + s2).intern();
	System.out.println(s3 == s8); // true
	
	System.out.println();
	
	String ss1 = "horld";
	String ss2 = "world";
	String ss3 = ss2.replace('w', 'h');
	System.out.println(ss1 == ss3); // false
}
```

总结：①常量与常量的拼接结果在常量池，且常量池中不会存在相同内容的常量； ②只要其中一个是变量，结果就在堆中。

- **常用方法**

  ①compareTo()：比较字符串的大小，从第一个字母开始比较，返回 (a - b) 的 int 值（a.compareTo(b)）；

  ②equals()：比较两个字符串的内容是否相等；

  ③indexOf()：返回指定字符在字符串中出现的第一个位置脚标；

  ④length()：返回字符串的长度；

  ⑤charAt(int index)：返回指定脚标位置上的字符；

  ⑥lastIndexOf()：返回指定字符在字符串中出现的最后一个位置脚标；

  ⑦split()：按某个字符串对当前字符串进行分离得到一个String[]；

  ⑧subString()：截取字符串;

  ⑨trim()：去除字符串的前后空格。

- **与基本数据类型、包装类之间的转换**

（1）基本数据类型、包装类 ---> String：

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①+"" ②String.valueOf();

（2）String ---> 基本数据类型、包装类：

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;调用包装类的parseXxx(String s)。

- **与字节数组 byte[] 之间的转换**

  （1）String ---> byte[]：

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;调用 String 的 getBytes();

  （2）byte[] ---> String：

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;调用 String 的构造器：String s = new String(buffer);

- **与字符数组 char[] 之间的转换**

  （1）String ---> char[]：

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;调用 String 的 toCharArray()；

  （2）char[] ---> String：

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;调用 String 的构造器：String s = new String(cbuf);

> （二）StringBuffer 类与 StringBuilder 类

**常用方法**

①增：append(Xxx xxx)；

②删：delete(int startIndex,int endIndex)；

③改：setCharAt(int index,char ch) / replace(int startIndex,int endIndex,String str)；

④查：charAt(int index)；

⑤插：insert(int index，String str)；

⑥长度：length()；

⑦遍历：for + charAt()  /  toString()。

**对比**

String、StringBuffer、StringBuilder 三者的异同？

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;同：表示字符串相关的类；

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;异：String：不可变的字符串序列，底层使用 char[] 存储；

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;StringBuffer：可变的字符串序列，线程安全的，效率低，底层使用 char[] 存储；

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;StringBuilder：可变的字符串序列，线程不安全的，效率高（jdk 5），底层使用 char[] 存储。

```java
String: 类似看成数组
StringBuffer: 类似看成 Vector
StringBuilder:类似看成 ArrayList
String s1 = new String(); // new char[0];
String s2 = new String("abc"); // new char[]{'a','b','c'};
StringBuffer sb1 = new StringBuffer(); // new char[16]; 空参构造器的默认底层数组的长度为16。
sysout(sb1.length()); // 0
StringBuffer sb2 = new StringBuffer("abc"); // new char["abc".length() + 16]; char[0] = 'a',...String 作为形参的构造器，底层会创建一个 str.length() + 16 为长度的数组。
s2 += "def"; // 不可变性：创建一个新的字符串
sb2.append("def"); // char[3] = 'd',char[4] = 'e';char[5] = 'f';
...
// 如果底层数组存储新数据的空间不够，需要扩容：默认扩容为原来的数组长度的2倍+2.
// StringBuilder 类似于上述的 StringBuffer,只是 StringBuffer 在方法的声明上，使用了 synchronized
```

**【算法题】考查：①数组；②字符串。**

（1）"aaaabbbccccedaaabbfffeee"--->a7b5c4...

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;---->a4b34e1d1a3b2f3e3

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;---->返回当前字符串中首次出现一个的字符

（2）模拟一个 trim 方法，去除字符串两端的空格。 

（3）将一个字符串进行反转。将字符串中指定部分进行反转。比如“abcdefg”反转为”abfedcg” 

（4）获取一个字符串在另一个字符串中出现的次数。 

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;比如：获取 "ab" 在 "abkkcadkabkebfkabkskab" 中出现的次数

（5）获取两个字符串中最大相同子串。比如： 

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;str1 = "abcwerthelloyuiodef“;str2 = "cvhellobnm" 

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提示：将短的那个串进行长度依次递减的子串与较长的串比较。 

（6）对字符串中字符进行自然顺序排序。 

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提示： 

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1）字符串变成字符数组。 

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2）对数组排序，选择，冒泡，Arrays.sort(); 

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3）将排序后的数组变成字符串。

## 2. jdk8 之前的时间日期 API

- **获取系统当前时间**

  调用 System 类的静态方法：currentTimeMillis();（毫秒数）

- **Date 类**

  （1）java.util.Date

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①如何实例化？两个构造器：Date() / Date(long millis)；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②两个方法的调用：toString()：显示当前日期对应的年月日时分秒的信息；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;getTime()：获取指定日期对应的毫秒数；

  （2）java.sql.Date：

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;作为 util 下 Date类的子类，与数据库交互时，和数据表中的 Date 类型对应。

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①一个构造器：Date(long millis)；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②两个方法的调用：toString() / getTime()。

  ```java
  @Test
  public void test1() {
  	// 1.如何实例化 java.util.Date
  	Date date1 = new Date(); // 代表着系统当前时间
  	System.out.println(date1);
  		
  	Date date2 = new Date(545254352345L); // 代表着指定毫秒数对应的时间
  	System.out.println(date2);
  		
  	// 2.toString()：显示当前日期对应的年月日时分秒的信息
  	// getTime()：获取指定日期对应的毫秒数
      System.out.println(date1.toString()); // Wed Aug 11 13:52:58 CST 2021
  	System.out.println(date1.getTime());
  	System.out.println(date2.toString()); // Mon Apr 13 04:32:32 CDT 1987
  	System.out.println(date2.getTime());
  }
  
  @Test
  public void test2() {
  	// 1.如何实例化 java.sql.Date
  	java.sql.Date date1 = new java.sql.Date(5234523453245L);
  
  	// 2.常用方法：toString() / getTime()
  	System.out.println(date1);
  	System.out.println(date1.getTime());
  }
  ```

- **java.text.SimpleDateFormat：用于 Date 的格式化和解析**

  （1）格式化（format）：日期 ---> 字符串、文本；

  （2）解析（parse）：字符串、文本 ---> 日期。

  ```java
  // SimpleDateFormat 类的使用
  // 1.格式化：日期 ---> 字符串、文本
  SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
  String format = sdf.format(new Date(System.currentTimeMillis()));// 2020-04-17 11:02:48
  System.out.println(format);
  // 2.解析：字符串、文本 ---> 日期
  String time = "2020-04-17 11:02:48";
  Date parse = sdf.parse(time);
  System.out.println(parse);// Fri Apr 17 11:02:48 CST 2020
  // 练习：将字符串“1998-04-22”转换为 java.sql.Date 类的对象
  String str = "1998-04-22";
  SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
  Date date2 = sdf1.parse(str);
  System.out.println("date2: " + date2);
  java.sql.Date date3 = new java.sql.Date(date2.getTime());
  System.out.println("date3: " + date3);
  ```

- **Calendar 类：日历**

  ```java
  // Calendar类的使用
  Calendar calendar = Calendar.getInstance(); // 对应当前的时间
  // 常用操作
  // get()
  System.out.println(calendar.get(Calendar.DAY_OF_MONTH));
  System.out.println(calendar.get(Calendar.DAY_OF_WEEK));
  System.out.println(calendar.get(Calendar.DAY_OF_YEAR));
  // set()
  calendar.set(Calendar.DAY_OF_MONTH, 18);
  System.out.println(calendar.get(Calendar.DAY_OF_MONTH));
  // add()
  calendar.add(Calendar.DAY_OF_MONTH, -2); 	
  System.out.println(calendar.get(Calendar.DAY_OF_MONTH));
  // 与 Date 之间的转换
  Date time2 = calendar.getTime();
  calendar.setTime(time2);
  System.out.println(time2);
  ```

## 3. jdk8 中新时间日期 API

- **时间日期 API 的迭代**

  第一代：Date 类；

  第二代：使用 Calendar 替换 Date 类；

  第三代：java8 中新增时间日期API，存在于 java.time，以及相关子包下。

- **前两代存在的问题说明**

  ①可变性：像日期和时间这样的类型应该是不可变的；

  ②偏移性：Date 中的年份是从 1900 开始的，而月份是从 0 开始的；

  ③格式化：格式化只对 Date 用，而 Calendar 则不行；

  ④此外：它们都是线程安全的、不能处理闰秒等。

- **java8 中新的时间日期 API 的说明**

  java.time：包含值对象的基础包；

  java.time.chrono：提供对不同日历系统的访问；

  java.time.format：格式化和解析时间和日期；

  java.time.temporal：包括底层框架和扩展特性；

  java.time.zone：包含时区支持的类。

- **本地日期、本地时间、本地日期时间的使用：LocalDate / LocalTime / LocalDateTime**

  （1）可以理解为：替换Calendar；

  （2）常用方法

  |                             方法                             |                             说明                             |
  | :----------------------------------------------------------: | :----------------------------------------------------------: |
  |                 **now() / now(ZoneId zone)**                 |        静态方法，根据当前时间创建对象/指定时区的对象         |
  |                           **of()**                           |             静态方法，根据指定日期/时间创建对象              |
  |               getDayOfMonth() / getDayOfYear()               |            获得月份天数(1-31)/获得年份天数(1-366)            |
  |                        getDayOfWeek()                        |           获得星期几（返回一个 DayOfWeek 枚举值）            |
  |                          getMonth()                          |               获得月份，返回一个 Month 枚举值                |
  |                 getMonthValue() / getYear()                  |                   获得月份(1-12)/获得年份                    |
  |            getHour() / getMinute() / getSecond()             |               获得当前对象对应的小时、分钟、秒               |
  | withDayOfMonth() / withDayOfYear() / withMonth() / withYear() | 将月份天数、年份天数、月份、年份修改为指定的值并返回新的对象 |
  | plusDays() / plusWeeks() / plusMonths / plusYears / plusHours() |        向当前对象添加几天、几周、几个月、几年、几小时        |
  | minuteMonths() / minusWeeks() / minusDays() / minusYears() / minusHours() |         从当前对象减去几月、几周、几天、几年、几小时         |

- **时间点：Instant**

  （1）可以理解为：代表一个时间点。类似于 java.util.Date；

  （2）常用方法

  |               方法                |                             说明                             |
  | :-------------------------------: | :----------------------------------------------------------: |
  |             **now()**             |        静态方法，返回默认 UTC 时区的 Instant 类的对象        |
  | **ofEpochMilli(long epochMilli)** | 静态方法，返回在 1970-01-01 00:00:00 基础上加上指定毫秒数之后的 Instant 类的对象 |
  |        **toEpochMilli()**         |   返回 1970-01-01 00:00:00 到当前时间的毫秒数，即为时间戳    |
  |    atOffset(ZoneOffset offset)    |           结合即时的偏移来创建一个 OffsetDateTime            |

- **日期时间格式化类：DateTimeFormatter**

  类似于 SimpleDateFormat 类。

  自定义的格式：如：ofPattern(“yyyy-MM-dd hh:mm:ss”)

  ```java
  // java8 中新增的时间日期 API
  // DateTimeFormatter 类的使用（类似于 SimpleDateFormat 类）
  DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss");
  // 格式化：日期 ---> 字符串、文本
  LocalDateTime dateTime = LocalDateTime.now();
  String format2 = dtf.format(dateTime);
  System.out.println(format2);
  // 解析：字符串、文本 ---> 日期
  TemporalAccessor temporalAccessor = dtf.parse("2020-04-17 12:00:52");
  System.out.println(temporalAccessor);
  ```

## 4. jdk8 中的 Optional 类

> java.util.Optional 类

- **理解**

  ①为了解决 java 代码中对象的空指针问题；

  ②这是一个可以为 null 的容器对象。如果值存在则 isPresent() 方法会返回 true，调用 get() 方法会返回该对象。

- **常用方法**

  Optional.empty() : 创建一个空的 Optional 实例

  Optional.of(T t) : 创建一个 Optional 实例

  Optional.ofNullable(T t) : 若 t 不为 null,创建 Optional 实例,否则创建空实例

  isPresent() : 判断是否包含值

  T get() : 如果调用对象包含值，返回该值，否则抛异常

  orElse(T t) :  如果调用对象包含值，返回该值，否则返回t

  orElseGet(Supplier s) : 如果调用对象包含值，返回该值，否则返回 s 获取的值

  map(Function f) : 如果有值对其处理，并返回处理后的 Optional，否则返回 Optional.empty()

  flatMap(Function mapper) : 与 map 类似，要求返回值必须是 Optional

- **典型练习**

  能保证如下的方法执行中不会出现空指针的异常

  ```java
  // 使用 Optional
  public String getGirlName2(Man man) {
  	Optional<Man> op = Optional.ofNullable(man);
  		
  	Man man1 = op.orElse(new Man(new Girl("赵丽颖"))); // man1：一定非空
  		
  	Girl girl = man1.getGirl();
  	Optional<Girl> op1 = Optional.ofNullable(girl);
  		
  	Girl girl1 = op1.orElse(new Girl("苍老师")); // girl1:一定非空
  			
  	return girl1.getName();
  }
  ```

## 5. 其他类

- **Math类**

  java.lang.Math 提供了一系列静态方法用于科学计算，其方法的参数和返回值类型一般为 double 型；

  常用方法：

  ```java
  abs   绝对值
  
  acos,asin,atan,cos,sin,tan  三角函数
  
  sqrt   平方根
  
  pow(double a,doble b)   a 的 b 次幂
  
  log   自然对数
  
  exp   e 为底指数
  
  max(double a,double b)
  
  min(double a,double b)
  
  random()    返回 0.0 到 1.0 的随机数
  
  long round(double a)   double 型数据 a 转换为 long 型（四舍五入）
  
  toDegrees(double angrad)   弧度—>角度
  
  toRadians(double angdeg)   角度—>弧度
  ```

- **BigInteger类、BigDecimal类**

  BigInteger类：Integer 类作为 int 的包装类，能存储的最大整型值为 2的31次方 - 1，BigInteger 类的数值范围较 Integer类、Long 类的数值范围要大得多，可以支持任意精度的整数。

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;构造方法：

  ```java
  BigInteger(String val);
  ```

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;常用方法：

  ```java
  public BigInteger abs();
  
  public BigInteger add(BigInteger val);
  
  public BigInteger subtract(BigInteger val);
  
  public BigInteger multiply(BigInteger val);
  
  public BigInteger divide(BigInteger val);
  
  public BigInteger remainder(BigInteger val);
  
  public BigInteger pow(int exponent);
  
  public BigInteger[] divideAndRemainder(BigInteger val);
  ```
  
  BigDecimal类：一般的 Float 类和 Double 类可以用来做科学计算或工程计算，但在商业计算中，要求数字精度比较高，故用到 java.math.BigDecimal 类。BigDecimal 类支持任何精度的定点数。
  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;构造方法：
  
  ```java
  public BigDecimal(double val);
  public BigDecimal(String val);
  ```
  
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;常用方法：
  
  ```java
  public BigDecimal add(BigDecimal augend); // 加
  public BigDecimal subtract(BigDecimal subtrahend); // 减
  public BigDecimal multiply(BigDecimal multiplicand); // 乘
  public BigDecimal divide(BigDecimal divisor, int scale, int roundingMode); // 除
  ```
  
  