/*
 * @Description: meta config
 * @Author: 张盼宏
 * @Date: 2022-08-27 21:54:39
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 22:41:07
 */
import { ILayoutProps, Icon } from '@/components';

/** 网站的标题 */
export const title = "Zhongbr's Blog 🚀";
/** 点击标题跳转的链接 */
export const titleLink = '/';
/** 头部右侧的导航链接 */
export const navLinks: ILayoutProps['navLinks'] = [
    { name: '首页', target: '/', icon: <Icon className="rp-zixun" /> },
    { name: '全部文章', target: '/tags', icon: <Icon className="rp-zhinan" /> },
    { name: 'Github', target: 'https://github.com/zhongbr', icon: <Icon className="rp-tuandui" /> },
];

/** 网站的备案信息 */
/** ICP 备案号 */
export const ICP = '鄂ICP备19008487号-1';
/** 公安备案号 */
export const PublicSecurity = '鄂公网安备42011102003165号';
export const PublicSecurityNo = '42011102003165';
/** 版权信息 */
export const AuthorCopyRight = 'Zhongbr\'s Blog 钟摆人的部落格';
