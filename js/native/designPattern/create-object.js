// 创建对象的方法

// Object 构造函数
var objConstructor = new Object();
objConstructor.name = 'bob';
objConstructor.age = '12';
objConstructor.sayName = function () {
  console.log(this.name + ' is ' + this.age);
}

// 对象字面量
var literalPerson = {
  name: 'bob',
  age: '12',
  sayName: function () {
    console.log(this.name + ' is ' + this.age);
  }
};


/**
 * 工厂模式
 */
function createPerson(name, age) {
  var o = new Object();
  o.name = name;
  o.age = age;
  o.sayName = function () {
    console.log(this.name + ' is ' + this.age);
  };
  return o;
}

var person1 = createPerson('bob', '12');

// 解决了创建多个相似对象的问题，没有解决对象识别问题


/**
 * 构造函数模式 
 */
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.sayName = function () {
    console.log(this.name + ' is ' + this.age);
  }
}

var person2 = new Person('bob', '12');
var person3 = new Person('Tom', '15');
console.log(person2 instanceof Person);

// 构造函数解决了对象识别问题，每个方法在实例上都要重新创建一遍，不同实例的同名函数是不相等的
console.log(person2.sayName == person3.sayName);

// 若函数移到构造函数之外，但是这个全局的函数只是被偶一个对象调用，多个方法就需要定义多个全局函数，引用类型就无封装性可言


/**
 * 原型模式： 可以让所有实例共享属性和方法
 */
function Person() {

}

Person.prototype.name = 'bob';
Person.prototype.age = '23';
Person.prototype.sayName = function () {
  console.log(this.name + ' is ' + this.age);
};

var person1 = new Person();
person1.name = 'Greg';

// 确定对象之间是否存在某种关系
// 实例与构造函数之间没有直接关系，只是内部包含一个指针，指向构造函数的原型对象，[[prototype]] __proto__
// 属性遮蔽
console.log(Person.prototype.isPrototypeOf(person1)); // true
console.log(Object.getPrototypeOf(person1) == Person.prototype);

// 实例方法： hasOwnProperty 检测属性是存在实例中，还是从原型继承而来
console.log(person1.hasOwnProperty('name')) // true;

// 操作符： in 通过对象能够访问到的给定的属性返回 true
console.log('name' in person1);

// 构造方法 Object.keys 返回可枚举属性的字符串数组
Object.keys(person1);

// 构造方法 Object.getOwnPropertyNames 返回所有的实例属性，无论是否可枚举  支持 IE9+ F4+ S5+ O12+ Chrome
console.log(Object.getOwnPropertyNames(person1));

// 更简单的原型语法
function Person() {

}

// 重写构造函数的原型对象，通过 constructor 无法确定对象类型
Person.prototype = {
  constructor: Person, // 重新设置 constructor 属性，但如此可枚举属性 [[Enumerable]] 属性为 true
  name: 'nick',
  age: '12',
  sayName: function () {
    console.log(this.name + ' is ' + this.age);
  }
}

// 只适用 ECMAScript 5 兼容浏览器
Object.defineProperties(Person.prototype, 'constructor', {
  enumerable: false,
  value: Person
});

// 原型缺点： 省略为构造函数传参，所有实例取得的属性相同， 这种共享对于函数很适用，但是引用类型的值就比较尴尬


/**
 * 组合使用构造函数模式和原型模式
 */
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.friends = ['shelby', 'court'];
}

Person.prototype = {
  constructor: Person,
  sayName: function () {
    console.log(this.name)
  }
};

var person1 = new Person();
var person2 = new Person();
person1.friends.shift();



/**
 * 动态原型模式 不能使用对象字面量重写原型，否则会切断现有实例和新原型之间的联系
 * 解决独立的构造函数和原型的困惑，具体时间差一个方法是否存在，来决定是否初始化原型
 */
function Person(name, age) {
  this.name = name;
  this.age = age;

  if (typeof this.sayName != 'function') {
    Person.prototype.sayName = function () {
      console.log(this.name)
    }
  }
}



/**
 * 寄生构造函数, 返回的对象与构造函数和构造函数的原型没有关系，不能修改原生内置构造函数，用法未知
 */
function Person(name, age) {
  var o = new Object();
  o.name = name;
  o.age = age;
  o.sayName = function () {
    console.log(this.name)
  }
  return o; // 重写构造函数返回值
}

var person1 = new Person('bob', 12);


/**
 * 稳妥构造函数, 不用 this,不用 new 用在安全环境, 除了 sayName 没有别的方法访问其数据成员， instanceof 没有意义
 */
function Person(name, age) {
  var o = new Object();

  o.sayName = function () {
    console.log(name);
  }

  return o;
}

var person1 = Person('hello', 13);


// 继承 +++++++++++++

/**
 *  原型链， 实现本质重写原型对象， 缺点 还是共享引用属性的问题
 */
function SuperType() {
  this.value = true;
}

SuperType.prototype.getValue = function () {
  return this.value;
}

function SubType() {
  this.value = false;
}

SubType.prototype = new SuperType();

SubType.prototype.getValue = function () {
  return this.value;
};

var student = new SubType();



/**
 * 借用构造函数, 方法都在构造函数定义，复用无从谈起
 */
function SuperType() {
  this.colors = ['red', 'pink'];
}

function SubType() {
  SuperType.call(this);
}


/**
 * 组合继承 伪经典继承，将原型链和借用构造函数结合的一种继承模式
 */
function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'pink'];
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
}

function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}

SubType.prototype = new SuperType();

SubType.prototype.sayAge = function () {
  console.log(this.age);
};

var instance1 = new SubType('bob');



/**
 * 原型式继承 ，对传入的对象进行一次浅复制,没有使用严格意义上的构造函数
 */
function object(o) {
  function F() {};
  F.prototype = o;
  return new F();
}

// 构造方法： Object.create 规范化了原型式继承
var person = {
  name: 'bob',
  colors: ['red', 'pink']
};

var person1 = Object.create(person);
person1.name = 'cc';
person1.colors.push('black');

var person2 = Object.create(person);
console.log(person2);


/**
 * 寄生式继承 在函数内部以某种形式增强对象
 */
function createAnother(original) {
  var clone = object(original);
  clone.sayName = function () {
    console.log('hi');
  };
  return clone;
}

/**
 * 组合继承最大的问题：调用两次超类型构造函数，
 * 通过借用构造函数继承属性，通过原型链的混成形式继承方法
 * 基本思路: 不必为了指定子类型原型而调用超类型构造函数，只是需要超类型原型的副本，
 * 本质就是：使用寄生式继承来继承超类型的原型，然后将结果指给子类型的原型
 */
function Person(name) {
  this.name = name;
  this.colors = ['red', 'pink'];
}

SuperType.prototype.sayName = function () {
  console.log(this.name);
};

function SubType(name, age) {
  SuperType.call(this, name);
  this.age = '12';
}

SubType.prototype = Object.create(SuperType.prototype);
SubType.prototype.constructor = SubType;

SubType.prototype.sayAge = function () {
  console.log(age);
}

var sub1 = new SubType('bob', '12');