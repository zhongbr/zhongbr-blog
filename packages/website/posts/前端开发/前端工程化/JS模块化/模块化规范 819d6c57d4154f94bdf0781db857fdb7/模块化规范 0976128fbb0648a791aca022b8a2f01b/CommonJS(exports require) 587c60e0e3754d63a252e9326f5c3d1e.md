# CommonJS(exports/require)

Tags: exports, module.exports, require

## 概述

CommonJS 是 Node 默认的模块化方案。

require/exports 是由 JavaScript 社区开发者在 ECMAScript 制定模块化规则之前，自行拟定的规则，得到了广泛的承认和使用。

CommonJS 就是其代表性的模块化规范，也是 NodeJS 使用的模块化方案，并且 NodeJS 已经有很多基于 CommonJS 的包。

## 加载过程

**CommonJS 模块是动态并且同步执行的**，执行到 require 函数语句时，对应的文件才会被加载并执行，将左右 module.exports 上设置的内容返回，所以在使用 require 时，并不要求 require 的位置，该语句可以在任意位置执行。

## 特点

导入包时使用的 **require 只是普通的函数，exports 也只是一个普通对象**，所以：

- 对于基础数据类型（例如 number、string 等），通过 exports 暴露后再从 require 引入是值传递，如果模块内的值在 exports 后发生变化，**由 require 引入的该值并不会发生变化**。
- 对于复杂数据类型（对象等），通过 exports 暴露后再通过 require 引入时，是浅拷贝。