---
title: 指标监控
date: 2021-09-08
category: 常用框架
tag:
  - SpringBoot 核心
---

## 1. SpringBoot Actuator

### 1.1 简介

未来每一个微服务在云上部署以后，我们都需要对其进行监控、追踪、审计、控制等。SpringBoot 就抽取了 Actuator 场景，使得我们每个微服务快速引用即可获得生产级别的应用监控、审计等功能。

### 1.2 1.x 与 2.x 的不同

![springboot-image39](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/springboot-image39.png)

### 1.3 如何使用

- 引入场景

  ```xml
  <dependency>
  	<groupId>org.springframework.boot</groupId>
  	<artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  ```

  ![image-20210908110617324](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210908110617324.png)

- 访问 http://localhost:8080/actuator/**

- 暴露所有监控信息为 HTTP

  ```yaml
  management:
    endpoints:
      enabled-by-default: true # 暴露所有端点信息
      web:
        exposure:
          include: '*'  # 以 web 方式暴露
  ```

- 测试

  ```http
  http://localhost:8080/actuator/beans
  http://localhost:8080/actuator/configprops
  http://localhost:8080/actuator/metrics
  http://localhost:8080/actuator/metrics/jvm.gc.pause
  ......
  ```

### 1.4 可视化

[https://github.com/codecentric/spring-boot-admin](https://github.com/codecentric/spring-boot-admin)

## 2. Actuator Endpoint

### 2.1 最常用的端点

| ID                 | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| `auditevents`      | 暴露当前应用程序的审核事件信息。需要一个`AuditEventRepository组件`。 |
| `beans`            | 显示应用程序中所有 Spring Bean 的完整列表。                  |
| `caches`           | 暴露可用的缓存。                                             |
| `conditions`       | 显示自动配置的所有条件信息，包括匹配或不匹配的原因。         |
| `configprops`      | 显示所有`@ConfigurationProperties`。                         |
| `env`              | 暴露 Spring 的属性`ConfigurableEnvironment`。                |
| `flyway`           | 显示已应用的所有 Flyway 数据库迁移。 需要一个或多个`Flyway`组件。 |
| `health`           | 显示应用程序运行状况信息。                                   |
| `httptrace`        | 显示 HTTP 跟踪信息（默认情况下，最近 100 个 HTTP 请求-响应）。需要一个`HttpTraceRepository`组件。 |
| `info`             | 显示应用程序信息。                                           |
| `integrationgraph` | 显示 Spring `integrationgraph` ，需要依赖`spring-integration-core`。 |
| `loggers`          | 显示和修改应用程序中日志的配置。                             |
| `liquibase`        | 显示已应用的所有 Liquibase 数据库迁移。需要一个或多个`Liquibase`组件。 |
| `metrics`          | 显示当前应用程序的 "指标" 信息。                             |
| `mappings`         | 显示所有`@RequestMapping`路径列表。                          |
| `scheduledtasks`   | 显示应用程序中的计划任务。                                   |
| `sessions`         | 允许从 Spring Session 支持的会话存储中检索和删除用户会话。需要使用 Spring Session 的基于 Servlet 的 Web 应用程序。 |
| `shutdown`         | 使应用程序正常关闭，默认禁用。                               |
| `startup`          | 显示由`ApplicationStartup`收集的启动步骤数据。需要使用`SpringApplication`进行配置`BufferingApplicationStartup`。 |
| `threaddump`       | 执行线程转储。                                               |

如果您的应用程序是Web应用程序（Spring MVC，Spring WebFlux 或 Jersey），则可以使用以下附加端点：

| ID           | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| `heapdump`   | 返回`hprof`堆转储文件。                                      |
| `jolokia`    | 通过 HTTP 暴露 JMX bean（需要引入 Jolokia，不适用于 WebFlux）。需要引入依赖`jolokia-core`。 |
| `logfile`    | 返回日志文件的内容（如果已设置`logging.file.name`或`logging.file.path`属性）。支持使用HTTP`Range`标头来检索部分日志文件的内容。 |
| `prometheus` | 以 Prometheus 服务器可以抓取的格式公开指标。需要依赖`micrometer-registry-prometheus`。 |

最常用的 Endpoint

- **Health：监控状况**
- **Metrics：运行时指标**

- **Loggers：日志记录**

### 2.2 Health Endpoint

健康检查端点，我们一般用于在云平台，平台会定时的检查应用的健康状况，我们就需要 Health Endpoint 可以为平台返回当前应用的`一系列组件健康状况的集合`。

```yaml
management:
  endpoint:
    health:
      enabled: true
      show-details: always # 开启 health 的详细显示
```

重要的几点：

- health endpoint 返回的结果，应该是一系列健康检查后的一个`汇总报告`
- 很多的健康检查默认已经自动配置好了，比如：数据库、redis 等

- 可以很容易的添加自定义的健康检查机制

![image-20210908130505114](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210908130505114.png)

### 2.3 Metrics Endpoint

提供详细的、层级的、空间指标信息，这些信息可以被pull（主动推送）或者push（被动获取）方式得到；

- 通过 Metrics 对接多种监控系统
- 简化核心 Metrics 开发

- 添加自定义 Metrics 或者扩展已有 Metrics

![image-20210908131806832](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210908131806832.png)

### 2.4 管理 Endpoints

#### 2.4.1 开启与禁用 Endpoints

- 默认所有的 Endpoint 除了 shutdown 都是开启的。

- 需要开启或者禁用某个 Endpoint。配置模式为  **management.endpoint.《endpointName》.enabled = true**

  ```yaml
  management:
    endpoint:
      beans:
        enabled: true
  ```

- 或者禁用所有的 Endpoint 然后手动开启指定的 Endpoint

  ```yaml
  management:
    endpoints:
      enabled-by-default: false
    endpoint:
      beans:
        enabled: true
      health:
        enabled: true
  ```

#### 2.4.2 暴露 Endpoints

支持的暴露方式：

- HTTP：默认只暴露 **health** 和 **info** Endpoint
- **JMX**：默认暴露所有 Endpoint
- 除了 health 和 info，剩下的 Endpoint 都应该进行保护访问。如果引入 SpringSecurity，则会默认配置安全访问规则

| ID                 | JMX  | Web  |
| ------------------ | ---- | ---- |
| `auditevents`      | Yes  | No   |
| `beans`            | Yes  | No   |
| `caches`           | Yes  | No   |
| `conditions`       | Yes  | No   |
| `configprops`      | Yes  | No   |
| `env`              | Yes  | No   |
| `flyway`           | Yes  | No   |
| `health`           | Yes  | Yes  |
| `heapdump`         | N/A  | No   |
| `httptrace`        | Yes  | No   |
| `info`             | Yes  | Yes  |
| `integrationgraph` | Yes  | No   |
| `jolokia`          | N/A  | No   |
| `logfile`          | N/A  | No   |
| `loggers`          | Yes  | No   |
| `liquibase`        | Yes  | No   |
| `metrics`          | Yes  | No   |
| `mappings`         | Yes  | No   |
| `prometheus`       | N/A  | No   |
| `scheduledtasks`   | Yes  | No   |
| `sessions`         | Yes  | No   |
| `shutdown`         | Yes  | No   |
| `startup`          | Yes  | No   |
| `threaddump`       | Yes  | No   |

### 3.定制 Endpoint

#### 3.1 定制 Health 信息

```java
@Component
public class MyHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        int errorCode = check(); // perform some specific health check
        if (errorCode != 0) {
            return Health.down().withDetail("Error Code", errorCode).build();
        }
        return Health.up().build();
    }
}
```

```java
// 构建 Health
Health build = Health.down()
                .withDetail("msg", "error service")
                .withDetail("code", "500")
                .withException(new RuntimeException())
                .build();
```



```java
@Component
public class MyComHealthIndicator extends AbstractHealthIndicator {

    /**
     * 真实的检查方法
     * @param builder
     * @throws Exception
     */
    @Override
    protected void doHealthCheck(Health.Builder builder) throws Exception {
        // mongodb 获取连接进行测试
        Map<String,Object> map = new HashMap<>();
        // 检查完成
        if(1 == 2){
			// builder.up(); // 健康
            builder.status(Status.UP);
            map.put("count",1);
            map.put("ms",100);
        } else {
			// builder.down();
            builder.status(Status.OUT_OF_SERVICE);
            map.put("err","连接超时");
            map.put("ms",3000);
        }

        builder.withDetail("code",100)
                .withDetails(map);
    }
}
```

### 3.2 定制 info 信息

常用两种方式

#### 3.2.1 编写配置文件

```yaml
info:
  appName: boot-admin
  version: 2.0.1
  mavenProjectName: @project.artifactId@  # 使用@@可以获取 maven 的 pom 文件值
  mavenProjectVersion: @project.version@
```

#### 3.2.2 编写 infoContributor

```java
@Component
public class ExampleInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("example", Collections.singletonMap("key", "value"));
    }
}
```

http://localhost:8080/actuator/info 会输出以上方式返回的所有info信息

![image-20210908134349305](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/framework/image-20210908134349305.png)

### 3.3 定制 Metrics 信息

#### 3.3.1 SpringBoot 支持自动适配的 Metrics

- JVM metrics, report utilization of:

- - Various memory and buffer pools
  - Statistics related to garbage collection

- - Threads utilization
  - Number of classes loaded/unloaded

- CPU metrics
- File descriptor metrics

- Kafka consumer and producer metrics
- Log4j2 metrics: record the number of events logged to Log4j2 at each level

- Logback metrics: record the number of events logged to Logback at each level
- Uptime metrics: report a gauge for uptime and a fixed gauge representing the application’s absolute start time

- Tomcat metrics (`server.tomcat.mbeanregistry.enabled` must be set to `true` for all Tomcat metrics to be registered)
- [Spring Integration](https://docs.spring.io/spring-integration/docs/5.4.1/reference/html/system-management.html#micrometer-integration) metrics

#### 3.3.2 增加定制 Metrics

```java
class MyService{
    Counter counter;
    public MyService(MeterRegistry meterRegistry){
        counter = meterRegistry.counter("myservice.method.running.counter");
    }

    public void hello() {
        counter.increment();
    }
}
```

也可以使用下面的方式

```java
@Bean
MeterBinder queueSize(Queue queue) {
    return (registry) -> Gauge.builder("queueSize", queue::size).register(registry);
}
```

### 3.4 定制 Endpoint

```java
@Component
@Endpoint(id = "container")
public class DockerEndpoint {

    @ReadOperation
    public Map getDockerInfo() {
        return Collections.singletonMap("info", "docker started...");
    }

    @WriteOperation
    private void restartDocker() {
        System.out.println("docker restarted....");
    }
}
```

场景：开发 **ReadinessEndpoint** 来管理程序是否就绪，或者 **LivenessEndpoint** 来管理程序是否存活；

当然，这个也可以直接使用 https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-kubernetes-probes

