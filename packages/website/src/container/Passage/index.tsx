/*
 * @Description: passage
 * @Author: 张盼宏
 * @Date: 2022-08-27 23:24:29
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-08 23:40:46
 */
import {memo, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import clsx from 'clsx';

import {ResponsiveEnum, useAsyncEffect, useAsyncFn, usePageConfig, useTags} from "@/hooks";
import {passage} from '@/service';
import {IPassage} from "@/service/passage/catalogue";
import {Tag} from "@/components";

import {Render, Sketch} from './components';
import {generateSketch, Title, traverseAst} from './utils/traverse';
import styles from './style.module.less';

type IPageParam = Record<'path', string | undefined>;

const Passage = () => {
    const { setStates, rate = 0, onPageReady, widthLevel } = usePageConfig();
    const { path } = useParams<IPageParam>();

    const [fetchPassage, res] = useAsyncFn(passage.passage);
    const [sketch, setSketch] = useState<Title[]>([]);
    const [catalogue, setCatalogue] = useState<IPassage>();

    const { onOpenTags } = useTags();

    useEffect(() => {
        setStates?.({
            title: res?.data?.catalogue?.title,
            footer: {
                showICP: false,
                showCopyRight: true,
                showPublicSecurity: false
            }
        });
    }, [setStates, res?.data?.catalogue?.title]);

    useAsyncEffect(async () => {
        if (!path) {
            return;
        }
        const [res, catalogue] = await Promise.all([
            fetchPassage({ path }),
            passage.catalogue()
        ]);
        setCatalogue(catalogue?.data?.[path.replace(/\.json$/, '.md')]);
        // traverse markdown ast and mark the parent and siblings
        traverseAst(res.data.ast);
        // generate sketch
        const sketch = generateSketch(res.data.ast);
        setSketch(sketch);
        // show page
        onPageReady?.();
    }, [fetchPassage, path]);

    return (
        <div className={styles.passageContainer}>
            <div
                className={clsx(
                    styles.sketch,
                    {
                        [styles.display]: [ResponsiveEnum.normal, ResponsiveEnum.large].includes(widthLevel || ResponsiveEnum.normal)
                    }
                )}
                style={{
                    top: `${155 - 75 * rate}px`
                }}
            >
                <Sketch sketch={sketch}/>
            </div>
            <div className={styles.passage}>
                <div className={clsx('content', 'blur')}>
                    <div className="tags">
                        {res?.data?.catalogue?.tags?.map(tag => (
                            <Tag key={tag} onClick={() => onOpenTags([tag])}>{tag}</Tag>
                        ))}
                    </div>

                    {catalogue?.cover && (
                        <img alt="cover" className="cover-image" src={catalogue.cover}/>
                    )}

                    <Render node={res?.data?.ast}/>
                </div>
            </div>
        </div>
    );
}

export default memo(Passage);
