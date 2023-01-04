# ESM(import/export)

Tags: exports, import

## 概述

在 ES6 中，引入了一套新的模块化规范，从语言层面实现了模块功能，那就是 ESM。

ESM 模块的 import 语句，**是静态解析的，在编译时，就会解析并加载对应的模块**。所以使用 ESM 时，import 语句需要在文件的顶层。

## 加载过程

在 ESM 中，模块的加载是**异步执行**的。在第一阶段，所有使用到 import 和 export 关键字的语句都会被解析，用来构建**依赖关系图**。在此过程中，被引入的脚本并不会立即执行。

ESM 模块在加载的过程中，不需要实际执行被引入的文件的代码，一些 named import 内的错误就可以被发现。

ESM 模块在加载的过程中，会从入口文件开始，根据 import 关键字语句，由外到内构建模块之间的**依赖关系图，**直到没有任何其他依赖的模块。然后由内向外执行，一个模块依赖的其他模块都执行完成以后，这个模块才能得到执行。

## 特点

### 1. ESM 导入和导出是引用传递

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

### 2. ESM 模块内支持 Top Level Await

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

```jsx
// CommonJS
const a = require('a.cjs');
const b = require('b.cjs');
// ESM
import { a } from 'a.mjs';
import { b } from 'b.mjs';
```

由于 CommonJS 的 require 函数是同步执行的，所以如果 a.cjs 内有顶层的 await ，那么 require(’b.cjs’) 的语句就会被阻塞，并且 CommonJS 是在执行到 require 的时候才会加载并执行对应的模块，顶层 await 甚至会阻塞到 b.cjs 资源的加载。

但是在 ESM 中就不会有这个问题，因为 import 的构建依赖关系图的过程是在编译时就会确定好了，此时不会执行模块的代码。各个模块也是在一个异步的函数内执行的，所以模块执行时也不会相互阻塞。