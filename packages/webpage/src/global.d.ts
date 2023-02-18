import { IIndexPoster } from '@/config/meta';

interface Metas {
    title: string;
    titleLink: string;
    IndexPoster: IIndexPoster;
    ICP: string;
    PublicSecurity: string;
    PublicSecurityNo: string;
    AuthorCopyRight: string;
    GithubLink: string;
};

declare global {
    declare var startRender: (opt: {
        metas?: Metas;
        root?: HTMLElement;
    }) => Promise<void>;
}
