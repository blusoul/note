(function (win, doc) {

  // DOM0 级方法
  // 为以下节点绑定事件，验证事件流
  var arr = ['span', 'div', 'body', 'html', win];
  var getTagName = doc.getElementsByTagName.bind(doc);

  // arr.map(function(item) {
  //   const isTagName = typeof item == 'string';
  //   const eventTarget = isTagName ? getTagName(item)[0] : item;
  //   const str = isTagName ? item : 'window';

  //   eventTarget.onclick = function (e) {
  //     console.log(str);
  //   }
  // });

  // DOM2 级方法
  var isCapture = true;
  arr.map(function (item) {
    var isTagName = typeof item == 'string';
    var eventTarget = isTagName ? getTagName(item)[0] : item;
    var str = isTagName ? item : 'window';

    eventTarget.addEventListener('click', function () {
      // 阻止进一步捕获
      // event.stopPropagation();
      console.log(str + '--capture');
    }, isCapture);

    eventTarget.addEventListener('click', function () {
      // 阻止进一步冒泡
      // event.stopPropagation();
      console.log(str + '--bubbling');
    }, !isCapture);
  });

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

  document.getElementsByTagName('span')[0].onclick = function () {
    console.log(11111)
  }

  var btn = document.getElementById('btn');
  if (btn.attachEvent) {
    btn.attachEvent('onclick', function (e) {
      console.log(e.type)
      console.log(this === window); // true
    });
    btn.attachEvent('onclick', function () {
      console.log(event.type + '--attach');
      console.log('hello');
    });
  }

  doc.body.onclick = function (event) {
    console.log(event.currentTarget == doc.body); // true
    console.log(this == doc.body); // true
    console.log(event.target == doc.getElementById('myBtn')); // true
  }

  // 阻止默认事件
  var link = document.getElementById('myLink');
  link.onclick = function (event) {
    console.log(event.cancelable); // 是否可以取消事件默认行为
    console.log(event.defaultPrevented);
    event.preventDefault();
    console.log(event.defaultPrevented);
  };

  var mouseContent = document.getElementById('mouseContent');
  mouseContent.onmousemove = function (event) {
    console.log(event.cancelable); // 是否可以取消事件默认行为
    console.log(event.defaultPrevented);
    event.preventDefault();
    console.log(event.defaultPrevented);
  };

  btn.onclick = function () {
    var event = window.event;
    console.log(event.type);
  };


})(window, document);