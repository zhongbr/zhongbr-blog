/*
 * @Description: meta config
 * @Author: 张盼宏
 * @Date: 2022-08-27 21:54:39
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 22:41:07
 */
import { ILayoutProps, Icon } from '@/components';

/** title of website */
export const title = 'Zhongbr\'s Blog 🚀';
/** link to navigate when click title */
export const titleLink = '/';
/** navigate link on right of the header */
export const navLinks: ILayoutProps['navLinks'] = [
    { name: '首页', target: '/', icon: <Icon className="rp-suoyin" /> },
    { name: '微信', icon: <Icon className="rp-weixin" /> },
    { name: 'Github', target: 'https://github.com/zhongbr', icon: <Icon className="rp-github" /> },
];
