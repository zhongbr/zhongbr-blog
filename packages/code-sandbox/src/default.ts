export const DefaultDemoFileName = '/Demo.js';
export const DefaultDemoCode =
`// ⚠️require function is asynchronous !
const React = await require('react');

// if you register \`EsmToAmdPlugin\`, following statements will be support
// import React from 'react';

const App = () => {
    // if you register \`JsxPlugin\`, jsx can be used.
    // return <div>hello world</div>;
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

module.exports.default = App
// if you register \`EsmToAmdPlugin\`, following statements will be support
// export default App;`;

export const DefaultIndexCode =
`const React = await require('react');
const ReactDom = await require('react-dom');
const App = (await require('./Demo.js')).default;

// if you register \`EsmToAmdPlugin\`, following statements will be support
// import React from 'react';
// import ReactDom from 'react-dom';
// import App from './App';

ReactDom.render(React.createElement(App, {}), document.getElementById('root'));`;

export const DefaultHtml =
`<noscript>Need javascript to run this demo page.</noscript>
<div id="root">
    <h3> 🚀 Welcome to use code sandbox. </h3>
</div>`;

export const DefaultCssCode =
`.title { color: blue }`;
