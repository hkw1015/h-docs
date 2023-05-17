---
title: Web 开发
date: 2021-09-08
category: 常用框架
tag:
  - SpringBoot 核心
--- 

## 1. SpringMVC 自动配置概览

Spring Boot provides auto-configuration for Spring MVC that **works well with most applications.(大多场景我们都无需自定义配置)**
The auto-configuration adds the following features on top of Spring’s defaults:

- Inclusion of ContentNegotiatingViewResolver and BeanNameViewResolver beans.
  - 内容协商视图解析器和 BeanName 视图解析器
- Support for serving static resources, including support for WebJars (covered later [in this document](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.developing-web-applications.spring-mvc.static-content))).
  - 静态资源（包括 webjars ）
- Automatic registration of Converter, GenericConverter, and Formatter beans.
  - 自动注册 Converter，GenericConverter，Formatter 
- Support for HttpMessageConverters (covered later [in this document](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.developing-web-applications.spring-mvc.message-converters)).
  - 支持 HttpMessageConverters （后来我们配合内容协商理解原理）
- Automatic registration of MessageCodesResolver (covered later [in this document](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.developing-web-applications.spring-mvc.message-codes)).
  - 自动注册 MessageCodesResolver （国际化用）
- Static index.html support.
  - 静态 index.html 页支持
- Custom Favicon support (covered later [in this document](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#boot-features-spring-mvc-favicon)).
  - 自定义 Favicon  
- Automatic use of a ConfigurableWebBindingInitializer bean (covered later [in this document](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.developing-web-applications.spring-mvc.binding-initializer)).
  - 自动使用 ConfigurableWebBindingInitializer（DataBinder 负责将请求数据绑定到 JavaBean 上）

> If you want to keep those Spring Boot MVC customizations and make more MVC customizations (interceptors, formatters, view controllers, and other features), you can add your own @Configuration class of type WebMvcConfigurer but without @EnableWebMvc.
>
> 不用 @EnableWebMvc 注解。使用 @Configuration + WebMvcConfigurer 自定义规则

> If you want to provide custom instances of RequestMappingHandlerMapping, RequestMappingHandlerAdapter, or ExceptionHandlerExceptionResolver, and still keep the Spring Boot MVC customizations, you can declare a bean of type WebMvcRegistrations and use it to provide custom instances of those components.
>
> 声明 WebMvcRegistrations 改变默认底层组件

> If you want to take complete control of Spring MVC, you can add your own @Configuration annotated with @EnableWebMvc, or alternatively add your own @Configuration-annotated DelegatingWebMvcConfiguration as described in the Javadoc of @EnableWebMvc.
>
> 使用 @EnableWebMvc + @Configuration + DelegatingWebMvcConfiguration 全面接管 SpringMVC

## 2. 简单功能分析

### 2.1 静态资源访问

#### 1、静态资源目录

只要静态资源放在类路径下：called `/static` (or `/public` or `/resources` or `/META-INF/resources`)

访问：当前项目根路径 / + 静态资源名

原理：静态映射 /**

> 请求进来，先去找 Controller 看能不能处理，不能处理的所有请求又都交给静态资源处理器，静态资源再找不到则响应 404 页面。

改变默认的静态资源路径

```yaml
spring:
  resources:
    static-locations: [classpath:/haha/]
```

#### 2、静态资源访问前缀

默认无前缀

```yaml
spring:
  mvc:
    static-path-pattern: /res/**
```

> 当前项目 + static-path-pattern + 静态资源名 = 静态资源文件夹下找

#### 3、webjar

自动映射 /webjar/**

https://www.webjars.org/

![image-20210830090847668](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210830090847668.png)

```xml
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>jquery</artifactId>
    <version>3.6.0</version>
</dependency>
```

访问地址：http://localhost:8080/webjars/jquery/3.6.0/jquery.js 后面地址要按照依赖里面的包路径

### 2.2 欢迎页支持

- 静态资源路径下：index.html

  - 可以配置静态资源路径
  - 但是不可以配置静态资源的访问前缀。否则导致 index.html 不能被默认访问

  ```yaml
  spring:
  #  mvc:
  #    static-path-pattern: /res/** 这个会导致 welcome page 功能失效
    resources:
      static-locations: [classpath:/haha/]
  ```

- controller 能处理 /index

### 2.3 自定义 `Favicon`

将 favicon.ico 放在静态资源目录下即可。

```yaml
spring:
#  mvc:
#    static-path-pattern: /res/** 这个会导致 Favicon 功能失效
```

### 2.4 静态资源配置原理

- SpringBoot 启动默认加载 XxxAutoCinfiguration 类（自动配置类）

- SpringMVC 功能的自动配置类 WebMvcAutoCinfiguration 生效

  ```java
  @Configuration(proxyBeanMethods = false)
  @ConditionalOnWebApplication(type = Type.SERVLET)
  @ConditionalOnClass({Servlet.class, DispatcherServlet.class, WebMvcConfigurer.class})
  @ConditionalOnMissingBean({WebMvcConfigurationSupport.class})
  @AutoConfigureOrder(-2147483638)
  @AutoConfigureAfter({DispatcherServletAutoConfiguration.class, TaskExecutionAutoConfiguration.class, ValidationAutoConfiguration.class})
  public class WebMvcAutoConfiguration {
  ```

- 给容器中配置了什么

  ```java
  @Configuration(proxyBeanMethods = false)
  @Import({WebMvcAutoConfiguration.EnableWebMvcConfiguration.class})
  @EnableConfigurationProperties({WebMvcProperties.class, ResourceProperties.class, WebProperties.class})
  @Order(0)
  public static class WebMvcAutoConfigurationAdapter implements WebMvcConfigurer, ServletContextAware {
  ```

- 配置文件的相关属性和 XxxProperties 进行了绑定。

  - WebMvcProperties == **spring.mvc**
  - ResourceProperties == **spring.resources**



#### 1、配置类只有一个有参构造器

```java
// 有参构造器中的所有参数的值都会从容器中确定
// ResourceProperties resourceProperties：获取和 spring.resources 绑定的所有的值的对象
// WebProperties webProperties：获取和 spring.mvc 绑定的所有的值的对象
// ListableBeanFactory beanFactory：Spring 的 beanFactory
// HttpMessageConverters：找到所有的 HttpMessageConverters
// ResourceHandlerRegistrationCustomizer：找到 资源处理器的自定义器
// ServletRegistrationBean：给应用注册 Servlet、Filter、......
public WebMvcAutoConfigurationAdapter(ResourceProperties resourceProperties, 
	WebProperties webProperties, 
	WebMvcProperties mvcProperties, 
	ListableBeanFactory beanFactory, 
	ObjectProvider<HttpMessageConverters> messageConvertersProvider, 
	ObjectProvider<WebMvcAutoConfiguration.ResourceHandlerRegistrationCustomizer> resourceHandlerRegistrationCustomizerProvider, 
	ObjectProvider<DispatcherServletPath> dispatcherServletPath, 
	ObjectProvider<ServletRegistrationBean<?>> servletRegistrations) {
	this.resourceProperties = (Resources)(resourceProperties.hasBeenCustomized() ? resourceProperties : webProperties.getResources());
	this.mvcProperties = mvcProperties;
	this.beanFactory = beanFactory;
	this.messageConvertersProvider = messageConvertersProvider;
	this.resourceHandlerRegistrationCustomizer = (WebMvcAutoConfiguration.ResourceHandlerRegistrationCustomizer)resourceHandlerRegistrationCustomizerProvider.getIfAvailable();
	this.dispatcherServletPath = dispatcherServletPath;
	this.servletRegistrations = servletRegistrations;
	this.mvcProperties.checkConfiguration();
}
```

#### 2、资源处理的默认规则

```java
public void addResourceHandlers(ResourceHandlerRegistry registry) {
	if (!this.resourceProperties.isAddMappings()) {
		logger.debug("Default resource handling disabled");
	} else {
        // webjars 的规则
		this.addResourceHandler(registry, "/webjars/**", "classpath:/META-INF/resources/webjars/");
		this.addResourceHandler(registry, this.mvcProperties.getStaticPathPattern(), (registration) -> {
			registration.addResourceLocations(this.resourceProperties.getStaticLocations());
			if (this.servletContext != null) {
				ServletContextResource resource = new ServletContextResource(this.servletContext, "/");
				registration.addResourceLocations(new Resource[]{resource});
			}

		});
	}
}
```

```yaml
spring:
  resources:
    add-mappings: false # 禁用所有静态资源规则
```

```java
@ConfigurationProperties(prefix = "spring.resources",ignoreUnknownFields = false)
public class ResourceProperties extends Resources {
    
	...
	
    public String[] getStaticLocations() {
        return super.getStaticLocations();
    }

==============================================================================================
public static class Resources {
	private static final String[] CLASSPATH_RESOURCE_LOCATIONS = new String[]{"classpath:/META-INF/resources/", "classpath:/resources/", "classpath:/static/", "classpath:/public/"};
	private String[] staticLocations;
	
    ...

	public Resources() {
		this.staticLocations = CLASSPATH_RESOURCE_LOCATIONS;
		this.addMappings = true;
		this.customized = false;
		this.chain = new WebProperties.Resources.Chain();
		this.cache = new WebProperties.Resources.Cache();
	}

	public String[] getStaticLocations() {
		return this.staticLocations;
	}
```

#### 3、欢迎页的处理规则

WebMvcAutoConfiguration 类下注册了：

```java
// HandlerMapping：处理器映射器，保存了每一个 Handler 能处理哪些请求。
@Bean
public WelcomePageHandlerMapping welcomePageHandlerMapping(ApplicationContext applicationContext, FormattingConversionService mvcConversionService, ResourceUrlProvider mvcResourceUrlProvider) {
	WelcomePageHandlerMapping welcomePageHandlerMapping = new WelcomePageHandlerMapping(new TemplateAvailabilityProviders(applicationContext), applicationContext, this.getWelcomePage(), this.mvcProperties.getStaticPathPattern());
	welcomePageHandlerMapping.setInterceptors(this.getInterceptors(mvcConversionService, mvcResourceUrlProvider));
	welcomePageHandlerMapping.setCorsConfigurations(this.getCorsConfigurations());
	return welcomePageHandlerMapping;
}
```

WelcomePageHandlerMapping 的构造器：

```java
WelcomePageHandlerMapping(TemplateAvailabilityProviders templateAvailabilityProviders, ApplicationContext applicationContext, Resource welcomePage, String staticPathPattern) {
	// 要用欢迎页功能，必须是 /**
	if (welcomePage != null && "/**".equals(staticPathPattern)) {
		logger.info("Adding welcome page: " + welcomePage);
		this.setRootViewName("forward:index.html");
	} else if (this.welcomeTemplateExists(templateAvailabilityProviders, applicationContext)) {
		// 调用 Controller  /index
		logger.info("Adding welcome page template: index");
		this.setRootViewName("index");
	}
}
```

## 3. 请求参数处理

### 3.1 请求映射

#### 3.1.1 Rest 使用与原理

##### 1、Rest 使用

- `@XxxMapping`

- Rest 风格支持（使用 HTTP 请求方式动词来表示对资源的操作）

  - 以前：/getUser 获取用户 /deleterUser 删除用户 /editUser 修改用户 /saveUser 保存用户

  - `现在：/user GET-获取用户 DELETE-删除用户 PUT-修改用户 POST-保存用户`

  - 核心 Filter：HiddenHttpMethodFilter

  - 用法：表单 method=post，隐藏域 _method=put

  - SpringBoot 中`手动开启`

    ```java
    @Bean
    @ConditionalOnMissingBean(HiddenHttpMethodFilter.class)
    // 默认页面表单隐藏域提交的方式是关闭的
    @ConditionalOnProperty(prefix = "spring.mvc.hiddenmethod.filter", name = "enabled", matchIfMissing = false)
    public OrderedHiddenHttpMethodFilter hiddenHttpMethodFilter() {
    	return new OrderedHiddenHttpMethodFilter();
    }
    ```

    ```yaml
    spring:
      mvc:
        hiddenmethod:
          filter:
            enabled: true # 手动开启页面表单的 Rest 功能
    ```

  - 扩展：如何把 _method 这个名字换成我们自己喜欢的

    ```java
    // 自定义 Filter
    @Bean
    public HiddenHttpMethodFilter hiddenHttpMethodFilter(){
    	HiddenHttpMethodFilter methodFilter = new HiddenHttpMethodFilter();
    	methodFilter.setMethodParam("_m");
    	return methodFilter;
    }
    ```

##### 2、Rest 原理

> 场景：表单提交要使用 Rest 的时候

- 表单提交会带上 **_method=PUT**
- **请求过来被** `HiddenHttpMethodFilter` **拦截**
  - 请求是否正常、并且是 POST
    - 获取到 **_mehtod** 的值
    - 兼容以下请求：**PUT、DELETE、PATCH**
    - **原生 request（post），包装模式 requestWrapper 重写了 getMethod 方法，返回的值是传入的值**
    - **过滤器链放行的时候用 wrapper，以后的方法调用 getMethod 是调用 requestWrapper 的**

> **Rest 使用客户端工具** --- 如 Postman 可以直接发送 PUT、DELETE 等方式请求，无需 Filter

#### 3.1.2 请求映射原理

![image-20210831132109265](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210831132109265.png)

> SpringMVC 功能分析都从 org.springframework.web.servlet.DispatcherServlet ---》doDispatch()

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
	HttpServletRequest processedRequest = request;
	HandlerExecutionChain mappedHandler = null;
	boolean multipartRequestParsed = false;
	WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);

	try {
		try {
			ModelAndView mv = null;
			Object dispatchException = null;

			try {
				processedRequest = this.checkMultipart(request);
				multipartRequestParsed = processedRequest != request;
				// 找到当前请求使用哪个 Handler（Controller 的方法）处理
				mappedHandler = this.getHandler(processedRequest);
				// HandlerMapping：处理器映射器。/xxx --> xxx
```

![image-20210831134140029](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210831134140029.png)

`RequestMappingHandlerMapping`：保存了所有 @RequestMapping 和 handler 的映射规则

```java
@RestController
public class HelloController {

    @GetMapping("/user")
    public String getUser() {
        return "hkw - get 请求";
    }

    @PostMapping("/user")
    public String postUser() {
        return "hkw - post 请求";
    }

    @PutMapping("/user")
    public String putUser() {
        return "hkw - put 请求";
    }

    @DeleteMapping("/user")
    public String deleteUser() {
        return "hkw - delete 请求";
    }
}
```

![image-20210831140106182](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210831140106182.png)

所有的请求映射都在 HandlerMapping 中：

- SpringBoot 自动配置欢迎页的 WelcomePageHandlerMapping，访问 / 能访问到 index.html
- SpringBoot 自动配置了默认的 RequestMappingHandlerMapping
- 请求进来，挨个尝试所有的 HandlerMapping 看是否有请求信息
  - 如果有就找到这个请求对应的 handler
  - 如果没有就是下一个 handlerMapping
- 我们需要一些自定义的映射处理，我们也可以自己给容器中放 `HandlerMapping`（**自定义 HandlerMapping**）。

### 3.2 普通参数与基本注解

#### 3.2.1 注解

`@PathVariable、@RequestHeader、@ModelAttribute、@RequestParam、@MatrixVariable、@CookieValue、@RequestBody`

```java
// 常用参数注解 使用
@ResponseBody
@GetMapping("/test1/{id}/owner/{username}")
public Map<String, Object> test1(@PathVariable("id") Integer id,
								 @PathVariable("username") String name,
								 @PathVariable Map<String, Object> pv,
								 @RequestHeader("User-Agent") String userAgent,
								 @RequestHeader Map<String, String> header,
								 @RequestParam("age") Integer age,
								 @RequestParam("inters") List<String> inters,
								 @RequestParam Map<String, Object> params,
								 @CookieValue("Admin-Token") String token,
								 @CookieValue("Admin-Token") Cookie cookie) {
	Map<String, Object> map = new HashMap<>();
	map.put("id", id);
	map.put("name", name);
	map.put("pv", pv);
	map.put("userAgent", userAgent);
	map.put("headers", header);
	map.put("age", age);
	map.put("inters", inters);
	map.put("params", params);
	map.put("token", token);
	System.out.println(cookie.getName() + "===>" + cookie.getValue());
	return map;
}

@ResponseBody
@PostMapping("/save")
public Map save(@RequestBody User user) {
	Map<String, Object> map = new HashMap<>();
	map.put("user", user);
	return map;
}
```

```java
// @RequestAttribute 使用
@GetMapping("/gotoPage")
public String gotoPage(HttpServletRequest request) {
	request.setAttribute("msg", "hkw666");
	return "forward:success";
}

@ResponseBody
@GetMapping("/success")
public Map success(@RequestAttribute("msg") String msg, HttpServletRequest request) {
	Map map = new HashMap();
	Object msg1 = request.getAttribute("msg");
	map.put("msg_from_request", msg1);
	map.put("msg_from_annotation", msg);
	return map;
}

```

```java
// 1、语法： 请求路径：/cars/sell;low=34;brand=byd,audi,yd
// 2、SpringBoot 默认是禁用了矩阵变量的功能
//      手动开启：
//      原理：对于路径的处理。UrlPathHelper 进行解析。
//           removeSemicolonContent（移除分号内容）支持矩阵变量的
// 3、矩阵变量必须有 url 路径变量才能被解析
@ResponseBody
@GetMapping("/cars/{path}")
public Map carsSell(@MatrixVariable("low") Integer low,
					@MatrixVariable("brand") List<String> brand,
					@PathVariable("path") String path) {
	Map<String, Object> map = new HashMap<>();
	map.put("low", low);
	map.put("brand", brand);
	map.put("path", path);
	return map;
}

===============================手动开启==============================
@Configuration
public class MyConfig implements WebMvcConfigurer {

    /*@Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void configurePathMatch(PathMatchConfigurer configurer) {
                UrlPathHelper urlPathHelper = new UrlPathHelper();
                urlPathHelper.setRemoveSemicolonContent(false);
                configurer.setUrlPathHelper(urlPathHelper);
            }
        };
    }*/

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        UrlPathHelper urlPathHelper = new UrlPathHelper();
        // 不移除;后面的内容。矩阵变量功能就可以生效
        urlPathHelper.setRemoveSemicolonContent(false);
        configurer.setUrlPathHelper(urlPathHelper);
    }
}
==============================手动开启==============================

// /boss/1;age=20/2;age=10
@ResponseBody
@GetMapping("/boss/{bossId}/{empId}")
public Map boss(@MatrixVariable(value = "age", pathVar = "bossId") Integer bossAge,
				@MatrixVariable(value = "age", pathVar = "empId") Integer empAge) {
	Map<String, Object> map = new HashMap<>();
	map.put("bossAge", bossAge);
	map.put("empAge", empAge);
	return map;
}
```

#### 3.2.2 Servlet API

`WebRequest、ServletRequest、MultipartRequest、 HttpSession、javax.servlet.http.PushBuilder、Principal、InputStream、Reader、HttpMethod、Locale、TimeZone、ZoneId`

 **底层使用 `ServletRequestMethodArgumentResolver`  解析以上的参数**

```java
@Override
public boolean supportsParameter(MethodParameter parameter) {
	Class<?> paramType = parameter.getParameterType();
	return (WebRequest.class.isAssignableFrom(paramType) ||
			ServletRequest.class.isAssignableFrom(paramType) ||
			MultipartRequest.class.isAssignableFrom(paramType) ||
			HttpSession.class.isAssignableFrom(paramType) ||
			(pushBuilder != null && pushBuilder.isAssignableFrom(paramType)) ||
			Principal.class.isAssignableFrom(paramType) ||
			InputStream.class.isAssignableFrom(paramType) ||
			Reader.class.isAssignableFrom(paramType) ||
			HttpMethod.class == paramType ||
			Locale.class == paramType ||
			TimeZone.class == paramType ||
			ZoneId.class == paramType);
}
```

#### 3.2.3 复杂参数

`Map、Model（map、model里面的数据会被放在request的请求域  request.setAttribute）、Errors/BindingResult、RedirectAttributes（重定向携带数据）、ServletResponse（response）、SessionStatus、UriComponentsBuilder、ServletUriComponentsBuilder`

```java
Map<String,Object> map,  Model model, HttpServletRequest request 都是可以给request域中放数据，
request.getAttribute();
```

Map、Model 类型的参数，会返回 mavContainer.getModel(); ---> BindingAwareModelMap 是 Model 也是 Map
通过 mavContainer.getModel(); 获取到值

#### 3.2.4 自定义对象参数

可以自动类型转换与格式化，可以级联封装

```java
@Data
public class Person {
    private String userName;
    private Integer age;
    private Date birth;
    private Pet pet;

}

@Data
public class Pet {
    private String name;
    private String age;
}
```

### 3.3 POJO 封装过程

- **ServletModelAttributeMethodProcessor**

### 3.4 参数处理原理

- HandlerMapping 中找到能处理请求的Handler（Controller.method()）
- 为当前 Handler 找一个适配器 HandlerAdapter； **RequestMappingHandlerAdapter**

- 适配器执行目标方法并确定方法参数的每一个值

#### 3.4.1 HandlerAdapter

![springboot-image6](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image6.png)

0 - 支持方法上标注 @RequestMapping

1 - 支持函数式编程

xxxxxx

#### 3.4.2 执行目标方法

```java
// Actually invoke the handler.
// DispatcherServlet -- doDispatch
mv = ha.handle(processedRequest, response, mappedHandler.getHandler());
```

```java
mav = invokeHandlerMethod(request, response, handlerMethod); // 执行目标方法

// ServletInvocableHandlerMethod
Object returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);
// 获取方法的参数值
Object[] args = getMethodArgumentValues(request, mavContainer, providedArgs);
```

#### 3.4.3 参数解析器 - HandlerMethodArgumentResolver

确定将要执行的目标方法的每一个参数的值是什么；

SpringMVC 目标方法能写多少种参数类型，取决于参数解析器。

![springboot-image7](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image7.png)

![springboot-image8](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image8.png)

- 当前解析器是否支持这种参数
- 支持就调用 resolveArgument 方法

#### 3.4.4 返回值处理器

![springboot-image9](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image9.png)

#### 3.4.5 如何确定目标方法每一个参数的值

```java
============InvocableHandlerMethod==========================
protected Object[] getMethodArgumentValues(NativeWebRequest request, @Nullable ModelAndViewContainer mavContainer,
		Object... providedArgs) throws Exception {

	MethodParameter[] parameters = getMethodParameters();
	if (ObjectUtils.isEmpty(parameters)) {
		return EMPTY_ARGS;
	}

	Object[] args = new Object[parameters.length];
	for (int i = 0; i < parameters.length; i++) {
		MethodParameter parameter = parameters[i];
		parameter.initParameterNameDiscovery(this.parameterNameDiscoverer);
		args[i] = findProvidedArgument(parameter, providedArgs);
		if (args[i] != null) {
			continue;
		}
		if (!this.resolvers.supportsParameter(parameter)) {
			throw new IllegalStateException(formatArgumentError(parameter, "No suitable resolver"));
		}
		try {
			args[i] = this.resolvers.resolveArgument(parameter, mavContainer, request, this.dataBinderFactory);
		}
		catch (Exception ex) {
			// Leave stack trace for later, exception may actually be resolved and handled...
			if (logger.isDebugEnabled()) {
				String exMsg = ex.getMessage();
				if (exMsg != null && !exMsg.contains(parameter.getExecutable().toGenericString())) {
					logger.debug(formatArgumentError(parameter, exMsg));
				}
			}
			throw ex;
		}
	}
	return args;
}
```

**（1）挨个判断所有的参数解析器哪个支持解析这个参数**

```java
@Nullable
private HandlerMethodArgumentResolver getArgumentResolver(MethodParameter parameter) {
	HandlerMethodArgumentResolver result = this.argumentResolverCache.get(parameter);
	if (result == null) {
		for (HandlerMethodArgumentResolver resolver : this.argumentResolvers) {
			if (resolver.supportsParameter(parameter)) {
				result = resolver;
				this.argumentResolverCache.put(parameter, result);
				break;
			}
		}
	}
	return result;
}
```

**（2）解析这个参数的值**

```java
调用各自 HandlerMethodArgumentResolver 的 resolveArgument 方法即可
```

**（3）自定义类型参数 封装 POJO**

`--- ServletModelAttributeMethodProcessor  这个参数处理器支持`

```java
// 判断是否为简单类型
public static boolean isSimpleValueType(Class<?> type) {
	return (Void.class != type && void.class != type &&
			(ClassUtils.isPrimitiveOrWrapper(type) ||
			Enum.class.isAssignableFrom(type) ||
			CharSequence.class.isAssignableFrom(type) ||
			Number.class.isAssignableFrom(type) ||
			Date.class.isAssignableFrom(type) ||
			Temporal.class.isAssignableFrom(type) ||
			URI.class == type ||
			URL.class == type ||
			Locale.class == type ||
			Class.class == type));
}
```

```java
@Override
@Nullable
public final Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
		NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {

	Assert.state(mavContainer != null, "ModelAttributeMethodProcessor requires ModelAndViewContainer");
	Assert.state(binderFactory != null, "ModelAttributeMethodProcessor requires WebDataBinderFactory");

	String name = ModelFactory.getNameForParameter(parameter);
	ModelAttribute ann = parameter.getParameterAnnotation(ModelAttribute.class);
	if (ann != null) {
		mavContainer.setBinding(name, ann.binding());
	}

	Object attribute = null;
	BindingResult bindingResult = null;

	if (mavContainer.containsAttribute(name)) {
		attribute = mavContainer.getModel().get(name);
	}
	else {
		// Create attribute instance
		try {
			attribute = createAttribute(name, parameter, binderFactory, webRequest);
		}
		catch (BindException ex) {
			if (isBindExceptionRequired(parameter)) {
				// No BindingResult parameter -> fail with BindException
				throw ex;
			}
			// Otherwise, expose null/empty value and associated BindingResult
			if (parameter.getParameterType() == Optional.class) {
				attribute = Optional.empty();
			}
			bindingResult = ex.getBindingResult();
		}
	}

	if (bindingResult == null) {
		// Bean property binding and validation;
		// skipped in case of binding failure on construction.
		WebDataBinder binder = binderFactory.createBinder(webRequest, attribute, name);
		if (binder.getTarget() != null) {
			if (!mavContainer.isBindingDisabled(name)) {
				bindRequestParameters(binder, webRequest);
			}
			validateIfApplicable(binder, parameter);
			if (binder.getBindingResult().hasErrors() && isBindExceptionRequired(binder, parameter)) {
				throw new BindException(binder.getBindingResult());
			}
		}
		// Value type adaptation, also covering java.util.Optional
		if (!parameter.getParameterType().isInstance(attribute)) {
			attribute = binder.convertIfNecessary(binder.getTarget(), parameter.getParameterType(), parameter);
		}
		bindingResult = binder.getBindingResult();
	}

	// Add resolved attribute and BindingResult at the end of the model
	Map<String, Object> bindingResultModel = bindingResult.getModel();
	mavContainer.removeAttributes(bindingResultModel);
	mavContainer.addAllAttributes(bindingResultModel);

	return attribute;
}
```

**WebDataBinder binder = binderFactory.createBinder(webRequest, attribute, name);**

**WebDataBinder：web 数据绑定器，将请求参数的值绑定到指定的 JavaBean 里面**

**WebDataBinder 利用它里面的 Converters 将请求数据转成指定的数据类型，再次封装到JavaBean中**

**GenericConversionService：在设置每一个值的时候，找它里面的所有 converter 那个可以将这个数据类型（request带来参数的字符串）转换到指定的类型（JavaBean -- Integer）**

**byte ---> file**

@FunctionalInterface **public interface** Converter<S, T>

![springboot-image11](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image11.png)

未来我们可以给 WebDataBinder 里面放自己的 Converter；

**private static final class** StringToNumber<T **extends** Number> **implements** Converter<String, T>

`自定义 Converter`

```java
//  WebMvcConfigurer 定制化 SpringMVC 的功能
@Bean
public WebMvcConfigurer webMvcConfigurer() {

		@Override
		public void addFormatters(FormatterRegistry registry) {
			registry.addConverter(new Converter<String, Pet>() {

				@Override
				public Pet convert(String source) {
					// 啊猫,3
					if(!StringUtils.isEmpty(source)){
						Pet pet = new Pet();
						String[] split = source.split(",");
						pet.setName(split[0]);
						pet.setAge(Integer.parseInt(split[1]));
						return pet;
					}
					return null;
				}
			});
		}
	};
}
```

#### 3.4.6 目标方法执行完成

将所有的数据都放在 **ModelAndViewContainer**：包含要去的页面地址 View，还包含 Model 数据。

![springboot-image12](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image12.png)

#### 3.4.7 处理派发结果

**processDispatchResult**(processedRequest, response, mappedHandler, mv, dispatchException);

renderMergedOutputModel(mergedModel, getRequestToExpose(request), response);

```java
InternalResourceView：
@Override
protected void renderMergedOutputModel(
		Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {

	// Expose the model object as request attributes.
	exposeModelAsRequestAttributes(model, request);

	// Expose helpers as request attributes, if any.
	exposeHelpers(request);

	// Determine the path for the request dispatcher.
	String dispatcherPath = prepareForRendering(request, response);

	// Obtain a RequestDispatcher for the target resource (typically a JSP).
	RequestDispatcher rd = getRequestDispatcher(request, dispatcherPath);
	if (rd == null) {
		throw new ServletException("Could not get RequestDispatcher for [" + getUrl() +
				"]: Check that the corresponding file exists within your web application archive!");
	}

	// If already included or response already committed, perform include, else forward.
	if (useInclude(request, response)) {
		response.setContentType(getContentType());
		if (logger.isDebugEnabled()) {
			logger.debug("Including [" + getUrl() + "]");
		}
		rd.include(request, response);
	}

	else {
		// Note: The forwarded resource is supposed to determine the content type itself.
		if (logger.isDebugEnabled()) {
			logger.debug("Forwarding to [" + getUrl() + "]");
		}
		rd.forward(request, response);
	}
}
```

```java
// 暴露模型作为请求域属性
// Expose the model object as request attributes.
exposeModelAsRequestAttributes(model, request);
```

```java
protected void exposeModelAsRequestAttributes(Map<String, Object> model, HttpServletRequest request) throws Exception {

	// 将 model 中的所有数据遍历挨个放在请求域中
	model.forEach((name, value) -> {
		if (value != null) {
			request.setAttribute(name, value);
		}
		else {
			request.removeAttribute(name);
		}
	});
}
```

## 4. 数据响应与内容协商

### 4.1 响应 JSON

#### 4.1.1 jackson.jar + @ResponseBody

![image-20210903082956930](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210903082956930.png)

![image-20210903083122685](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210903083122685.png)

给前端自动返回 JSON 数据

##### 1、返回值解析器

![springboot-image13](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image13.png)

```java
try {
	this.returnValueHandlers.handleReturnValue(returnValue, getReturnValueType(returnValue), mavContainer, webRequest);
}
```

```java
@Override
public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
		ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception {

	HandlerMethodReturnValueHandler handler = selectHandler(returnValue, returnType);
	if (handler == null) {
		throw new IllegalArgumentException("Unknown return value type: " + returnType.getParameterType().getName());
	}
	handler.handleReturnValue(returnValue, returnType, mavContainer, webRequest);
}
```

```java
RequestResponseBodyMethodProcessor  	
@Override
public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
		ModelAndViewContainer mavContainer, NativeWebRequest webRequest)
		throws IOException, HttpMediaTypeNotAcceptableException, HttpMessageNotWritableException {

	mavContainer.setRequestHandled(true);
	ServletServerHttpRequest inputMessage = createInputMessage(webRequest);
	ServletServerHttpResponse outputMessage = createOutputMessage(webRequest);

	// Try even with null return value. ResponseBodyAdvice could get involved.
	// 使用消息转换器进行写出操作
	writeWithMessageConverters(returnValue, returnType, inputMessage, outputMessage);
}
```

##### 2、返回值解析器原理

![springboot-image14](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image14.png)

（1）返回值处理器判断是否支持这种类型返回值 `supportsReturnType`

（2）返回值处理器调用 `handleReturnValue` 进行处理

（3）RequestResponseBodyMethodProcessor 可以处理返回值标了 @ResponseBody 注解的

​	**利用 MessageConverters 进行处理，将数据写为 json**

​	①内容协商（浏览器默认会以请求头的方式告诉服务器它能接收什么类型的数据）

​	②服务器最终根据自己自身的能力，决定服务器能生产出什么样内容类型的数据

​	③SpringMVC 会挨个遍历所有容器底层的 HttpMessageCoverter，看谁能处理？

```java
得到 MappingJackson2HttpMessageConverter 可以将对象写为 json
利用 MappingJackson2HttpMessageConverter 将对象转为 json 再写出去
```

![springboot-image15](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image15.png)

#### 4.1.2 SpringMVC 到底支持哪些返回值

```java
ModelAndView
Model
View
ResponseEntity 
ResponseBodyEmitter
StreamingResponseBody
HttpEntity
HttpHeaders
Callable
DeferredResult
ListenableFuture
CompletionStage
WebAsyncTask
有 @ModelAttribute 且为对象类型的
@ResponseBody 注解 ---> RequestResponseBodyMethodProcessor
```

#### 4.1.3 HttpMessageConverter 原理

##### 1、MessageConverter 规范

![springboot-image16](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image16.png)

HttpMessageConverter：看是否支持将此 Class 类型的对象，转为 MediaType 类型的数据

例子：Person 对象转为 JSON，或者将 JSON 转为 Person

##### 2、默认的 MessageConverter

![springboot-image17](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image17.png)

0 - 只支持Byte类型的
1 - String
2 - String
3 - Resource
4 - ResourceRegion
5 - DOMSource**.class** \ SAXSource**.class** \ StAXSource**.class** \StreamSource**.class** \Source**.class**
6 - MultiValueMap
7 - true 
8 - true
9 - 支持注解方式xml处理的。



**最终 MappingJackson2HttpMessageConverter 把对象转为 JSON（利用底层的 jackson 的 objectMapping 转换的）**

![springboot-image18](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image18.png)

### 4.2 内容协商

根据客户端接收能力不同，返回不同媒体类型的数据

#### 4.2.1 引入 xml 依赖

```xml
<dependency>
	<groupId>com.fasterxml.jackson.dataformat</groupId>
	<artifactId>jackson-dataformat-xml</artifactId>
</dependency>
```

#### 4.2.2 postman 分别测试返回 json 和 xml

只需要改变请求头中 Accept 字段。Http 协议中规定，告诉服务器客户端可以接收的数据类型。

![image-20210903210844433](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210903210844433.png)

#### 4.2.3 开启浏览器参数方式内容协商功能

为了方便内容协商，开启基于请求参数的内容协商功能。

```yaml
spring:
  mvc:
    contentnegotiation:
      favor-parameter: true # 开启请求参数内容协商模式
```

发送请求：

http://localhost:8080/test/user?format=json

![image-20210903212026938](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210903212026938.png)

http://localhost:8080/test/user?format=xml

![image-20210903212157506](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210903212157506.png)

![springboot-image19](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image19.png)

确定客户端接收什么样的内容类型

（1）`Parameter 策略优先确定是要返回 json 数据（获取请求头中的 format 的值）`

（2）最终进行内容协商`返回给客户端 json` 即可

#### 4.2.4 内容协商原理

（1）`判断当前响应头中是否已经有确定的媒体类型（MediaType）。

**（2）获取客户端（Postman、浏览器）支持接收的内容类型。（获取客户端 Accept 请求头字段）【application/xml】**

​	①**contentNegotiationManager 内容协商管理器 默认使用基于请求头的策略**

![springboot-image20](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image20.png)

​	②**HeaderContentNegotiatonStrategy 确定客户端可以接收的内容类型**



（3）遍历循环所有当前系统的 `MessageConverter`，看谁支持操作这个对象（Person）

（4）找到支持操作 Person 的 converter，把 converter 支持的媒体类型统计出来

（5）客户端需要【application.xml】，服务端能力-【10种-json、xml】

![springboot-image21](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image21.png)

（6）进行内容协商的最佳匹配媒体类型

（7）用 支持 将对象转为 最佳匹配类型的 converter，调用它进行转化

![springboot-image21](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image21.png)

导入了 jackson 处理 xml 的包，xml 的 converter 就会自动进来

```java
WebMvcConfigurationSupport
jackson2XmlPresent = ClassUtils.isPresent("com.fasterxml.jackson.dataformat.xml.XmlMapper", classLoader);

if (jackson2XmlPresent) {
	Jackson2ObjectMapperBuilder builder = Jackson2ObjectMapperBuilder.xml();
	if (this.applicationContext != null) {
		builder.applicationContext(this.applicationContext);
	}
	messageConverters.add(new MappingJackson2XmlHttpMessageConverter(builder.build()));
}
```

#### 4.2.5 自定义 MessageConverter

（1）`@ResponseBody 响应数据出去`，调用 **RequestResponseBodyMethodProcessor** 处理

（2）Processor 处理方法返回值，通过 **MessageConverter** 处理

（3）所有 **MessageCOnverter** 合起来可以支持各种媒体类型数据的操作（读、写）

（4）内容协商找到最终的 **MessageConverter**

SpringMVC 的什么功能，一个入口 --- 给容器中添加一个 WebMvcConfigurer

```java
/**
 * 自定义 Converter
 */
public class MyMessageConverter implements HttpMessageConverter<User> {

    @Override
    public boolean canRead(Class aClass, MediaType mediaType) {
        return false;
    }

    @Override
    public boolean canWrite(Class aClass, MediaType mediaType) {
        return aClass.isAssignableFrom(User.class);
    }

    @Override
    public List<MediaType> getSupportedMediaTypes() {
        return MediaType.parseMediaTypes("application/x-hkw");
    }

    @Override
    public User read(Class aClass, HttpInputMessage httpInputMessage) throws IOException, HttpMessageNotReadableException {
        return null;
    }

    @Override
    public void write(User user, MediaType mediaType, HttpOutputMessage httpOutputMessage) throws IOException, HttpMessageNotWritableException {
        // 自定义协议数据的导出
        String data = user.getName() + ";" + user.getAge();
        // 写出去
        OutputStream body = httpOutputMessage.getBody();
        body.write(data.getBytes());
    }
}
```

```java
@Configuration
public class MyConfig implements WebMvcConfigurer {

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(new MyMessageConverter());
    }
}
```

**有可能我们添加的自定义的功能会覆盖默认很多功能，导致一些默认的功能失效。**
**我们除了完全自定义外？SpringBoot有没有为我们提供基于配置文件的快速修改媒体类型功能？怎么配置呢？【提示：参照SpringBoot官方文档web开发内容协商章节】**

```yaml
spring:
  mvc:
    contentnegotiation:
      favor-parameter: true # 开启请求参数内容协商模式
      media-types: {hh: application/x-hkw} # 配置媒体类型匹配功能
```

![image-20210903235907194](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210903235907194.png)

![image-20210903235941647](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210903235941647.png)

## 5. 视图解析与模板引擎

视图解析：**SpringBoot 默认不支持 JSP，需要引入第三方模板引擎技术实现页面渲染。**

### 5.1 视图解析

#### 5.1.1 视图解析原理流程

（1）目标方法处理的过程中，所有数据都会被放在 **`ModelAndViewContainer`** 里面，**包括数据和视图地址**

（2）方法的参数是一个自定义类型对象（从请求参数中确定的），把它重新放在 **`ModelAndViewContainer`**

（3）**任何目标方法执行完成以后都会返回 ModelAndView（数据和视图地址）**

（4）**processDespatchResult 处理派发结果（页面该如何响应）**

```java
render(mv, request, response); 进行页面渲染逻辑
--- 根据方法的 String 返回值得到 View 对象【定义了页面的渲染逻辑】
	--- 1、所有的视图解析器尝试是否能根据当前返回值得到 View 对象
    --- 2、得到了 redirect:/main.html ---> Thymeleaf new RedirectView()
    --- 3、ContentNegotiationViewResolver 里面包含了下面所有的视图解析器，内部还是利用下面所有视图解析器得到视图对象。
    --- 4、view.render(mv.getModelInternal(), request, response); 视图对象调用自定义的 render 进行页面渲染工作
        --- RedirectView 如何渲染【重定向到一个页面】
        	①获取目标 url 地址
        	②response.sendRedirect(encodedURL);
```

```
视图解析：
	- 返回值以 forward: 开始：new InternalResourceView(forwardUrl); ---> 转发
	- request.getRequestDispatcher(path).forward(request, response);
	- 返回值以 redirect: 开始：new RedirectView() ---> render 就是重定向
	- 返回值是普通字符串：new ThymeleafView() ---> thymeleaf 模板渲染
```

![springboot-image23](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image23.png)

![springboot-image24](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image24.png)

### 5.2 模板引擎 - Thymeleaf

#### 5.2.1 thymeleaf 简介

Thymeleaf is a modern server-side Java template engine for both web and standalone environments, capable of processing HTML, XML, JavaScript, CSS and even plain text. --- **现代化、服务端 Java 模板引擎**

#### 5.2.2 基本语法

##### 1、表达式

|    名称    |  语法  |                用途                |
| :--------: | :----: | :--------------------------------: |
|  变量取值  | ${...} |  获取请求域、session 域、对象等值  |
|  选择变量  | *{...} |          获取上下文对象值          |
|    消息    | #{...} |           获取国际化等值           |
|    链接    | @{...} |              生成链接              |
| 片段表达式 | ~{...} | jsp:include 作用，引入公共页面片段 |

##### 2、字面量

文本值：**'one text' , 'Another one!'** , ... 

数字：**0 , 34 , 3.0 , 12.4** , ...

布尔值：**true , false**

空值：**null**

变量：one , two , ... 【变量不能有空格】

##### 3、文本操作

字符串拼接：+

变量替换：**|The name is ${name}|**

##### 4、数学运算

运算符：**+ , - , * , / , %**

##### 5、布尔运算

运算符：**and , or**

一元运算：**! , not**

##### 6、比较运算

比较：> , < , >= , <= (**gt , lt , ge, le**)

等式：== , != (**eq , ne**)

##### 7、条件运算

if-then：**(if) ? (then)**

if-then-else：**(if) ? (then) : (else)**

default：**(value) ?: (defaultvalue)**

##### 8、特殊操作

无操作：_

#### 5.2.3 设置属性值 -th:attr

设置单个值

```html
<form action="subscribe.html" th:attr="action=@{/subscribe}">
  <fieldset>
    <input type="text" name="email" />
    <input type="submit" value="Subscribe!" th:attr="value=#{subscribe.submit}"/>
  </fieldset>
</form>
```

设置多个值

```html
<img src="../../images/gtvglogo.png"  th:attr="src=@{/images/gtvglogo.png},title=#{logo},alt=#{logo}"/>
```

以上两个的代替写法 th:xxx

```html
<input type="submit" value="Subscribe!" th:value="#{subscribe.submit}"/>
<form action="subscribe.html" th:action="@{/subscribe}">
```

所有 H5 兼容的标签写法

[https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#setting-value-to-specific-attributes](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#setting-value-to-specific-attributes)

#### 5.2.4 迭代

```html
<tr th:each="prod : ${prods}">
	<td th:text="${prod.name}">Onions</td>
	<td th:text="${prod.price}">2.41</td>
	<td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
</tr>
```

```html
<tr th:each="prod,iterStat : ${prods}" th:class="${iterStat.odd}? 'odd'">
  <td th:text="${prod.name}">Onions</td>
  <td th:text="${prod.price}">2.41</td>
  <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
</tr>
```

##### 5.2.5 条件运算

```html
<a href="comments.html"
th:href="@{/product/comments(prodId=${prod.id})}"
th:if="${not #lists.isEmpty(prod.comments)}">view</a>
```

```html
<div th:switch="${user.role}">
  <p th:case="'admin'">User is an administrator</p>
  <p th:case="#{roles.manager}">User is a manager</p>
  <p th:case="*">User is some other thing</p>
</div>
```

#### 5.2.6 属性优先级

![image-20210904105513168](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210904105513168.png)

### 5.3 Thymeleaf 使用

#### 5.3.1 引入 starter

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

#### 5.3.2 自动配置好了 thymeleaf

```java
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(ThymeleafProperties.class)
@ConditionalOnClass({ TemplateMode.class, SpringTemplateEngine.class })
@AutoConfigureAfter({ WebMvcAutoConfiguration.class, WebFluxAutoConfiguration.class })
public class ThymeleafAutoConfiguration {...}
```

自动配置好的策略：

- 所有 thymeleaf 的配置值都在 **ThymeleafProperties**
- 配置好了 **SpringTemplateEngine**
- 配好了 **ThymeleafViewResolver**
- 我们只需要直接开发页面

```java
public static final String DEFAULT_PREFIX = "classpath:/templates/";

public static final String DEFAULT_SUFFIX = ".html";  // xxx.html
```

#### 5.3.3 页面开发

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<h1 th:text="${msg}">哈哈</h1>
<h2>
    <a href="www.hl1015.top" th:href="${link}">HL1015</a>
</h2>
</body>
</html>
```

### 5.4 构建后台管理系统

##### 5.4.1 项目创建

- thymeleaf、web-starter、devtools、lombok

##### 5.4.2 静态资源处理

- 自动配置好，我们只需要把所有静态资源放到 static 文件夹下

##### 5.4.3 路径构建

- th:action="@{/login}"

##### 5.4.4 模板抽取

- th:insert/replace/include

##### 5.4.5 页面跳转

```java
@PostMapping("/login")
public String main(User user, HttpSession session, Model model){

	if(StringUtils.hasLength(user.getUserName()) && "123456".equals(user.getPassword())){
		// 把登陆成功的用户保存起来
		session.setAttribute("loginUser",user);
		// 登录成功重定向到 main.html; 重定向防止表单重复提交
		return "redirect:/main.html";
	}else {
		model.addAttribute("msg", "账号密码错误");
		// 回到登录页面
		return "login";
	}
}
```

##### 5.4.6 数据渲染

```java
@GetMapping("/dynamic_table")
public String dynamic_table(Model model){
	// 表格内容的遍历
	List<User> users = Arrays.asList(new User("zhangsan", "123456"),
			new User("lisi", "123444"),
			new User("haha", "aaaaa"),
			new User("hehe ", "aaddd"));
	model.addAttribute("users",users);

	return "table/dynamic_table";
}
```

```java
<table class="display table table-bordered" id="hidden-table-info">
<thead>
<tr>
	<th>#</th>
	<th>用户名</th>
	<th>密码</th>
</tr>
</thead>
<tbody>
<tr class="gradeX" th:each="user,stats:${users}">
	<td th:text="${stats.count}">Trident</td>
	<td th:text="${user.userName}">Internet</td>
	<td >[[${user.password}]]</td>
</tr>
</tbody>
</table>
```

## 6. 拦截器

### 6.1 HandlerInterceptor 接口

```java
/**
 * 登录检查
 * 1、配置好拦截器要拦截哪些请求
 * 2、把这些配置放在容器中
 */
@Slf4j
public class LoginInterceptor implements HandlerInterceptor {

    /**
     * 目标方法执行之前
     * @param request
     * @param response
     * @param handler
     * @return
     * @throws Exception
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String requestURI = request.getRequestURI();
        log.info("preHandle 拦截的请求路径是{}", requestURI);

        // 登录检查逻辑
        HttpSession session = request.getSession();

        Object loginUser = session.getAttribute("loginUser");

        if(loginUser != null){
            // 放行
            return true;
        }

        // 拦截住，未登录，跳转到登录页
        request.setAttribute("msg", "请先登录");
		// re.sendRedirect("/");
        request.getRequestDispatcher("/").forward(request,response);
        return false;
    }

    /**
     * 目标方法执行完成以后
     * @param request
     * @param response
     * @param handler
     * @param modelAndView
     * @throws Exception
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        log.info("postHandle执行{}", modelAndView);
    }

    /**
     * 页面渲染以后
     * @param request
     * @param response
     * @param handler
     * @param ex
     * @throws Exception
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        log.info("afterCompletion执行异常{}", ex);
    }
}
```

### 6.2 配置拦截器

```java
/**
 * 1、编写一个拦截器实现 HandlerInterceptor 接口
 * 2、拦截器注册到容器中（实现 WebMvcConfigurer 的 addInterceptors）
 * 3、指定拦截规则【如果是拦截所有，静态资源也会被拦截】
 */
@Configuration
public class AdminWebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginInterceptor())
                .addPathPatterns("/**")  // 所有请求都被拦截包括静态资源
                .excludePathPatterns("/", "/login", "/css/**", "/fonts/**", "/images/**", "/js/**"); // 放行的请求
    }
}
```

### 6.3 拦截器原理

- 根据当前请求，找到 **HandlerExecutionChain**【可以处理请求的 handler 以及 handler 的所有拦截器】
- 先来 **顺序执行** 所有拦截器的 `preHandler` 方法
  - 如果当前拦截器 preHandler 返回 true，则执行下一个拦截器的 preHandler
  - 如果当前拦截器返回为 false，直接倒序执行所有已经执行了的拦截器的 afterCompletion 方法
- **如果任何一个拦截器返回为 false，直接跳出不执行目标方法**
- **所有拦截器都返回 true，执行目标方法**
- **倒序执行所有拦截器的 `postHandle` 方法**
- **前面的步骤有任何异常都会直接倒序触发 `afterCompletion` 方法**
- 页面成功渲染完成以后，也会倒序触发 afterCompletion 方法

![springboot-image25](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image25.png)

![springboot-image26](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image26.png)

## 7. 文件上传

### 7.1 页面表单

```html
<form method="post" action="/upload" enctype="multipart/form-data">
    <input type="file" name="file"><br>
    <input type="submit" value="提交">
</form>
```

### 7.2 文件上传代码

```java
/**
 * MultipartFile 自动封装上传过来的文件
 * @param email
 * @param username
 * @param headerImg
 * @param photos
 * @return
 */
@PostMapping("/upload")
public String upload(@RequestParam("email") String email,
					 @RequestParam("username") String username,
					 @RequestPart("headerImg") MultipartFile headerImg,
					 @RequestPart("photos") MultipartFile[] photos) throws IOException {

	log.info("上传的信息：email={},username={},headerImg={},photos={}", email, username, headerImg.getSize(), photos.length);

	if(!headerImg.isEmpty()){
		// 保存到文件服务器，OSS服务器
		String originalFilename = headerImg.getOriginalFilename();
		headerImg.transferTo(new File("H:\\cache\\" + originalFilename));
	}

	if(photos.length > 0){
		for (MultipartFile photo : photos) {
			if(!photo.isEmpty()){
				String originalFilename = photo.getOriginalFilename();
				photo.transferTo(new File("H:\\cache\\" + originalFilename));
			}
		}
	}

	return "main";
}
```

### 7.3 自动配置原理

**文件上传自动配置类-MultipartAutoConfiguration-MultipartProperties**

- 自动配置好了 **`StandardServletMultipartResolver【文件上传解析器】`**

- 原理步骤

  - **1、请求进来使用文件上传解析器判断**（isMultipart）**并封装**（resolveMultipart，返回 MultipartHttpServletRequest）**文件上传请求**
  - **2、参数解析器来解析请求中的文件内容封装成 MultipartFile**
  - **3、将 request 中文件信息封装为一个 Map：MultiValueMap<String, MultipartFile>**

  > **FileCopyUtils：实现文件流的拷贝**

## 8. 异常处理

### 8.1 错误处理

#### 8.1.1 默认规则

- 默认情况下，Spring Boot 提供 /error 处理所有错误的映射

- 对于机器客户端，它将生成 JSON 响应，其中包含错误，HTTP 状态和异常消息的详细信息。

  ![image-20210904132545589](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210904132545589.png)

- 对于浏览器客户端，响应一个 "whitelabel" 错误视图，以 HTML 格式呈现相同的数据

  ![image-20210904132610650](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210904132610650.png)

- **要对其进行自定义，添加 `View` 解析为 `error`**

- 要完全替换默认行为，可以实现 `ErrorController` 并注册该类型的 Bean 定义，或添加 `ErrorAttributes` 类型的组件 以使用现有机制来替换其内容

- error/ 下的 4xx，5xx 页面会被自动解析

  ![image-20210904133146949](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210904133146949.png)

#### 8.1.2 定制错误处理逻辑

- 自定义错误页

  - error/404.html、error/5xx.html，有精确的错误状态码就匹配精确，没有就找 4xx.html，如果都没有就触发白页

- @ControllerAdvice + @ExceptionHandler 处理全局异常，**底层是 ExceptionHandlerExceptionResolver 支持的**

- `@ResponseStatus + 自定义异常`，底层是 **ResponseStatusExceptionResolver，将 @ResponseStatus 注解的信息底层调用 response.sendError(statusCode, resolvedReason); tomcat 发送的 /error**

- `Spring 底层的异常，如 参数类型转换异常`。**DefaultHandlerExceptionResolver 处理框架底层的异常**

  - response.sendError(HttpServletResponse.**SC_BAD_REQUEST**, ex.getMessage());

- `自定义实现 HandlerExceptionResolver 处理异常`，可以`作为默认的全局异常处理规则`

  ![springboot-image27](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image27.png)

- **ErrorViewResolver 实现自定义处理异常**

  - response.sendError，error 请求就会转给 controller
  - 如果你的异常没有任何人能处理，tomcat 底层 response.sendError，error 请求就会转给 controller
  - **<span style="color:red">basicErrorController 要去的页面地址是</span> ErrorViewResolver**

#### 8.1.3 异常处理自动配置原理

- **ErrorMvcAutoConfiguration 自动配置异常处理规则**

  - **容器中的组件：类型 DefaultAttributes -> id：errorAttributes**

    - **public class <span style="color:red">DefaultAttributes</span> implements <span style="color:blue">ErrorAttributes</span> , <span style="color:blue">HandlerExceptionResolver</span>**
    - **DefaultErrorAttributes**：定义错误页面中可以包含哪些数据

    ![springboot-image28](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image28.png)

    ![springboot-image29](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image29.png)

  - **<span style="color:red">容器中的组件：类型：BasicErrorController --> id：basicErrorController（json + 白页 + 适配响应）</span>**

    - **处理默认 /error 路径的请求，页面响应** `new ModelAndView`("error", model);
    - **容器中有组件 `View` --> id 是 error**（响应默认错误页）
    - 容器中放组件 **BeanNameViewResolver（视图解析器），按照返回的视图名作为组件的 id 去容器中找 View 对象**

  - **容器中的组件**：类型：**`DefaultErrorViewResolver`** --> id：conventionErrorViewResolver

    - 如果发生错误，会以 HTTP 的状态码作为视图页地址（viewName），找到真正的页面
    - error/404、5xx.html

如果想要返回页面，就会找 error 视图【StaticView】。（默认是一个百页）

![springboot-image30](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image30.png)

#### 8.1.4 异常处理步骤流程

1. 执行目标方法，目标方法运行期间有任何异常都会被 catch、标志当前请求结束，并且用 `dispatchException`

2. 进入视图解析流程（页面渲染？）

   processDispatchResult(processedRequest, response, mappedHandler, **`mv`, <span style="color:red">dispatchException</span>**)

3. **mv = processHandlerException;** 处理 handler 发生的异常，处理完成返回 ModelAndView;

   1. 遍历所有的 **handlerExceptionResolvers，看谁能处理当前异常【<span style="color:red">HandlerExceptionResolver 处理器异常解析器</span>】**

      ![springboot-image31](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image31.png)

   2. **系统默认的 异常解析器**

      ![springboot-image34](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image34.png)

      1. **DefaultErrorAttributes `先来处理异常，把异常信息保存到 request 域，并且返回 null`**

      2. **`默认没有任何人能处理异常，所以异常会抛出`**

         1. **如果没有任何人能处理最终底层就会发送 /error 请求，会被底层的 BasicErrorController 处理**

         2. **解析错误视图，遍历所有的 ErrorViewResolver，看谁能解析**

            ![springboot-image35](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image35.png)

         3. **默认的 DefaultErrorViewResolver，作用是把响应状态码作为错误页的地址，error/500.html**

         4. **`模板引擎最终响应这个页面 error/500.html`**

## 9. Web 原生组件注入（Servlet、Filter、Listener）

### 9.1 使用 Servlet API

推荐如下方式：

@`ServletComponentScan(basePackages = "com.hkw.springboot2")`：指定原生 Servlet 组件都放在那里

@WebServlet(urlPatterns = "**/my**")：效果，直接响应，没有经过 Spring 的拦截器？

@WebFilter(urlPatterns = {**"/css/* " , "/images/* "**})

@WebListener



扩展：DispatcherServlet 如何注册进来？

- 容器中自动配置了 DispatcherServlet 属性绑定到 WebMvcProperties，对应的配置文件配置项是 **spring.mvc**
- **通过 ServletRegistrationBean**< DispatcherServlet> 把 DispatcherServlet 配置进来
- 默认映射的是 / 路径

![springboot-image36](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image36.png)

`Tomcat-Servlet`：

多个 Servlet 都能处理到同一层路径，精确优选原则

A：/my/

B：/my/1

### 9.2 使用 RegistrationBean

`ServletRegistrationBean` , `FilterRegistrationBean` and `ServletListenerRegistrationBean`

```java
@Configuration
public class MyRegistConfig {

    @Bean
    public ServletRegistrationBean myServlet(){
        MyServlet myServlet = new MyServlet();

        return new ServletRegistrationBean(myServlet,"/my","/my02");
    }


    @Bean
    public FilterRegistrationBean myFilter(){

        MyFilter myFilter = new MyFilter();
        // return new FilterRegistrationBean(myFilter,myServlet());
        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean(myFilter);
        filterRegistrationBean.setUrlPatterns(Arrays.asList("/my","/css/*"));
        return filterRegistrationBean;
    }

    @Bean
    public ServletListenerRegistrationBean myListener(){
        MySwervletContextListener mySwervletContextListener = new MySwervletContextListener();
        return new ServletListenerRegistrationBean(mySwervletContextListener);
    }
}
```



## 10. 嵌入式 Servlet 容器

### 10.1 切换嵌入式 Servlet 容器

- 默认支持的 webServer

  - Tomcat , Jetty or Undertow
  - ServletWebServerApplicationContext 容器启动寻找 ServletWebServerFactory 并引导创建服务器

- 切换服务器

  ![springboot-image37](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image37.png)

  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
      <exclusions>
          <exclusion>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-tomcat</artifactId>
          </exclusion>
      </exclusions>
  </dependency>
  ```

- 原理

  - SpringBoot 应用启动发现当前是 Web 应用，web 场景包 - `导入 tomcat`
  - web 应用会创建一个 web 版的 ioc 容器 `ServletWebServerApplicationContext`
  - `ServletWebServerApplicationContext` 启动的时候寻找 **`ServletWebServerFactory`**（`Servlet 的 web 服务器工厂 ---> Servlet 的 web 服务器`）
  - SpringBoot 底层默认有很多的 WebServer 工厂：`TomcatServletWebServerFactory , JettyServerWebServerFactory or UndertowServerWebServerFactory`
  - `底层直接会有一个自动配置类：ServletWebServerFactoryAutoConfiguration`
  - **ServletWebServerFactoryAutoConfiguration 导入了 ServletWebServerFactoryConfiguration（配置类）**
  - `ServletWebServerFactoryConfiguration 配置类 根据动态判断系统中到底导入了哪个 Web 服务器的包。（默认是 web-starter 导入 tomcat 包），容器中就有 TomcatServetWebServerFactory`
  - `TomcatServerWebServerFactory 创建出 Tomcat 服务器并启动，TomcatWebServer 的构造器拥有初始化方法 initialize --- this.tomcat.start();`
  - `内嵌服务器，就是手动把启动服务器的代码调用（tomcat 核心 jar 包存在）`

### 10.2 定制 Servlet 容器

- 实现 **WebServerFactoryCustomizer**< ConfigurationServletWebServerFactory>
  - 把配置文件的值和 ServletWebServerFactory 进行绑定
- 修改配置文件 **server.xxx**
- 直接自定义 **ConfigurableServletWebServerFactory**

**xxxCustomizer：定制化器，可以改变 xxx 的默认规则**

```java
@Component
public class CustomizationBean implements WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> {

    @Override
    public void customize(ConfigurableServletWebServerFactory server) {
        server.setPort(9000);
    }
}
```

## 11. 定制化原理

### 11.1 定制化的常见方式

- 修改配置文件

- **xxxCustomiizer**

- **编写自定义的配置类 xxxConfiguration + @Bean 替换、增加容器中默认组件、视图解析器**

- **<span style="color:red">Web 应用编写一个配置类实现 WebMvcConfiguration 即可定制化 web 功能 + @Bean 给容器中再扩展一些组件</span>**

  ```java
  @Configuration
  public class AdminWebConfig implements WebMvcConfigurer
  ```

- @EnableWebMvc + WebMvcConfiguration --- @Bean 可以全面接管 SpringMVC，所有规则全部自己重新配置，实现定制和扩展功能

  - WebMvcAutoConfiguration 是默认的 SpringMVC 的自动配置功能类。静态资源、欢迎页、......
  - 一旦使用 `@EnableWebMvc`。会 `@Import`(DelegatingWebMvcConfiguration.class)
  - **DelegatingWebMvcConfigurtaion** 的作用，只保证 SpringMVC 最基本的使用
    - 把所有系统中的 WebMvcConfigurer 拿过来，所有功能的定制都是这些 WebMvcConfigurer 合起来一起生效
    - 自动配置了一些非常底层的组件。**RequestMappingHandlerMapping**、这些组件依赖的组件都是从容器中获取
    - **public class** DelegatingWebMvcConfiguration **extends WebMvcConfigurationSupport**
  - **WebMvcAutoConfiguration** 里面的配置要能生效 必须 `@ConditionalOnMissingBean`**(WebMvcConfigurationSupport.class**)
  - `@EnableWebMvc 导致了` WebMvcAutoConfiguration 没有生效

- ......

### 11.2 原理分析套路

**<span style="color:red">场景 starter </span>--- xxxAutoConfiguration --- `导入 xxx 组件` --- 绑定 xxxProperties --- <span style="color:red">绑定配置文件项</span>**