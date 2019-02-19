# 小记

## Image 问题

1. Image 对象, 在加载同一 src 时，onload 不一定会触发（Webkit 如 iOS 上不会触发），

   方法一：每次重新 new 一个 Image 对象，或者 src 增加版本号，但是这样的影响是，Image 对象不能共用造成浪费，或者相同图片要多次加载不能更好的利用缓存

   方法二：只需要一个 Image 对象，对 onload 成功的图片地址进行缓存，也可以对图片地址  的 hash 进行缓存

```javascript
// 相同src不会触发onload
const loadImg = (() => {
  const img = new Image();
  const loadedList = [];
  return (src = '') => {
    return new Promise((resolve, reject) => {
      // 加载过的图片
      if (loadedList.includes(src)) {
        img.src = src;
        // console.log('cache:' + img.height)
        return resolve(img);
      }

      img.onload = () => {
        loadedList.push(src);
        // console.log('onload:' + img.height);
        return resolve(img);
      };
      img.onerror = err => reject(err);
      img.src = src;
    });
  };
})();
```

hasCode 方法

```javascript
function hashCode() {
  var hash = 0;
  if (this.length == 0) return hash;
  for (i = 0; i < this.length; i++) {
    char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
```

2. onload 只是加载完成，图片还未  解码渲染，插入页面会卡顿，可以在 image decode 完成之后插入页面加上 requestAnimationFrame 避免丢帧

```javascript
// decode 返回一个thenable
const img = new Image();
img.src = 'xxx.png';
img
  .decode()
  .then(() => {
    requestAnimationFrame(() => document.body.appendChild(img));
  })
  .catch(err => {});
```

## 在线示例

[图片加载示例](https://codepen.io/blusoul/pen/RvPdeJ)

## 参考

[jQuery load event](https://api.jquery.com/load-event/)

![img](https://i.loli.net/2019/01/24/5c49b87e4bccc.png)

[whatwg dom-image](https://html.spec.whatwg.org/multipage/embedded-content.html#dom-image)

https://www.samanthaming.com/tidbits

https://kangax.github.io/compat-table/es6/

https://www.ecma-international.org/ecma-262/9.0/index.html#sec-memory-model-fundamentals
