import { isAbsolute } from 'path';

import staticResourcesMapEntries from '@/app/posts/article/md/staticResourcesMap.json';

const publicDir = '/static';
const staticResourcesMap = new Map(staticResourcesMapEntries as [string, string][]);

export const isOutLink = (url: string) => url.startsWith('http') || url.startsWith('//');

export function relativeUrl(url: string | undefined) {
    if (!url || isAbsolute(url) || isOutLink(url)) {
        return url;
    }
    if (staticResourcesMap.has(url)) {
        return publicDir + '/' + staticResourcesMap.get(url);
    }
    if (staticResourcesMap.has(`./${url}`)) {
        return publicDir + '/' + staticResourcesMap.get(`./${url}`);
    }
    return url;
}
