/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-08-27 13:57:29
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-07 23:01:38
 */
import React from 'react';
import * as ReactNamespace from 'react';
import ReactDOM from 'react-dom/client';
import * as ReactDomNamespace from 'react-dom/client';

import { HashRouter } from 'react-router-dom';
import * as ReactRouterDom from 'react-router-dom';

import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.less';

window['react'] = { default: React, ...ReactNamespace };
window['react-dom'] = { default: ReactDOM, ...ReactDomNamespace };
window['react-router-dom'] = { ...ReactRouterDom };

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
