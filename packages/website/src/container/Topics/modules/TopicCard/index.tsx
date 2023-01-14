import React, { useRef } from 'react';
import clsx from "clsx";

import { useCursorFollow } from '@/animations';
import { Hover, Icon, Tag } from '@/components';
import { useTags, useNavigate, useEventListener } from '@/hooks';
import { HoverContext } from '@/components/Hover';
import { ITopic } from '@/service/passage/topics';
import { IPassage } from "@/service/passage/catalogue";

import styles from './card.module.less';

export { default as Group } from './Group';

const TopicCard: React.FC<ITopic> = props => {
    const { icon, topicName, desc, color = '#7adfb032', tags, passages } = props;
    const ref = useRef<HTMLDivElement>(null);

    const { onOpenTags } = useTags();
    const navigate = useNavigate();

    useCursorFollow(ref.current, 300, color.slice(0, 7));

    useEventListener(ref.current, 'mouseenter', () => {
        ref.current?.style?.setProperty('--color', color.slice(0, 7) + '50');
    });

    useEventListener(ref.current, 'mouseleave', () => {
        ref.current?.style?.setProperty('--color', color.slice(0, 7) + '32');
    });

    const onOpenPassage = (passage: IPassage) => {
        navigate(`/passage/${encodeURIComponent(passage['json-path'])}`);
    };

    return (
        <Hover
            ref={ref}
            className={styles.hoverContainer}
            style={{ '--color': color } as React.CSSProperties}
            triggerInHover={false}
            hoverContent={(
                <HoverContext.Consumer>
                    {({ toggle }) => (
                        <div className={clsx('blur', 'border-radius-normal', styles.hover)}>
                            <div className={styles.head}>
                                <div className={styles.operation} onClick={() => toggle()}>
                                    <Icon className="rp-arrow-left-bold"/>
                                    返回
                                </div>
                                <div className={styles.title}>
                                    <Icon className={icon}/>
                                    精选文章
                                </div>
                            </div>
                            <div className={styles.passagesList}>
                                {passages?.map((passage) => (
                                    <div className={styles.passageListItem} onClick={() => onOpenPassage(passage)}>
                                        <Icon className="rp-dianzan"/>
                                        <div
                                            className={styles.title}
                                        >
                                            {passage.title}
                                        </div>
                                        <Icon
                                            className={clsx('rp-arrow-right', styles.icon)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </HoverContext.Consumer>
            )}
        >
            <HoverContext.Consumer>
                {({ toggle, hovered }) => (
                    <div className={clsx('border-radius-normal', styles.card, { [styles.hoverd]: hovered })}>
                        <div className={styles.icon}>
                            <Icon className={icon}/>
                        </div>
                        <div className={styles.head}>
                            <div className={styles.title}>{topicName}</div>
                            <div className={styles.operation} onClick={() => toggle(true)}>
                                精选文章
                                <Icon className="rp-arrow-right"/>
                            </div>
                        </div>
                        <div className={styles.desc}>
                            <span className={styles.title}>
                                {desc}
                            </span>
                        </div>
                        <div className={styles.tags}>
                            {tags?.map(tag => (
                                <Tag key={tag} onClick={() => onOpenTags([tag])}>
                                    {tag}
                                </Tag>
                            ))}
                        </div>
                        <div className={styles.footer}>
                            <div
                                className={styles.operation}
                                onClick={() => onOpenTags(tags)}
                            >
                                查看所有文章
                                <Icon className="rp-arrow-right"/>
                            </div>
                        </div>
                    </div>
                )}
            </HoverContext.Consumer>
        </Hover>
    );
};

TopicCard.displayName = 'TopicCard';
export default TopicCard;
