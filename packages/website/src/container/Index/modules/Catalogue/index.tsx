/*
 * @Description: passages catalogues
 * @Author: 张盼宏
 * @Date: 2022-08-28 14:38:38
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 18:45:34
 */
import React, {useMemo} from "react";
import moment from 'moment';
import Pagination, { PaginationProps } from '@mui/material/Pagination';
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import { Tag, Card, Icon } from '@/components';
import {useNavigate, useStates, useTags} from '@/hooks';
import { ICatalogue, IPassage } from "@/service/passage/catalogue";

import styles from './style.module.less';
import {copy} from "@/utils/copt";

interface IStates {
    pageNo: number;
    pageSize: number;
    pageCount: number;
}

const initStates: IStates = {
    pageNo: 1,
    pageSize: 24,
    pageCount: 1
}

export interface Props {
    /** trigger when entry passage */
    onEnterPassage?: (passage: IPassage) => void;
    /** catalogues */
    catalogue?: ICatalogue;
}

const Catalogue: React.FC<Props> = (props) => {
    const { onEnterPassage, catalogue } = props;
    const [{ pageNo, pageSize, pageCount }, setStates] = useStates(initStates);

    const navigator = useNavigate();

    const { onReplaceTags, onRemoveTag, tags } = useTags();

    const passages = useMemo(() => {
        const passages = Object.values(catalogue || {});

        setStates({ pageCount: Math.ceil(passages.length / pageSize) });

        return passages.slice(pageSize * (pageNo - 1), pageSize * pageNo).map(passage => ({
            ...passage,
            mdate: moment(passage.mdate).format('YYYY-MM-DD HH:mm:ss')
        }))
    }, [catalogue, setStates, pageSize, pageNo]);

    const onOpenPassage = (passage: IPassage) => {
        onEnterPassage?.(passage);
        navigator(`/passage/${passage['json-path']}`);
    };

    const onCopy = async (passage: IPassage) => {
        await copy(`${window.location.protocol}//${window.location.host}/#/passage/${passage['json-path']}`);
    };

    const onPageChange: PaginationProps['onChange'] = (event, page) => {
        setStates({ pageNo: page });
    };

    return (
        <div className={styles.container}>
            { !!tags.length && (
                <Paper className={styles.selectedTags} variant="outlined">
                    {tags?.map(tag => (
                        <Tag
                            selected
                            onRemove={() => onRemoveTag(tag)}
                        >
                            {tag}
                        </Tag>
                    ))}
                    <Button size="small" color="primary" onClick={() => onReplaceTags([])}>
                        清除
                    </Button>
                </Paper>
            ) }

            <div className={styles.passagesContainer}>
                {passages.map(passage => (
                    <Card
                        onClickImage={() => onOpenPassage(passage)}
                        title={passage.title}
                        headerImage={passage.cover}
                        extraInfo={(
                            <div>
                                {passage.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                            </div>
                        )}
                        extraInfoHover={passage.mdate}
                        hoverContent={(
                            <div className={styles.passageOperations}>
                                <Icon
                                    className="rp-faxian"
                                    text="阅读"
                                    onClick={() => onOpenPassage(passage)}
                                />
                                <Icon
                                    className="rp-fuzhi"
                                    text="复制"
                                    onClick={() => onCopy(passage)}
                                />
                            </div>
                        )}
                    />
                ))}
            </div>

            <div className={styles.pagination}>
                <Pagination count={pageCount} page={pageNo} onChange={onPageChange}/>
            </div>
        </div>
    );
};

export default Catalogue;
