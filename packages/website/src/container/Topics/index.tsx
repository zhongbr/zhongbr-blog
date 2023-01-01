import React, {useEffect} from 'react';

import { useAsyncFn, useAsyncEffect, usePageConfig } from '@/hooks';
import { topics } from '@/service/passage';

import { Footer, TopicCard, TopicCardGroup } from './modules';
import styles from './style.module.less';
import {title} from "@/config/meta";

const Topics: React.FC = props => {
    const [fetchTopics, topicsRes] = useAsyncFn(topics);
    const { setStates, onPageReady } = usePageConfig();

    useAsyncEffect(async () => {
        await fetchTopics();
        onPageReady?.();
    }, [fetchTopics]);

    useEffect(() => {
        setStates?.({
            title: title
        });
    }, [setStates]);

    return (
        <div>
            <TopicCardGroup rowCount={2} className={styles.topicsContainer}>
                {topicsRes?.data?.topics?.map?.(topic => (
                    <TopicCard
                        key={topic.id}
                        {...topic}
                    />
                ))}
            </TopicCardGroup>
            <Footer/>
        </div>
    );
};

Topics.displayName = 'Topics';
export default Topics;
