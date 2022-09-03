/*
 * @Description: 路由设置
 * @Author: 张盼宏
 * @Date: 2022-08-27 23:30:19
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 13:58:40
 */
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Index = lazy(() => import('@/container/Index'));
const Passage = lazy(() => import('@/container/Passage'));

const routers: RouteObject[] = [
    {
        path: '/index',
        element: <Index />,
    },
    {
        path: '/passage/:path',
        element: <Passage />,
    },
    {
        path: '/',
        element: <Index/>
    }
];

export default routers;
