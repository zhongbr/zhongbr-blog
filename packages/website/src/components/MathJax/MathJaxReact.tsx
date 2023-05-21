'use client';
import React from 'react';
import { MathComponent } from 'mathjax-react';

type IMathComponentProps = typeof MathComponent extends React.FC<infer T> ? T : unknown;
export type IProps = IMathComponentProps & {
    className?: string;
};

const MathJax: React.FC<IProps> = props => {
    const { className, ...others } = props;

    return (
        <MathComponent {...others} />
    );
};

MathJax.displayName = 'MathJax';
export default MathJax;
