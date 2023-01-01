import React, {useState, createContext, useContext} from 'react';
import clsx from 'clsx';

import { usePersistFn } from '@/hooks';
import styles from './style.module.less';

export interface IContext {
    hovered: boolean;
    toggle: (hovered?: boolean) => void;
}
export const HoverContext = createContext<IContext>({
    hovered: false,
    toggle: () => {}
});

export interface IProps {
    className?: string;
    hoverContent?: React.ReactNode;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    triggerInHover?: boolean;
}

export function useHover() {
    return useContext(HoverContext);
}

const Hover: React.FC<IProps> = props => {
    const { className, style, hoverContent, children, triggerInHover=true } = props;
    const [hovered, setHovered] = useState(false);

    const onMouseEnter = usePersistFn(() => {
        if (!triggerInHover) {
            return;
        }
        setHovered(true);
    });

    const onMouseLeave = usePersistFn(() => {
        if (!triggerInHover) {
            return;
        }
        setHovered(false);
    });

    const toggle: IContext['toggle'] = usePersistFn((hovered_) => {
        if (typeof hovered_ !== 'undefined') {
            setHovered(hovered_);
            return;
        }
        setHovered(!hovered);
    });

    return (
        <div
            className={clsx(styles.hoverContainer, className)}
            style={style}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <HoverContext.Provider value={{ hovered, toggle }}>
                <div
                    className={clsx(styles.hoverLayer, hovered ? styles.unfold : styles.fold)}
                >
                    {hoverContent}
                </div>
                {children}
            </HoverContext.Provider>
        </div>
    );
};

Hover.displayName = 'Hover';
export default Hover;
