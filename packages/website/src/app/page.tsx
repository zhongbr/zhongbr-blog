import React from 'react';

import { Topic } from '@/components';
import { getTopics } from '@/data/posts';

import styles from './page.module.scss';

export * from '@/config/ssg-static';

interface IProps {}

async function Page (props: IProps) {
    const topics = await getTopics();

    return (
        <div className={styles.topics}>
            {topics?.topics?.map(topic => <Topic key={topic.id} topic={topic} />)}
        </div>
    );
}

export default Page;
