/*
 * @Description: passage tags pool
 * @Author: 张盼宏
 * @Date: 2022-09-03 14:30:49
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 18:10:41
 */
import React, { useState, useLayoutEffect } from 'react';
import Grow from '@mui/material/Grow';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { Tag } from '@/components';
import { useTags } from '@/hooks';

import { TagsMap } from '../../hooks/useCatalogue';
import styles from './style.module.less';

const GROW_IN_TIMEOUT = 100;

export interface IProps {
    tags: TagsMap;
}

const Tags: React.FC<IProps> = (props) => {
    const { tags } = props;
    const [show, setShow] = useState(false);

    const { onSelectTag, onRemoveTag, tags: selectedTags } = useTags();

    useLayoutEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 3000);
    }, []);

    return (
        <Paper className={styles.tagsPool} variant="outlined">
            <Typography variant="h3">
                Tags
            </Typography>

            <div className={styles.tags}>
                {Array.from(tags).map(([tag, passages], index) => (
                    <Grow
                        in={show}
                        key={tag}
                        style={{ transformOrigin: '0 0 0' }}
                        {...show ? { timeout: GROW_IN_TIMEOUT * index } : {}}
                    >
                        <Tag
                            selected={selectedTags.includes(tag)}
                            onClick={() => onSelectTag(tag)}
                            onRemove={() => onRemoveTag(tag)}
                        >
                            {tag}({passages.length || 0})
                        </Tag>
                    </Grow>
                ))}
            </div>
        </Paper>
    );
};

export default Tags;
