---
title: 公共字段自动填充
date: 2021-11-03
category: 常用框架
tag:
  - MyBatis-Plus
---

## 1. 元数据处理器接口

> ①所在包：com.baomidou.mybatisplus.MetaObjectHandler
>
> ②insertFill(MetaObject metaObject) / updateFill(MetaObject metaObject)
>
> ③metaObject：元对象，是 MyBatis 提供的一个用于更加方便，更加优雅地访问对象的属性，给对象的属性设置值的一个对象，还会用于包装对象，支持对 Object、Map、Collection 等对象进行包装
>
> ④本质上 metaObject 获取对象的属性值或者是给对象的属性设置值，最终是要通过 Reflector 获取到属性的对应方法的 Invoker，最终 invoke

## 2. 开发步骤

1. 注解填充字段，比如：@TableField(fill = FieldFill.INSERT)
2. 自定义公共字段填充处理器
3. MP 全局注入【自定义公共字段填充处理器】

## 3. 实操演示

**（1）给 tbl_employee 表添加 create_time，update_time 字段**

```sql
ALTER TABLE `mp`.`tbl_employee` 
ADD COLUMN `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间' AFTER `del_flag`,
ADD COLUMN `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间' AFTER `create_time`;
```

![image-20211130220955228](http://img.hl1015.top/blog/image-20211130220955228.png)

**（2）实体类 Employee 添加 createTime，updateTime 字段，并添加上 @TableField(fill = xxx) 注解**

![image-20211130221520697](http://img.hl1015.top/blog/image-20211130221520697.png)

**（3）自定义公共字段填充处理器**

```java
/**
 * 自定义公共字段填充处理器
 */
@Slf4j
public class MyMetaObjectHandler extends MetaObjectHandler {

    /**
     * 插入操作时，自动填充
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        log.info("==================== insert operation start ====================");
        setFieldValByName("createTime", new Date(), metaObject);
        setFieldValByName("updateTime", new Date(), metaObject);
    }

    /**
     * 修改操作时，自动填充
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        log.info("==================== update operation start ====================");
        setFieldValByName("updateTime", new Date(), metaObject);
    }
}
```

**（4）在 MP 全局策略中，注入上面自定义的公共字段填充处理器**

```xml
<!-- 定义 MyBatis-Plus 的全局策略配置 -->
<bean id="globalConfiguration" class="com.baomidou.mybatisplus.entity.GlobalConfiguration">
	...
	<!-- 注入公共字段填充处理器 -->
    <property name="metaObjectHandler" ref="metaObjectHandler"/>
</bean>

<!-- 定义 自定义公共字段填充处理器 -->
<bean id="metaObjectHandler" class="com.hl1015.mp.handler.MyMetaObjectHandler"/>
```

**（5）测试公共字段填充**

```java
@Test
public void testMetaObjectHandler() {
	Employee employee = new Employee();
	employee.setLastName("test1");
	employee.setEmail("test1@163.com");
	employee.setAge(10);
	employee.setGender("1");
	employee.setVersion(1);

	Integer result = employeeMapper.insert(employee);
	System.out.println("result = " + result);
}
```

![image-20211130223029982](http://img.hl1015.top/blog/image-20211130223029982.png)

![image-20211130223053544](http://img.hl1015.top/blog/image-20211130223053544.png)