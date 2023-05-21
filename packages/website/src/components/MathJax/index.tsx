import React, { memo, Suspense } from 'react';
import dynamic from 'next/dynamic';

// @ts-ignore
const LazyMathComponent = dynamic(() => import('./MathJaxReact'), {
    ssr: false,
    loading: () => <span>📚公式加载中🚀🚀</span>
});

export interface IProps {
    latex: string;
}

const MathJax = memo<IProps>(props => {
    const { latex } = props;

    return (
        <Suspense fallback="📚公式加载中🚀🚀">
            {/* @ts-ignore */}
            <LazyMathComponent tex={latex}/>
        </Suspense>
    );
});

MathJax.displayName = 'MathJax';

export default MathJax;
