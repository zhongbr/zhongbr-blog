import React from 'react';
import {useEvent} from '@zhongbr/react-hooks';
import clsx from 'clsx';

import {ResponsiveEnum, useNavigate, usePageConfig} from '@/hooks';

import DownArrow from './DownArrow';
import IndexImage from './images/index.png';
import styles from './style.module.less';

export interface IPoster {
    className?: string;
}

const Poster: React.FC<IPoster> = props => {
    const { className } = props;

    const navigator = useNavigate();
    const { scrollRef, widthLevel } = usePageConfig();

    const onAllPassages = useEvent(() => {
        navigator('/tags');
    });

    const onPlayground = useEvent(() => {
        navigator('/playground');
    });

    const onScrollToMainBlock = useEvent(() => {
        if (!scrollRef?.current) return;
        scrollRef.current.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });

    return (
        <div className={clsx(styles.indexContainer, className)}>
            <div className={styles.body}>
                <div
                    className={styles.contents}
                >
                    <h1 className={styles.title}>永远相信美好的事情即将发生</h1>
                    <div className={styles.subContents}>
                        Always believe that something wonderful is about to come. 😁
                    </div>
                    <div className={clsx(styles.buttons)}>
                        <div className={styles.button} onClick={onAllPassages}>全部文章</div>
                        <div className={styles.button} onClick={onPlayground}>Playground</div>
                    </div>
                </div>
                <div
                    className={clsx(styles.imageContainer, { [styles.hidden]: widthLevel === ResponsiveEnum.tiny })}
                >
                    <img
                        src={IndexImage}
                        alt="index"
                    />
                </div>
            </div>
            <DownArrow className={styles.arrow} onClick={onScrollToMainBlock}/>
        </div>
    );
};

Poster.displayName = 'Poster';
export default Poster;
