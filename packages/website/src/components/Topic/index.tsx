import React from 'react';
import clsx from 'clsx';

import { Icon } from '@/components';
import { ITopic } from '@/data/posts';

import styles from './index.module.scss';

export interface ITopicProps {
    topic: ITopic;
}

function Topic (props: ITopicProps) {
    const { topic } = props;
    return (
        <div
            className={clsx(styles.topic_box, 'blur')}
            style={{ '--color': topic.color } as React.CSSProperties}
        >
            <div className={styles.topic_box_icon}>
                <Icon className={topic.icon} />
            </div>
            <div className={styles.topic_box_title}>
                <div className={styles.topic_box_title_body}>{topic.topicName}</div>
                <div className={styles.topic_box_title_operation}>精选文章</div>
            </div>
            <div className={styles.topic_box_tags}>
                {topic.tags?.map(tag => (
                    <div className={styles.tag} key={tag}>{tag}</div>
                ))}
            </div>
        </div>
    );
}

export default Topic;
