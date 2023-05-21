import React from 'react';
import clsx from 'clsx';
import { sep } from 'path';

import { Node } from '@/types/markdown';
import { ICatalogue, IPassage } from '@/data/posts';
import { PostTree } from '@/components';
import catalogue from '@/app/posts/article/md/catalogue.json';

import { buildAst } from './utils/traverse';
import { Render } from './modules';
import styles from './index.module.scss';

const Article = (props: { ast: Node; metas: IPassage; }) => {
    const { ast: node, metas } = props;
    const ast = buildAst(node);

    const path = metas['json-path'].replace(/^\.\//, '').split(sep);

    return (
        <div className={styles.container}>
            <div className={clsx(styles.posts_tree, 'blur')}>
                <PostTree path={['', ...path]} catalogue={catalogue as unknown as ICatalogue} />
            </div>
            <div className={clsx(styles.post, 'blur')}>
                <div className={styles.metas}>
                    <div className={styles.cover}>
                        <img src={metas.cover}/>
                    </div>
                    <div className={styles.title}>
                        {metas.title}
                    </div>
                    {metas?.mdate && (
                        <div className={styles.info}>
                            <span>📅</span>
                            最后修改日期：{metas.mdate}
                        </div>
                    )}
                    {metas?.author && (
                        <div className={styles.info}>
                            <span>👤</span>
                            {metas.author}
                        </div>
                    )}
                </div>
                <Render node={node} ast={ast} />
            </div>
        </div>
    );
};

export default Article;
