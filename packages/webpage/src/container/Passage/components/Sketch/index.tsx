import React, { useLayoutEffect, useState } from 'react';
import { useEvent, useDebounce } from '@zhongbr/react-hooks';
import clsx from 'clsx';

import { usePageConfig } from "@/hooks";
import { getOffsetTop } from '@/utils/anchor-scroll';

import { Title } from '../../utils/traverse';
import styles from './style.module.less';


export interface IProps {
    sketch: Title[];
    selected?: string;
}

const Sketch: React.FC<IProps> = props => {
    const { sketch } = props;
    const { scrollRef } = usePageConfig();

    const [index, setIndex] = useState(0);

    const onClickTitle = useEvent(async (anchor: string) => {
        const container = (scrollRef as React.RefObject<HTMLDivElement>).current;
        const element = document.getElementById(anchor);
        if (element && container) {
            const offset = getOffsetTop(element, container);
            // 获取 header 的高度，避免标题被遮挡
            const headerHeight = getComputedStyle(element).getPropertyValue('--header-fold-height');
            const number = headerHeight.match(/\d+\.?\d*/)?.[0] || '0';
            container.scrollTo({
                top: offset - Number(number),
                behavior: 'smooth'
            })
        }
    });

    const onScroll = useDebounce(() => {
        const headerHeight = getComputedStyle(scrollRef?.current as HTMLDivElement).getPropertyValue('--header-fold-height');
        const number = headerHeight.match(/\d+\.?\d*/)?.[0] || '0';
        for (let i=0; i<sketch.length; i++) {
            const element = document.getElementById(sketch[i].key);
            if ((element?.getBoundingClientRect?.()?.top || Infinity) > Number(number)) {
                setIndex(Math.max(i - 1, 0));
                break;
            }
        }
    }, 500);

    useLayoutEffect(() => {
        setTimeout(() => {
            scrollRef?.current?.addEventListener('scroll', onScroll);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => scrollRef?.current?.removeEventListener('scroll', onScroll);
    }, [scrollRef, onScroll]);

    return (
        <div className={styles.container}>
            <div className={styles.title}>目录</div>
            {sketch.map((item, index_) => (
                <div
                    onClick={() => onClickTitle(item.key)}
                    className={clsx(styles.item, { [styles.selected]: index === index_ })}
                    key={index_}
                    style={{
                        marginLeft: `${20 * (item.depth - 1)}px`
                    }}
                >
                    <span className={styles.sharp}>#</span>{item.text}
                </div>
            ))}
        </div>
    );
};

export default Sketch;
