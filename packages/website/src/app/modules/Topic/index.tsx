import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import { Icon } from '@/components';
import { ITopic } from '@/data/posts';

import styles from './index.module.scss';
import * as querystring from 'querystring';

export interface ITopicProps {
    topic: ITopic;
}

function Topic (props: ITopicProps) {
    const { topic } = props;

    return (
        <div
            className={clsx(styles.topic_box, 'blur', 'no-default-styles')}
            style={{ '--color': topic.color } as React.CSSProperties}
        >
            <div className={styles.topic_box_icon}>
                <Icon className={topic.icon} />
            </div>
            <div className={styles.topic_box_title}>
                <div className={styles.topic_box_title_body}>{topic.topicName}</div>
                <Link
                    href={`/posts?${querystring.stringify({ tags: topic.tags })}`}
                    className={styles.topic_box_title_operation}
                >
                    全部文章
                    <Icon className="rp-arrow-right" />
                </Link>
            </div>
            <div className={styles.topic_box_tags}>
                {topic.tags?.map(tag => (
                    <Link
                        href={`/posts?tags=${tag}`}
                        className="tag"
                        key={tag}
                    >
                        {tag}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Topic;
