import React, {useEffect} from 'react';

import { useAsyncFn, useAsyncEffect, usePageConfig } from '@/hooks';
import { topics } from '@/service/passage';
import { useMessage } from '@/components';

import { TopicCard, TopicCardGroup } from './modules';
import styles from './style.module.less';
import {title} from "@/config/meta";

const Topics: React.FC = props => {
    const [fetchTopics, topicsRes] = useAsyncFn(topics);
    const { setStates, onPageReady } = usePageConfig();
    const { success } = useMessage();

    useAsyncEffect(async () => {
        await fetchTopics();
        onPageReady?.();
        success({
            title: '页面加载完成',
            content: '页面加载完成啦！'
        });
    }, [fetchTopics]);

    useEffect(() => {
        setStates?.({
            title: title,
            footer: {
                showICP: true,
                showPublicSecurity: true,
                showCopyRight: true
            }
        });
    }, [setStates]);

    return (
        <div className={styles.topicsPage}>
            <TopicCardGroup rowCount={2} className={styles.topicsContainer}>
                {topicsRes?.data?.topics?.map?.(topic => (
                    <TopicCard
                        key={topic.id}
                        {...topic}
                    />
                ))}
            </TopicCardGroup>
        </div>
    );
};

Topics.displayName = 'Topics';
export default Topics;
