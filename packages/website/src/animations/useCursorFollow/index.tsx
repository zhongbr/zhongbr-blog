import React, { MouseEvent, useRef } from 'react';
import styles from './style.module.less';

/**
 * 在指定的元素中插入一个可以跟随鼠标指针移动的子元素
 * @param size 子元素的尺寸
 * @param color 子元素的颜色
 */
export function useCursorFollow(size = 100, color?: string) {
    const ref = useRef(document.createElement('div'));
    const container_ = useRef<HTMLDivElement>(null);

    // 代理 container_ 对象，在 set current 对象时就可以拿到最新的 dom 了
    // 此时增加样式、监听事件比 useLayoutEffect 更加准确
    let container = container_;
    if (!container_.current) {
        container = new Proxy(container_, {
            set(target: React.MutableRefObject<HTMLDivElement>, p: string | symbol, dom: HTMLDivElement, receiver: any): boolean {
                if (!dom) return true;
                // 为 dom 增加样式
                if (!dom.classList.contains(styles.curFollowBg)) {
                    dom.classList.add(styles.curFollowBg);
                }
                // 为鼠标跟随的 dom 增加样式
                ref.current.classList.add(styles.follow);
                ref.current.style.setProperty('display', 'none');
                dom.appendChild(ref.current);
                // 在容器上挂载鼠标移入、移动和移除的事件
                dom.addEventListener('mousemove', e =>{
                    const { clientX, clientY } = e as unknown as MouseEvent;
                    const rect = dom.getBoundingClientRect();

                    const x = clientX - rect.left;
                    const y = clientY - rect.top;

                    dom.style.setProperty('--cursor-x', `${x}px`);
                    dom.style.setProperty('--cursor-y', `${y}px`);
                });
                dom.addEventListener('mouseenter', e =>{
                    if (color) {
                        ref.current.style.setProperty('--cursor-color', color);
                    }
                    ref.current.style.setProperty('display', 'block');
                })
                dom.addEventListener('mouseleave', e =>{
                    ref.current.style.setProperty('display', 'none');
                });
                return Reflect.set(target, p, dom);
            }
        });
    }

    return [container] as const;
}

export interface IProps {
    className?: string;
    color?: string;
    size?: number;
    children: React.ReactNode;
}

const CursorFollow: React.FC<IProps> = props => {
    const { color, size, className, children } = props;

    const [ref] = useCursorFollow(size, color);

    return (
        <div className={className} ref={ref}>
            {children}
        </div>
    );
};

CursorFollow.displayName = 'CursorFollow';

export default CursorFollow;
