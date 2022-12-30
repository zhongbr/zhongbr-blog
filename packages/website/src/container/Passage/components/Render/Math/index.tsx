import React from 'react';

import { MathJax } from '@/components';
import { IBaseProps } from '@/types/markdown';

const Math: React.FC<IBaseProps> = (props) => {
    const { node } = props;

    return (
        <div>
            <MathJax latex={node.value}/>
        </div>
    );
};

export default Math;
