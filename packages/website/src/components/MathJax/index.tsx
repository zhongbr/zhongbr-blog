import React, { memo, Suspense } from 'react';

const LazyMathComponent = React.lazy(async () => {
    const { MathComponent } = await import('mathjax-react');
    return { default: MathComponent };
})

export interface IProps {
    latex: string;
}

const MathJax = memo<IProps>(props => {
    const { latex } = props;

    return (
        <Suspense fallback="📚公式加载中🚀">
            <LazyMathComponent tex={latex}/>
        </Suspense>
    );
});

MathJax.displayName = 'MathJax';

export default MathJax;
