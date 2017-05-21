# BOM - 浏览器对象模型

BOM 提供了很多对象，用于访问浏览器的功能。

## window 对象

BOM 的核心对象是 window，表示浏览器的一个实例。既是通过 JavaScript 访问浏览器窗口的一个接口，又是 ECMAScript 规定的 Global 对象。

## 全局作用域

全局作用域中声明的一个变量和函数，都会变成 window 对象的属性和方法。但他们与直接在 window 对象上定义的属性有差别： 全局变量不能通过 delete 操作符删除。

```js
var age = 10;
window.color = 'red';

delete window.age; // 返回 false

delete window.color; // 返回 true
```

IE8 以及以下 delete 删除 window 属性，不管该属性是如何创建，上面两种情况都会抛出错误。

访问未声明的变量会抛出错误，

### 窗口关系与框架

页面中包含框架的，每个框架都有自己的 window 对象，保存在 frames 集合中。可以通过索引（从 0 开始，从左至右，从上到下）或者框架名称（window 的 name 属性）访问。

top 对象始终指向最高（最外）层的框架，也就是浏览器窗口。

parent 对象始终指向当前框架的直接上层框架。没有框架时，parent 一定等于 top

self 对象始终指向 window

所有这些对象都是 window 对象的属性，可以通过属性访问的方式访问。

> 多个窗口意味着多个全局环境，不同的全局环境拥有不同的全局对象，从而拥有不同内置构造函数，会影响对跨框架传递的对象使用 instanceof 操作符。详见 [instanceof 运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) 与 [JavaScript instanceof 运算符深入剖析](https://www.ibm.com/developerworks/cn/web/1306_jiangjj_jsinstanceof/)