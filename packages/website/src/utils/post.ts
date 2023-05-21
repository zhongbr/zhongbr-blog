import { sep } from 'path-browserify';

import encodedPathsEntries from '@/app/posts/article/md/encodedPathsFile.json';

const encodedPaths = new Map(encodedPathsEntries as [string, string][]);
export function openPost(pathStr: string) {
    const pathCn = pathStr.replace(/\.json$/, '');

    // 编码映射到拼音
    const path = pathCn.split(sep).map(segment => encodedPaths.get(segment) || segment).join(sep);

    window.open(`/posts/article/md/${path}`, '_blank', 'noopener');
}
