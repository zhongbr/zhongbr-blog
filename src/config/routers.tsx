/*
 * @Description: 路由设置
 * @Author: 张盼宏
 * @Date: 2022-08-27 23:30:19
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-27 23:36:17
 */
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Passage = lazy(() => import('@/container/Passage'));

const routers: RouteObject[] = [
    {
        path: '/passage',
        element: <Passage />,
    }
];

export default routers;
