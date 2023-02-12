import React, { useContext } from 'react';
import clsx from "clsx";

import Hover, { HoverContext } from '../Hover';
import { GroupContext } from './group';

import styles from "@/components/PassageCard/normal.module.less";

export interface IProps {
    className?: string;
    /** card width */
    width?: number;
    /** head image */
    headerImage?: React.ReactNode;
    /** icon at the left of title */
    icon?: React.ReactNode;
    /** title content */
    title?: React.ReactNode;
    /** content under of title */
    extraInfo?: React.ReactNode;
    /** extra info show when hover */
    extraInfoHover?: React.ReactNode;
    /** show when hover */
    hoverContent?: React.ReactNode;
    onClickImage?: () => void;
}

const Card: React.FC<IProps> = props => {
    const {
        className,
        headerImage,
        icon = "🚀",
        title,
        extraInfoHover,
        extraInfo,
        hoverContent,
        onClickImage,
        width,
    } = props;

    const { cardWidth } = useContext(GroupContext);

    return (
        <Hover>
            <HoverContext.Consumer>
                {({ hovered }) => (
                    <div
                        className={clsx(className, styles.cardNormal, 'border-radius-normal')}
                        style={{ '--width': `${width || cardWidth}px` } as React.CSSProperties}
                    >
                        <div className={styles.header} onClick={onClickImage}>
                            {typeof headerImage === 'string' ? <img src={headerImage} alt="Cover"/> : headerImage}
                        </div>
                        <div className={clsx(styles.content, 'blur', hovered ? styles.hovered : styles.unhovered)}>
                            <div className={styles.title}>
                                <div>{icon}</div>
                                <span>{title}</span>
                            </div>
                            <div className={styles.extraInfo}>
                                {extraInfo}
                            </div>
                            <div className={clsx(styles.extraInfoHover, { [styles.fold]: !hovered })}>
                                {extraInfoHover}
                            </div>
                            <div className={clsx(styles.hoverContainer, { [styles.fold]: !hovered })}>
                                {hoverContent}
                            </div>
                        </div>
                    </div>
                )}
            </HoverContext.Consumer>
        </Hover>
    );
};

Card.displayName = 'Card';

export { default as Group } from './group';
export default Card;
