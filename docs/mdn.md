# MDN 笔记

## Web 

### setTimeout & setInterval

    setTimeout(function[, delay, param1, param2, ...])

1. delay: 

    最小延迟时间 >= 4ms DOM_MIN_TIMEOUT_VALUE(setTimeout()/setInterval() 的每调用一次定时器的最小间隔是4ms,
    最大延迟值： 大于 2147483647 (大约24.8 天)会溢出，立即执行) 
    [浏览器中实现0ms延时的定时器](https://dbaron.org/log/20100309-faster-timeouts)

    ```javascript
     (function() {
        var timeouts = [];
        var messageName = "zero-timeout-message";

        // Like setTimeout, but only takes a function argument.  There's
        // no time argument (always zero) and no arguments (you have to
        // use a closure).
        function setZeroTimeout(fn) {
            timeouts.push(fn);
            window.postMessage(messageName, "*");
        }

        function handleMessage(event) {
            if (event.source == window && event.data == messageName) {
                event.stopPropagation();
                if (timeouts.length > 0) {
                    var fn = timeouts.shift();
                    fn();
                }
            }
        }

        window.addEventListener("message", handleMessage, true);

        // Add the one thing we want added to the window object.
        window.setZeroTimeout = setZeroTimeout;
    })();
    ```

1. param: 附加参数，会在定时器到期时传给function(ps: 不兼容IE9以及以下，包裹函数或者 bind 消耗更多的性能)

1. this: 调用的代码运行在与所在函数完全分离的执行环境上，this 指向 window 严格模式可能是undefined