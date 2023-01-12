/*
 * @Description: 单页应用入口文件
 * @Author: 张盼宏
 * @Date: 2022-08-27 13:57:29
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-07 23:01:38
 */
import React from 'react';
import ReactDOM from 'react-dom/client';

import { HashRouter } from 'react-router-dom';

import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.less';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
        <App />
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
