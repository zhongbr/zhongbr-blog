/*
 * @Description: passages catalogues
 * @Author: 张盼宏
 * @Date: 2022-08-28 14:38:38
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 18:45:34
 */
import React, { useMemo } from "react";
import clsx from "clsx";

import { PassageCard, PassageCardGroup, Icon, Tag } from '@/components';
import { useNavigate, useTags } from '@/hooks';
import { ICatalogue, IPassage } from "@/service/passage/catalogue";
import { copy } from "@/utils/copy";

import styles from './style.module.less';

export interface Props {
    /** trigger when entry passage */
    onEnterPassage?: (passage: IPassage) => void;
    /** catalogues */
    catalogue?: ICatalogue;
}

const Catalogue: React.FC<Props> = (props) => {
    const { onEnterPassage, catalogue } = props;

    const navigator = useNavigate();

    const { onReplaceTags, onRemoveTag, onSelectTag, tags } = useTags();

    const passages = useMemo(() => {
        // 过滤掉不显示的文章
        return Object.values(catalogue || {}).filter(passage => passage.visible);
    }, [catalogue]);

    const onOpenPassage = (passage: IPassage) => {
        onEnterPassage?.(passage);
        navigator(`/passage/${encodeURIComponent(passage['json-path'])}`);
    };

    const onCopy = async (passage: IPassage) => {
        await copy(`${window.location.protocol}//${window.location.host}/#/passage/${encodeURIComponent(passage['json-path'])}`);
    };

    return (
        <PassageCardGroup
            className={styles.container}
            cardsContainerClassName={styles.passagesContainer}
            headContent={!!tags.length && (
                <div className={clsx('blur', 'border-radius-normal', styles.selectedTags)}>
                    {tags?.map(tag => (
                        <Tag
                            selected
                            onRemove={() => onRemoveTag(tag)}
                        >
                            {tag}
                        </Tag>
                    ))}
                    <Tag hideIcon onClick={() => onReplaceTags([])}>
                        清除
                    </Tag>
                </div>
            )}
        >
            {passages.map(passage => (
                <PassageCard
                    onClickImage={() => onOpenPassage(passage)}
                    title={passage.title}
                    icon={passage.icon}
                    headerImage={passage.cover}
                    extraInfoHover={passage.mdate}
                    extraInfo={(
                        <div>
                            {passage?.tags?.map?.(tag => <Tag key={tag} onClick={() => onSelectTag(tag)}>{tag}</Tag>)}
                        </div>
                    )}
                    hoverContent={(
                        <div className={styles.passageOperations}>
                            <Icon
                                className="rp-faxian"
                                text="阅读"
                                onClick={() => onOpenPassage(passage)}
                            />
                            <Icon
                                className="rp-fuzhi"
                                text="复制"
                                onClick={() => onCopy(passage)}
                            />
                        </div>
                    )}
                />
            ))}
        </PassageCardGroup>
    );
};

export default Catalogue;
