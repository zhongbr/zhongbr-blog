import React, {useEffect} from 'react';

import {ResponsiveEnum, useAsyncEffect, useAsyncFn, usePageConfig} from '@/hooks';
import {topics} from '@/service/passage';
import {useMessage} from '@/components';
import {title} from "@/config/meta";

import {TopicCard, TopicCardGroup} from './modules';
import styles from './style.module.less';

const Topics: React.FC = props => {
    const [fetchTopics, topicsRes] = useAsyncFn(topics);
    const { setStates, widthLevel, onPageReady } = usePageConfig();
    const { success } = useMessage();

    // 屏幕宽度最窄时，一行只显示一个
    const rowCount = widthLevel === ResponsiveEnum.tiny ? 1 : 2;

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
            <TopicCardGroup rowCount={rowCount} className={styles.topicsContainer}>
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
