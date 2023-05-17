---
title: 多线程
category: Java
tag:
  - Java 基础
---

## 1. 程序、线程、进程的理解

程序（program）：是为完成特定任务、用某种语言编写的一组指令的集合，即指一段静态的代码，静态对象。

进程（process）：是程序的一次执行过程，或是正在运行的一个程序。动态过程：有它自身的产生、存在和消亡的过程。——生命周期。

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①如：运行中的QQ、运行中的QQ播放器；

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②进程是动态的，程序是静态的；

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③进程作为资源分配的单位，系统在运行时会为每个进程分配不同的内存区域。

线程（thread）：进程可进一步细化为线程，是程序内部的一条执行路径。（线程作为调度和执行的单位，每个线程拥有独立的运行栈和程序计数器，线程切换的开销较小，多个线程之间共享着内存区域中的<span style="color:blue">堆和方法区</span>，使得线程间的通信变得更简便、高效，但是多个线程操作共享的系统资源会带来<span style="color:red">安全隐患</span>）

举例：360安全卫士

【程序：存在我们磁盘上的静态代码】

![image-20210811093737819](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210811093737819.png)

【进程：运行中的360】

![image-20210811094133509](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210811094133509.png)

【线程：分别能执行的电脑体检、木马查杀、电脑清理都是一个个线程】

![image-20210811094157413](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210811094157413.png)



## 2. 创建多线程的四种方式

- **方式一：继承 Thread 类**

  ①创建 Thread 类的子类；

  ②重写 Thread 类中的 run()，将此线程要执行的操作，声明在 run() 的方法体中；

  ③实例化 Thread 类的子类；

  ④调用对象的 start()。

- **方式二：实现Runnable接口**

  ①创建一个 Runnable 接口的实现类；

  ②实现接口中的抽象方法：run()；

  ③创建实现类的对象；

  ④将此对象作为参数传递到 Thread 类中的构造器中，创建 Thread 类的对象；

  ⑤通过 Thread 类对象调用 start()。

  （备注：start() 的作用：①启动线程；②调用当前线程的 run()。）

  > 方式一和方式二的对比：
  >
  > （1）联系：public class Thread implements Runnale;
  >
  > （2）对比：实现的方式要更好一些；
  >
  >   一方面，由于单继承的局限性；
  >
  >   另一方面，如果多个线程有共享数据的话，更适合使用实现的方式。

- **方式三：实现Callable接口**

  ①创建一个 Callable 接口的实现类；

  ②实现接口中的抽象方法：call()；

  ③创建实现类的对象；

  ④将该对象作为参数传递到 FutureTask 类的构造器中，并创建 FutureTask 类的对象；

  ⑤将 FutureTask 类的对象作为参数传递到 Thread 类的构造器中，并创建 Thread 类的对象；

  ⑥用 Thread 类的实例对象调用 start()。

- **方式四：使用线程池**

  ①调用 Executors 的 newFixedThreadPool() 方法，返回指定线程数量的 ExecutorService；

  ②将 Runnable 接口的实现类对象作为形参传递给 ExecutorService 的 submit() 方法中，submit() 方法的作用：开启线程，调用线程 run()。

  ③关闭线程池：pool.shutdown()。

  【说明：一般实际开发中不这么使用，这里仅作为了解】

  ![image-20210811095159994](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210811095159994.png)

- **典型代码（方式一 ~ 方式四）**

```java
public class Test2 {
	public static void main(String[] args) {
		// 实现方式一：继承Thread类
		MyThread1 myThread1 = new MyThread1();
		myThread1.start();
		// 实现方式二：实现Runnable接口
		Thread myThread2 = new Thread(new MyThread2());
		myThread2.start();
		// 实现方式三：实现Callable接口
		Thread myThread3 = new Thread(new FutureTask<>(new MyThread3()));
		myThread3.start();
		// 实现方式四：使用线程池
		// 1.调用Executors的newFixedThreadPool()，返回指定线程数量的ExecutorService
		ExecutorService pool = Executors.newFixedThreadPool(10);
		// 2.将Runnable实现类的对象作为形参传递给ExecutorService的submit()方法中，开启线程，并执行相关的run()。
		pool.submit(new MyThread4());// 相当于：线程.start()。
		pool.submit(new MyThread4());
		pool.submit(new MyThread4());
		// 结束线程池的使用
		pool.shutdown();
	}
}

/** 创建线程的实现方式一：继承Thread类 ---> 
①创建自定义类继承Thread类；
②将要执行的语句写在重写的run()中；
③创建自定义类的对象；
④对象调用start()。*/
class MyThread1 extends Thread {
	@Override
	public void run() {
		System.out.println("---MyThread1");
	}
}

/** 创建线程的实现方式二：实现Runnable接口 ---> 
①创建自定义类实现Runnable接口；
②将要执行的语句写在重写的run()中；
③创建自定义类的对象；
④将该对象作为参数传到Thread类的构造器中，并创建Thread类的对象；
⑤对象调用start()。*/
class MyThread2 implements Runnable {
	@Override
	public void run() {
		System.out.println("---MyThread2");
	}
}

/** 创建线程的实现方式三：实现Callable接口 ---> 
①创建自定义类是实现Callable接口；
②将要执行的代码放在重写的call()中；
③创建自定义类的对象；
④将该对象作为参数传到FutureTask类的构造器中，并创建FutureTask类的对象；
⑤将FutureTask类的对象传入Thread类的构造器中，并创建Thread类的对象；
⑥对象调用start()。*/
class MyThread3 implements Callable<Integer> {

	@Override
	public Integer call() throws Exception {
		System.out.println("---MyThread3");
		return 200;
	}
}

/**
 * 创建线程的实现方式四：线程池的使用
 */
class MyThread4 implements Runnable {
	@Override
	public void run() {
		for(int i = 0;i < 100;i++) {
			System.out.println(Thread.currentThread().getName() + " : " + i);
		}
	}	
}
```



## 3. Thread 类中的常用方法

（1）run()：当前线程要执行的操作；

（2）start()：①启动线程；②调用当前线程的 run()；

（3）currentThread()：静态方法，获取当前执行代码的所属线程；

（4）getName()：获取当前线程的名字；

（5）setName()：设置当前线程的名字；

（6）yield()：显示地释放 CPU 的执行权；

（7）join()：在线程 a 的执行过程中，调用线程 b 的 join()，则开始执行线程 b 的操作，直到线程 b 执行完以后，线程 a 才可以继续执行；

（8）sleep(long millitime)：设置当前线程睡眠的时间；

（9）isAlive()：判断当前线程是否存活；

（10）线程的优先级：

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MIN_PRIORITY = 1;

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NORM_PRIORITY = 5;

​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX_PRIORITY = 10;

getPriority()：获取当前线程的优先级；

setPriority(int priority)：设置当前线程的优先级；

注意：高优先级的线程在被 CPU 分配并执行的概率上会高于低优先级的线程。



## 4. Thread 类的生命周期

![image-20210811095747212](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210811095747212.png)



## 5. 线程的同步机制

> 这里举 卖票 的例子

- **出现的问题**

  出现了重票和错票

- **出现问题的原因**

  当一个窗口在操作 ticket 时，没操作完的情况下，其他窗口就参与进来，导致 ticket 的错误

- **如何解决？**

  必须当一个窗口操作完 ticket 之后，其他窗口才能参与进来操作 ticket

- **java 如何实现？**

  使用线程的同步机制。

  方式一：<span style="color:red">使用同步代码块</span>

  ```java
  synchronized(同步监视器) {
  	// 需要被同步的代码（比如：操作 ticket 的代码）
  }
  // 说明：
  // ①需要被同步的代码，即为操作共享数据的代码；
  // ②什么是共享数据？多个线程都要操作的数据，比如：ticket。
  // ③同步监视器，俗称锁。任何一个类的对象都可以充当锁，但是，必须保证多个线程共用一把锁。
  // ④不是所有的多线程问题都会出现线程安全问题，只有多个线程操作共享数据了，才会出现线程安全问题。
  // ⑤同步的方式解决了线程的安全问题，但是同步代码块或同步方法中，其实是单线程的，效率低。
  ```

  方式一：<span style="color:red">使用同步方法</span>

  （1）如果操作共享数据的代码完全声明在一个方法中，还可以考虑将此方法声明为同步方法；

  （2）如果此方法是非静态的，则同步监视器默认为：this；

  （3）如果此方法是静态的，则同步监视器默认为：当前类本身。

  说明：同步监视器在继承 Thread 类的方式，要慎用 this.（考虑点：要看 this 是不是唯一的）;

  方式一 对比 方式二 的代码举例：

  ```java
  public class TestSynchronized {
  	public static void main(String[] args) {
  		Ticket ticket = new Ticket();
  		Thread thread1 = new Thread(ticket);
  		thread1.start();
  		Thread thread2 = new Thread(ticket);
  		thread2.start();
  	}
  }
  
  class Ticket implements Runnable {
  	// 定义票数为100
  	private static int ticketNum = 100;
  	
  	/*@Override
  	public void run() {
  		while(true) {
  			// 同步代码块
  			synchronized(this) {
  				if(ticketNum > 0) {
  					try {
  						Thread.sleep(50);
  					} catch (InterruptedException e) {
  						e.printStackTrace();
  					}
  					System.out.println(Thread.currentThread().getName() + " : " + ticketNum + "已售出");
  					ticketNum--;
  				} else {
  					break;
  				}
  			}
  		}
  	}*/
      
  	@Override
  	public void run() {
  		boolean flag = true;
  		while(flag) {
  			saleTicket(flag);
  		}
  	}
  	
  	// 同步方法
  	static synchronized void saleTicket(boolean flag) {
  		if(ticketNum > 0) {
  			try {
  				Thread.sleep(50);
  			} catch (InterruptedException e) {
  				e.printStackTrace();
  			}
  			System.out.println(Thread.currentThread().getName() + " : " + ticketNum + "已售出");
  			ticketNum--;
  		} else {
  			flag = false;
  		}
  	}
  }
  ```

- **jdk5 中使用 Lock 实现线程安全**

  使用举例：

  ```java
  public class TestLock {
  	public static void main(String[] args) {
  		Thread thread = new Thread(new Ticket());
  		thread.start();
  	}
  }
  
  class Ticket implements Runnable {
  	// 定义票数为100
  	int ticketNum = 100;
  	
  	// 1.实例化Lock
  	private ReentrantLock lock = new ReentrantLock();
  	@Override
  	public void run() {
  		while(true) {
  			try {
  				// 2.加锁
  				lock.lock();
  				if(ticketNum > 0) {
  					try {
  						Thread.sleep(50);
  					} catch (InterruptedException e) {
  						e.printStackTrace();
  					}
  					System.out.println(Thread.currentThread().getName() + " : " + ticketNum + "已售出");
  					ticketNum--;
  				} else {
  					break;
  				}
  			} finally {
  				// 3.解锁
  				lock.unlock();
  			}
  		}
  	}
  }
  ```

- **【面试题】**

  （1）解决线程安全问题，有哪几种方式？

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;三种。

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①同步代码块；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②同步方法；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③使用 Lock。

  （2）使用同步的方式和 Lock 的方式有什么区别？

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;相同点：都是解决线程安全问题的；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;不同点：同步的方式，在执行代码块或同步方法以后，会自动释放同步监视器；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;而 Lock 的方式，必须手动执行 unlock() 方法，才可以释放。



## 6. 线程安全的单例模式---针对懒汉式

```java
// 懒汉式（线程安全的）
class Singleton4 {
	private Singleton4() {
		
	}
	
	private static Singleton4 singleton;
	
	public static Singleton4 getInstance() {
		if(singleton == null) {
			synchronized(Singleton4.class) {
				if(singleton == null) {
					singleton = new Singleton4();
				}
			}
		}
		return singleton;
	}
}
```



## 7. 死锁问题

- **死锁的理解**

  不同的线程分别占用了对方需要的同步资源不放弃，都在等待对方放弃自己需要的同步资源，就形成了死锁。

- **说明**

  是我们开发中要避免出现的。

- **举例**

```java
public static void main(String[] args) {

	StringBuffer s1 = new StringBuffer();
	StringBuffer s2 = new StringBuffer();

	new Thread(new Runnable() {

		@Override
		public void run() {
			synchronized (s1) {

				s1.append("a");
				s2.append("1");

				try {
					Thread.sleep(10);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
					
				synchronized (s2) {

					s1.append("b");
					s2.append("2");

					System.out.println(s1);
					System.out.println(s2);
				}
			}
		}

	}).start();

	new Thread(new Runnable() {

		@Override
		public void run() {
			synchronized (s2) {

				s1.append("c");
				s2.append("3");

				try {
					Thread.sleep(10);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
					
				synchronized (s1) {

					s1.append("d");
					s2.append("4");

					System.out.println(s1);
					System.out.println(s2);
				}
			}
		}

	}).start();
}
```



## 8. 线程通信

- **具体使用**

  wait()：一旦执行该方法，当前线程进入阻塞状态，同时，会释放同步监视器；

  notify()：一旦执行该方法，则唤醒被 wait() 后等待中的所有线程中，优先级最高的那个；

  notifyAll()：一旦执行该方法，则唤醒所有被 wait() 后等待中的线程。

- **要求**

  （1）此三个方法必须使用在同步方法或同步方法块中，不能使用在 Lock 解决的线程安全问题中；

  （2）此三个方法的调用者是同步监视器。

- **【面试题】sleep() 和 wait() 的区别？**

  （1）定义的位置：Thread.sleep() / Object.wait()；

  （2）相同点：都可以使得当前线程进入阻塞状态；

  （3）结束阻塞的方式：sleep()：睡眠时间结束  wait()：notify()/notifyAll()；

  （4）使用上的局限性：

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①sleep()：在任何位置都能使用；wait()：只能使用在同步结构中；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②如果使用在同步结构中，sleep() 不会释放同步锁，wait() 会释放同步锁。

- **典型例题**

  （1）使用两个线程打印 1-100，线程1，线程2，交替打印；

  （2）生产者、消费者的问题。



## 9. 线程池

- **背景**

  如果在程序执行过程中，需要创建大量的分线程，而这些分线程执行的操作还比较简单，执行结束后，就马上准备销毁。 ---降低了执行效率

- **可以考虑用线程池的方式**

  好处：①不用再去新建线程，执行效率高；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②线程可以复用，节省资源；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③可以对多个线程实现统一的管理。

- **延伸**

  数据库连接池