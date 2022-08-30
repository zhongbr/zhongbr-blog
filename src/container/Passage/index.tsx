/*
 * @Description: passage
 * @Author: 张盼宏
 * @Date: 2022-08-27 23:24:29
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:13:04
 */
import { useEffect, useState, memo } from 'react';
import { useParams } from 'react-router-dom';

import { usePageConfig, useAsyncFn, useAsyncEffect } from "@/hooks";
import { passage } from '@/service';

import { Render, Sketch } from './components';
import { traverseAst, generateSketch, Title } from './utils/traverse';
import styles from './style.module.less';

type IPageParam = Record<'path', string | undefined>;

const Passage = () => {
    const { setStates, rate = 0 } = usePageConfig();
    const { path } = useParams<IPageParam>();

    const [fetchPassage, res] = useAsyncFn(passage.passage);
    const [sketch, setSketch] = useState<Title[]>([]);

    useEffect(() => {
        setStates?.({
            title: res?.data?.catalogue?.title
        });
    }, [setStates, res?.data?.catalogue?.title]);

    useAsyncEffect(async () => {
        if (!path) {
            return;
        }
        const res = await fetchPassage({ path });
        // traverse markdown ast and mark the parent and siblings
        traverseAst(res.data.ast);
        // generate sketch
        const sketch = generateSketch(res.data.ast);
        setSketch(sketch);
    }, [fetchPassage, path]);

    return (
        <div className={styles.passageContainer}>
            <div
                className={styles.sketch}
                style={{
                    top: `${155 - 75 * rate}px`
                }}
            >
                <Sketch sketch={sketch}/>
            </div>
            <div className={styles.passage}>
                {!!res?.data?.ast ? <Render node={res.data.ast}/> : null}
            </div>
        </div>
    );
}

export default memo(Passage);
