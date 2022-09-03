---
'title': '建立typescript+react+webpack+electron的桌面应用项目'
'tags': ['react', 'webpack', 'electron', 'typescript']

---

# 建立TypeScript+React+Webpack+Electron的桌面应用项目

## 项目结构

![项目结构](https://tva1.sinaimg.cn/large/0081Kckwgy1gl50vb37b1j30oi0xu77f.jpg)

## 1. 新建一个React + TypeScript的项目

使用 create-react-app 命令，新建一个React + TypeScript项目

```bash
create-react-app <my-project-name> --typescript
```

\<my-project-name\>是项目的名称，会自动 npm install，如果自动安装依赖失败，可以手动安装依赖

```bash
npm install
```

----

## 2. 安装并配置Babel

使用 create-react-app 命令创建的项目默认使用 tsc 编译文件，如果需要使用webpack打包，可以使用 babel 将TypeScript代码转换成JavaScript代码，作为一个loader配置在webpack中。

需要安装如下的依赖

```json
{
  "devDependencies":{
    "@babel/core": "^7.12.3",
  	"@babel/preset-env": "^7.12.7",
  	"@babel/preset-react": "^7.12.7",
  	"@babel/preset-typescript": "^7.12.1",
  }
}
```

使用npm安装：

```bash
npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/preset-typescript @babel/preset-react
```

在项目的根目录新建一个".babelrc"的Babel配置文件，并写入如下的内容

```json
{
  "presets":[
    "@babel/preset-typescript",
    "@babel/react",
    "@babel/env"
  ]
}
```

## 3. 安装并配置Electron和webpack

webpack版本: 4.x

为了可以正确处理css、svg、html等静态文件，可以安装如下的plugin或者loader

```json
{
  "devDependencies":{
    "webpack-html-plugin": "^0.1.0",
    "css-loader": "^5.0.1",
    "raw-loader": "^4.0.2",
    "copy-webpack-plugin": "^6.3.2",
    "file-loader": "^6.1.1",
    "style-loader": "^1.3.0"
  }
}
```

使用npm安装

```bash
npm install --save-dev webpack-html-plugin@0.1.0 css-loader@5.0.1 raw-loader@4.0.2 copy-webpack-plugin@6.3.2 file-loader@6.1.1 style-loader@1.3.0
```

在项目的根目录新建 webpack.ui.js 和 webpack.main.js，编辑如下的配置

### I. webpack.ui.js ElectronUI进程使用的资源文件webpack打包配置

```javascript
const HtmlWebpackPlugin = require('webpack-html-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
module.exports = {
    target: "electron-renderer",
    resolve: {
        extensions: ['.ts', '.tsx', '.d.ts', '.js', '.jsx', '.d.js', '.css']
    },
    entry: {
        ui: path.resolve(__dirname, 'src','ui','index.tsx')
    },
    output: {
        filename: '[name]_bundle.js',
        path: path.resolve(__dirname, 'dist', 'ui')
    },
    module: {
        rules: [
            {
                test: /\.[t|j]sx?/,
                use: 'babel-loader'
            },
            {
                test: /\.svg|\.png|\.jpg|\.jpeg|\.gif/,
                use: 'file-loader'
            },
            {
                test: /\.css/,
                use: [
                    "style-loader",
                    "css-loader"
                ],
            }
        ]
    },
    plugins: [
        // 复制静态资源
        new CopyWebpackPlugin({
            patterns:[{
                from: path.resolve(__dirname, 'public'),
                to: '.'
            }]
        })
    ]
}
```

值得注意的是，从 **copy-webpack-plugin** 6开始，其配置方式改为了如下的形式，否则会报错：

```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');
new CopyWebpackPlugin({
  patterns:[
    {
      from: 'xxx',
      to: 'xxx'
    }
  ]
})
```

```b
[webpack-cli] ValidationError: Invalid options object. Copy Plugin has been initialized using an options object that does not match the API schema.
 - options[0] misses the property 'patterns'. Should be:
   [non-empty string | object { from, to?, context?, globOptions?, filter?, toType?, force?, flatten?, transform?, cacheTransform?, transformPath?, noErrorOnMissing? }, ...] (should not have fewer than 1 item)
    at validate (/Users/zhongbr/Documents/node_study/test2/node_modules/copy-webpack-plugin/node_modules/schema-utils/dist/validate.js:104:11)
    at new CopyPlugin (/Users/zhongbr/Documents/node_study/test2/node_modules/copy-webpack-plugin/dist/index.js:54:31)
    at Object.<anonymous> (/Users/zhongbr/Documents/node_study/test2/webpack.config.js:35:9)
    at Module._compile (/Users/zhongbr/Documents/node_study/test2/node_modules/v8-compile-cache/v8-compile-cache.js:192:30)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1131:10)
    at Module.load (node:internal/modules/cjs/loader:967:32)
    at Function.Module._load (node:internal/modules/cjs/loader:807:14)
    at Module.require (node:internal/modules/cjs/loader:991:19)
    at require (/Users/zhongbr/Documents/node_study/test2/node_modules/v8-compile-cache/v8-compile-cache.js:159:20)
    at requireConfig (/Users/zhongbr/Documents/node_study/test2/node_modules/webpack-cli/lib/groups/resolveConfig.js:73:18)
    at Array.map (<anonymous>)
    at resolveConfigFiles (/Users/zhongbr/Documents/node_study/test2/node_modules/webpack-cli/lib/groups/resolveConfig.js:124:40)
    at module.exports (/Users/zhongbr/Documents/node_study/test2/node_modules/webpack-cli/lib/groups/resolveConfig.js:247:11)
    at WebpackCLI._baseResolver (/Users/zhongbr/Documents/node_study/test2/node_modules/webpack-cli/lib/webpack-cli.js:53:38)
    at /Users/zhongbr/Documents/node_study/test2/node_modules/webpack-cli/lib/webpack-cli.js:149:30
    at async WebpackCLI.runOptionGroups (/Users/zhongbr/Documents/node_study/test2/node_modules/webpack-cli/lib/webpack-cli.js:148:9)
    at async WebpackCLI.run (/Users/zhongbr/Documents/node_study/test2/node_modules/webpack-cli/lib/webpack-cli.js:191:9)
    at async runCLI (/Users/zhongbr/Documents/node_study/test2/node_modules/webpack-cli/lib/bootstrap.js:59:9) {
  errors: [
    {
      keyword: 'required',
      dataPath: '[0]',
      schemaPath: '#/required',
      params: [Object],
      message: "should have required property 'patterns'",
      schema: [Object],
      parentSchema: [Object],
      data: [Object],
      children: [Array]
    }
  ],
  schema: {
    definitions: { ObjectPattern: [Object], StringPattern: [Object] },
    type: 'object',
    additionalProperties: false,
    properties: { patterns: [Object], options: [Object] },
    required: [ 'patterns' ]
  },
  headerName: 'Copy Plugin',
  baseDataPath: 'options',
  postFormatter: null
}

```

### II. webpack.main.js Electron逻辑进程使用的webpack打包配置

```javascript
const path = require('path');
module.exports = {
    target: "electron-main", // 指明是要打包到electron的main
    entry: path.resolve(__dirname, "src", "main", "main.ts"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js"
    },
    resolve:{
        extensions: ['.ts', '.js']
    },
    module:{
        rules:[
            {
                test: /\.ts|\.js/,
                use: 'babel-loader'
            }
        ]
    }
}
```



### III. 修改public下的index.html为如下的内容

将%PUBLIC_PATH%全部替换成"."

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="./favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta
          name="description"
          content="Web site created using create-react-app"
  />
  <link rel="apple-touch-icon" href="./logo192.png" />
  <!--
    manifest.json provides metadata used when your web app is installed on a
    user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
  -->
  <link rel="manifest" href="./manifest.json" />
  <!--
    Notice the use of %PUBLIC_URL% in the tags above.
    It will be replaced with the URL of the `public` folder during the build.
    Only files inside the `public` folder can be referenced from the HTML.

    Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
    work correctly both with client-side routing and a non-root public URL.
    Learn how to configure a non-root public URL by running `npm run build`.
  -->
  <title>React App</title>
</head>
<body>
<noscript>You need to enable JavaScript to run this app.</noscript>
<div id="root"></div>
<!--
  This HTML file is a template.
  If you open it directly in the browser, you will see an empty page.

  You can add webfonts, meta tags, or analytics to this file.
  The build step will place the bundled scripts into the <body> tag.

  To begin the development, run `npm start` or `yarn start`.
  To create a production bundle, use `npm run build` or `yarn build`.
-->
<script src="./ui_bundle.js"></script>
</body>
</html>

```



### IV. 在src/main下新建一个main.ts作为逻辑进程

main.ts的代码如下：

```typescript
import { app, BrowserWindow } from "electron";
import * as path from "path";

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        width: 800,
    });

    // and load the index.html of the app.
    // mainWindow.loadFile(path.join(__dirname, "../index.html"));
    if(!app.isPackaged){
        mainWindow.loadFile(path.join("./ui/index.html")).then(r => {})
        // mainWindow.loadURL('http://localhost:8080').then();
    }
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

```



## 4. 在Package.json中添加启动和调试脚本

安装electron，并添加启动脚本到pakage.json中

```json
{
  "scripts":{
    "ebuild": "webpack --config webpack.ui.js && webpack --config webpack.main.js && electron dist/main.js"
  }
}
```

然后运行，即可启动electron窗口

```bash
npm run ebuild
```

如果遇到报错提示Electron未正确安装时，可以尝试向node_modules/electron目录中添加一个path.txt，其中的内容是 electron的可执行文件的路径，并添加如下的环境变量

```bash
# 报错
Electron failed to install correctly, please delete node_modules/electron and try installing again
# path.txt的内容示例
Electron.app/Contents/MacOS/Electron
# 添加的环境变量
export ELECTRON_OVERRIDE_DIST_PATH=/usr/local/Cellar/nvm/0.37.0/versions/node/v15.2.1/lib/node_modules/electron/dist
```

为了便于开发，做到在修改了ui的代码后，electron可以自动更新，可以借助 nodemon 包，其npm安装命令如下

```bash
npm install --save-dev nodemon
```



## 附 · 完整的package.json文件

```json
{
  "name": "test2",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.11.6",
    "@testing-library/react": "^11.2.2",
    "@testing-library/user-event": "^12.2.2",
    "@types/jest": "^26.0.15",
    "@types/node": "^12.19.7",
    "@types/react": "^16.14.2",
    "@types/react-dom": "^16.9.10",
    "react": "^17.0.1",
    "react-dom": "^17.0.1",
    "react-scripts": "4.0.1",
    "typescript": "^4.1.2",
    "web-vitals": "^0.2.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "ebuild": "webpack --config webpack.ui.js && webpack --config webpack.main.js && electron dist/main.js --inspect=8888"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@babel/core": "^7.12.3",
    "@babel/preset-env": "^7.12.7",
    "@babel/preset-react": "^7.12.7",
    "@babel/preset-typescript": "^7.12.1",
    "babel-loader": "^8.1.0",
    "copy-webpack-plugin": "^6.3.2",
    "css-loader": "^5.0.1",
    "electron": "^11.0.3",
    "file-loader": "^6.1.1",
    "nodemon": "^2.0.6",
    "style-loader": "^1.3.0",
    "webpack-cli": "^4.2.0"
  }
}
```



