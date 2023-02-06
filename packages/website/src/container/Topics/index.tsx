import React, { memo, useEffect } from 'react';
import { useAsyncEffect, useAsyncFn } from '@zhongbr/react-hooks';

import { ResponsiveEnum, usePageConfig } from '@/hooks';
import { topics } from '@/service/passage';
import { title } from "@/config/meta";

import { TopicCard, TopicCardGroup, Poster } from './modules';
import styles from './style.module.less';

const Topics: React.FC = props => {
    const [fetchTopics, topicsRes] = useAsyncFn(topics);
    const { setStates, widthLevel, onPageReady } = usePageConfig();

    // 屏幕宽度最窄时，一行只显示一个
    const rowCount = widthLevel === ResponsiveEnum.tiny ? 1 : 2;

    useAsyncEffect(async () => {
        await fetchTopics();
        onPageReady?.();
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
            <Poster/>
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
export default memo(Topics);
