// @ts-ignore
import iframeScript from '@/iframe/iframe?raw';
// @ts-ignore
import iframeScriptUrl from '@/iframe/iframe?url';

const isDev = process.env.NODE_ENV === 'development';

export const Html = `
<html lang="en">
    <head>
        <title>Demo Sandbox</title>
        <script ${isDev ? `src="${iframeScriptUrl}" type="module"` : ''}>
            ${isDev ? '' : iframeScript}
        </script>
    </head>
    <body>
        <noscript>Need javascript to run this demo page.</noscript>
        <div id="root"></div>
    </body>
</html>
`;

// 降级显示的 html ，用于在不支持 iframe srcdoc 属性的浏览器上显示
export const fallbackHtml = `data:text/html,${encodeURIComponent(Html)}`;
