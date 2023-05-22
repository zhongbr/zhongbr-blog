import React from 'react';
import clsx from 'clsx';
import { sep } from 'path';
import Link from 'next/link';

import { Node } from '@/types/markdown';
import { ICatalogue, IPassage } from '@/data/posts';
import { PostTree, Profile } from '@/components';
import catalogue from '@/app/posts/article/md/catalogue.json';

import { buildAst } from './utils/traverse';
import { Render } from './modules';
import styles from './index.module.scss';
import { Footer } from '@/components/Layout';

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
                    {metas?.tags?.length && (
                        <div className={clsx(styles.tags_box, 'no-default-styles')}>
                            {metas?.tags?.map(tag => (
                                <Link
                                    key={tag}
                                    className={clsx('tag', styles.tag)}
                                    href={`/posts?tags=${tag}`}
                                    target="_blank"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <Render node={node} ast={ast} />
            </div>
            <div className={styles.right_panel}>
                <Profile/>
                <Footer/>
            </div>
        </div>
    );
};

export default Article;
