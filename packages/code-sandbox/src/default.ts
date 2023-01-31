export const DefaultDemoCode =
`// ⚠️require function is asynchronous !
// const React = await require('react');
import React from 'react';

const App = () => {
    return (
        React.createElement(
            'div',
            {},
            React.createElement(
                'div',
                {
                    className: 'title'
                },
                'DemoSandbox'
            ),
            'welcome to use code sandbox'
        )
    );
};

module.exports = App`;

export const DefaultIndexCode =
`const React = await require('react');
const ReactDom = await require('react-dom');
const App = await require('./App');

ReactDom.render(React.createElement(App, {}), document.getElementById('root'));`;

export const DefaultHtml =
`<noscript>Need javascript to run this demo page.</noscript>
<div id="root">
    <h3> 🚀 Welcome to use code sandbox. </h3>
</div>`;

export const DefaultCssCode =
`.title { color: blue }`;
