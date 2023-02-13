import React, { memo, useEffect } from 'react';
import { useAsyncEffect, useAsyncFn } from '@zhongbr/react-hooks';

import { ResponsiveEnum, usePageConfig } from '@/hooks';
import { topics } from '@/service/passage';
import { useBlogConfig } from "@/config/ConfigContext";

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

    const { metas } = useBlogConfig();

    useEffect(() => {
        setStates?.({
            title: metas?.title,
            footer: {
                showICP: true,
                showPublicSecurity: true,
                showCopyRight: true,
                scrollSnap: true
            }
        });
    }, [setStates]);

    return (
        <>
            <Poster className={styles.poster}/>
            <TopicCardGroup rowCount={rowCount} className={styles.topicsContainer}>
                {topicsRes?.data?.topics?.map?.(topic => (
                    <TopicCard
                        key={topic.id}
                        {...topic}
                    />
                ))}
            </TopicCardGroup>
        </>
    );
};

Topics.displayName = 'Topics';
export default memo(Topics);
