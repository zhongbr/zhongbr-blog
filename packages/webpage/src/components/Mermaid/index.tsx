import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

import { usePageConfig } from '@/hooks';

const config = {
    startOnLoad:true,
    htmlLabels:true,
    flowchart:{
        useMaxWidth:false,
    }
};

export interface IProps {
    source: string;
}


const Mermaid: React.FC<IProps> = (props) => {
    const { source } = props;

    const pre = useRef<HTMLPreElement>(null);

    const { theme } = usePageConfig();
    useEffect(() => {
        if (!pre.current) return;
        mermaid.init({
            ...config,
            darkMode: theme === 'dark-theme'
        }, pre.current);
    }, [theme]);

    return (
        <pre
            className="mermaid"
            ref={pre}
            style={{ width: '100%', height: '100%', textAlign: 'center' }}
        >
            {source}
        </pre>
    );
};

Mermaid.displayName = 'Mermaid';
export default Mermaid;
