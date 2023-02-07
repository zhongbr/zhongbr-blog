import React, { useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEvent } from '@zhongbr/react-hooks';

import { usePageConfig } from "@/hooks";
import { getOffsetTop, smoothScrollTo } from '@/utils/anchor-scroll';

import { Title } from '../../utils/traverse';
import styles from './style.module.less';


export interface IProps {
    sketch: Title[];
    selected?: string;
}

const Sketch: React.FC<IProps> = props => {
    const { sketch } = props;
    const { scrollRef } = usePageConfig();
    const [searchParams, setSearchParams] = useSearchParams();

    const onClickTitle = useEvent(async (anchor: string) => {
        const container = (scrollRef as React.RefObject<HTMLDivElement>).current;
        const element = document.getElementById(anchor);
        setSearchParams({
            _: anchor
        });
        if (element && container) {
            const offset = getOffsetTop(element, container);
            container.scrollTo({
                top: offset,
                behavior: 'smooth'
            })
        }
    });

    useLayoutEffect(() => {
        const anchor = searchParams.get('_');
        if (anchor) {
            onClickTitle(anchor);
        }
    }, [searchParams, onClickTitle]);

    return (
        <div className={styles.container}>
            <div className={styles.title}>目录</div>
            {sketch.map((item, index) => (
                <div
                    onClick={() => onClickTitle(item.key)}
                    className={styles.item}
                    key={index}
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
