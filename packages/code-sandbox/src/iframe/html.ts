import iframeScriptUrl from '@/iframe/iframe?url';
import iframeStyles_ from './iframe.css?raw';

export const getIframeHTML = () => {
    const srcDoc =
`<html lang="en">
    <head>
        <title>Demo Sandbox</title>
        <script type="module" src="${iframeScriptUrl}"></script>
    </head>
    <body></body>
</html>`;
    const src = `data:text/html,${encodeURIComponent(srcDoc)}`;
    return [srcDoc, src];
};

export const iframeStyles: string = iframeStyles_;
