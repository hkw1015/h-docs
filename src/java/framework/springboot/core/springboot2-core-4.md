---
title: 单元测试
date: 2021-09-08
category: 常用框架
tag:
  - SpringBoot 核心
---

## 1. JUnit 5 的变化

**<span style="color:red">SpringBoot 2.2.0 版本开始引入 JUnit 5 作为单元测试默认库</span>**

作为最新版本的 JUnit 框架，JUnit 5 和之前版本的 JUnit 框架有很大的不同，由三个不同子项目的几个不同模块组成。

> JUnit 5 = JUnit Platform + JUnit Jupiter + JUnit Vintage

**JUnit Platform**：JUnit Platform 是在 JVM 上启动测试框架的基础，不仅支持 JUnit 自制的测试引擎，其他测试引擎也都可以接入。

**JUnit Jupiter**：JUnit Jupiter 提供了 JUnit 5 的新的编程模型，是 JUnit 5 新特性的核心，内部包含了一个测试引擎，用于在 JUnit Platform 上运行。

**JUnit Vintage**：由于 JUnit 已经发展多年，为了照顾老的项目，JUnit Vintage 提供了兼容 JUnit 4.x , JUnit 3 的测试引擎。

![springboot-image38](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image38.png)

注意：

**SpringBoot 2.4 以上版本移除了默认对 Vintage 的依赖，如果需要兼容 JUnit 4 需要自行引入（不能使用 JUnit 4 的功能 @Test）**

**JUnit 5 ' s Vintage Engine Removed from `spring-boot-starter-test`，如果需要继续兼容 JUnit 4 需要自行引入 Vintage。**

```xml
<dependency>
    <groupId>org.junit.vintage</groupId>
    <artifactId>junit-vintage-engine</artifactId>
    <scope>test</scope>
    <exclusions>
        <exclusion>
            <groupId>org.hamcrest</groupId>
            <artifactId>hamcrest-core</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```



![image-20210908091635336](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210908091635336.png)



```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

现在：

```java
@SpringBootTest
class SpringBoot2BuildDemoApplicationTests {
	@Test
    void contextLoads() {}
}
```

以前：

```java
@SpringBootTest + @RunWith(SpringRunner.class)
```



`SpringBoot 整合 JUnit 以后`：

- 编写测试方法：@Test 标注（注意需要使用 JUnit5 版本的注解）
- JUnit 类具有 Spring 的功能，@Autowired，`@Transactional 标注测试方法，测试完成后自动回滚`

## 2. Junit 5 常用注解

JUnit 5 的注解与 JUnit 4 的注解有所变化

[https://junit.org/junit5/docs/current/user-guide/#writing-tests-annotations](https://junit.org/junit5/docs/current/user-guide/#writing-tests-annotations)

- **@Test**：表示方法是测试方法，但是与 JUnit 4 的 @Test 不同，它的职责非常单一不能声明任何属性，扩展的测试将会由 Jupiter 提供额外测试
- **@ParameterizedTest**：表示方法是参数化测试
- **`@RepeatedTest`**：表示方法可重复执行
- **@DisplayName**：为测试类或者测试方法设置`展示名称`
- **`@BeforeEach`**：表示在每个单元测试之前执行
- **@AfterEach**：表示在每个单元测试之后执行
- **`@BeforeAll`**：表示在所有单元测试之前执行
- **`@AfterAll`**：表示在所有单元测试之后执行
- **@Tag**：表示单元测试类别，类似于 JUnit 4 中的 @Categories
- **@Disabled**：表示测试类或测试方法不执行，类似于 JUnit 4 中的 @Ignore
- **`@Timeout`**：表示测试方法运行如果超过了指定时间将会返回错误
- **@ExtendWith**：为测试类或测试方法提供扩展类引用

```java
import org.junit.jupiter.api.Test; // 注意这里使用的是 jupiter 的 Test注解！！！

public class TestDemo {

    @Test
    @DisplayName("第一次测试")
    public void test() {
        System.out.println("hello world!");
    }
}
```

![image-20210908094438857](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210908094438857.png)

## 3. 断言（assertions）

断言（assertions）是测试方法中的核心部分，用来对测试需要满足的条件进行验证。**这些断言方法都是 org.junit.jupiter.api.Assertions 的静态方法**。

> **检查业务逻辑返回的数据是否合理；**
>
> **所有的测试方法运行结束以后，会有一个详细的测试报告。**

JUnit 5 内置的断言可以分成如下几个类别：

### 3.1 简单断言

用来对单个值进行简单的验证。如：

| 方法            | 说明                                 |
| --------------- | ------------------------------------ |
| assertEquals    | 判断两个对象或两个原始类型是否相等   |
| assertNotEquals | 判断两个对象或两个原始类型是否不相等 |
| assertSame      | 判断两个对象引用是否指向同一个对象   |
| assertNotSame   | 判断两个对象引用是否指向不同的对象   |
| assertTrue      | 判断给定的布尔值是否为 true          |
| assertFalse     | 判断给定的布尔值是否为 false         |
| assertNull      | 判断给定的对象引用是否为 null        |
| assertNotNull   | 判断给定的对象引用是否不为 null      |

```java
@Test
@DisplayName("simple assertion")
public void simple() {
	Assertions.assertEquals(3, 1 + 2, "simple math");
	Assertions.assertNotEquals(3, 1 + 1);

	Assertions.assertNotSame(new Object(), new Object());
	Object obj = new Object();
	Assertions.assertSame(obj, obj);

	Assertions.assertFalse(1 > 2);
	Assertions.assertTrue(1 < 2);

	Assertions.assertNull(null);
	Assertions.assertNotNull(new Object());
}
```

### 3.2 数组断言

通过 assertArrayEquals 方法来判断两个对象或原始类型的数组是否相等

```java
@Test
@DisplayName("array assertion")
public void array() {
	Assertions.assertArrayEquals(new int[]{1, 2}, new int[]{1, 2}); // 通过
	// Assertions.assertArrayEquals(new int[]{1, 2}, new int[]{2, 1}); // 不通过
}
```

### 3.3 组合断言

assertAll 方法接受多个 org.junit.jupiter.api.Executable 函数式接口的实例作为要验证的断言，可以通过 lambda 表达式很容易的提供这些断言

```java
@Test
@DisplayName("assert all")
public void all() {
	Assertions.assertAll("Math",
			() -> Assertions.assertEquals(2, 1 + 1),
			() -> Assertions.assertTrue(1 > 0)
	);
}
```

### 3.4 异常断言

在 JUnit4 时期，想要测试方法的异常情况时，需要用 **@Rule** 注解的 ExpectedException 变量还是比较麻烦的，而JUnit5 提供了一种新的断言方式 **Assertions.assertThrows()** ，配合函数式编程就可以进行使用

```java
@Test
@DisplayName("异常测试")
public void exceptionTest() {
	ArithmeticException exception = Assertions.assertThrows(
			// 扔出断言异常
			ArithmeticException.class, () -> System.out.println(1 % 0));
}
```

### 3.5 超时断言

JUnit 5 提供了 **Assertions.assertTimeout()** 为测试方法设置超时时间

```java
@Test
@DisplayName("超时测试")
public void timeoutTest() {
	// 如果测试方法时间超过 1s 将会异常
	Assertions.assertTimeout(Duration.ofMillis(1000), () -> Thread.sleep(500));
}
```

### 3.6 快速失败

使用 fail 方法可以直接使测试方法失败

```java
@Test
@DisplayName("fail")
public void shouldFail() {
	Assertions.fail("This should fail");
}
```

## 4. 前置条件（assumptions）

JUnit 5 中的前置条件（**assumptions【假设】**）类似于断言，不同之处在于不满足的断言会使得测试方法失败，而**不满足的前置条件只会使得测试方法的执行终止**。前置条件可以看成是测试方法执行的前提，当该前提不满足时，就没有继续执行的必要。

```java
@DisplayName("前置条件")
public class AssumptionsTest {

    private final String environment = "DEV";

    @Test
    @DisplayName("simple")
    public void simpleAssume() {
        Assumptions.assumeTrue(Objects.equals(this.environment, "DEV"));
        Assumptions.assumeFalse(() -> Objects.equals(this.environment, "PROD"));
    }

    @Test
    @DisplayName("assume then do")
    public void assumeThenDo() {
        Assumptions.assumingThat(
                Objects.equals(this.environment, "DEV"),
                () -> System.out.println("In DEV")
        );
    }
}
```

assumeTrue 和 assumFalse 确保给定的条件为 true 或 false，不满足条件会使得测试执行终止。

assumingThat 的参数是表示条件的布尔值和对应的 Executable 接口的实现对象。只有条件满足时，Executable 对象才会被执行；当条件不满足时，测试执行并不会终止。

## 5. 嵌套测试

JUnit 5 可以通过 Java 中的内部类和 `@Nested` 注解实现嵌套测试，从而可以更好地把相关的测试方法组织在一起。在内部类中可以使用 @BeforeEach 和 @AfterEach 注解，而且嵌套的层次没有限制。

```java
@DisplayName("A stack")
class TestingAStackDemo {

    Stack<Object> stack;

    @Test
    @DisplayName("is instantiated with new Stack()")
    void isInstantiatedWithNew() {
        new Stack<>();
    }

    @Nested
    @DisplayName("when new")
    class WhenNew {

        @BeforeEach
        void createNewStack() {
            stack = new Stack<>();
        }

        @Test
        @DisplayName("is empty")
        void isEmpty() {
            Assertions.assertTrue(stack.isEmpty());
        }

        @Test
        @DisplayName("throws EmptyStackException when popped")
        void throwsExceptionWhenPopped() {
            Assertions.assertThrows(EmptyStackException.class, stack::pop);
        }

        @Test
        @DisplayName("throws EmptyStackException when peeked")
        void throwsExceptionWhenPeeked() {
            Assertions.assertThrows(EmptyStackException.class, stack::peek);
        }

        @Nested
        @DisplayName("after pushing an element")
        class AfterPushing {

            String anElement = "an element";

            @BeforeEach
            void pushAnElement() {
                stack.push(anElement);
            }

            @Test
            @DisplayName("it is no longer empty")
            void isNotEmpty() {
                Assertions.assertFalse(stack.isEmpty());
            }

            @Test
            @DisplayName("returns the element when popped and is empty")
            void returnElementWhenPopped() {
                Assertions.assertEquals(anElement, stack.pop());
                Assertions.assertTrue(stack.isEmpty());
            }

            @Test
            @DisplayName("returns the element when peeked but remains not empty")
            void returnElementWhenPeeked() {
                Assertions.assertEquals(anElement, stack.peek());
                Assertions.assertFalse(stack.isEmpty());
            }
        }
    }
}
```

## 6. 参数化测试

参数化测试是 JUnit5 很重要的一个新特性，它使得用不同的参数多次运行测试成为了可能，也为我们的单元测试带来许多便利。

利用 **@ValueSource** 等注解，指定入参，我们将可以使用不同的参数进行多次单元测试，而不需要每新增一个参数就新增一个单元测试，省去了很多冗余代码。

**@ValueSource**：为参数化测试指定入参来源，支持八大基础类以及 String 类型，Class 类型

**@NullSource**：表示为参数化测试提供一个 null 的入参

**@EnumSource**：表示为参数化测试提供一个枚举入参

**@CsvFileSource**：表示读取指定 CSV 文件内容作为参数化测试入参

**@MethodSource**：表示读取指定方法的返回值作为参数化测试入参（注意方法返回需要是一个流）

> 当然如果参数化测试仅仅只能做到指定普通的入参还达不到让我觉得惊艳的地步。让我真正感到他的强大之处的地方在于他可以支持外部的各类入参。如：CSV，YML，JSON 文件甚至方法的返回值也可以作为入参。只需要去实现 **ArgumentsProvider** 接口，任何外部文件都可以作为它的入参。

```java
@ParameterizedTest
@ValueSource(strings = {"one", "two", "three"})
@DisplayName("参数化测试1")
public void parameterizedTest1(String string) {
	System.out.println(string);
	Assertions.assertTrue(StringUtils.isNotBlank(string));
}

@ParameterizedTest
@MethodSource("method") // 指定方法名
@DisplayName("方法来源参数")
public void testWithExplicitLocalMethodSource(String name) {
	System.out.println(name);
	Assertions.assertNotNull(name);
}

static Stream<String> method() {
	return Stream.of("apple", "banana");
}
```

## 7. 迁移指南

在进行迁移的时候需要注意如下的变化：

- 注解在 org.junit.jupiter.api 包中，断言在 prg.junit.jupiter.api.Assertions 类中，前置条件在 org.junit.jupiter.api.Assumptions 类中
- 把 @Before 和 @After 替换成 @BeforeEach 和 @AfterEach
- 把 @BeforeClass 和 @AfterClass 替换成 @BeforeAll 和 @AfterAll
- 把 @Ignore 替换成 @Disabled
- 把 @Category 替换成 @Tag
- 把 @RunWith、@Rule 和 @ClassRule 替换成 @ExtendWith