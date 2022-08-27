/*
 * @Description: page context
 * @Author: 张盼宏
 * @Date: 2022-08-27 21:07:10
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-27 23:29:42
 */
import React, {createContext, useContext} from 'react';

export interface IPageContext {
    title: string;
    target: string;
    scrollRef?: React.LegacyRef<Element>;
    setStates?: (
        payload: Partial<Omit<IPageConfig, 'setStates'>>,
        cb?: (states: Omit<IPageConfig, 'setStates'>) => void
    ) => void;
}

export type IPageConfig = Omit<IPageContext, 'setStates'>;

export const PageConfigContext = createContext<IPageContext>({
    title: '',
    target: ''
});

export default function usePageConfig() {
    return useContext(PageConfigContext);
};
