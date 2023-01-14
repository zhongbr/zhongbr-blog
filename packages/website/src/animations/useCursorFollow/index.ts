import { MouseEvent, useLayoutEffect, useRef } from 'react';
import { useEventListener } from '@/hooks';
import styles from './style.module.less';

export default function useCursorFollow(dom: HTMLElement | null, size = 100) {
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
        ref.current.style.setProperty('display', 'block');
    });

    useEventListener(dom, 'mouseleave', () => {
        ref.current.style.setProperty('display', 'none');
    });
}
