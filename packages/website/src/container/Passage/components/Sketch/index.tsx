/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:43:11
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 22:43:11
 */
import React from 'react';
import { Title } from '../../utils/traverse';
import styles from './style.module.less';


export interface IProps {
    sketch: Title[];
    selected?: string;
}

const Sketch: React.FC<IProps> = props => {
    const { sketch } = props;

    return (
        <div className={styles.container}>
            <div className={styles.title}>目录</div>
            {sketch.map(item => (
                <div
                    className={styles.item}
                    key={item.text}
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
