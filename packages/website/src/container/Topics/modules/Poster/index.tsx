import React from 'react';
import { useEvent } from '@zhongbr/react-hooks';

import { useNavigate } from '@/hooks';

import IndexImage from './images/index.png';
import styles from './style.module.less';
import {Icon} from "@/components";

export interface IPoster {}

const Poster: React.FC<IPoster> = props => {
    const navigator = useNavigate();
    const onAllPassages = useEvent(() => {
        navigator('/tags');
    });

    const onPlayground = useEvent(() => {
        navigator('/playground');
    });

    return (
        <div className={styles.indexContainer}>
            <div className={styles.body}>
                <div
                    className={styles.contents}
                >
                    <h1 className={styles.title}>钟摆人的博客</h1>
                    <div className={styles.subContents}>
                        <span className={styles.tag}>
                            <Icon className="rp-renwu"/>
                            总结
                        </span>
                        <span className={styles.tag}>
                            <Icon className="rp-baogao"/>
                            记录
                        </span>
                        <span className={styles.tag}>
                            <Icon className="rp-pinglun"/>
                            分享
                        </span>
                    </div>
                    <div className={styles.buttons}>
                        <div className={styles.button} onClick={onAllPassages}>全部文章</div>
                        <div className={styles.button} onClick={onPlayground}>Playground</div>
                    </div>
                </div>
                <div
                    className={styles.imageContainer}
                >
                    <img
                        src={IndexImage}
                        alt="index"
                    />
                </div>
            </div>
        </div>
    );
};

Poster.displayName = 'Poster';
export default Poster;
