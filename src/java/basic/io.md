---
title: IO流
category: Java
tag:
  - Java 基础
---

## 1. File 类的使用

- **java.io.File 类的使用**

  （1）FIle 类的一个对象，代表着一个文件（.txt , .doc , .jpg , .avi等）或文件目录；

  （2）本章涉及到的 File，流相关的类，都定义在 `java.io` 包下；

  （3）File 类的对象，如果作为一个文件，就可以理解作为一个端点（起始点、目标点）被流所使用；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;代码上的体现：常常将 File 类的对象，作为参数传递给流的构造器中。

  （4）File 类中提供了文件或文件目录的创建、重命名、长度、删除等操作，但是并没涉及到文件内容的读写。如果涉及到文件内容的读写的话，就需要使用流。

- **File 类的实例化**

```java
/*
 * 1.如何实例化File
 * 
 * 2.路径：绝对路径：包含盘符在内的文件或文件目录的完整路径
 * 		   相对路径：相对于当前工程路径来说
 */
@Test
public void test1() {
	// 创建文件
	File file1 = new File("D:\\io\\hello.txt");
	File file2 = new File("D:\\io","hello.txt");
	// 创建文件目录
	File file3 = new File("d:\\io");
	File file4 = new File("d:\\io","io1");
		
	// 相对路径的表示：
	File file = new File("jdbc.properties");

	File file5 = new File(file1.getAbsoluteFile().getParent(),"world.txt");
}
```

- **常用方法**

![image-20210810165437650](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210810165437650.png)

备注：蓝色的需要熟练使用。



## 2. IO 流概述

- **流的分类**

  （1）流的流向：输入流、输出流；

  （2）操作数据的类型：字节流、字符流；

  （3）流的角色：节点流（或文件流）、处理流

![image-20210810165723150](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210810165723150.png)

- **流的体系结构**

![image-20210810165828517](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210810165828517.png)

备注：淡蓝色是重点。

- **重点掌握的结构**

  （1）抽象基类

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;InputStream

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OutputStream

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reader

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Writer

  （2）节点流

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileInputStream(read(byte[] buffer)

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileOutputStream(write(byte[] buffer,0,len)

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileReader(read(char[] buffer)

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileWriter(write(byte[] buffer,0,len)

  （3）缓冲流（处理流的一种：提高数据传输的速度）

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BufferedInputStream

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BufferedOutputStream

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BufferedReader

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BufferedWriter

- **FileInputStream/FileOutputStream 的使用**

```java
@Test
public void testFileInputOutputStream() {
	FileInputStream fis = null;
	FileOutputStream fos = null;
	try {
		// 1.提供原文件和目标文件
		File src = new File("minghui.jpg");
		File dest = new File("C:\\Users\\Administrator\\Desktop\\minghui.jpg");
			
		// 2.创建相应的输入流和输出流
		fis = new FileInputStream(src);
		fos = new FileOutputStream(dest);
			
		// 3.读取数据并写出数据的操作
		byte[] buffer = new byte[1024];
		int len; // 记录读入字节数组中的字节数
		while((len = fis.read(buffer)) != -1) {				
			fos.write(buffer, 0, len);				
		}
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		// 4.关闭资源
		if(fos != null) {
			try {
				fos.close();
			} catch (IOException e) {
				e.printStackTrace();
			}				
		}
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

- **FileReader/FileWriter的使用**

```java
// 实现“dbcp.txt”文件的复制
@Test
public void testReaderWriter() {
	FileReader reader = null;
	FileWriter writer = null;
	try {
		// 1.提供原文件和目标文件
		File src = new File("dbcp.txt");
		File dest = new File("dbcp1.txt");
		// 2.创建相应的输入流和输出流
		reader = new FileReader(src);
		writer = new FileWriter(dest);
			
		// 3.具体的读入、写出的操作
		char[] cbuf = new char[20];
		int len; // 记录读入到cbuf中字符的个数
		while((len = reader.read(cbuf)) != -1) {
			writer.write(cbuf, 0, len);
			String str = new String(cbuf, 0, len);
			System.out.print(str);
		}
	} catch (FileNotFoundException e) {
		e.printStackTrace();
	} catch (IOException e) {
		e.printStackTrace();
	} finally {
		if(writer != null) {
			// 4.关闭资源
			try {
				writer.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		if(reader != null) {
			try {
				reader.close();
			} catch (IOException e) {
				e.printStackTrace();
			}				
		}
	}
}
```

- **总结**

  （1）如果操作输入流对应的文件，要求文件必须存在，否则会报 FileNotFoundException;

  （2）如果操作输出流对应的文件，此文件可以不存在。

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果此文件不存在，在程序运行过程中，会自动创建；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果此文件存在，使用 FileOutputStream(File file)：则会覆盖原有的文件；

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;使用 FileOutputStream(File file,true)：则会在原文件内容给末尾追加数据。

  （3）流资源，不会被 JVM 自动回收，必须显示地关闭；

  （4）必须使用 try-catch-finally 处理流的关闭，为了保证此资源一定可以关闭；

  （5）此时多个节点流的关闭，没有顺序要求。

  注意点：

  ①在读取文本文件时，一定要确认好读取文件的字符编码格式和我们开发工具所用的字符编码格式，这俩要一致，不然会产生乱码（可以用转换流解决）。

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BufferReader reader = new BufferReader(new InputStreamReader(new FileInputStream(“d:\\io\\hello.txt”)));

  ②字节流处理图像文件，字符流处理文本文件。



## 3. 缓冲流的使用

- **分类**

  （1）处理非文本文件的流：BufferedInputStream、BufferedOutputStream;

  （2）处理文本文件的流：BufferedReader、BufferedWriter。

  作用：提高文件的读写速度。

- **典型代码1：处理字节文件**

```java
// 使用BufferedInputStream/BufferedOutputStream实现文件的复制
public void copyWithBuffered(String src, String dest) {
	BufferedInputStream bis = null;
	BufferedOutputStream bos = null;
	try {
		// 1.提供原文件和目标文件
		File srcFile = new File(src);
		File destFile = new File(dest);
			
		// 2.创建相应的输入流和输出流
		FileInputStream fis = new FileInputStream(srcFile);
		FileOutputStream fos = new FileOutputStream(destFile);
			
		bis = new BufferedInputStream(fis);
		bos = new BufferedOutputStream(fos);
			
		// 3.读取数据并写出数据的操作
		byte[] buffer = new byte[1024];
		int len; // 记录读入字节数组中的字节数
		while((len = bis.read(buffer)) != -1){
				
			bos.write(buffer, 0, len);
			bos.flush(); // 刷新数据
				
		}
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		// 4.关闭资源
		if(bos != null) {
			try {
				bos.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		if(bis != null) {
			try {
				bis.close();
			} catch (IOException e) {
				e.printStackTrace();
			}				
		}			
	}
}
```

- **典型代码2：处理字符**

```java
//综合使用BufferedReader和BufferedWriter的例子
@Test
public void testBufferedReaderWriter() throws Exception {
	// 1.提供原文件和目标文件
	File file1 = new File("dbcp.txt");
	File file2 = new File("dbcp2.txt");
	// 2.1 创建相应的输入流和输出流
	FileReader fr = new FileReader(file1);
	FileWriter fw = new FileWriter(file2);
	// 2.2 创建相应的输入缓冲流和输出缓冲流
	BufferedReader br = new BufferedReader(fr);
	BufferedWriter bw = new BufferedWriter(fw);
		
	// 3.使用String
	String str;
	while((str = br.readLine()) != null) { // 读入到String中的数据不包含换行符
		bw.write(str);
		bw.write("\n");
		// bw.newLine();
		// bw.flush(); // 刷新数据
	}
	// 4.关闭资源
	br.close();
	bw.close();
}
```



## 4. 转换流的使用

- **转换流**

  InputStreamReader / OutputStreamWriter

- **作用**

  （1）InputStreamReader：将一个输入型的字节流转换为输入型的字符流

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;解码：字节数组 ---> 字符数组、字符串，对应着 InputStreamReader

  （2）OutputStreamWriter：将一个输出型的字节流转换为输出型的字符流

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;解码：字符数组、字符串 ---> 字节数组，对应着 OutputStreamWriter

![image-20210810172028690](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210810172028690.png)

- **典型实现**

```java
// 将使用GBK编码方式写出的文件，读入内存，并以UTF-8的方式存储为另外一个文件
@Test
public void testInputStreamReader2() throws Exception {

	File file1 = new File("dbcp_gbk.txt");
	File file2 = new File("dbcp_utf-8.txt");
	
	FileInputStream fis = new FileInputStream(file1);
	FileOutputStream fos = new FileOutputStream(file2);

	// 解码的过程
	InputStreamReader isr = new InputStreamReader(fis, "GBK");
	OutputStreamWriter osw = new OutputStreamWriter(fos,"UTF-8");
	
	char[] cbuf = new char[20];
	int len;
	while ((len = isr.read(cbuf)) != -1) {
		osw.write(cbuf, 0, len);
	}
	
	isr.close();
	osw.close();
}
```

- **说明**

  文件在最初保存时，使用什么字符集进行编码的，那么打开此文件，还原为内存中的数据时，就需要使用同样的字符集进行解码。

- **编码集**

  （1）常见的编码集

  ```java
  ASCII：美国标准信息交换码。
  用一个字节的7位可以表示。
  
  ISO8859-1：拉丁码表。欧洲码表
  用一个字节的8位表示。
  
  GB2312：中国的中文编码表。
  
  GBK：中国的中文编码表升级，融合了更多的中文文字符号。
  
  Unicode：国际标准码，融合了多种文字。
  所文字都用两个字节来表示,Java语言使用的就是unicode
  
  UTF-8：最多用三个字节来表示一个字符。
  ```

  （2）B/S :Browser  Server    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C/S:Client   Server

  ​    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了保证所有的数据在前后端正确显示（不出现乱码），我们要保证编码集和解码集要一致。通常，我们都使用 UTF-8，包括服务器端与数据库的交互，也同样使用	UTF-8。



## 5. 对象流的使用

- **对象流**

  ObjectInputStream 和 ObjectOutputStream

  作用：存储和读取基本数据类型或对象的处理流。

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（它的强大之处就在于可以把 Java 中的对象写入到数据源中，也能把对象从数据源中还原回来。）

  序列化：内存中的 java 对象 ---> 写入文件、通过网络传输出去【使用ObjectOutputStream实现】

  反序列化：读取文件、通过网络传输过来 ---> 还原内存中的java对象【使用ObjectInputStream实现】

- **对象的序列化机制**

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对象的序列化机制允许把内存中的 java 对象转换成与平台无关的二进制流，从而允许把这种二进制流持久地保存在磁盘上，或通过网络将这种二进制流传输到另一个网络节点。当程序获取了这种二进制流，就可以恢复成原来的 java 对象。

- **实现序列化的类需要满足的条件**

  （1）自定义类实现 Serializable 接口；

  （2）在类中声明 serialVersionUID；

  （3）要求自定义类的所有属性都是可序列化的。

  说明：ObjectInputStream 和 ObjectOutputStream 不能序列化 static 和 transient 修饰的成员变量。



## 6. 其他的流的使用

- **标准的输入输出流**

  System.in：标准的输入流，默认是从键盘输入；

  System.out：标准的输出流，默认是从显示器输出。

  重写设置：

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.setIn()：重新设置输入位置；

  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.setOut()：重新设置输出位置。

- **打印流**

  PrintStream、PrintWriter

  提供了一系列重载的 print 和 println 方法，用于多种数据类型的输出；

  System.out 返回的是 PrintStream 的实例。

- **数据流**

  DataInputStream 和 DataOutputStream

  作用：用于读取或写出基本数据类型、String、字节数组



## 7. RandomAccessFile的使用

- **随机存取文件流**

- **使用说明**

  （1）继承于java.lang.Object;

  （2）既可以充当输入流，又可以充当输出流；

  （3）作为输出流，如果输出的文件不存在，则在输出过程中，自动创建此文件；

   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果输出的文件存在，则默认从文件开头的位置写入，覆盖原有的文件内容，但是可以在写出前，调用 seek(int positioin) 指定开始操作的位置。

  ```java
  @Test
  public void test2() throws IOException {
  		
  	RandomAccessFile raf = new RandomAccessFile("hello.txt", "rw");
  		
  	// 指定指针指向的位置
  	raf.seek(3);
  		
  	raf.write("xyz".getBytes());
  		
  	raf.close();
  }
  	
  @Test
  public void test1() throws IOException {
  
  	RandomAccessFile raf1 = new RandomAccessFile("minghui.jpg", "r");
  	RandomAccessFile raf2 = new RandomAccessFile("minghui3.jpg", "rw");
  
  	byte[] buffer = new byte[1024];
  	int len;
  	while((len = raf1.read(buffer)) != -1) {
  		raf2.write(buffer, 0, len);
  	}
  
  	raf1.close();
  	raf2.close();
  }
  ```



## 8. Path、Paths、Files的使用

- **NIO 的理解**

  NIO：New IO，Non-Blocking IO

  NIO 中使用通道 Channel 和缓冲区 Buffer 来替换原有的流和字节/字符数组，实现数据的传输，效率高，同时是非阻塞式的。

- **Path 的使用**

  （1）Path的说明：替换原有的File类

   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①早期的 java 只提供一个File类来访问文件系统，但 File 类的功能比较有限，所提供的方法性能也不高，而且，大多数方法在出错时仅返回失败，并不会提供异常信息；

   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②NIO.2 为了弥补这种不足，引入了 Path 接口，代表一个平台无关的平台路径，描述了目录结构中文件的位置，Path 可以看成是 File 类的升级版本，实际引用的资源也可以不存在。

  （2）如何实例化

   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Paths类（工具类）提供静态 get() 方法来获取 Path 对象；

   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①static Path get(String first,String ... more)：用于将多个字符串连成路径；

   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②static Path get(URL url)：返回指定url对应Path路径。

  ```java
  举例：
  Path path1 = Paths.get(“hello.txt”);// new File(“hello.txt”);
  Path path2 = Paths.get(“D:\\io”,”io1\\io2”,”hello.txt”); // new File(String parent,String 	fileName);
  ```

  （3）常用方法

  ```java
  String toString() : 返回调用 Path 对象的字符串表示形式
  
  boolean startsWith(String path) : 判断是否以 path 路径开始
  
  boolean endsWith(String path) : 判断是否以 path 路径结束
  
  boolean isAbsolute() : 判断是否是绝对路径
  
  Path getParent() : 返回 Path 对象包含整个路径，不包含 Path 对象指定的文件路径
  
  Path getRoot() : 返回调用 Path 对象的根路径
  
  Path getFileName() : 返回与调用 Path 对象关联的文件名
  
  int getNameCount() : 返回 Path 根目录后面元素的数量
  
  Path getName(int idx) : 返回s指定索引位置 idx 的路径名称
  
  Path toAbsolutePath() : 作为绝对路径返回调用 Path 对象
  
  Path resolve(Path p) : 合并两个路径，返回合并后的路径对应的 Path 对象
  
  File toFile() : 将 Path 转化为 File 类的对象
  
  另外，File 类中有方法：toPath() 将 File 对象转换为 Path 对象。
  ```

- **Files 中的常用方法：操作文件或文件目录的工具类**

```java
Path copy(Path src, Path dest, CopyOption … how) : 文件的复制
    
Path createDirectory(Path path, FileAttribute<?> … attr) : 创建一个目录
    
Path createFile(Path path, FileAttribute<?> … arr) : 创建一个文件
    
void delete(Path path) : 删除一个文件/目录，如果不存在，执行报错
    
void deleteIfExists(Path path) : Path对应的文件/目录如果存在，执行删除
    
Path move(Path src, Path dest, CopyOption…how) : 将 src 移动到 dest 位置
    
long size(Path path) : 返回 path 指定文件的大小
    
Files 常用方法：用于判断
boolean exists(Path path, LinkOption … opts) : 判断文件是否存在
    
boolean isDirectory(Path path, LinkOption … opts) : 判断是否是目录
    
boolean isRegularFile(Path path, LinkOption … opts) : 判断是否是文件
    
boolean isHidden(Path path) : 判断是否是隐藏文件
    
boolean isReadable(Path path) : 判断文件是否可读
    
boolean isWritable(Path path) : 判断文件是否可写
    
boolean notExists(Path path, LinkOption … opts) : 判断文件是否不存在
    
Files 常用方法：用于操作内容
SeekableByteChannel newByteChannel(Path path, OpenOption…how) : 获取与指定文	件的连接，how 指定打开方式。
    
DirectoryStream<Path>  newDirectoryStream(Path path) : 打开 path 指定的目录
    
InputStream newInputStream(Path path, OpenOption…how): 获取 InputStream 对象
    
OutputStream newOutputStream(Path path, OpenOption…how) : 获取 OutputStream 对象
```

