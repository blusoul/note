window.onload = function () {
  console.log(event.target == document);
  console.log(event.currentTarget == window);
  console.log(event.srcElement); // IE8 以下为 null
}

// 验证浏览器是否支持 DOM2 HTMLEvents
var isSupportedDOM2 = document.implementation.hasFeature('HTMLEvents', '2.0');
var isSupportedDOM3 = document.implementation.hasFeature('UIEvent', '3.0');
console.log('DOM2: ' + isSupportedDOM2 + '---DOM3:' + isSupportedDOM3);


// 图片的 onload & onerror 事件, 一般在图片指定 src 之前为其绑定事件
var imgNode = document.getElementsByTagName('img')[0];
imgNode.onerror = function () {
  console.log('img is error');
};
var newImg = new Image();
newImg.onload = function () {
  console.log('invisible img is load');
};
newImg.src = 'img/time.jpg';

// dynamic script
var dynamicScript = document.createElement('script');
dynamicScript.type = 'text/javascript';
dynamicScript.src = 'js/dynamic.js';

dynamicScript.addEventListener('load', function () {
  console.log((event.target == this) + '--dynamic');
}, false);
document.body.appendChild(dynamicScript);

// unload
window.onunload = function () {
  alert('window will be closed');
}

window.onscroll = function () {
  if (document.compatMode == 'CSS1Compat') {
    console.log(document.documentElement.scrollTop + '--documentElement');
  } else {
    console.log(document.body.scrollTop + '--body');
  }
};

window.onresize = function () {
  console.log(event)
}