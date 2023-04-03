import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import ConfigContextProvider from '@/config/ConfigContext';

import App from './App';
import { MessageProvider } from './components';
import './index.less';

window.startRender = async (opt) => {
    const { root: rootElement = document.getElementById('root') as HTMLElement } = opt;
    const root = ReactDOM.createRoot(rootElement);
    console.log('opt', opt);
    root.render(
        <React.StrictMode>
            <ConfigContextProvider opt={opt}>
                <HashRouter>
                    <MessageProvider>
                        <App/>
                    </MessageProvider>
                </HashRouter>
            </ConfigContextProvider>
        </React.StrictMode>
    );
}
