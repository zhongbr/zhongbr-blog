import React, { useMemo } from "react";
import { dirname } from 'path-browserify';

import { useNavigate } from '@/hooks';
import { useMessage, Icon, PassageCard } from '@/components';
import { copy } from '@/utils/copy';

import { usePassageContext } from '../../../context';

import styles from './passage.module.less';

export interface IProps {
    keyword: string;
    extraHeaders?: string[];
    extraInfos?: string[];
}

const PassageLink: React.FC<IProps> = props => {
    const { keyword: keyword_, extraInfos, extraHeaders } = props;
    const { catalogue = {}, curCatalogue } = usePassageContext();
    const navigator = useNavigate();
    const message = useMessage();

    // 找到包含当前关键词，并且和当前文章在同一个子目录的文章
    const passage = useMemo(() => {
        // 处理 keyword 内的斜杠
        const keyword = keyword_.replace('/', ' ');
        const entry = Object.entries(catalogue).find(([name, metas]) => {
            if (!name.includes(keyword)) {
                return false;
            }
            if (!metas?.['json-path'] || !curCatalogue?.['json-path']) {
                return false;
            }
            return dirname(metas['json-path']).includes(dirname(curCatalogue['json-path']));
        });
        return entry?.[1];
    }, [catalogue, curCatalogue, keyword_]);

    const onOpenPassage = () => {
        if (!passage) {
            message.fail({
                title: '打开失败',
                content: '未找到对应的文章'
            });
            return;
        }
        navigator(`/passage/${encodeURIComponent(passage['json-path'])}`)
    };

    const onCopy = () => {
        if (!passage) {
            message.fail({
                title: '复制失败',
                content: '未找到对应的文章'
            });
            return;
        }
        copy(`${window.location.protocol}//${window.location.host}/#/passage/${encodeURIComponent(passage['json-path'])}`)
    }

    if (!passage) {
        return <span>这篇文章走丢了😭</span>
    }

    return (
        <PassageCard
            className={styles.card}
            onClickImage={onOpenPassage}
            title={passage.title}
            headerImage={passage.cover}
            icon={passage.icon}
            extraInfo={(extraInfos?.length && extraHeaders?.length && extraInfos.length === extraHeaders.length && (
                <div className={styles.extraInfo}>
                    {extraInfos.map((value, index) => (
                        <div key={index} className={styles.item}>
                            <span className={styles.title}>{extraHeaders[index]}</span>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
            ))}
            hoverContent={
                <div className={styles.hoverOps}>
                    <Icon
                        className="rp-faxian"
                        text="阅读"
                        onClick={onOpenPassage}
                    />
                    <Icon
                        className="rp-fuzhi"
                        text="复制"
                        onClick={onCopy}
                    />
                </div>}
        />
    );
};
export default PassageLink;
