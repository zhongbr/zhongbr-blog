/*
 * @Description: loading page
 * @Author: 张盼宏
 * @Date: 2022-09-10 22:15:27
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-18 15:23:24
 */
import { ReactComponent as LoadingIcon } from './loading.svg';
import styles from './style.module.less';

export interface Props {
    texts: string;
}

export default function Loading (props: Props) {
    const { texts } = props;

    return (
        <div className={styles.loading}>
            <div className={styles.content}>
                <LoadingIcon/>
                <div>{texts}</div>
            </div>
        </div>
    );
}
