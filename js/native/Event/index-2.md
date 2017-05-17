# 事件二

介绍常用的事件类型，模拟事件，和事件委托

## 事件类型

包括 IE9 在内的所有主流浏览器都支持 DOM2 级 事件。IE9 也支持 DOM3 级事件。

### UI 事件

    UI （User Interface 用户界面）事件，是指那些那些不一定与用户操作有关的事件

现有的 UI 事件如下：

* DOMActivate： 表示元素已经被用户操作（通过鼠标或键盘）激活。*在 DOM3 级事件中已被废弃*。

* load：当页面完全加载后在 window 上触发，所有框架都加载完毕在框架集上触发，当图像加载完成，在&lt;img&gt;元素上触发，或者嵌入的内容加载完毕在&lt;object&gt;元素上触发。

* unload：当页面完全卸载后在 window 上触发，当所有框架都卸载后在框架集上触发，或者嵌入的内容卸载完毕后在&lt;object&gt;元素上触发。

* abort：在用户停止下载过程时，如果嵌入的内容没有加载完成，则在&lt;object&gt;元素上触发。

* error：当 JavaScript 错误时在 window 上触发，当无法加载图像时在&lt;img&gt;元素触发，当无法加载嵌入内容时在&lt;object&gt;元素上触发，或者当一个或多个框架无法加载时在框架集上触发。

* select: 当用户选择文本框（&lt;input&gt;或&lt;textarea&gt;)中的一个或者多个字符时触发。

* resize：但窗口或者框架的大小变化时在 window 或框架上触发。

* scroll：当用户滚动带滚动条的元素中的内容时，在该元素上触发。&lt;body&gt;元素中包含所加载页面的滚动条

除了 DOMActivate 之外，其他事件在 DOM2 级事件中都被归为 HTML 事件（DOMActivate 事件仍属于 UI 事件）。

确定浏览器是否支持 DOM2 级事件规定的 HTML 事件，可以用以下代码

```js
// 是否支持 DOM2 级事件
var isSupported = document.implementation.hasFeature('HTMLEvents', '2.0');

// 是否支持 DOM3 级事件
var isSupported = document.implementation.hasFeature('UIEvent', '3.0');
```

#### load 事件

当页面完全加载（包括所有图像，JavaScript 文件，CSS 文件等），就会触发 window 上的 load 事件。有两种定义 onload 事件处理程序的方式。

一种是 JavaScript 方式

```js
// 在兼容 DOM 的浏览器中，event.target 属性的值被设置为 document,而 IE 不会为这个事件设置 srcElement
window.addEventListener('load', function(event){
  console.log('loaded');
}, false);
```

另一种是，为 body 元素添加一个 onload 特性,

```html
<html>
  <head>
    <title></title>
  </head>
  <body onload="alert('loaded')">
  </body>
</html>
```

一般来说，在 window 上发生的任何事件都可以在&lt;body&gt;元素中通过相应的属性来指定，因为在 HTML 中无法访问 window 元素。建议用 JavaScript 方式。

> “DOM2 级事件”规范，应该在 document 而非 window 上触发 load 事件，但是，所有浏览器都在 window 上实现了该事件。

图像上触发 onload 事件，最好在指定图像的 src 属性之前为图像指定事件，event 没有有用的信息，新图像只要设置了 src 属性就开始下载.

使用 Image 构造函数创建一个新图像的实例。

```js
var newImg = new Image();
newImg.onload = function() {
  console.log(event)
};
newImg.src='img/time.jpg';
```

> 在不属于 DOM 文档的图像（包括未添加到文档的&lt;img&gt;元素和 Image 对象）上触发的 load 事件，IE8 以及之前不生成 event 对象。

script 元素只有设置了 src 属性并将该元素添加到文档后，才开始下载，所以指定 src 属性和指定事件处理程序的先后就不重要了。以此来判断动态加载的 JavaScript 文件是否加载完毕。

```js
var dynamicScript = document.createElement('script');
dynamicScript.type = 'text/javascript';
dynamicScript.src = 'js/dynamic.js';
dynamicScript.onload = function () {
  console.log((event.target == this) + '--dynamic');
};
document.body.appendChild(dynamicScript);
```

> IE8 以及以下不支持 script 元素上 onload 事件，大多数浏览器 event 对象的 target 引用的是该 script 节点。IE9,IE10 是 srcElement,(win10 IE 测试)，FireFox 3 之前的是 document.

#### unload 事件

在文档被完全卸载后触发。利用这个事件最多的情况是清除引用，以避免内存泄漏。event 对象在兼容 DOM 的浏览器中只包含 target (值为 document)。 unload 事件在一切卸载后才触发，那么在页面加载后存在的对象，此时就不一定存在了。

> “DOM2 级事件” 规范，应该在&lt;body&gt;元素而非window 对象上触发 unload 事件，同样所有浏览器都在 window 上实现了 unload 事件。

#### resize 事件

当浏览器窗口被调整时就会在 window (窗口)上面触发，可以通过 JavaScript 或 &lt;body&gt; 元素中的 onresize 特性来指定事件处理程序。*更改过程中会重复触发*。兼容 DOM 的浏览器 event 对象的target 为 document. IE8 以及以前没提供任何属性。

#### scroll 事件

虽然 scroll 事件是在 window 对象上发生的，但它实际表示的是页面中相应元素的变的话。混杂模式下，可以通过 &lt;body&gt;元素的 scrollLeft 和 scrollTop 来监控。标准模式下，除了 Safari 之外都通过 &lt;html&gt; 来反映变化。（safari 仍基于 &lt;body&gt; 跟踪滚动位置，貌似 chrome 也是 html,汗）

```js
window.addEventListener('scroll',function() {
  if (document.compatMode == 'CSS1Compat') {
    // chrome 为 0，IE 有值
    console.log(document.documentElement.scrollTop);
  } else {
    console.log(document.body.scrollTop)
  }
},false);
```

### 焦点事件

焦点事件会在页面获得或者失去焦点时触发。利用 document.hasFocus() 方法及 document.activeElement 属性配合，**知晓用户在页面上的行踪**。

有以下 6 个焦点事件

1. blur 在元素失去焦点时触发。这个事件不会冒泡

2. DOMFocusIn: 在元素获得焦点时触发，冒泡，只有 Opera 支持。DOM3 级事件废弃，采用 focusin.

3. DOMFocusOut: 在元素失去焦点时触发，只有 Opera 支持。DOM3 级事件废弃，采用 focusout.

4. focus: 在元素获得焦点时触发，不冒泡。

5. focusin: 在元素获得焦点时触发，冒泡。

6. focusout: 元素失去焦点时触发，冒泡。

当焦点从页面中一个元素移动到另一个元素，会一次触发：

1. focusout 在失去焦点的元素上触发

2. focusin 在获得焦点的元素上触发

3. blur 在失去焦点的元素上触发

4. focus 在获得焦点的元素上触发

要确定浏览器是否支持这些事件

```js
var isSupported = document.implementation.hasFeature('FocusEvent', '3.0');
```

### 鼠标与滚轮事件




## 内存与性能

## 模拟事件