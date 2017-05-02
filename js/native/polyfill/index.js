// 继承
function Person(name, age) {
	this.name = name;
	this.age = age;
}

Person.prototype.sayHello = function () {
	console.log('Hi, my name is ' + this.name + ' and I am ' + this.age + ' years old');
	return this;
}

Person.prototype.setName = function (str) {
	this.name = str;
	return this;
}

function Student(name, age, info) {
	Person.call(this, name, age);
	this.info = info;
}

Student.prototype = Object.create(Person.prototype);

Student.prototype.constructor = Person;

Student.prototype.sayHello = function () {
	console.log(this.name + ' is ' + this.age + ' years old ! ' + this.info);
	return this;
}

var a = new Person('John', 18);
var b = new Student('Jack', 20, 'yeah');

console.log(a instanceof Person);
console.log(b instanceof Student);
console.log(b instanceof Person);

a.sayHello();
b.sayHello();
b.setName('ruben').sayHello();


if (Function.prototype.bind !== 'function') {
	Function.prototype.bind = function () {
		var bb;
	};
}

function Car() {

}

Car.prototype = {
	whistle: function () {
		console.log('bebe');
	}
}

Car.prototype.constructor = Car;

var benz = new Car;

benz.whistle();

// 行为委托

var LoginCtrl = {
	verifyUser: function () {
		console.log('user');
		return this;
	},
	verifyPsw: function () {
		console.log('psw');
		return this;
	}
};

var RegCtrl = Object.create(LoginCtrl);

RegCtrl.verifyPhone = function () {
	console.log('phone');
	return this;
};
RegCtrl.verifyCode = function () {
	console.log('code');
	return this;
};

var reg1 = Object.create(RegCtrl);

reg1.verifyPhone().verifyPsw();

// Object.create polyfill

if (typeof Object.create == 'function') {
	Object.create = (function () {
		function Temp() {}

		var hasOwn = Object.prototype.hasOwnProperty;

		return function (O, properties) {
			if (typeof O != 'object') {
				throw TypeError('argument must be an Object or null');
			}

			Temp.prototype = O;
			var result = new Temp();
			Temp.prototype = null;

			// if (properties) {
			// 	Object.defineProperties(result, properties);
			// }

			if (properties) {
				for (var prop in properties) {
					if (hasOwn.call(properties, prop)) {
						result[prop] = properties[prop];
					}
				}
			}


			if (O === null) {
				result.__proto__ = null;
			}

			return result;
		}
	})();
}

var bb = Object.create(null);
console.log(bb)

// 混入
function mixin(sourceObj, targetObj) {
	for (var key in sourceObj) {
		if (!(key in targetObj)) {
			targetObj[key] = sourceObj[key];
		}
	}
	return targetObj;
}




// 定义属性
var temp = {
	age: 18
};
console.log(temp.length)

Object.defineProperty(temp, 'name', {
	value: 'Bob',
	configurable: false,
	writable: false,
	enumerable: false
});

// Object.preventExtensions(temp);
// Object.seal(temp)
// Object.freeze(temp);
// console.log(Object.isExtensible(temp))
// console.log(Object.isSealed(temp))
// console.log(Object.isFrozen(temp))
temp.dd = 1;

console.log(Object.getOwnPropertyNames(temp));

const mm = Object.keys(temp);
console.log(mm);

Function.prototype.bind = function (oThis) {
	if (typeof this !== 'function') {
		// closest thing possible to the ECMAScript 5
		// internal IsCallable function
		throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
	}

	var aArgs = Array.prototype.slice.call(arguments, 1);
	var fToBind = this;
	var fNOP = function () {};
	var fBound = function () {
		return fToBind.apply(this instanceof fNOP ?
			this :
			oThis,
			aArgs.concat(Array.prototype.slice.call(arguments)));
	};

	if (this.prototype) {
		// Function.prototype doesn't have a prototype property
		fNOP.prototype = this.prototype;
	}
	fBound.prototype = new fNOP();

	return fBound;
};


function Add() {
	this.age = 20;
	console.log(this.age)
}

var newObj = {
	age: 20,
	getAge: function getAge(arr) {
		console.log(this.age);
	}
}

// newObj.getAge.bind(getAge, [1, 2])();

Add.bind(temp)();

var ddd = new Add();

console.log(ddd);
