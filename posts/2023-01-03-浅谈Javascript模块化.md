---
title: '浅谈JavaScript模块化'
tags: ['前端工程化', '前端', 'NodeJS', 'CommonJs', 'ES Module', 'AMD']
recommend: 'frontend'
icon: '😁'
cover: 'https://i.328888.xyz/2023/01/02/tNist.png'
---
# 浅谈 JavaScript 模块化

JavaScript 在最开始时是没有模块化的概念的，即使在浏览器中使用多个 script 标签加载的 js，仍然是共享的全局变量空间。

**模块化规范**为 JavaScript 提供了模块编写、模块依赖和模块运行的方案。

总体来说，目前 JavaScript 有两种模块化规范(esm 和 CommonJS)，**并且这两种模块化规范并不完全兼容**。

## 1. CommonJS

### 概述

CommonJS 是 Node 默认的模块化方案。

require/exports 是由 JavaScript 社区开发者在 ECMAScript 制定模块化规则之前，自行拟定的规则，得到了广泛的承认和使用。

CommonJS 就是其代表性的模块化规范，也是 NodeJS 使用的模块化方案，并且 NodeJS 已经有很多基于 CommonJS 的包。

### 加载过程

**CommonJS 模块是动态并且同步执行的**，执行到 require 函数语句时，对应的文件才会被加载并执行，将左右 module.exports 上设置的内容返回，所以在使用 require 时，并不要求 require 的位置，该语句可以在任意位置执行。

### 特点

导入包时使用的 **require 只是普通的函数，exports 也只是一个普通对象**，所以：

- 对于基础数据类型（例如 number、string 等），通过 exports 暴露后再从 require 引入是值传递，如果模块内的值在 exports 后发生变化，**由 require 引入的该值并不会发生变化**。
- 对于复杂数据类型（对象等），通过 exports 暴露后再通过 require 引入时，是浅拷贝。

*****************

## 2. ES Module

### 概述

在 ES6 中，引入了一套新的模块化规范，从语言层面实现了模块功能，那就是 ESM。

ESM 模块的 import 语句，**是静态解析的，在编译时，就会解析并加载对应的模块**。所以使用 ESM 时，import 语句需要在文件的顶层。

### 加载过程

在 ESM 中，模块的加载是**异步执行**的。在第一阶段，所有使用到 import 和 export 关键字的语句都会被解析，用来构建**依赖关系图**。在此过程中，被引入的脚本并不会立即执行。

ESM 模块在加载的过程中，不需要实际执行被引入的文件的代码，一些 named import 内的错误就可以被发现。

ESM 模块在加载的过程中，会从入口文件开始，根据 import 关键字语句，由外到内构建模块之间的**依赖关系图，**直到没有任何其他依赖的模块。然后由内向外执行，一个模块依赖的其他模块都执行完成以后，这个模块才能得到执行。

### 特点

#### 1. ESM 导入和导出是引用传递

通过 export 导出值，通过 import 导入，**这两个是关键字，**且使用 export 导出的值是引用传递（两个标识符指向的是同一块内存）

```jsx
// a.js
export let a = 1;
export function changeA(v) {
	a = v;
}

// b.js
import { a, changeA } from 'a';
console.log(a);
changeA(2);
console.log(a);

// 输出
// 1
// 2
```

#### 2. ESM 模块内支持 Top Level Await

得益于 esm 模块的加载机制，模块的执行发生在依赖关系图构建完成以后，在 esm 模块内，可以在模块的顶层使用 await 关键字。

下面是一段引用自 v8 博客([Top-level await](https://v8.dev/features/top-level-await))的一段：

> Perhaps you have seen the infamous gist by Rich Harris which initially outlined a number of concerns about top-level await and urged the JavaScript language not to implement the feature. Some specific concerns were:
>
> - Top-level await could block execution.
> - Top-level await could block fetching resources.
> - There would be no clear interop story for CommonJS modules.
>
> The stage 3 version of the proposal directly addresses these issues:
>
> - **As siblings are able to execute**, there is no definitive blocking.
> - **Top-level await occurs during the execution phase of the module graph**. At this point all resources have already been fetched and linked. There is no risk of blocking fetching resources.
> - **Top-level await is limited to [ESM] modules**. There is explicitly no support for scripts or for CommonJS modules.

```js
// CommonJS
const a = require('a.cjs');
const b = require('b.cjs');
// ESM
import { a } from 'a.mjs';
import { b } from 'b.mjs';
```

由于 CommonJS 的 require 函数是同步执行的，所以如果 a.cjs 内有顶层的 await ，那么 require(’b.cjs’) 的语句就会被阻塞，并且 CommonJS 是在执行到 require 的时候才会加载并执行对应的模块，顶层 await 甚至会阻塞到 b.cjs 资源的加载。

但是在 ESM 中就不会有这个问题，因为 import 的构建依赖关系图的过程是在编译时就会确定好了，此时不会执行模块的代码。各个模块也是在一个异步的函数内执行的，所以模块执行时也不会相互阻塞。

**************

## 3. AMD(define/require)

### 概述

AMD 也是一种社区开发者实现的 JavaScript 模块化规范，与 CommonJS 不同的是，AMD的导入 require 是**异步**的，AMD 模块化规范是可以不需要转换，通过在浏览器内引入 AMD 实现（最具有代表性的实现 [requirejs](https://requirejs.org/)）的方式，在浏览器内直接运行的。

### 实现原理

在浏览器内通过 <script> 标签引入了 AMD 规范的实现之后，会在浏览器全局注册两个函数:

- define 函数：用于声明模块，接受3个参数，模块的名称、模块依赖的其他模块名称数组以及生成模块的函数
- require 函数：用于通过模块的名称导入对应的模块

```js
// 定义一个模块
define('module', ['dep'], function(dep) {
  return exports;
});

// 导入和使用
require(['module'], function(module) {
});
```

### 优点

- 可在不转换代码的情况下直接在浏览器中运行；
- 可异步加载依赖；
- 可并行加载多个依赖；
- 代码可运行在浏览器环境和 Node.js 环境下。

### 缺点

不管是在浏览器环境还是 NodeJS 环境，JavaScript 原生都是不支持 AMD 模块化规范的，需要引入对应的库之后才能使用。

并且 AMD 模块化的实现库，必须要在模块声明之前就加载完成。

浏览器原生是不支持 AMD 的，需要导入实现了 AMD 模块化规范的库（例如 [requirejs](https://requirejs.org/)），才可以使用。

**************

## 4. CommonJS 和 ESM 横向比较

1. 使用 esm 编写的模块，**不能被 require**，只能使用 import 关键字导入；

   > 这是由于 esm 模块内是支持顶层 await 的，但是 cjs 模块是不支持的。
>
2. 使用 cjs 编写的模块，不能被 import 关键字导入（可以使用 default import 兼容，见第3条），只能使用 require 函数来导入；

   > 这是由于 cjs 编写的模块，其内部导出的内容是动态的，**需要被导入的文件执行完成以后**，才能确定有哪些内容被挂载到 module.exports 上，而 import 的关键字的解析是需要在编译时进行的，此时模块还没有被执行。
>
3. 使用 cjs 编写的模块，可以被 default import ，但是不能被 named import；
4. 可以在 esm 模块内使用 require 来导入 cjs 模块，即使该 cjs 模块使用的是 named export。但是这样的使用可能会在 webpack、rollup 等构建工具中带来不必要的麻烦。
5. cjs 是默认的模块化方案，如果你想使用 esm ，可以将 js 的文件后缀名修改为 .mjs。或者可以**将 package.json 中的 type 设置为 module ，将 esm 设置为默认的模块化方案**，如果此时想使用 cjs ，需要将对应的文件后缀名改为 .mjs。

*************

## 5. 案例和坑

随便打开一个 React 项目的 node_modules ，不难发现，其实 React 只提供了 cjs 格式的包：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0c6ae159-0da8-4def-a35c-aa22272513d1/Untitled.png)

正常情况下，我们在代码里使用 React 的时候，应该按照下面的方式来引入：

```jsx
import React from 'react';
const { useEffect } = React;
```

但是在项目实际开发的时候，我们直接按照 esm 的方式来引入 React 更为常见，并且也不会报错，执行起来也是没问题的。

```jsx
import React, { useEffect } from 'react';
```

这是由于 babel、webpack 等会在编译的时候对 React 进行特殊处理，让其支持通过 esm 的方式来引入 npm 包。
