# AMD(define/require)

Tags: define, require

## 概述

AMD 也是一种社区开发者实现的 JavaScript 模块化规范，与 CommonJS 不同的是，AMD的导入 require 是**异步**的，AMD 模块化规范是可以不需要转换，通过在浏览器内引入 AMD 实现（最具有代表性的实现 [requirejs](https://requirejs.org/)）的方式，在浏览器内直接运行的。

## 实现原理

在浏览器内通过 <script> 标签引入了 AMD 规范的实现之后，会在浏览器全局注册两个函数:

- define 函数：用于声明模块，接受3个参数，模块的名称、模块依赖的其他模块名称数组以及生成模块的函数
- require 函数：用于通过模块的名称导入对应的模块

```jsx
// 定义一个模块
define('module', ['dep'], function(dep) {
  return exports;
});

// 导入和使用
require(['module'], function(module) {
});
```

## 优点

- 可在不转换代码的情况下直接在浏览器中运行；
- 可异步加载依赖；
- 可并行加载多个依赖；
- 代码可运行在浏览器环境和 Node.js 环境下。

## 缺点

不管是在浏览器环境还是 NodeJS 环境，JavaScript 原生都是不支持 AMD 模块化规范的，需要引入对应的库之后才能使用。

并且 AMD 模块化的实现库，必须要在模块声明之前就加载完成。

浏览器原生是不支持 AMD 的，需要导入实现了 AMD 模块化规范的库（例如 [requirejs](https://requirejs.org/)），才可以使用。

## 实现原理

导入了 AMD 模块化规范的实现后，会在浏览器的上下文内挂载两个函数，一个 define 函数用于声明模块，一个 require 函数用于导入模块。

```jsx
// 定义一个模块
define('module', ['dep'], function(dep) {
  return exports;
});

// 导入和使用
require(['module'], function(module) {
});
```

AMD 也是一种社区开发者实现的 JavaScript 模块化规范，同样采用一个 require 函数来导入模块，但是 AMD 内的 require 函数是异步执行的。

## 优点

- 可在不转换代码的情况下直接在浏览器中运行（但是一定要保证 AMD 实现库加载后，其他的脚本再执行）；
- 可异步加载依赖；
- 可并行加载多个依赖；
- 代码可运行在浏览器环境和 Node.js 环境下。