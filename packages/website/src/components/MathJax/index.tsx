import React, { memo, Suspense } from 'react';

const LazyMathComponent = React.lazy(() => import('./MathJaxReact'));

export interface IProps {
    latex: string;
}

const MathJax = memo<IProps>(props => {
    const { latex } = props;

    return (
        <Suspense fallback="📚公式加载中🚀🚀">
            <LazyMathComponent tex={latex}/>
        </Suspense>
    );
});

MathJax.displayName = 'MathJax';

export default MathJax;
