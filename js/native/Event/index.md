# 事件

    事件，就是文档或浏览器窗口中发生的一些特定的交互瞬间。

浏览器事件系统相对比较复杂，包括 DOM 事件和 BOM 事件。IE9+, FireFox, Opera, Safari 和 Chrome 全部都实现了 “DOM2 级事件” 模块的核心部分。IE8 是最后一个使用专有事件系统的主要浏览器。

## 事件流

    事件流，描述的是从页面中接受事件的顺序。

当时的浏览器厂商都认为，点击按钮同时，你也点击了按钮的容器元素，甚至点击了整个页面。不过 IE 的事件流是事件冒泡流，Netscape 的事件流是事件捕获流。

### 事件冒泡

IE 的事件冒泡流叫事件冒泡（event bubbling)，即事件开始最具体的元素接收，然后逐级向上传播到较为不具体的节点。

    Element div --> Element body --> Element html --> Document

IE5.5 以及更早版本冒泡会跳过&lt;html&gt;元素（从&lt;body&gt;直接跳到 document）,但DOM2 级则将事件冒泡到 window 对象。

```js
(function (win, doc) {

  // DOM0 级
  // 为以下节点绑定事件，验证事件流
  var arr = ['span', 'div', 'body', 'html', win];
  var getTagName = doc.getElementsByTagName.bind(doc);

  arr.map(function(item) {
    var isTagName = typeof item == 'string';
    var eventTarget = isTagName ? getTagName(item)[0] : item;
    var str = isTagName ? item : 'window';

    eventTarget.onclick = function (e) {
      console.log(str);
    }
  });

  // 点击 span 会依次弹出 span div body html window
})(window, document);
```

### 事件捕获

事件捕获思想是不大具体的节点更应该接收到事件，而具体的节点应该最后接收到事件。事件捕获的用意在于在事件到达预定目标之前捕获它。

    Document --> Element html --> Element body --> Element div

“DOM2 级事件” 规范要求事件从 document 对象开始传播，但 DOM2 级浏览器都是从 window 对象开始捕获事件。

### DOM 事件流

    “DOM2 级事件” 规定的事件流包括三个阶段：事件捕获阶段，处于目标阶段和事件冒泡阶段。

DOM 事件流中实际的目标在捕获阶段不会接收到事件，处理目标阶段在事件处理中被看成冒泡阶段一部分。“DOM2 级事件” 规范要求捕获阶段不会涉及事件目标，但实现 DOM2 级事件的浏览器都会在捕获阶段触发事件对象上的事件。结果，就是有两个机会在目标对象上操作事件。

## 事件处理程序

    事件处理程序，就是响应某个事件的函数，也叫事件侦听器。

### HTML 事件处理程序

某个元素支持的每种事件，都可以使用一个与相应事件处理程序同名的 HTML 特性来指定，这个特性的值应该是能够执行的 Javascript 代码。

```html
<input type="button" value="Click Me" onclick="alert(this.value)" />
```

这个特性的值不能使用未经转义的 HTML 语法字符，如 &，""，<，> 等

也可以调用页面其他地方定义的脚本,事件处理程序会创建一个封装元素属性值的函数，函数中有一个局部变量 event,也就是事件对象。

```html
<script>
  function showMessage() {
    console.log(event)
  }
</script>
<input type="button" value="Click Me" onclick="showMessage()" />
```

缺点：

1. 时差问题，用户在事件处理程序尚未解析时触发事件处理程序，就会引起错误，使用 try-catch

2. 扩展作用域链在不同浏览器会导致不同结果

3. HTML 与 Javascript 代码紧密耦合。

### DOM0 级事件处理程序

通过 Javascript 指定事件处理程序的传统方式，就是将一个函数赋值给一个事件处理程序属性。使用简单，具有跨浏览器的优势。

每个元素（包括 window 和 document)都有自己的事件处理程序属性，**这些属性通常小写**，将这些属性的值设置为一个函数，就可以指定事件处理程序。

```js
var btn = document.getElementById('myBtn');
btn.onclick = function() {
  console.log(this.id);
}
```

使用 DOM0 级方法指定的事件处理程序被认为时元素的方法。因此，这时候的事件处理程序是在元素的作用域中运行。程序中的 this 引用指向当前元素。**以这种方式添加的事件处理程序会在事件流的冒泡阶段被处理。**

另外，多次为同一个元素的同一个事件处理程序属性的值设置函数，会覆盖之前设置的函数。

删除通过指定 DOM0 级方法指定的事件处理程序，只需要将事件处理程序属性的值设置为 null.

```js
btn.onclick = null;
```

### DOM2 级事件处理程序

“DOM2 级事件” 定义了两个方法，用于处理指定和删除事件处理程序的操作：addEventListener() 和 removeEventListener()。所有 DOM 节点都包含这两个方法，并且接受三个参数：要处理的事件名，作为事件处理程序的函数，和一个决定在哪个阶段调用事件处理程序的布尔值，true表示捕获阶段，false表示冒泡阶段。

DOM2 级方法与 DOM0 级一样，添加的事件处理程序也是在其依附元素的作用域中运行。DOM2 级方法添加事件处理程序的主要好处是**可以添加多个事件处理程序**。

```js
(function (win, doc) {

  // DOM2 级方法
  // 为以下节点绑定事件，验证事件流
  var arr = ['span', 'div', 'body', 'html', win];
  var getTagName = doc.getElementsByTagName.bind(doc);
  // 是否捕获
  var isCapture = true;
  arr.map(function(item) {
    var isTagName = typeof item == 'string';
    var eventTarget = isTagName ? getTagName(item)[0] : item;
    var str = isTagName ? item : 'window';

    eventTarget.addEventListener('click', function () {
      console.log(str + '--capture');
    }, isCapture);

    eventTarget.addEventListener('click', function () {
      console.log(str + '--bubbling');
    }, !isCapture);
  });

  // 执行结果
  // window--capture
  // html--capture
  // body--capture
  // div--capture
  // span--capture
  // span--bubbling
  // div--bubbling
  // body--bubbling
  // html--bubbling
  // window--bubbling

})(window, document);
```

通过以上示例，可以验证：

1. 先捕获阶段，到目标处理阶段，再到冒泡阶段

2. 浏览器在捕获阶段触发了事件对象上的事件。两次 span

3. DOM2 级方法可以添加多个事件处理程序

通过 addEventListener() 添加的事件处理程序，只能使用 removeEventListener() 来移除。移除时传入的参数与添加处理程序时使用的参数相同。表示，通过 addEventListener() 添加的匿名函数将无法移除。

大多数情况下，都是将事件处理程序添加到事件流的冒泡阶段，这样可以最大限度的兼容浏览器。最好只在需要在事件到达目标之前截获它的时候将事件处理程序添加到捕获阶段。

### IE 事件处理程序

IE 实现了两个类似的方法： attachEvent() 和 detachEvent()。这两个方法都接受两个参数：事件处理程序名称和事件处理程序函数。

IE8 以及以下只支持冒泡，所以 attachEvent() 添加的事件处理程序都会被添加到冒泡阶段。

需要注意的是：

1. 这两个方法的第一个参数是 'onclick',而非 addEventListener() 方法中的 'click'

2. 使用 attachEvent() 方法，事件处理程序会在全局作用域中运行，与 DOM0 和 DOM2 不同，因此 this 等于 window

3. 为同一个按钮添加两个不同的事件处理程序，与 DOM 方法不同的是，这些事件处理程序不是以它们添加的顺序执行，而是以相反的顺序被触发。因此首先是 'hello',然后是 'true', IE9 则以添加的顺序执行，Edge 不支持此方法。

```js
var btn = document.getElementById('btn');
btn.attachEvent('onclick',function() {
  console.log(this === window); // true
});
btn.attachEvent('onclick',function() {
  console.log('hello');
});
```

使用 attachEvent() 添加的事件可以通过 detachEvent() 来移除，条件是必须提供相同的参数。与 DOM 方法一样，添加的匿名函数将不能被移除。

支持 IE 事件处理程序的还有 Opera。

## 事件对象

在触发 DOM 上的某一个事件时，会产生一个事件对象 event, 这个对象包含着所有与事件有关的信息，包括导致事件的元素，事件的类型以及其他与特定事件相关的信息。所有浏览器都支持 event 对象，但支持方式不同。

### DOM 中的事件对象

兼容 DOM 的浏览器都会将一个 event 对象传入到事件处理程序中，无论指定事件处理程序时使用的时什么方法（DOM0 级或 DOM2 级）。

```js
var btn = document.getElementById('btn');
btn.onclick = function(event) {
  console.log(event.type);
}

btn.addEventListener('click',function(event){
  console.log(event.type)
},false);
```

对于 HTML 特性指定的事件处理程序，以以下方式提供 event 对象可以让 HTML 特性事件处理程序与 Javascript 函数执行相同的操作

```html
<input type="button" value="Click Me" onclick="alert(event.type)" />
```

event 对象包含与创建它的特定事件有关的属性和方法。

* bubbles： 只读，Boolean，表明事件是否冒泡

* cancelable: 只读，Boolean, 表明是否可以取消事件默认行为

* currentTarget: 只读，Element，事件处理程序当前正在处理事件的那个元素

* defaultPrevented: 只读，Boolean，为 true 则表示已调用 preventDefault() (DOM3新增)

* detail: 只读，Integer, 事件相关的细节信息

* eventPhase: 只读，Integer，调用事件处理程序的阶段，1 表示捕获阶段，2 表示处于目标，3 表示冒泡阶段

* preventDefault(): 只读，Function，取消事件默认行为，如果 cancelable 为 true,则可以使用此方法

* stopPropagation(): 只读，Function，取消事件的进一步捕获或者冒泡，如果 bubbles 为 true, 则可以使用此方法

* stopImmediatePropagation(): 只读，Function，取消事件的进一步捕获或冒泡，同时阻止任何事件处理程序被调用（DOM3 新增)

* target: 只读，Element，事件的目标

* type： 只读， String，被触发的事件的类型

* isTrusted: 只读，Boolean，为 true 表示事件是用户触发，为 false 表示通过 Javascript 创建触发或者 dispatchEvent 触发(DOM3 新增)

#### currentTarget & target

```js
 document.body.onclick = function (event) {
    console.log(event.currentTarget == document.body); // true
    console.log(this == document.body); // true
    console.log(event.target == doc.getElementById('myBtn')); // true
  }

```

上述例子中，事件处理程序内部，this 始终等于 currentTarget 的值，是因为事件处理程序是注册在 document.body 元素，而 target 元素是 click 事件的真正目标元素。按钮 input#myBtn 没有注册事件处理程序，click 事件冒泡到 body 才得到处理。

#### type 属性

可以在需要是通过一个函数来处理多个事件。

```js
var btn = document.getElementById('btn');
var handler = function(event) {
  switch (event.type) {
    case 'click':
      // click
      break;
    case 'mouseover':
      // mouseover
      break;
    case 'mouseout':
      // mouseout
      break;
  }
};
btn.onclick = handler;
btn.onmouseover = handler;
btn.onmouseout = handler;
```

#### preventDefault() 方法

阻止浏览默认事件

```js
var link = document.getElementById('myLink');
link.onclick = function(event) {
  // 是否可以取消事件默认行为
  console.log(event.cancelable);  // true
  // 是否已经调用取消事件默认行为函数
  console.log(event.defaultPrevented);  // false
  event.preventDefault();
  console.log(event.defaultPrevented); // true
}
```

只有 cancelable 属性为 true, 才能使用 preventDefault() 来取消默认行为

#### stopPropagation() 方法

用于立即停止事件在 DOM 层中的传播，即取消进一步的事件捕获或冒泡。

```js
(function (win, doc) {

  var arr = ['span', 'div', 'body', 'html', win];
  var getTagName = doc.getElementsByTagName.bind(doc);
  // 是否捕获
  var isCapture = true;
  arr.map(function(item) {
    var isTagName = typeof item == 'string';
    var eventTarget = isTagName ? getTagName(item)[0] : item;
    var str = isTagName ? item : 'window';

    eventTarget.addEventListener('click', function () {
      // 阻止进一步捕获
      event.stopPropagation();
      console.log(str + '--capture');
    }, isCapture);

    eventTarget.addEventListener('click', function () {
      // 阻止进一步冒泡
      event.stopPropagation();
      console.log(str + '--bubbling');
    }, !isCapture);
  });

})(window, document);
```

阻止进一步捕获，捕获流只执行到 window,其他事件不会执行
阻止进一步冒泡，捕获流执行完成，目标事件，不会冒泡到上一层

#### eventPhase 属性

该属性可以确定事件当前位于事件流的哪个阶段。在捕获阶段调用的事件处理程序，eventPhase 值为 1，处于目标对象上，eventPhase 值为 2，在冒泡阶段调用的事件处理程序，eventPhase 值为 3

注：尽管 “处于目标” 发生在冒泡阶段，但 eventPhase 仍一直等于 2。

### IE 中的事件对象

DOM0 级方法添加事件处理程序时，event 对象作为 window 对象的一个属性存在

如果时使用 attachEvent() 添加的，那么就有一个 event 对象作为参数被传入事件处理程序函数中，也可以通过 window 对象访问 event 对象

```js
var btn = document.getElementById('btn');
btn.onclick = function() {
  var event = window.event;
  console.log(event.type);
};

btn.attachEvent('onclick', function(event) {
  console.log(event.type + '--attach');
});

```

#### event 对象的属性和方法

* cancelBubble 读/写 类型 Boolean,默认为false，设置为 true 就可以取消事件冒泡，与 DOM 中 stopPropagation() 方法相同，只能取消事件冒泡。

* returnValue 读/写 类型 Boolean，默认值为true，设置为 false 就可以取消事件的默认行为，与 DOM 中 preventDefault() 方法相同，但没法确定是否被取消。

* srcElement 只读 类型 Element ,事件的目标，与 DOM 中的 target 属性相同

* type 只读 类型 String, 被触发事件的类型

因为事件处理程序的作用域时根据指定他的方式来确定的，不能认为 this 会始终等于事件目标，比如 attachEvent() 方法添加的事件处理程序 this 等于 window。最好还是使用 event.srcElement。
