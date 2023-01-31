# Code Sandbox

## 1. Install

### React Component

```shell
npm install @zhongbr/code-sandbox
```

```jsx
import ReactDom from 'react-dom';
import  CodeSandbox, { registerPlugins } from '@zhongbr/code-sandbox';
import { ReactPolyfill } from '@zhongbr/code-sandbox/es/plugins/react';
import { JsxPlugin } from '@zhongbr/code-sandbox/es/plugins/babel';

registerPlugins([
    new ReactPolyfill(),
    new JsxPlugin(),
]);

ReactDom.render(<CodeSandbox html="<h1>hello world</h1>" />, document.getElementById('root'));
```

### webcomponent
es module
```html
<script type="module">
  import {
    CodeSandbox,
    registerPlugins
  } from "https://cdn.jsdelivr.net/npm/@zhongbr/code-sandbox@latest/es/webcomponent.js";
  import { ReactPolyfill } from "https://cdn.jsdelivr.net/npm/@zhongbr/code-sandbox@latest/es/plugins/react/index.js";
  import { JsxPlugin, EsmToAmdPlugin } from "https://cdn.jsdelivr.net/npm/@zhongbr/code-sandbox@latest/es/plugins/babel/index.js";
  registerPlugins([new JsxPlugin(), new EsmToAmdPlugin(), new ReactPolyfill()]);
  if (!customElements.get("code-sandbox")) {
    customElements.define("code-sandbox", CodeSandbox);
  }
</script>
<code-sandbox
  html="<div id='root'>wait...🚀</div>"
/>
```

## 2. Base usage

### Properties

#### The same properties between React component and Webcomponent .

| name  | type   | usage                            |
|-------|--------|----------------------------------|
| html  | string | html code in sandbox             |
| css   | string | css code in sandbox              |
| code  | string | javascript code in sandbox       |
| index | string | entry javascript code in sandbox |

#### React Component properties

| name            | type                                            | usage                                                               |
|-----------------|-------------------------------------------------|---------------------------------------------------------------------|
| style           | React.CSSProperties                             | inline styles for the iframe container                              |
| class           | string                                          | css class name for the iframe container                             |
| onLoadingModule | (moduleName: string, extraInfo: string) => void | event will be triggered when sandbox requiring module from internet |
| onReady         | () => void                                      | event will be triggered when sandbox codes have executed finished . |

#### Web Component properties

| name      | type   | usage                                       |
|-----------|--------|---------------------------------------------|
| style     | string | inline style for sandbox iframe container   |
| className | string | css class name for sandbox iframe container |

##### Events

You can use `addEventListener` method of `code-sandbox` dom node to access the event.

- `loading-module`: event will be triggered when sandbox requiring module from internet, you can get module informations from `detail` of the event object .
- `ready`: event will be triggered when sandbox codes have executed finished .

## 3. Plugins

### Internal plugins

Some internal plugins are provided in `plugins` directory of this package.

```javascript
import { JsxPlugin } from '@zhongbr/code-sandbox/es/plugins/babel';
```

- `unpkg`: `UnpkgPlugin`, use [https://unpkg.com](https://unpkg.com) to load package not exists.
- `jsdelivr`: `JsdelivrPlugin`, use [https://jsdelivr.com](https://jsdelivr.com) to load package not exists.
- `react`: 
  - `ReactPolyfill`, this is a polyfill plugin to require `react` and `react-dom` package. 
  If you want to require react packages in your demo code, you need to register this plugin, because there is no `unpkg` fields in react package.
- `babel`: these plugins depend on `@babel/standalone`, so the bundle will be a little large.
  - `JsxPlugin`, you can register this plugin to execute `JSX` codes in sandbox.
  - `EsmToAmdPlugin`, you can register this plugin to use ESM import and export keywords in your sandbox.

### Custom plugin lifecycles

- `resolveModuleUrl`
- `require`
- `beforeModuleGenerate`
