import React from 'react';

import { getTopics } from '@/data/posts';
import { Footer } from '@/components/Layout';
import { ImageSize, imgLevel } from '@/utils/cover';
import { Swiper, Topic } from './modules';
import styles from './page.module.scss';

interface IProps {}

async function Page (props: IProps) {
    const topics = await getTopics();

    return (
        <>
            <Swiper
                init={1}
                interval={10000}
                posters={[
                    { background: <img src={imgLevel('http://i.imgs.ovh/2023/12/10/fiXOU.jpeg', ImageSize.Origin)}  alt="img1" />, title: 'Zhongbr\'s Blog 🚀', subTitle: '永远相信最美好的事情即将发生' },
                    { background: <img src={imgLevel('http://i.imgs.ovh/2023/12/10/fUGKH.jpeg', ImageSize.Origin)}  alt="img1" />, title: 'Zhongbr\'s Blog 🚀', subTitle: 'Always Believe that something wonderful is about to come.' }
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
