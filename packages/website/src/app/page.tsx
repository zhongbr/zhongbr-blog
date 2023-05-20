import React from 'react';

import { getTopics } from '@/data/posts';
import { Footer } from '@/components/Layout';

import { Topic, Swiper } from './modules';
import styles from './page.module.scss';

export * from '@/config/ssg-static';

interface IProps {}

async function Page (props: IProps) {
    const topics = await getTopics();

    return (
        <>
            <Swiper
                init={1}
                interval={10000}
                posters={[
                    { background: <img src='https://i.328888.xyz/2023/01/01/tiZM3.jpeg'  alt="img1" />, title: 'Zhongbr\'s Blog 🚀', subTitle: '永远相信最美好的事情即将发生' },
                    { background: <img src='https://i.328888.xyz/2023/01/01/tZMoa.jpeg'  alt="img1" />, title: 'Zhongbr\'s Blog 🚀', subTitle: 'Always Believe that something wonderful is about to come.' }
                ]}
            />
            <div className={styles.topics}>
                {topics?.topics?.map(topic => <Topic key={topic.id} topic={topic} />)}
            </div>
            <Footer className={styles.footer} />
        </>
    );
}

export default Page;
