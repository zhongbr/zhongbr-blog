import React, { MouseEvent, useLayoutEffect, useRef } from 'react';
import { useEventListener } from '@/hooks';
import styles from './style.module.less';

/**
 * 在指定的元素中插入一个可以跟随鼠标指针移动的子元素
 * @param dom 容器元素
 * @param size 子元素的尺寸
 * @param color 子元素的颜色
 */
export function useCursorFollow(dom: HTMLElement | null, size = 100, color?: string) {
    const ref = useRef(document.createElement('div'));

    useLayoutEffect(() => {
        if (!dom) return;
        if (!dom.classList.contains(styles.curFollowBg)) {
            dom.classList.add(styles.curFollowBg);
        }
        ref.current.classList.add(styles.follow);
        ref.current.style.setProperty('display', 'none');
        dom.appendChild(ref.current);
    }, [dom]);

    useEventListener(dom,'mousemove', (e) => {
        if (!dom) return;
        const { clientX, clientY } = e as unknown as MouseEvent;
        const rect = dom.getBoundingClientRect();

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        dom.style.setProperty('--cursor-x', `${x}px`);
        dom.style.setProperty('--cursor-y', `${y}px`);
    });

    useEventListener(dom, 'mouseenter', () => {
        if (color) {
            ref.current.style.setProperty('--cursor-color', color);
        }
        ref.current.style.setProperty('display', 'block');
    });

    useEventListener(dom, 'mouseleave', () => {
        ref.current.style.setProperty('display', 'none');
    });
}

export interface IProps {
    className?: string;
    color?: string;
    size?: number;
    children: React.ReactNode;
}

const CursorFollow: React.FC<IProps> = props => {
    const { color, size, className, children } = props;
    const ref = useRef<HTMLDivElement>(null);

    useCursorFollow(ref.current, size, color);

    return (
        <div className={className} ref={ref}>
            {children}
        </div>
    );
};

CursorFollow.displayName = 'CursorFollow';

export default CursorFollow;
