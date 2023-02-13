import React, { createContext, useContext } from 'react';
import IndexPosterImage from '@/images/index.png';

type IOpt = Parameters<typeof startRender>[0];

export const ConfigContext = createContext<IOpt>({});

export const useBlogConfig = () => {
    const config = useContext(ConfigContext);
    if (config.metas?.IndexPoster) {
        config.metas.IndexPoster.rightImage ||= IndexPosterImage;
    }
    return config;
};

export interface IProps {
    children: React.ReactNode;
    opt?: IOpt;
}

const BlogConfigProvider: React.FC<IProps> = (props) => {
    const { children, opt = {} } = props;
    return (
        <ConfigContext.Provider value={opt}>
            {children}
        </ConfigContext.Provider>
    );
};

export default BlogConfigProvider;
