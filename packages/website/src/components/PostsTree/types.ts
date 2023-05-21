import { ICatalogue } from '@/data/posts';
import { sep } from 'path';

export interface IPost {
    path: string;
    name: string;
}

export interface IDirectory {
    path: string;
    name: string;
    childrenMap: Map<string, IDirectory | IPost>;
    children: Array<IDirectory | IPost>;
}

export const buildPostsTreeIndexes = (catalogue: ICatalogue): IDirectory => {
    const posts = Object.values(catalogue);
    const root: IDirectory = { path: '', name: '', childrenMap: new Map([]), children: [] };

    posts.forEach(post => {
        const segments = post['json-path'].replace(/^\.\//, '').split(sep);
        let current = root;
        segments.forEach((segment, index) => {
            if (!current.childrenMap.has(segment)) {
                if (index === segments.length - 1) {
                    const file = { path: post['json-path'], name: post.title };
                    current.childrenMap.set(segment, file);
                    current.children.push(file);
                    return;
                } else {
                    const directory: IDirectory = {
                        path: `${current.path}${segment}/`,
                        name: `${segment}`,
                        childrenMap: new Map([]),
                        children: [],
                    };
                    current.childrenMap.set(segment, directory);
                    current.children.push(directory);
                }
            }
            current = current.childrenMap.get(segment) as IDirectory;
        });
    });

    return root;
};
