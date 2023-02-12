import React, {useState, createContext, useContext} from 'react';
import clsx from 'clsx';
import { useEvent } from '@zhongbr/react-hooks';

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

const Hover: React.ForwardRefRenderFunction<HTMLDivElement, IProps> = (props, ref) => {
    const { className, style, hoverContent, children, triggerInHover=true } = props;
    const [hovered, setHovered] = useState(false);

    const onMouseEnter = useEvent(() => {
        if (!triggerInHover) {
            return;
        }
        setHovered(true);
    });

    const onMouseLeave = useEvent(() => {
        if (!triggerInHover) {
            return;
        }
        setHovered(false);
    });

    const toggle: IContext['toggle'] = useEvent((hovered_) => {
        if (typeof hovered_ !== 'undefined') {
            setHovered(hovered_);
            return;
        }
        setHovered(!hovered);
    });

    return (
        <div
            ref={ref}
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
export default React.forwardRef(Hover);
