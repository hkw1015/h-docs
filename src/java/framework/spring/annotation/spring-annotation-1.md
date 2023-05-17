---
title: 组件注册
date: 2021-12-11
category: 常用框架
tag:
  - Spring 注解
---

## 1. 使用 @Configuration 和 @Bean 注解给容器中注册组件

**（1）准备：新建一个 maven 工程，添加 spring-context 和 lombok 的依赖**

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.20</version>
    <scope>compile</scope>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.3.5</version>
</dependency>
```

**（2）新建一个实体类**

```java
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Person {

    private String name;

    private int age;
}
```

**（3）新建一个配置类 MyConfig**

```java
/**
 * 配置类 == 配置文件
 */
@Configuration // 告诉 spring 这是一个配置类
public class MyConfig {

    @Bean // 给容器中注册一个 Bean，类型为返回值的类型，id 默认用方法名
    public Person person() {
        Person person = new Person();
        person.setAge(23);
        person.setName("黄康伟");
        return person;
    }
}
```

<font color="red">注：id 可以使用 @Bean 中的 value 属性设置</font>

**（4）测试**

```java
public static void main(String[] args) {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MyConfig.class);
	Person person = context.getBean(Person.class);
	System.out.println(person);

	String[] namesForType = context.getBeanNamesForType(Person.class);
	for (String name : namesForType) {
		System.out.println(name);
	}
}
```

![image-20211130231124272](http://img.hl1015.top/blog/image-20211130231124272.png)

## 2. 使用 @ComponentScan 注解自动扫描组件 & 指定扫描规则

**（1）新建 controller、service、dao 类**

![image-20211201205748458](http://img.hl1015.top/blog/image-20211201205748458.png)

**（2）在配置类上加上 @ComponentScan 注解**

![image-20211201205909115](http://img.hl1015.top/blog/image-20211201205909115.png)

<font color="red">注：</font>value 属性用来指定要扫描的包

**（3）引入测试包，测试获取所有容器中的 Bean 的名称**

```xml
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
    <scope>test</scope>
</dependency>
```

测试方法如下：

```java
@Test
public void test1() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MyConfig.class);
    String[] definitionNames = context.getBeanDefinitionNames();
    for (String name : definitionNames) {
        System.out.println(name);
    }
}
```

![image-20211201210130277](http://img.hl1015.top/blog/image-20211201210130277.png)

**（4）使用 excludeFilters 属性指定扫描的时候按照什么规则排除哪些组件**

![image-20211201210302243](http://img.hl1015.top/blog/image-20211201210302243.png)

再次运行上面的测试方法：

![image-20211201210503829](http://img.hl1015.top/blog/image-20211201210503829.png)

**（5）使用 includeFilters 属性指定扫描的时候按照什么规则只需要哪些组件**

<font color="red">注：</font>需要禁用默认的过滤规则，即将 userDefaultFilters 属性设置为 false

![image-20211201210827062](http://img.hl1015.top/blog/image-20211201210827062.png)

再次运行上面的测试方法：

![image-20211201210849806](http://img.hl1015.top/blog/image-20211201210849806.png)

**（6）使用 @ComponentScans 注解配置扫描规则策略组**

![image-20211201210955730](http://img.hl1015.top/blog/image-20211201210955730.png)

再次运行上面的测试方法：

![image-20211201211003634](http://img.hl1015.top/blog/image-20211201211003634.png)

**（7）自定义扫描规则，实现 TypeFilter 接口**

![image-20211201211040759](http://img.hl1015.top/blog/image-20211201211040759.png)

```java
/**
 * 自定义扫描规则
 */
public class MyTypeFilter implements TypeFilter {

    /**
     * @param metadataReader 读取到当前正在扫描的类的信息
     * @param metadataReaderFactory 可以获取到其他任何类信息
     * @return
     * @throws IOException
     */
    @Override
    public boolean match(MetadataReader metadataReader, MetadataReaderFactory metadataReaderFactory) throws IOException {
        // 获取当前类注解的信息
        AnnotationMetadata annotationMetadata = metadataReader.getAnnotationMetadata();
        // 获取当前正在扫描的类的类信息
        ClassMetadata classMetadata = metadataReader.getClassMetadata();
        // 获取当前类资源（类的路径）
        Resource resource = metadataReader.getResource();

        String className = classMetadata.getClassName();
        return className.contains("UserController") || className.contains("UserDao");
    }
}
```

再次运行上面的测试方法：

![image-20211201212809834](http://img.hl1015.top/blog/image-20211201212809834.png)

## 3. 使用 @Scope 注解设置组件作用域

- singleton：单实例的（默认值）
  - ioc 容器启动就会调用方法创建对象放到 ioc 容器中，以后每次获取就是直接从容器中拿（map.get())
- prototype：多实例的
  - ioc 容器启动并不会调用方法创建对象放在容器中，而是每次获取的时候才会调用方法创建对象
- request：同一次请求创建一个实例
- session：同一个 session 创建一个实例

```java
@Test
public void test2() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MyConfig.class);
    Person bean1 = context.getBean(Person.class);
    Person bean2 = context.getBean(Person.class);
    System.out.println(bean1.hashCode());
    System.out.println(bean2.hashCode());
    System.out.println(bean1 == bean2);
}
```

**（1）作用域为 singleton，即默认情况**

运行上面的测试方法：

![image-20211201213417148](http://img.hl1015.top/blog/image-20211201213417148.png)

**（2）作用域为 prototype**

![image-20211201213447248](http://img.hl1015.top/blog/image-20211201213447248.png)

再次运行上面的测试方法：

![image-20211201213653752](http://img.hl1015.top/blog/image-20211201213653752.png)

## 4. 使用 @Lazy 注解实现 Bean 懒加载

主要针对单实例 Bean：默认在容器启动时创建对象

懒加载：容器启动时不创建对象，第一次使用（获取）Bean 创建对象，并初始化

```java
@Test
public void test3() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MyConfig.class);
    System.out.println("ioc容器创建完成");
    Person bean = context.getBean(Person.class);
    System.out.println(bean);
}
```

**（1）未加 @Lazy 注解前**

![image-20211201213744402](http://img.hl1015.top/blog/image-20211201213744402.png)

运行上面的测试方法：

![image-20211201213814761](http://img.hl1015.top/blog/image-20211201213814761.png)

**（2）加上 @Lazy 注解后**

![img](http://img.hl1015.top/blog/clipboard.png)

再次运行上面的测试方法：

![image-20211201213939679](http://img.hl1015.top/blog/image-20211201213939679.png)

## 5. 使用 @Conditional 按照条件注册 Bean

按照一定的条件进行判断，满足条件时给容器中注册 Bean

![image-20211202210918099](http://img.hl1015.top/blog/image-20211202210918099.png)

- 用在类上时，表示满足当前条件时，当前类中配置的 Bean 注册才能生效
- 用在方法上时，表示满足当前条件时，当前方法对应的 Bean 注册才能生效

通过实现 Condition 接口，自定义两个条件类 WindowsCondition、LinuxCondition：

```java
public class WindowsCondition implements Condition {

    /**
     * @param conditionContext      判断条件能使用的上下文（环境）
     * @param annotatedTypeMetadata 注释信息
     * @return
     */
    @Override
    public boolean matches(ConditionContext conditionContext, AnnotatedTypeMetadata annotatedTypeMetadata) {
        // 1.能获取到 ioc 使用的 BeanFactory
        ConfigurableListableBeanFactory beanFactory = conditionContext.getBeanFactory();
        // 2.获取类加载器
        ClassLoader classLoader = conditionContext.getClassLoader();
        // 3.获取当前环境信息
        Environment environment = conditionContext.getEnvironment();
        // 4.获取到 Bean 定义的注册类
        BeanDefinitionRegistry registry = conditionContext.getRegistry();

        String property = environment.getProperty("os.name");
        if (property != null && property.contains("Windows")) return true;
        return false;
    }
}
```

```java
public class LinuxCondition implements Condition {

    @Override
    public boolean matches(ConditionContext conditionContext, AnnotatedTypeMetadata annotatedTypeMetadata) {
        String property = environment.getProperty("os.name");
        if (property != null && property.contains("linux")) return true;
        return false;
    }
}
```

**（1）将 @Condititional 注解标注在方法上**

```java
@Configuration
public class MyConfig1 {

    @Conditional({WindowsCondition.class})
    @Bean(value = "bill")
    public Person person01() {
        return new Person("Bill Gates", 62);
    }

    @Conditional({LinuxCondition.class})
    @Bean(value = "linus")
    public Person person02() {
        return new Person("Linus", 48);
    }
}
```

测试代码：

```java
@Test
public void test4() {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MyConfig1.class);
	ConfigurableEnvironment environment = context.getEnvironment();
	String property = environment.getProperty("os.name");
	System.out.println("当前系统：" + property);

	String[] beanNamesForType = context.getBeanNamesForType(Person.class);
	for (String beanName : beanNamesForType) {
		System.out.println(beanName);
	}
}
```

![image-20211202212502129](http://img.hl1015.top/blog/image-20211202212502129.png)

调整 VM 参数：

![image-20211202212542969](http://img.hl1015.top/blog/image-20211202212542969.png)

![image-20211202212627728](http://img.hl1015.top/blog/image-20211202212627728.png)

再次运行上面的测试代码：

![image-20211202212707988](http://img.hl1015.top/blog/image-20211202212707988.png)

**（2）将 @Condititional 注解标注在类上**

```java
@Conditional({LinuxCondition.class})
@Configuration
public class MyConfig1 {

    @Bean(value = "bill")
    public Person person01() {
        return new Person("Bill Gates", 48);
    }

    @Bean(value = "linus")
    public Person person02() {
        return new Person("Linus", 48);
    }
}
```

再次运行上面的测试代码：

![image-20211202212856904](http://img.hl1015.top/blog/image-20211202212856904.png)

## 6. 使用 @Import 给容器中快速导入一个组件

**（1）使用 @Bean 给容器中注册一个组件：**

```java
@Configuration
public class MyConfig2 {

    @Bean
    public Blue blue() {
        return new Blue();
    }
}
```

测试代码：

```java
@Test
public void test5() {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MyConfig2.class);

	String[] beanDefinitionNames = context.getBeanDefinitionNames();
	for (String beanName : beanDefinitionNames) {
		System.out.println(beanName);
	}
}
```

![image-20211203172919154](http://img.hl1015.top/blog/image-20211203172919154.png)

可以看到成功往 Spring IOC 容器中注册进了一个组件

**（2）使用 @Import 注解往容器中快速注册导入一个组件**

```java
@Configuration
@Import(value = Red.class)
public class MyConfig2 {

    @Bean
    public Blue blue() {
        return new Blue();
    }
}
```

再次运行上面的测试代码：

![image-20211204204206433](http://img.hl1015.top/blog/image-20211204204206433.png)

可以发现使用 @Import 导入的组件，id 默认是组件的全类名

我们也可以同时导入多个组件，@Import 注解的 value 属性中传入类型的数组，代码如下：

```java
@Configuration
@Import(value = {Red.class, Blue.class, Green.class})
public class MyConfig2 {
}
```

再次运行上面的测试代码：

![image-20211204204930781](http://img.hl1015.top/blog/image-20211204204930781.png)

上面演示的是使用 @Import 导入组件的**第一种方式：直接使用需要导入组件的 Class 对象**

![image-20211204205314641](http://img.hl1015.top/blog/image-20211204205314641.png)

使用 @Import 导入组件的**第二种方式：使用 ImportSelector 接口**，实现接口的 selectImports 方法，返回需要导入组件的全类名数组

```java
public class MyImportSelector implements ImportSelector {

    /**
     * @param importingClassMetadata 当前标注 @Import 注解的类的所有注解信息
     * @return 需要导入到容器中的组件全类名数组
     */
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        return new String[]{"com.hkw.annotation.entity.color.Blue",
                "com.hkw.annotation.entity.color.Green",
                "com.hkw.annotation.entity.color.White",
                "com.hkw.annotation.entity.color.Red"};
    }
}
```

```java
@Configuration
@Import(value = MyImportSelector.class)
public class MyConfig3 {
}
```

测试代码：

```java
@Test
public void test6() {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MyConfig3.class);

	String[] beanDefinitionNames = context.getBeanDefinitionNames();
	for (String beanName : beanDefinitionNames) {
		System.out.println(beanName);
	}
}
```

![image-20211204211030834](http://img.hl1015.top/blog/image-20211204211030834.png)

使用 @Import 导入组件的**第三种方式：使用 ImportBeanDefinitionRegistrar 接口**，实现接口的 registerBeanDefinitions 方法，通过手动注册的方式进行导入组件

```java
public class MyImportBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {

    /**
     * @param importingClassMetadata 当前标注 @Import 注解的类的所有注解信息
     * @param registry               BeanDefinition注册类：
     *                               把所有需要注册到容器中的 Bean 可以通过 BeanDefinitionRegistry 的 registerBeanDefinition 方法进行手工注册
     */
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        boolean definition1 = registry.containsBeanDefinition("com.hkw.annotation.entity.color.Blue");
        boolean definition2 = registry.containsBeanDefinition("com.hkw.annotation.entity.color.Green");
        if (definition1 && definition2) {
            // 指定 Bean 的定义信息（Bean 的类型、Bean 的作用域，。。。）
            RootBeanDefinition beanDefinition = new RootBeanDefinition(Person.class);
            // 注册一个 Bean，指定 bean 名
            registry.registerBeanDefinition("person", beanDefinition);
        }
    }
}
```

再次运行上面的测试代码：

![image-20211204212901540](http://img.hl1015.top/blog/image-20211204212901540.png)

## 7. 使用 FactoryBean 注册组件

```java
public class ColorFactoryBean implements FactoryBean<Color> {

    // 返回一个 Color 对象，这个对象会添加到容器中
    @Override
    public Color getObject() throws Exception {
        System.out.println("ColorFactoryBean---getObject()");
        return new Color();
    }

    @Override
    public Class<?> getObjectType() {
        return Color.class;
    }

    // true：单实例，在容器中就保存一份
    // false：多实例，每次获取都会创建一个新的 Bean
    @Override
    public boolean isSingleton() {
        return true;
    }
}
```

```java
@Configuration
public class MyConfig4 {

    @Bean
    public ColorFactoryBean colorFactoryBean() {
        return new ColorFactoryBean();
    }
}
```

测试代码：

```java
@Test
public void test7() {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MyConfig4.class);

	Object bean1 = context.getBean("colorFactoryBean");
	Object bean2 = context.getBean("colorFactoryBean");
    System.out.println("bean的类型：" + bean1.getClass());
	System.out.println(bean1 == bean2);
}
```

![image-20211204231148123](http://img.hl1015.top/blog/image-20211204231148123.png)

换成多实例：

![image-20211204231524554](http://img.hl1015.top/blog/image-20211204231524554.png)

再次运行上面的测试代码：

![image-20211204231656365](http://img.hl1015.top/blog/image-20211204231656365.png)

**通过加 & 前缀获取工厂 Bean 实例，而不是工厂 Bean 创建的对象的实例：**

```java
@Test
public void test7() {
	AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MyConfig4.class);

	Object bean1 = context.getBean("colorFactoryBean");
	Object bean2 = context.getBean("colorFactoryBean");
	System.out.println("bean的类型：" + bean1.getClass());
	System.out.println(bean1 == bean2);

	Object bean3 = context.getBean("&colorFactoryBean");
	System.out.println(bean3.getClass());
}
```

![image-20211204232634733](http://img.hl1015.top/blog/image-20211204232634733.png)

![image-20211204232354318](http://img.hl1015.top/blog/image-20211204232354318.png)

小结：①FactoryBean 默认获取到的是工厂 Bean 调用 getObject 创建的对象；②要获取工厂 Bean 本身，我们需要给 id 前面加一个 **&** 符号【例：&colorFactoryBean】

## 8. 总结给容器中注册组件的方式

**（1）包扫描（@ComponentScan） + 组件标注注解（@Controller / @Service / @Repository / @Component）【<font color="red">自己写的类</font>】**

**（2）@Bean【<font color="red">导入第三方包里的组件</font>】**

**（3）@Import【<font color="red">快速给容器中导入一个组件</font>】**

**（4）使用 Spring 提供的 FactoryBean（工厂 Bean）**

