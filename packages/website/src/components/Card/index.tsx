import React from 'react';
import clsx from "clsx";

import Hover, { HoverContext } from '../Hover';

import styles from "@/components/Card/normal.module.less";

export interface IProps {
    /** card width */
    width?: string;
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
        headerImage,
        icon = "🚀",
        title,
        extraInfoHover,
        extraInfo,
        hoverContent,
        onClickImage,
        width = '400px',
    } = props;

    return (
        <Hover>
            <HoverContext.Consumer>
                {({ hovered }) => (
                    <div className={clsx(styles.cardNormal, 'border-radius-normal')} style={{ '--width': width } as any}>
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
export default Card;
