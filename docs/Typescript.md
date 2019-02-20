## 笔记

1. project 使用 typescript 都需要初始化(即生成 typeconfig.json), 命令: tsc --init

1. object 与 any 的区别：

   1. 两者都可以使用所有类型

   1. object 不能使用其具有的属性，any 则只是屏蔽类型检查

1. const 与 readonly

   1. 两者都是不可重新赋值

   1. 变量用 const, 属性用 readonly

1. 遵循最小特权原则，后续不需要改变的变量一律用 const
