import React, {createContext, useContext} from 'react';
import { IProps as LayoutProps } from '@/components/Layout';
import { ResponsiveEnum } from './useResponsive';

export interface IPageContext {
    title: string;
    target: string;
    footer?: LayoutProps['footerProps'];
    scrollRef?: React.RefObject<Element>;
    loading?: boolean;
    theme?: string;
    screenWidth?: number;
    widthLevel?: ResponsiveEnum;
    setStates?: (
        payload: Partial<Omit<IPageConfig, 'setStates'>>,
        cb?: (states: Omit<IPageConfig, 'setStates'>) => void
    ) => void;
    resetStates?: () => void;
    onPageReady?: () => void;
    setTheme?: (theme: string) => void;
}

export type IPageConfig = Omit<IPageContext, 'setStates'>;

export const PageConfigContext = createContext<IPageContext>({
    title: '',
    target: ''
});

export default function usePageConfig() {
    return useContext(PageConfigContext);
};
