---
title: 主从复制
date: 2021-12-11
category: Redis
tag:
 - Redis
---

## 1. 是什么

主机数据更新后根据配置和策略，自动同步到备机的  <span style="color:red">master/slave 机制</span>， <span style="color:red">**Master 以写为主，Slave 以读为主**</span>

## 2. 能干嘛

- 读写分离，性能扩展
- 容灾快速恢复

![image-20211123101533604](http://img.hl1015.top/blog/image-20211123101533604.png)

## 3. 怎么玩：主从复制

### 3.0 准备工作

**（1）准备 3 台虚拟机，模拟 3 台 服务器**

![image-20211123131953814](http://img.hl1015.top/blog/image-20211123131953814.png)

**（2）在每台虚拟机上安装 Redis 6**

- 1-上传 redis 6 安装包（使用 xftp 工具）

  - ![image-20211123132340910](http://img.hl1015.top/blog/image-20211123132340910.png)

- 2-解压安装包

  - ```shell
    tar -zxvf /opt/module/redis-6.2.1.tar.gz -C /opt/software/
    ```

- 3-编译 & 安装

  - ```shell
    cd /opt/software/redis-6.2.1
    ```

  - ```shell
    make # 编译
    make install # 安装
    ```

- 4-创建 /myredis 文件夹，并将 /opt/software/redis-6.2.1/redis.conf 复制到 /myredis 文件夹中

  - ```powershell
    mkdir /myredis # 创建 myredis 文件夹
    cp /opt/software/redis-6.2.1/redis.conf /myredis/  # 复制 redis.conf
    ```

- 5-修改 /myredis/redis.conf，开启后台运行 & 解除只绑定本机 & 关闭本机保护模式

  - ```shell
    vim /myredis/redis.conf
    ```

    ①开启后台运行
    
    ![image-20211123152438661](http://img.hl1015.top/blog/image-20211123152438661.png)
    
    ②解除只绑定本机，允许其他 ip 地址访问
    
    ![image-20211124111506069](http://img.hl1015.top/blog/image-20211124111506069.png)
    
    ③将本机访问保护模式设置 no
    
    ![image-20211117193639739](http://img.hl1015.top/blog/image-20211117193639739.png)

- 6-**从机** centos 101、centos102 的 /myredis/redis.conf 中加入关于主从复制的配置【永久生效】

  - 使用 `ifconfig` 命令查看主机 centos103 服务器的 IP 地址

    ![image-20211123231811467](http://img.hl1015.top/blog/image-20211123231811467.png)

    ![image-20211124130037420](http://img.hl1015.top/blog/image-20211124130037420.png)
    
  - 配从（库）不配主（库）-【命令行方式、临时生效】
  
    ```shell
    slaceof <ip><port> # 成为某个实例的从服务器
    ```
  

### 3.1 在 centos101 上新建 redis101.conf

**（1）新建 redis101.conf**

```shell
vim /myredis/redis101.conf
```

**（2）填写以下内容**

```shell
include /myredis/redis.conf
pidfile /var/run/redis_101.pid
port 6379
dbfilename dump101.rdb
```

![image-20211123225922601](http://img.hl1015.top/blog/image-20211123225922601.png)

### 3.2 在 centos102 上新建 redis102.conf

```shell
vim /myredis/redis102.conf
```

```shell
include /myredis/redis.conf
pidfile /var/run/redis_102.pid
port 6379
dbfilename dump102.rdb
slave-priority 10
```

![image-20211124123648963](http://img.hl1015.top/blog/image-20211124123648963.png)

> slave-priority：设置从机的优先级，值越小，优先级越高，用于选择主机时使用【默认 100】

### 3.3 在 centos103 上新建 redis103.conf

```shell
vim /myredis/redis103.conf
```

```shell
include /myredis/redis.conf
pidfile /var/run/redis_103.pid
port 6379
dbfilename dump103.rdb
```

![image-20211124123607103](http://img.hl1015.top/blog/image-20211124123607103.png)

### 3.4 启动三台 redis 服务器

![image-20211123230737304](http://img.hl1015.top/blog/image-20211123230737304.png)

![image-20211123230655206](http://img.hl1015.top/blog/image-20211123230655206.png)

![image-20211123230711027](http://img.hl1015.top/blog/image-20211123230711027.png)

### 3.5 查看三台主机运行情况

```shell
info replication # 打印主从复制的相关信息
```

![image-20211124131256513](http://img.hl1015.top/blog/image-20211124131256513.png)

演示主机写，从机读：

![master_write_and_slave_read](http://img.hl1015.top/blog/master_write_and_slave_read.gif)

## 4. 常用 3 招

### 4.1 一主二仆

- 切入点问题？
  - slave1、slave2 是从头开始复制还是从切入点开始复制？【这个分情况】
    - 如果是刚启动，slave 会主动向 master 发送 sync 命令，完成全量复制（即从头开始复制）
    - 如果不是刚启动，master 会将所有新收集到的修改命令依次传给 slave 完成同步（即从切入点开始复制）
  - 比如 slave1 没参与到 set k1、k2、k3 的过程，从 set k4 才开始进入，那之前的  k1、k2、k3 是否也可以复制？
    - 可以的，刚启动的 slave 会主动向 master 发送 sync 命令，完成全量复制
- 从机是否可以写？set 可否？
  - 答案：不可以
    ![image-20211124144411373](http://img.hl1015.top/blog/image-20211124144411373.png)
- 主机 shutdown 后情况如何？从机是上位还是原地待命？
  - 答案：从机原地待命
    ![master_shutdown](http://img.hl1015.top/blog/master_shutdown.gif)
- 其中一台从机 down 后情况如何？重新启动后它能跟上大部队吗？
  - 答案：可以
    ![slave_shutdown](http://img.hl1015.top/blog/slave_shutdown.gif)

想要回答好上面的问题，我们需要清楚 Redis 的 **主从复制原理：**

- slave 启动成功连接到 master 后会发送一个 sync 命令
- master 收到命令后启动后台的存盘进程，同时收集所有接收到的用于修改数据集命令，在后台进程执行完毕之后，master 将传送整个 RDB 数据文件到 slave，以完成一次完全同步
- 全量复制：slave 服务器在接收到 RDB 数据文件后，将其存盘并加载到内存中
- 增量复制：master 继续将所有新收集到的修改命令依次传给 slave 完成同步
- 但是只要是重新连接 master，一次完全同步（全量复制）将被自动执行

![image-20211124141633846](http://img.hl1015.top/blog/image-20211124141633846.png)

### 4.2 薪火相传

上一个 slave 可以是下一个 slave 的 master，slave 同样可以接收其他 slaves 的连接和同步请求，那么该 slave 就作为了链条中下一个 master，可以有效减轻 master 的写压力，去中心化降低风险。

```shell
slaveof <masterip><port> # 建立主从复制关系
```

<font color="blue">某个 slave 中途变更转向：会清除之前的数据，重新建立连接，全量拷贝最新的</font>

<font color="blue">风险：一旦某个 slave 宕机，后面的 slave 都没法备份【因为主机如果挂了，从机还是从机，无法写数据】</font>

![image-20211124152244129](http://img.hl1015.top/blog/image-20211124152244129.png)

![xinhuoxiangchuan](http://img.hl1015.top/blog/xinhuoxiangchuan.gif)

> 从机 centos101-IP：192.168.184.130，从机 centos102-IP：192.168.184.131，主机 centos103-IP：192.168.184.132

### 4.3 反客为主

当一个 master 宕机后，后面的 slave 可以立刻升为 master，其后面的 slave 不用做任何修改，使用命令 `slaveof no one` 可以将从机变为主机【全手动操作】

![fankeweizhu](http://img.hl1015.top/blog/fankeweizhu.gif)

## 5. 哨兵模式（sentinel）

### 5.1 是什么

可以理解为<font color="red">**反客为主的自动版**</font>，能够在后台监控主机是否故障，如果故障了根据投票自动将从库转换为主库

![image-20211124162400098](http://img.hl1015.top/blog/image-20211124162400098.png)



### 5.2 怎么玩（使用步骤）

#### 5.2.1 调整回一主二仆模式，centos103 带着 centos101、centos102

![image-20211124162927994](http://img.hl1015.top/blog/image-20211124162927994.png)

#### 5.2.2 自定义的 /myredis 目录下新建 sentinel.conf

```shell
vim /myredis/sentinel.conf
```

#### 5.2.3 配置哨兵，填写内容

```shell
sentinel monitor centos103 192.168.184.132 6379 1
```

> 其中 centos103 为监控对象起的服务器名称，1 为至少有多少哨兵同一迁移的数量

#### 5.2.4 启动哨兵

```shell
redis-sentinel /myredis/sentinel.conf
```

以 centos101  启动的截图为例：

![image-20211124170918945](http://img.hl1015.top/blog/image-20211124170918945.png)

> /usr/local/bin 目录下，带的 <font color="red">**redis-benchmark**</font> 工具，可以用于 redis 做压测

#### 5.2.5 当主机挂掉，从机选举中产生新的主机

![sentinel](http://img.hl1015.top/blog/sentinel.gif)

![image-20211124214744943](http://img.hl1015.top/blog/image-20211124214744943.png)

大概 10 秒左右，可以看到哨兵窗口日志，切换了新的主机【哪个从机会被选举为主机呢？根据优先级别：<font color="red">slave-priority</font>】，<font color="green">原主机重启后会变为从机</font>。

#### 5.2.6 复制延时

由于所有的写操作都是先在 master 上操作，然后同步更新到 slave 上，所以从 master 同步到 slave 机器有一定的延迟，当系统很繁忙的时候，延迟问题会更加严重，slave 机器数量的增加也会使这个问题更加严重。

### 5.3 故障恢复

**（1）新主登基**

从下线的主服务的所有从服务里面挑选一个从服务，将其转成主服务，选择条件依次为：

1. 选择优先级靠前的
2. 选择偏移量最大的
3. 选择 runid 最小的从服务

> 优先级在 redis.conf 中默认：`slave-priority 100`，值越小优先级越高
>
> 偏移量是指获得原主机数据最全的
>
> 每个 redis 实例启动后都会随机生成一个 40 位的 runid

**（2）群仆俯首**

挑选出新的主服务之后，sentinel 向原主服务的从服务发送 salveof  新主服务的命令，复制新 master

**（3）旧主俯首**

当已下线的服务重新上线时，sentinel 会向其发送 slaveof 命令，让其成为新主的从

### 5.4 主从复制（jedis 应用）

```java
public class JedisSentinelTest {
    private static JedisSentinelPool jedisSentinelPool = null;

    public static Jedis getJedisFromSentinel() {
        if (jedisSentinelPool == null) {
            Set<String> sentinelSet = new HashSet<>();
            sentinelSet.add("192.168.184.130:26379");
            sentinelSet.add("192.168.184.131:26379");
            sentinelSet.add("192.168.184.132:26379");

            JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
            jedisPoolConfig.setMaxTotal(10); // 最大可用连接数
            jedisPoolConfig.setMaxIdle(5); // 最大闲置连接数
            jedisPoolConfig.setMinIdle(5); // 最小闲置连接数
            jedisPoolConfig.setBlockWhenExhausted(true); // 连接耗尽是否等待
            jedisPoolConfig.setMaxWaitMillis(2000); // 等待时间
            jedisPoolConfig.setTestOnBorrow(true); // 取连接的时候进行一下测试 ping pong

            jedisSentinelPool = new JedisSentinelPool("centos103", sentinelSet, jedisPoolConfig);
            return jedisSentinelPool.getResource();
        } else {
            return jedisSentinelPool.getResource();
        }
    }

    public static void main(String[] args) {
        Jedis jedisFromSentinel = JedisSentinelTest.getJedisFromSentinel();
        String ping = jedisFromSentinel.ping();
        System.out.println(ping);
    }
}
```

