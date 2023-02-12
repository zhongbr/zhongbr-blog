import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import { basename } from 'path-browserify';
import { useAsyncEffect, useAsyncFn } from '@zhongbr/react-hooks';

import { ResponsiveEnum, usePageConfig, useTags } from "@/hooks";
import { passage } from '@/service';
import { IPassage } from "@/service/passage/catalogue";
import { Icon, Tag } from "@/components";

import { Context } from './context';
import { Render, Sketch } from './components';
import { generateSketch , Title, traverseAst} from './utils/traverse';
import styles from './style.module.less';

type IPageParam = Record<'path', string | undefined>;

const Passage = () => {
    const { setStates, onPageReady, widthLevel } = usePageConfig();
    const { path: path_ } = useParams<IPageParam>();

    const [fetchPassage, res] = useAsyncFn(passage.passage);
    const [fetchCatalogue, catalogueRes] = useAsyncFn(passage.catalogue);
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
        if (!path_) {
            return;
        }
        const path = decodeURIComponent(path_);
        const [res, catalogue] = await Promise.all([
            fetchPassage({ path }),
            fetchCatalogue()
        ]);
        setCatalogue(catalogue?.data?.[basename(path.replace(/\.json$/, '.md'))]);
        // traverse markdown ast and mark the parent and siblings
        traverseAst(res.data.ast);
        // generate sketch
        const sketch = generateSketch(res.data.ast);
        setSketch(sketch);
        // show page
        onPageReady?.();
    }, [fetchPassage, path_]);

    return (
        <Context.Provider value={{ catalogue: catalogueRes?.data, curCatalogue: catalogue }}>
            <>
                <aside
                    className={clsx(
                        styles.sketch,
                        {[styles.display]: [ResponsiveEnum.normal, ResponsiveEnum.large].includes(widthLevel || ResponsiveEnum.normal)}
                    )}
                >
                    <Sketch sketch={sketch}/>
                </aside>
                <article
                    className={clsx(
                        styles.passage,
                        {[styles.full]: [ResponsiveEnum.mid, ResponsiveEnum.tiny].includes(widthLevel || ResponsiveEnum.normal)}
                    )}
                >
                    <div className={clsx('content', 'blur')}>
                        <div className="tags">
                            {res?.data?.catalogue?.tags?.map((tag: any) => (
                                <Tag key={tag} onClick={() => onOpenTags([tag])}>{tag}</Tag>
                            ))}
                        </div>

                        {catalogue?.mdate && (
                            <div className="date">
                                <Icon className="rp-rili"/>
                                <span>发布日期</span>
                                <span>{catalogue.mdate}</span>
                            </div>)}

                        {catalogue?.cover && (
                            <img alt="cover" className="cover-image" src={catalogue.cover}/>
                        )}

                        <div className="passage-render">
                            <Render node={res?.data?.ast}/>
                        </div>
                    </div>
                </article>
            </>
        </Context.Provider>
    );
}

export default memo(Passage);
