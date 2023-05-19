'use client';
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useEvent } from '@zhongbr/react-hooks';
import clsx from 'clsx';

import styles from './index.module.scss';

export interface IPoster {
    background: React.ReactNode;
    title: string;
    subTitle: string;
}

export interface ISwiperProps {
    posters: IPoster[];
    interval?: number;
    init?: number;
}

const SwiperItem = ({ poster }: { poster: IPoster; }) => (
    <div className={styles.poster}>
        <div className={styles.image}>
            {poster.background}
        </div>
        <div className={clsx(styles.title_box, 'blur')}>
            <div className={styles.title}>{poster.title}</div>
            <div className={styles.sub_title}>{poster.subTitle}</div>
        </div>
    </div>
);

const Swiper: React.FC<ISwiperProps> = (props) => {
    const { posters, interval = 5000, init = 0 } = props;

    const hoverRef = useRef(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const [current, setCurrent] = useState(init);

    const swiperTo = async (target: number) => {
        if (!containerRef.current) return;
        setCurrent(target === posters.length ? 0 : target);
        await containerRef.current.scrollTo({
            left: window.innerWidth * target,
            behavior: 'smooth',
        });
    };

    const swiperNext = useEvent(async () => {
        swiperTo(current + 1);
        setTimeout(() => {
            // 如果是最后一张，滚动位置置为 0
            if (current === posters.length - 1) {
                if (!containerRef.current) return;
                containerRef.current.scrollLeft = 0;
            }
        }, interval / 3);
    });

    useEffect(() => {
        const step = async () => {
            if (!hoverRef.current) {
                await swiperNext();
            }
            timeout = setTimeout(step, interval);
        };
        let timeout = setTimeout(step, interval);
        return () => clearTimeout(timeout);
    }, [swiperNext, interval]);

    useLayoutEffect(() => {
        if (init !== 0) {
            swiperTo(init);
        }
    }, [init]);

    return (
        <div className={styles.container}>
            <div
                className={styles.poster_swiper}
                ref={containerRef}
                onMouseEnter={() => hoverRef.current = true}
                onMouseLeave={() => hoverRef.current = false}
            >
                {posters.map(poster => <SwiperItem poster={poster} key={poster.title} />)}
                <SwiperItem poster={posters[0]}/>
            </div>

            <div className={styles.indicator}>
                {posters.map((_, index) => (
                    <div
                        className={styles.item}
                        key={index}
                        data-current={current === index}
                        onClick={() => swiperTo(index)}
                    />
                ))}
                {current + 1}/{posters.length}
            </div>
        </div>
    );
};

export default Swiper;
