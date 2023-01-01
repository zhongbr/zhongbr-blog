/*
 * @Description: passages catalogues
 * @Author: 张盼宏
 * @Date: 2022-08-28 14:38:38
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-03 18:45:34
 */
import React, {useMemo} from "react";
import Button from "@mui/material/Button";
import clsx from "clsx";

import { Tag, Card, Icon } from '@/components';
import { useNavigate, useTags } from '@/hooks';
import { ICatalogue, IPassage } from "@/service/passage/catalogue";
import {copy} from "@/utils/copy";

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
        return Object.values(catalogue || {});
    }, [catalogue]);

    const onOpenPassage = (passage: IPassage) => {
        onEnterPassage?.(passage);
        navigator(`/passage/${passage['json-path']}`);
    };

    const onCopy = async (passage: IPassage) => {
        await copy(`${window.location.protocol}//${window.location.host}/#/passage/${passage['json-path']}`);
    };

    return (
        <div className={styles.container}>
            {!!tags.length && (
                <div className={clsx('blur', 'border-radius-normal', styles.selectedTags)}>
                    {tags?.map(tag => (
                        <Tag
                            selected
                            onRemove={() => onRemoveTag(tag)}
                        >
                            {tag}
                        </Tag>
                    ))}
                    <Button size="small" color="primary" onClick={() => onReplaceTags([])}>
                        清除
                    </Button>
                </div>
            )}

            <div className={styles.passagesContainer}>
                {passages.map(passage => (
                    <Card
                        width={450}
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
            </div>
        </div>
    );
};

export default Catalogue;
