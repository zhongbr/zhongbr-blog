/*
 * @Description: passages catalogues
 * @Author: 张盼宏
 * @Date: 2022-08-28 14:38:38
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-28 15:06:59
 */
import React, {useMemo} from "react";
import moment from 'moment';

import { useNavigate } from '@/hooks';
import { ICatalogue, IPassage } from "@/service/passage/catalogue";

import styles from './style.module.less';

export interface Props {
    /** trigger when entry passage */
    onEnterPassage?: (passage: IPassage) => void;
    /** catalogues */
    catalogue?: ICatalogue;
}

const Catalogue: React.FC<Props> = (props) => {
    const { onEnterPassage, catalogue } = props;

    const navigator = useNavigate();

    const passages = useMemo(() => {
        const passages = Object.values(catalogue || {});
        return passages.map(passage => ({
            ...passage,
            mdate: moment(passage.mdate).format('YYYY-MM-DD HH:mm:ss')
        }))
    }, [catalogue]);

    const onOpenPassage = (passage: IPassage) => {
        onEnterPassage?.(passage);
        navigator(`/passage/${passage['json-path']}`);
    };

    return (
        <>
            {passages.map(passage => (
                <div
                    className={styles.catalogueItem}
                    key={passage['json-path']}
                >
                    <div/>

                    <div className={styles.metaInfo}>
                        <div
                            onClick={() => onOpenPassage(passage)}
                            className={styles.title}
                        >
                            {passage.title}
                        </div>

                        <div className={styles.tags}>
                            {passage.tags?.map(tag => (
                                <div
                                    className={styles.tag}
                                    key={tag}
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>

                        <div className={styles.extra}>
                            <span>[{passage.mdate}]</span>
                            <span>{passage.summary}</span>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default Catalogue;
