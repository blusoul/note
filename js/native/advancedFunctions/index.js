// 高阶函数是指满足下列条件之一的函数：
// 1. 函数作为参数传递
// 2. 函数作为返回值输出

// 函数作为参数传递，回调

// 函数作为返回值输出
// 判断数据类型
var Type = {};
for (var i = 0, type; type = ['String', 'Array', 'Number'][i++];) {
	(function (type) {
		Type['is' + type] = function () {
			return Object.prototype.toString.call(obj) == '[object ' + type + ']';
		}
	})(type)
}


// 面向切面编程（AOP）实现装饰者模式
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

// 高阶函数其他应用
// 1.currying  函数柯里化
var currying = function (fn) {
	var args = [];
	return function () {
		if (arguments.length == 0) {
			return fn.applay(this, args);
		}
		[].push.apply(args, [].slice.call(arguments));
		return arguments.callee;
	}
};

// 2. uncurrying 反柯里化
Function.prototype.uncurrying = function () {
	var self = this;
	return function () {
		var obj = Array.prototype.shift.call(arguments);
		return self.apply(obj, arguments);
	}
}

Function.prototype.uncurrying = function () {
	var self = this;
	return function () {
		Fuction.prototype.call.apply(self, arguments);
	}
}

// 函数节流
var throllte = function (fn, interval) {
	var _self = fn;
	var timer;
	var firstTime = true;
	return function () {
		var args = arguments;
		var _this = this;

		if (firstTime) {
			_self.applay(_this, args);
			firstTime = false;
			return false;
		}

		if (timer) {
			return false;
		}

		timer = setTimeout(function () {
			clearTimeout(timer);
			timer = null;
			_self.apply(_this, args);

		}, interval || 500)
	}
};

//分时函数

var timeChunk = function (arr, fn, count) {
	var obj;
	var timer;

	var start = function () {
		for (var i = 0; i < Math.min(count || 1, arr.length); i++) {
			var obj = arr.shift();
			fn(obj);
		}
	};

	return function () {
		timer = setInterval(function () {
			if (arr.len === 0) {
				return clearInterval(timer);
			}
			start();
		}, 200)
	}
}

// 惰性函数
var addEvent = function (elem, type, handler) {
	if (window.addEventListener) {
		addEvent = function (elem, type, handler) {
			elem.addEventListener(elem, type, handler);
		};
	} else {
		addEvent = function (elem, type, handler) {
			elem.attachEvent(elem, type, handler);
		};
	}

	addEvent(elem, type, handler)
};
