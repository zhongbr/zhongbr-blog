/*
 * @Description: 路由设置
 * @Author: 张盼宏
 * @Date: 2022-08-27 23:30:19
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 22:45:59
 */
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Topics = lazy(() => import('@/container/Topics'));
const TagIndex = lazy(() => import('@/container/TagIndex'));
const Passage = lazy(() => import('@/container/Passage'));

const routers: RouteObject[] = [
    {
        path: '/passage/:path',
        element: <Passage/>,
    },
    {
        path: '/tags',
        element: <TagIndex/>
    },
    {
        path: '/',
        element: <Topics/>
    }
];

export default routers;
