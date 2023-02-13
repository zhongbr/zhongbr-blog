import React from 'react';
import {useEvent} from '@zhongbr/react-hooks';
import clsx from 'clsx';

import { ResponsiveEnum, useNavigate, usePageConfig } from '@/hooks';
import { useBlogConfig } from '@/config/ConfigContext';
import animations from '@/animations/gradient-background.module.less';

import DownArrow from './DownArrow';
import styles from './style.module.less';

export interface IPoster {
    className?: string;
}

const Poster: React.FC<IPoster> = props => {
    const { className } = props;

    const navigator = useNavigate();
    const { scrollRef, widthLevel } = usePageConfig();

    const { metas } = useBlogConfig();
    const IndexPoster = metas?.IndexPoster;

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
                    <h1 className={clsx(styles.title, animations.gradientText)}>{IndexPoster?.title}</h1>
                    <div className={styles.subContents}>
                        {IndexPoster?.desc}
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
                        src={IndexPoster?.rightImage}
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
