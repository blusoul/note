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

1. DOMFocusIn: 在元素获得焦点时触发，冒泡，只有 Opera 支持。DOM3 级事件废弃，采用 focusin.

1. DOMFocusOut: 在元素失去焦点时触发，只有 Opera 支持。DOM3 级事件废弃，采用 focusout.

1. focus: 在元素获得焦点时触发，不冒泡。

1. focusin: 在元素获得焦点时触发，冒泡。

1. focusout: 元素失去焦点时触发，冒泡。

当焦点从页面中一个元素移动到另一个元素，会一次触发：

1. focusout 在失去焦点的元素上触发

1. focusin 在获得焦点的元素上触发

1. blur 在失去焦点的元素上触发

1. focus 在获得焦点的元素上触发

要确定浏览器是否支持这些事件

```js
var isSupported = document.implementation.hasFeature('FocusEvent', '3.0');
```

### 鼠标与滚轮事件

DOM3 级事件中定义了 9 个鼠标事件:

1. click: 只有在用户单击主鼠标按钮（一般是左键）或者按下回车键触发。

1. dblclick: 双击鼠标左键触发

1. mousedown: 用户按下了任意鼠标按钮时触发，不能通过键盘触发。

1. mouseup: 用户释放鼠标按钮时触发，不能通过键盘触发。

1. mouseenter: 在鼠标光标从元素外部首次移动到元素范围内时触发，**不冒泡，而且在光标移动到其后代元素上也不会触发**。DOM3 纳入规范。

1. mouseleave: 在位于元素上方的鼠标光标移动到元素范围之外时触发，**不冒泡，而且在光标移动到后代元素上也不会触发**。

1. mousemove: 当鼠标光标在元素内部移动时会*重复*触发。不能通过键盘触发。

1. mouseout: 在鼠标位于一个元素上方，用户移入另一个元素时触发。移入的元素可能位于前一个元素的外部，也可以时元素的内部。不能通过键盘触发。

1. mouseover: 在鼠标位于一个元素外部，然后用户将其首次移入时触发。不能通过键盘事件触发。

除了 mouseenter 和 mouseleave 之外，所有鼠标事件都支持冒泡。

只有在同一个元素上相继触发 mousedown 和 mouseup 事件，才会触发 click 事件。只有通过触发两次 click 事件，才会触发一次 dblclick 事件。*所有取消 click 和 dblclick 事件，也可以通过取消 mousedown 和 mouseup 间接实现*。触发的顺序：

    mousedown --> mouseup --> click --> mousedown --> mouseup --> click --> dblclick

> IE8 及之前的版本实现了个小 bug，双击时跳过第二个 mousedown 和 click 事件

    mousedown --> mouseup --> click --> mouseup --> dblclick

检测浏览器是否支持

```js
// 是否支持 DOM2 级事件
var isSupportedDOM2 = document.implementation.hasFeature('MouseEvents', '2.0');
// 是否支持 DOM3 级事件
var isSupportedDOM3 = document.implementation.hasFeature('MouseEvent', '3.0');
```

#### 客户区坐标位置

    事件对象的 clientX 和 clientY 属性，表示事件发生时，鼠标指针在视口的水平和垂直的坐标。**不包括页面滚动的距离**。

#### 页面坐标位置

    事件对象的 pageX 和 pageY 属性，表示鼠标光标在页面中的位置，从页面本身而非视口的左侧和顶边计算。

IE8 及更早的版本不支持事件对象的页面坐标，可以通过客户区坐标和滚动信息计算。

#### 屏幕坐标位置

    事件对象的 screenX 和 screenY 属性可以确定鼠标事件发生时，鼠标指针相对于整个屏幕的坐标信息。

#### 修改键

    修改键一般用来修改鼠标事件的的行为。DOM 规定了 4 个属性，shiftKey, ctrlKey,altKey, metaKey.如果相应键被按下了，值为 true.

IE8 及之前的版本不支持 metaKey.

#### 相关元素

对 mouseover 事件而言，事件的主目标获得光标的元素，而相关元素是那个失去光标的元素。mouseout 事件而言，事件的主目标是失去光标的元素。

DOM 通过 event 对象的 relatedTarget 属性提供了相关元素的信息。这个属性只对 mouseover 和 mouseout 才包含值，其他事件是 null。在 IE8 及之前的不支持此属性。在 mouseover 事件触发时，IE 的 fromElement 属性中保存着相关元素。在 mouseout 事件触发时， IE 的 toElement 属性中保存着相关元素。

#### 鼠标按钮

只有在主鼠标按钮被单击或者回车键被按下，才会触发 click 事件，检测 click 按钮的信息不必要。对于 mousedown 和 mouseup 而言，在其 event 对象存在 button 属性表示按下或者释放的按钮。有三个值： 0 表示主鼠标按钮，1 表示中间鼠标按钮， 2 表示次鼠标按钮。

IE8 及之前也提供了 button 属性，但与 DOM 的有很大差别。将 IE 模型规范化为 DOM 的方式

    0, 1, 3, 5, 7 --> 0;    2, 6 --> 2;    4 --> 1

#### 更多的事件信息

DOM2 级事件 规范在 event 对象中提供 detail 属性，对于鼠标事件来说，detail 中包含一个数值，表示在给定位置上发生多少次单击。在同一像素上相继发生一次 mousedown 和 mouseup 才算一次单击。值从 1 开始，每次单击值递增，如果在 mousedown 和 mouseup 之间移动位置， detail 会重置为 0.

#### 鼠标滚轮事件

IE6 首次实现了 mousewheel 事件，event 对象包含鼠标事件所有标准信息外，还有个 wheelDelta 属性，当用户向前滚动，wheelDelta 是 120 的倍数；向后滚动鼠标，wheelDelta 是 -120 的倍数。

#### 触摸设备

* 不支持 dblclick。双击浏览器窗口会放大，没有办法改变这一行为

* 轻击可单击元素会触发 mousemove 事件，如果此操作会导致内容的变化，将不再有其他事件发生，否则，会依次发生 mousedown mouseup 和 click. 可单击元素是指那些单击可产生默认操作的元素（如链接），或者已经指定了 onclick 事件处理程序的元素。

* mousemove 事件也会触发 mouseover 和 mouseout 事件

* 两个手指放在屏幕上且页面随手指一动而滚动时会触发 mousewheel 和 scroll 事件

#### 无障碍性问题

屏幕阅读器无法理解 mousedown 和 mouseover 事件. dblclick 无法通过键盘触发.

### 键盘与文本事件

对键盘事件的支持主要遵循 DOM0 级. DOM3 为键盘事件制定了规范.有三个键盘事件:

1. keydown: 当用户按下键盘上任意键触发,按住不放,会重复触发此事件

1. keypress: 当用户按下键盘上字符键触发,按住不妨,会重复触发此事件

1. keyup: 当用户释放键盘上的键时触发

只有一个文本事件

1. textInput: 这个事件是对 keypress 的补充, 用意是将文本显示给用户之前更容易拦截文本.在文本插入文本框之前会触发 textInput 事件.

> 键盘和鼠标事件一样,都支持相同的修改键,IE8 及之前不支持 metaKey.

#### 键码

在发生 keydown 和 keyup 事件时,event 对象包含 keyCode 属性, 值与 ASCII 码的编码相同. A --> 65, 回车 --> 13, a --> 97

也有一些特殊的,在 FireFox 和 Opera 中,按分号键 keyCode 值为 59, 也就是 ASCII 中分号的编码; 但 IE 和 Safari 返回 186,即键盘中按键的键码.

#### 字符编码

在所有浏览器中,按下能够插入或者删除字符的键都会触发 keypress 事件. IE9 等的 event 对象会有个 charCode 属性,只有在发生 keypress 事件时才包含值.对应按钮的 ASCII 码.

```js
function getCharCode(event) {
  if (typeof event.charCode == 'number') {
    return event.charCode;
  } else {
    return event.keyCode;
  }
}
```

### DOM3 级的变化

DOM3 级的键盘事件不再包含 charCode 属性,包含 key 和 char,兼容性差不建议

* key 属性取代 keyCode,它的值时一个字符串.字符键,值对应的时文本,非字符键,key 的值时相应的键名(如 'Shift', 'Down')

* char 属性,在按下字符键与 key 相同,对于按下非字符键时值为 null

* location 属性,表示按下了什么位置的键

* getModifierState() 方法,

#### textInput 事件

与 keypress 区别: 

1. 任何获得焦点的元素都可以触发 keypress 事件,但只有在可编辑区域才能触发 textInput 事件.

1. textInput 只有在用户按下能够输入实际的键时才会被触发,而 keypress 则时按下那些影响文本显示的键也会触发(如 退格键)

textInput 事件的 event 对象还包含一个 data 属性,值为用户输入的字符(非编码),没按上档键,按下 S 则 data 的值为 's',若按住上档键,再按下 S, 则 data 的值为 'S'

event 对象上还有一个属性 inputMethod 表示文本输入到文本框的方式,只有 IE 支持此属性.

* 0, 表示浏览器不确定时怎么输入

* 1, 表示是使用键盘输入

* 2, 表示文本是粘贴进来的

* 3, 表示文本是拖放进来的

* 4, 表示文本是使用 IME 输入的

* 5, 表示文本通过在表单中选择某一项输入的

* 6, 表示文本是通过手写输入的

* 7, 表示文本是通过语音输入的

* 8, 表示文本是通过几种方法组合输入的

* 9, 表示文本是通过脚本输入的

#### 复合事件

复合事件(composition event) 是 DOM3 级事件新添加的一类事件,用于处理 IME 的输入序列.IME 通常需要同时按住多个键,但最终只输入一个字符.有三个复合事件:

1. compositionstart: 在 IME 的文本复合系统打开时触发,表示要开始输入了

1. compositionupdate: 在向输入字段插入新字符时触发

1. compositionend: 在 IME 的文本复合系统关闭时触发

在触发复合事件时,目标就是接受文本的输入字段.但它比文本的 event 对象多一个属性 data.其中包含以下几个值:

1. 如果在 compositionstart 事件发生时访问,包含正在编辑的文本(例如:已经选中需要马上替换的文本)

1. 如果在 compositionupdate 事件发生时访问,包含正插入的新字符

1. 如果在 compositionend 事件发生时访问,包含此次输入绘画中插入的所有的字符

```js
// 检测浏览器是否支持复合事件
var isSupported = document.implementation.hasFeature('CompositionEvent','3.0');
```

#### 变动事件

变动事件(mutation event)能在 DOM 中的某一部分发生变化时给出提示.

* DOMSubtreeModified: 在 DOM 结构中发生任何变化时触发.这个事件在其他任何事件触发后都会触发.

* DOMNodeInserted: 在一个节点作为子节点插入到另一个节点时触发

* DOMNodeRemoved: 在节点从其父节点中被移除时触发

* DOMNodeInsertedIntoDocument: 在一个节点被直接插入文档或者通过子树间接插入文档后触发,这个事件在 DOMNodeInserted 之后触发

* DomNodeRemovedFromDocument: 在一个节点被直接从文档中移除或者通过子树间接从文档中移除之前触发.这个事件在 DOMNodeRemoved 之后触发

* DOMAttrModified: 在特性被修改之后触发

* DOMCharacterDataModified: 在文本节点的值发生变化时触发

```js
// 检测浏览器是否支持变动事件
var isSupported = document.implementation.hasFeature('MutationEvents','2.0');
```

##### 删除节点

使用 removeChild() 或 replaceChild() 从 DOM 中删除节点,首先会触发 DOMNodeRemoved 事件,此事件的目标(event.target)是被删除的节点, 而 event.relateNode 属性中包含这对目标节点的父节点的引用. 在此事件触发是,节点尚未从其父节点删除. 因此节点的 parentNode 属性仍然指向父节点.这个事件会冒泡.

如果被移除的节点包含子节点, 那么其所有子节点和这个被移除的节点上相继会触发 DOMNodeRemovedFromDocument 事件. 但此事件不会冒泡, 所以只有直接指定其中一个子节点事件处理程序才能调用, 这个事件的目标是相应的子节点或者那个被移除的节点. 除此之外 event 不包含其他信息.

接着触发 DOMSubtreeModified 事件,这个事件的目标是被移除节点的父节点. event 对象不会提供其他信息.

#### 插入节点

使用 appendChild(), replaceChild 或 insertBefore() 向 DOM 插入节点,首先会触发 DOMNodeInserted 事件. 此事件的目标是被插入的节点, 而 event.relateNode 属性包含一个对父节点的引用. 这个事件触发是,节点已经被插入到新的父节点.这个事件冒泡.

紧接着会在新插入的节点上触发 DOMNodeInsertedIntoDocument 事件. 不冒泡, 因此必须在插入节点之前为它添加事件处理程序. 这个事件的目标是被插入的节点.

最后一个触发的事件是 DOMSubtreeModified 触发于新插入节点的父节点.

### HTML 事件

DOM 规范米有涵盖所有浏览器支持的所有事件.

#### contextmenu 事件

contextmenu 事件,用以表示何时应该改显示上下文菜单,以便开发人员取消默认的上下文菜单而提供自定义的菜单.因为 此事件 属于鼠标事件,所以其事件对象包含与光标有关的属性. 通常使用 contextmenu 事件来显示自定义的上下文菜单,使用 onclik 事件处理程序隐藏该菜单.

#### beforeunload 事件

window 对象上的 beforeunload 事件,是为了让开发人员有可能在页面卸载钱阻止这一操作.这个事件会在浏览器卸载页面之前触发,可以通过它来取消卸载并继续使用原有页面.但不能彻底取消. 为了显示提示消息. 必须将 event.returnValue 值设置为给用户显示的字符串(对 IE 及 FireFox 而言), 同时作为函数的返回值(对 Safari 和 Chrome 而言).

```js
window.addEventListener('beforeunload', function(event) {
  var message = " I'm really going to miss you if you go";  event.returnValue = message;
  return message;
},false);
```

#### DOMContentLoaded 事件

window 的 load 事件会在页面一切加载完成时触发, 而 DOMContentLoaded 事件则在形成完整的 DOM 树之后就会触发. 可以在页面下载的早期添加事件处理程序,意味着用户能够尽早的与地面进行交互.

可以为 document 或 window 添加相应的事件处理程序.(尽管此事件会冒泡到window, 但它的目标实际上是 document ). event.target 是 document.

IE9+, 都支持 DOMContentLoaded 事件,这个事件始终都会在 load 事件之前触发.对于不支持的浏览器,建议在页面加载期间设置一个时间为 0 的超时调用.

```js
setTimeout(function() {
  // add
},0);
```

当前 JavaScript 处理完成之后立即运行此函数.至于这个时间与 DOMContentLoaded 被触发的时间是否同步, 为确保这个方法有效,必须将其作为页面中第一个超时调用,即便如此也无法保证所有环境中该超时调用一定早于 load 事件.

#### readystatechange 事件

IE 为 DOM 文档中的某些部分提供了 readystatechange 事件,这个事件目的是提供文档或元素加载状态有关的信息. 支持 readystatechange 事件的每个对象都有一个 readyState 属性. 可能包含下列5个值:

1. uninitialized(未初始化): 对象存在但尚未初始化

1. loading(正在加载): 对象正在加载数据

1. loaded(加载完毕): 对象加载数据完成

1. interactive(交互): 可以操作对象了,但还没完全加载

1.complete(完成):对象已经加载完成

对于 document 而言,值为 interactive 的 readyState 会在与 DOMContentLoaded 大致相同的时刻触发 readystatechange 事件.

与 load 事件一起使用的时候,无法预测两个事件的触发的先后顺序. 为了尽可能的抢占先机,有必要同时检测交互完成和完成阶段

```js
document.addEventListener('readystatechange', function(event) {
  if (document.readyState == 'interactive' || document.readyState == 'complete') {
    // 如果进入交互或者完成阶段,就移除事件,避免重复执行
    document.removeElementListener('readystatechange',argument.callee, false);
    alert('Content Loaded');
  }
},false);
```

> 支持 readystatechange 事件的有 IE 和 FireFox 4+ 和 Opera.

另外,script 在(IE 和 Opera 中)和 link (仅在 IE 中) 元素也会触发 readystatechange 事件来确定外部 JavaScript 和 CSS 文件是否已经加载完成. 除非把动态创建的元素添加到页面,否则浏览器不会开始下载外部资源. readyState 属性同样存在问题. 两个状态一并检测,并在调用一次事件处理程序后,将其移除.

```js
var script = document.createElement('script');

script.src = 'example.js';
script.addEventListener('readystatechange', function(event) {
  var target = event.target;
  if (target.readyState == 'loaded' || target.readyState == 'complete') {
    // 如果进入了其中任何一个阶段,则移除事件处理程序,防止二次执行
    target.addEventListener('readystatechange',arguments.callee, false);
  }
},false);
```

#### pageshow 和 pagehide 事件

某些浏览器有一个特性,名叫 *"往返缓存"*(back-forward cache 或 bfcache), 可以在用户使用浏览器 后退 和 前进 按钮是加快页面的转换速度. 这个缓存不仅保存着页面数据, 还保存着 DOM 和 JavaScript 的状态; 实际上是将整个页面保存在内存中. **如果页面位于 bfcache 中, 那么再次打开页面不会触发 load 事件**. 这些事件能形象的说明 bfcache.

1. pageshow 这个事件再页面显示时触发, 无论页面是否来自于 bfcache. 虽然这个事件的目标时 document, 但必须将事件处理程序添加到 window. pageshow 事件的 event 对象还有一个 名为 persisted 布尔值属性. 若页面被保存在 bfcache 中,则这个属性值为 true.

1. pagehide 事件会在浏览器卸载页面时触发,而且实在 unload 事件之前触发.这个事件也同样要添加到 window 对象. 不过 persisted 属性表示, 如果页面卸载之后会被保存到 bfcache 中, 则值为 true.

IE9 及之前的版本不支持这两个事件.

> 指定了 onunload 事件处理程序的页面会被自动排除在 bfcache 之外, 即使事件处理程序是空. 原因在与, onunload 最常用于撤销 onload 所执行的操作, 而跳过 onload 后再次显示的页面很可能就会导致页面不正常.

#### hashchange 事件

hashchange 事件, 以便在 URL 的参数列表(以及 URL 中 '#' 后的所有字符)发生变化时通知开发人员. 必须把 hashchange 事件添加给 window 对象. event 包含两个属性: oldURL 和 newURL.

支持 hashchange 事件的有 IE8+. safari 和 IE 不支持这两个属性. 最好使用 location 对象来确定

```js
// 检测浏览器是否支持 hashchange 
// 如果 IE8 在 IE7 文档模式下运行, 即使功能无效也会返回 true
var isSupported = ('onhashchange' in window) && (document.documentMode === undefined || document.documentMode > 7);
```

### 设备事件

设备事件(device event),可以让开发人员确定用户在怎样使用设备.

1. orientationchage 事件

苹果公司为 Safari 浏览器添加了 orientationchange 事件, 以便开发者能确定用户何时将设备从横向查看模式切换为纵向查看模式.

移动 Safari 的 window.orientation 属性可能包含三个值: 0 表示肖像模式, 90 表示左旋转模式, -90 表示右旋转模式, 180 表示头朝下模式(此模式未支持)

```js
window.addEventListener('orientationchange', function(event) {
  console.log(window.orientation);
},false);
```

1. MozOrientation 事件

FireFox 引入了名为 MozOrientation 事件, 在 window 对象上触发, event 对象上有三个属性, 在静止状态, x = 0, y=0, z = 1; 设备向右倾斜, x 会减小; 向左倾斜, x 会增大.如果设备向远离用户的方向倾斜, y 会减小. 向接近用户的方向倾斜, y会增大; z 轴检测垂直加速度. 1 表示静止不动, 0 表示失重.

只有带有加速计的设备才支持此事件, 将来可能被取代.

1. deviceorientation 事件

本质上 DeviceOrientation Event 规范定义的 deviceorientation 事件与 MozOrientation 事件类似. 不过 deviceorientation 事件时告诉开发者设备在空间中朝向哪. 而不是如何移动.

设备在空间中靠 x, y, z 轴来定位的, 触发 deviceorientation 事件时,事件对象包含五个属性

1. alpha: 在围绕 z 轴旋转时(即左右旋转时), y 轴的度数差: 介于 0 到 360 的浮点数

1. beta: 在围绕 x 轴旋转(即前后旋转)时, z 轴的度数差: 介于 -180 到 180 的浮点数

1. gamma: 在围绕 y 轴旋转(即扭转设备)时, z 轴的度数差: 介于 -90 到 90 的浮点数

1. absolute: 布尔值,表示设备是否返回一个绝对值

1. compassCalibrated: 布尔值,表示设备的指南针是否校准过

#### devicemotion 事件

DeviceOrientation Event 规范还定义了一个 devicemotion 事件, 告诉开发人员设备什么时候移动, 而不仅仅是设备方向如何改变. 触发 devicemotion 事件,事件对象包含以下属性:

1. acceleration: 一个包含 x, y 和 z 的对象.在不考虑重力的情况,告诉你每个方向的加速度

1. accelerationIncludingGravity: 一个包含 x, y, z 的对象,在考虑 z 轴中立的情况,告诉你每个方向的加速度

1. interval: 以毫秒表示的时间值

1. rotationRate: 一个包含表示方向的 alpha, beta 和 gamma 属性的对象

只有 iOS 的 Safari, Chrome 和 Android 版 webkit 实现

### 触摸手势事件

Touch Events 只针对触摸设备,有以下几个触摸事件

1. touchstart: 当手指触摸屏幕时触发,即使已经有一个手指放在屏幕也会触发

1. touchmove: 当手指在屏幕上滑动时连续的触发,在这个事件发生期间,调用 event.preventDefault() 可以阻止滚动

1. touchend: 当手指从屏幕上移开时触发

1. touchcancel: 当系统停止跟踪触摸时触发

这些事件都会冒泡,event 对象除了常见的 DOM 属性外,还包含三个用于跟踪触摸的属性

1. touches: 表示当前跟踪触摸操作的 Touch 对象的数组

1. targetTouches: 表示事件目标的 Touch 对象的数组

1. changeTouches: 表示自上次触摸以来发生改变的 Touch 对象数组

每个 Touch 对象包含以下属性

1. clientX: 触摸目标在视口中的 x 坐标

1. clientY: 触摸目标在视口中的 y 坐标

1. identifier: 表示触摸的唯一 ID

1. pageX: 触摸目标在页面中的 x 坐标

1. pageY: 触摸目标在页面中的 y 坐标

1. screenX: 触摸目标在屏幕中的 x 坐标

1. screenY: 触摸目标在屏幕中的 y 坐标

1. target: 触摸的 DOM 节点目标

touchend 事件发生时, touches 集合中没有了 Touch 对象, 因为不存在活动的触摸操作,此时就必须使用 changeTouches 集合

在触摸屏幕上的元素时,这些事件(包括鼠标事件)的发生顺序如下:

    touchstart --> mouseover --> mousemove --> mousedown --> mouseup --> click --> touchend

#### 手势事件

1. gesturestart: 当一个手指已经安在屏幕上而另一个手指又触摸屏幕时触发

1. gesturechange: 当触摸屏幕的任何一个手指的位置发生变化时触发

1. gestureend: 当任何一个手指从屏幕上移开时触发

只有两个手指都触摸到使劲按的接受容器时才会触发这些事件,在一个元素上设置事件处理程序,意味着两个手机必须同时位于该元素的范围内

与触摸事件一样, event 对象包含着标准的鼠标事件属性,还有两个额外的属性:

1. rotation: 表示手指变化引起的旋转角度, 负值代表逆时针旋转, 正值代表顺时针旋转

1. scale: 表示li按个手指之间间距的变化,这个值从 1 开始,并随距离拉大而增长, 随距离缩短而减小.

## 内存与性能

在 JavaScript 中,添加到页面上的事件处理程序的数量将直接关系到页面的整体运行性能. 每个函数都是对象,都会占用内存;内存中对象越多,性能越差. 其次,必须事先制定所有的事件处理程序而导致 DOM 访问次数增多,延迟整个页面的交互就绪时间

### 事件委托

事件委托, 利用事件冒泡,只指定一个事件处理程序,管理某一类型的所有事件, 与传统方法相比, 具有以下优点:

1. document 对象很快就可以访问, 而且可以在页面生命周期的任何时间点为它添加事件处理程序

1. 在页面中设置事件处理程序所需的事件更少. 只添加一个事件处理程序所需的 DOM 引用更少,所花时间更少

1. 整个页面占用的内存空间更少,能提升整体性能

最适合采用事件委托技术的事件包括 click, mousedown, mouseup, keydown, keyup, keypress.

### 移除事件处理程序

导致空事件处理程序(dangling event handler)的情况:
第一种, 当 DOM 节点被移除时,事件处理程序仍然保持着与 DOM 节点的引用关系, 所以在移除节点之前,先移除节点的事件处理程序, 确保了内存被再次利用

另一种情况, 页面卸载之前没有清理干净事件处理程序, 每次加载再卸载页面时, 内存中滞留的对象增加, 事件处理程序占用的内存没有释放. 一般来说, 最好的做法,在页面卸载之前, 先通过 onunload 事件处理程序移除所有的事件处理程序, 事件委托此时再次体现了优势, 需要跟踪的越少,移除就越容易. 

> 使用了 onunload 事件处理程序意味着页面不会被缓存在 bfcache 中

## 模拟事件

事件经常由用户操作或者通过其他浏览器功能来触发。DOM2 级规范规定了模拟特定事件的方式。 IE9 等都支持这种方式。IE 有它自己的模拟事件的方式。

### DOM 中的事件模拟

可以在 document 对象上使用 createEvent() 方法创建这些 event 对象。整个方法接受一个参数，即表示要创建的事件类型的字符串。在 DOM2 级中，所有的这些字符串都使用英文的复数形式， 而在 DOM3 级中都变成了单数。

1. UIEvents: 一般化的 UI 事件。鼠标事件和键盘事件都继承自 UI 事件。 DOM3 级是 UIEvent。

1. MouseEvents: 一般化的鼠标事件。DOM3 级中是 MouseEvent。

1. MutationEvents: 一般化的 DOM 变动事件。DOM3 级中是 MutationEvent。

1. HTMLEvents: 一般化的 HTML 事件。没有 对应的 DOM3 级事件，都被分散到其他的类别中

触发模拟事件的方法， dispatchEvent() , 调用时需要传入一个参数，即表示要触发事件的 evnet 对象

#### 模拟鼠标事件

创建鼠标事件对象的方法是为 createEvent() 传入字符串 “MouseEvents"。返回的对象有一个名为 initMouseEvent() 的方法，用于指定与该鼠标事件的有关信息。整个方法接受 15 个参数。分别与鼠标事件的每个典型的属性一一对应。

    type, bubbles, cancelable, view(设置为 document.defaultView), detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget

其中，前 4 个参数对正确激发事件至关重要，剩余的参数在事件处理程序才用到， 当把 event 对象传给 dispatchEvent() 方法时，整个对象的 target 属性会自动设置。

```js
var btn = document.getElementById('myBtn');

// 创建事件对象
var event = document.createEvent('MouseEvents');

// 初始化事件对象
event.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

// 触发事件
btn.dispatchEvent(event);
```

#### 模拟键盘事件

DOM3 级规定，调用 createEvent() 并传入“KeyboardEvent”就可以创建一个键盘事件，返回的对象也会包含一个 initKeyEvent() 方法，这个方法接受下列参数

    type, bubbles, cancelable, view, key(按下键的键码), location(按了哪里的键), modifiers(空格分隔的修改键列表), repeat(在一行中按这个键多少次)

DOM3 级不提倡使用 keypress 事件，因此只能模拟 keydown 和 keyup.

FireFox 中，调用 createEvent() 并传入 “KeyEvents” 创建键盘事件。返回的事件对象包含一个 initKeyEvent() 方法，接受 10 个参数

    type, bubbles, cancelable, view, ctrlKey, altKey, shiftKey, metaKey, keyCode, charCode

在其他浏览器中，则需要创建一个通用的事件，然后再向事件对象添加键盘特有的信息

```js
var textBox = document.getElementById('myTextBox');
var event = document.createEvent('Events);

//初始化事件对象
event.initEvent(type, bubbles, cancelable);
event.view = document.defaultView;
event.altKey = false;
event.ctrlKey = false;
event.shiftKey = false;
event.metaKey = false;
event.keyCode = 65;
event.charCode = 65;

textBox.dispatchEvent(event);
```

#### 自定义 DOM 事件

自定义 DOM 事件，不是由 DOM 原生触发，目的是让开发人员创建自己的事件。要创建自定义事件，可以调用 createEvent('CustomEvent'),返回的对象有一个 initCustomEvent() 方法，接受 4 个参数

    type, bubbles, cancelable, detail(对象， 任意值， 保存在 event 对象的 detail 属性中)

```js
var div = document.createEvent('CustomEvent');
var event;

div.addEventListener('myevent', function(event) {
  console.log(event.detail)
},false);

if (document.implementation.hasFeature('CustomEvent', '3.0')) {
  event = document.createEvent('CustomEvent');
  event.initCustomEvent('myevent', true, false, 'hello');
  event.dispatchEvent(event)
}
```

### IE 的事件模拟

IE8 及之前的版本，先创建 event 对象，然后为其指定相应的信息，再触发对象, 调用 document.createEventObject() 创建 event 对象，再为 event 对象添加信息，最后通过 fireEvent() 方法触发，接受两个参数： 事件处理程序的名称和 event 对象。

```js
var textbox = document.getElementById('textbox');

var event = document.createEventObject();
event.altKey = false;
event.ctrlKey = false;
event.shiftKey =false;
event.keyCode = 65;

textbox.fireEvent('onkeypress', event);
```