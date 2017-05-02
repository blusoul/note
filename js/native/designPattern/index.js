// 单例模式
var getSingle = function (fn) {
    var result;
    return function () {
        return result || (result = fn.apply(this, arguments));
    }
};

// 策略模式


// 代理模式


// 迭代器模式


// 发布订阅模式
var Event = (function () {
    var clientList = {};
    var listen = function (key, fn) {
        if (!clientList[key]) {
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };

    var trigger = function () {
        var key = Array.prototype.shift.call(arguments);
        var fns = clientList[key];
        if (!(fns && fns.length)) {
            return false;
        }

        for (var i = 0, len = fns.length; i < len; i++) {
            fns[i].apply(this, arguments);
        }
    };

    var remove = function (key, fn) {
        var fns = clientList[key];
        if (!(fns && fns.length)) {
            return false;
        }

        if (fn) {
            for (var i = fns.length - 1; i >= 0; i--) {
                if (fns[i] == fn) {
                    fns.splice(i, 1);
                }
            }
        } else {
            fns.length = 0;
        }
    };

    return {
        listen: listen,
        trigger: trigger,
        remove: remove
    }
})();

// 命令模式


// 组合模式


// 模板方法模式


// 享元模式


// 职责链模式


// 中介者模式


// 装饰者模式
Function.prototype.before = function (beforeFn) {
    var _self = this;
    return function () {
        beforeFn.apply(this, arguments);
        return _self.apply(this, arguments);
    }
}

Function.prototype.after = function (afterFn) {
    var _self = this;
    return function () {
        var result = _self.apply(this, arguments);
        afterFn.apply(this, arguments);
        return result;
    }
}

//状态模式


//适配器模式
