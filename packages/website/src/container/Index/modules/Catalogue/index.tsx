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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from "@mui/material/CardActions";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";

import { Tag } from '@/components';
import {useNavigate, useStates, useTags} from '@/hooks';
import { ICatalogue, IPassage } from "@/service/passage/catalogue";

import styles from './style.module.less';

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
                    <Card className={styles.card} variant="outlined" onClick={() => onOpenPassage(passage)}>
                        <CardContent className={styles.content}>

                            <Typography color="h5">
                                {passage.title}
                            </Typography>

                            <Typography color="text.secondary">
                                {passage.mdate}
                            </Typography>

                            <div className={styles.tags}>
                                {passage.tags?.map(tag => (
                                    <Tag
                                        key={tag}
                                        onClick={() => onReplaceTags([tag])}
                                    >
                                        {tag}
                                    </Tag>
                                ))}
                            </div>

                        </CardContent>

                        <CardActions className={styles.actions}>
                            <Button size="small" onClick={() => onOpenPassage(passage)}>read...</Button>
                        </CardActions>
                    </Card>
                ))}
            </div>

            <div className={styles.pagination}>
                <Pagination count={pageCount} page={pageNo} onChange={onPageChange}/>
            </div>
        </div>
    );
};

export default Catalogue;
