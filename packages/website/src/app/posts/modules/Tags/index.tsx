'use client';
import React from 'react';

import { UnPromise } from '@/types/utils';
import { dividePostsByTag } from '../../actions/dividePosts';
import { IPassage } from '@/data/posts';

type TagsMap = UnPromise<ReturnType<typeof dividePostsByTag>>;

export interface ITagProps {
    tagsMap: TagsMap;
}

const Tags: React.FC<ITagProps> = (props) => {
    const { tagsMap } = props;

    const tags = Array.from(tagsMap.keys());
    console.log(Array.isArray(tagsMap));

    return (
        <div>
            {tags.map(tag => <div key={tag}>{tag}</div>)}
        </div>
    );
};

export default Tags;
