/*
 * @Description: loading page
 * @Author: 张盼宏
 * @Date: 2022-09-10 22:15:27
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-18 15:23:24
 */
import Loading from './Loading';
import styles from './style.module.less';

export interface Props {
    texts: string;
}

export default function Splash (props: Props) {
    const { texts } = props;

    return (
        <div className={styles.splash}>
            <Loading className={styles.loading} count={8}/>
            <div>{texts}</div>
        </div>
    );
}
