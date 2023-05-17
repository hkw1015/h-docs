---
title: 数组
category: Java
tag:
  - Java 基础
---

## 1. 一维数组
- **数组的说明**

  数组（array）：可以理解为多个相同数据类型的变量的组合。

  目的：为了便于在内存中对数据进行统一管理。

- **一维数组的声明与初始化**

  （1）静态初始化：数组的赋值和数组元素的赋值同时进行。

  ```java
  int[] ids1 = new int[]{1,2,3,4,5,6,7};
  int[] ids2 = {1,2,3,4,5,6,7};
  ```

  （2）动态初始化：数组的赋值和数组元素的赋值分开进行。

  ```java
  String[] names = new String[3];
  ```

- **一维数组的引用**

  通过下角标的方式进行调用（下角标从0开始，到数组长度-1结束）。

  总结：不管是静态初始化还是动态初始化，一旦数组初始化完成，其长度就确定了，而且长度是不可变的。

- **数组的属性**

  数组的长度，即为数组中元素的个数，可以通过 length 属性来获取。

- **一维数组的遍历**

```java
for(int i = 0;i < ids.length;i++) {
	System.out.println(ids[i]);
}
```

- **一维数组元素的默认初始化值**

  （1）整型：byte、short、int、long默认初始化值为0；

  （2）浮点型：float、double默认初始化值为0.0；

  （3）布尔型：boolean默认初始化值为false；

  （4）字符型：char默认初始化值为0或'\u0000'，不能理解为'0'；

  （5）引用数据类型的默认初始化值为null。



## 2. 数组的常见算法

- **针对数值型的数组**

  求数组的最大值、最小值、平均数、总和等。

- **数组的赋值与复制**

```java
int[] arr1 = new int[]{1,2,3};
int[] arr2;
// 赋值：
arr2 = arr1;
// 复制：
arr2 = new int[arr1.length];
for(int i = 0;i < arr1.length;i++) {
	arr2[i] = arr1[i];
}
```

- **数组元素的反转**

```java
// 方式一：
for (int i = 0; i < arr1.length / 2; i++) {
    // 交换两个位置变量值的操作
    int temp = arr1[i];
    arr1[i] = arr1[arr1.length - 1 - i];
    arr1[arr1.length - 1 - i] = temp;
}
// 方式二：
for(int x = 0,y = arr1.length -1;x < y;x++,y--) {
    int temp = arr1[x];
    arr1[x] = arr1[y];
    arr1[y] = temp;
}
```

- **数组中指定元素的查找**

  （1）线性查找：普遍适用性（String中有 contains(String str) 和 index(String str) 可用于判断）

```java
int number = -64;
number = 65;
boolean isFlag = true;
for(int i = 0;i < arr1.length;i++) {
	if(number == arr1[i]) {
		isFlag = false;
		System.out.println(number + "在数组中存在，对应的索引位置为：" + i);
	}
}
if(isFlag) {
	System.out.println("在数组不存在" + number);
}
```

​	（2）二分法查找：使用前提 --- 数组是有序的

- **数组的排序算法**

  （1）选择排序：直接选择排序、堆排序

  （2）交换排序：冒泡排序、快速排序

  （3）插入排序：直接插入排序、折半插入排序、Shell排序

  （4）归并排序

  （5）桶式排序

  （6）基数排序

理解：

1）衡量排序算法的优劣：

​		①时间复杂度：分析关键字的比较次数和记录的移动次数

​		②空间复杂度：分析排序算法中需要多少辅助内存

​		③稳定性：若两个记录A和B的关键字值相等，但排序后A、B的先后次序保	持不变，则称这种排序算法是稳定的。

2）内部排序 与 外部排序

​		内部排序：只需要在内存中完成，不需要借助于外部存储设备

​		外部排序：需要借助于外部设备才可完成排序

**★★★冒泡排序的实现：需要能手写出来★★★**

```java
for(int i = 0;i < arr1.length - 1;i++) {
	for(int j = 0;j < arr1.length - 1 - i;j++) {
		if(arr1[j] > arr1[j + 1]){
			int temp = arr1[j];
			arr1[j] = arr1[j + 1];
			arr1[j + 1] = temp;
		}	
	}			
}
```



## 3. Arrays 工具类的使用

![image-20210809173842467](https://pet-hkw.oss-cn-shenzhen.aliyuncs.com/image/new_blog_system/java/base/image-20210809173842467.png)

```java
// equals(int[] a,int[] b):比较两个数组是否相等
int[] arr1 = new int[]{1,2,3};
int[] arr2 = new int[]{3,2,1};		
boolean isEquals = Arrays.equals(arr1, arr2);
System.out.println(isEquals);
		
// toString(int[] a):遍历数组元素，并返回
System.out.println(arr1);
System.out.println(Arrays.toString(arr1));
		
// fill(int[] a,int val):将数组中的所有元素替换为val
Arrays.fill(arr1, 5);
System.out.println(Arrays.toString(arr1));

// sort(int[] a):实现数组的排序。默认是从小到大的。内部使用的快速排序
int[] arr3 = new int[] { 23, 54, 76, 4, 6754, -9, -64, 6, 0, 54 };
System.out.println(Arrays.toString(arr3));
Arrays.sort(arr3);
System.out.println(Arrays.toString(arr3));
		
// binarySearch(int[] a,int key)
int index = Arrays.binarySearch(arr3, 6);
System.out.println(index);
```



## 4. 数组的常见异常

- **数组下标越界异常：ArrayIndexOutOfBoundsException**
- **空指针异常：NullPointerException**

