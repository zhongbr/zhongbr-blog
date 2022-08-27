/*
 * @Description: meta config
 * @Author: 张盼宏
 * @Date: 2022-08-27 21:54:39
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-27 23:19:47
 */
import { ILayoutProps, Icon } from '@/components';

/** title of website */
export const title = '钟摆人的部落格';
/** link to navigate when click title */
export const titleLink = '/';
/** navigate link on right of the header */
export const navLinks: ILayoutProps['navLinks'] = [
    { name: '文章目录', target: '', icon: <Icon className="rp-github" /> },
    { name: 'Github 主页', target: '', icon: <Icon className="rp-github" /> },
];
