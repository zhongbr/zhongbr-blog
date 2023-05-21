import React from 'react';
import clsx from 'clsx';

import styles from './index.module.scss';

const avatar = 'https://avatars.githubusercontent.com/u/44153622?v=4';
const name = 'Zhongbr 张盼宏';
const info: { name: string; value: React.ReactNode; icon: React.ReactNode; }[] = [
    { name: '职业', value: '前端开发工程师 Frontend Engineer', icon: '👨‍💻‍' },
    { name: '教育', value: '湖北工业大学 Huber University of Technology', icon: '🏫' },
    {
        name: 'Github',
        value: <a href="https://github.com/zhongbr" target="_blank">https://github.com/zhongbr</a>,
        icon: '📚'
    }
];
const githubLink = 'https://github-readme-stats-one-bice.vercel.app/api?username=zhongbr&show_icons=true&include_all_commits=true&count_private=true&role=OWNER,ORGANIZATION_MEMBER,COLLABORATOR';

const Profile: React.FC = () => {
    return (
        <div className={clsx('blur', 'no-default-styles', styles.profile)}>
            <div className={styles.avatar}>
                <img src={avatar} className="box-shadow"/>
            </div>
            <div className={styles.name}>👤&nbsp;{name}</div>
            <div className={styles.info}>
                {info.map(item => (
                    <div className={styles.info_item} key={item.name}>
                        <div className={styles.icon}>{item.icon}</div>
                        {item.name && <div className={styles.item_name}>{item.name}</div>}
                        <div className={styles.item_value}>{item.value}</div>
                    </div>
                ))}
            </div>
            <div className={styles.status}>
                <img src={githubLink} alt="Github Status"/>
            </div>
        </div>
    );
};

export default Profile;
