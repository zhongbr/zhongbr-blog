/*
 * @Description: meta config
 * @Author: 张盼宏
 * @Date: 2022-08-27 21:54:39
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 22:41:07
 */
import { ILayoutProps, Icon } from '@/components';

/**
 * 首页的海报信息
 */
export interface IIndexPoster {
    title: string;
    desc: string;
    rightImage: string;
}

/** 头部右侧的导航链接 */
export const navLinks: ILayoutProps['navLinks'] = [
    { name: '首页', target: '/', icon: <Icon className="rp-zixun" /> },
    { name: '全部文章', target: '/tags', icon: <Icon className="rp-zhinan" /> },
    { name: 'Playground', target: '/playground', icon: <Icon className="rp-jiaoxue" /> },
    { name: 'Github', target: 'https://github.com/zhongbr', icon: <Icon className="rp-tuandui" /> },
];
