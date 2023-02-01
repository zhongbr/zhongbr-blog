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
    return [srcDoc];
};

export const iframeStyles: string = iframeStyles_;
