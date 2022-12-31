import React from 'react';

import Hover from '../Hover';
import Normal, { IProps } from './Normal';

export type { IProps };

const Card: React.FC<IProps> = props => {
    const { ...normalProps } = props;

    return (
        <Hover>
            <Normal {...normalProps}/>
        </Hover>
    );
};

Card.displayName = 'Card';
export default Card;
