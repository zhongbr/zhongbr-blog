import React, {useState, createContext, useContext} from 'react';
import clsx from 'clsx';

import { usePersistFn } from '@/hooks';
import styles from './style.module.less';

export const HoverContext = createContext<{ hovered: boolean; }>({ hovered: false });

export interface IProps {
    className?: string;
    hoverContent?: React.ReactNode;
    children?: React.ReactNode;
}

export function useHover() {
    return useContext(HoverContext);
}

const Hover: React.FC<IProps> = props => {
    const { className, hoverContent, children } = props;
    const [hovered, setHovered] = useState(false);

    const onMouseEnter = usePersistFn(() => {
        setHovered(true);
    });

    const onMouseLeave = usePersistFn(() => {
        setHovered(false);
    });

    return (
        <div
            className={clsx(styles.hoverContainer, className)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                className={styles.hoverLayer}
                style={{ display: hovered ? 'block' : 'none' }}
            >
                {hoverContent}
            </div>
            <HoverContext.Provider value={{ hovered }}>
                {children}
            </HoverContext.Provider>
        </div>
    );
};

Hover.displayName = 'Hover';
export default Hover;
