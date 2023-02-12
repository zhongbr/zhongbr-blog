import React, { createContext } from 'react';
import clsx from "clsx";

import { ResponsiveEnum, usePageConfig } from "@/hooks";

import styles from './group.module.less';

export interface IProps {
    id?: string;
    className?: string;
    maxWidth?: number;
    rowCountOffset?: number;
    outerPadding?: number;
    containerPadding?: number;
    gap?: number;
    borderWidth?: number;
    cardsContainerClassName?: string;
    headContent?: React.ReactNode;
    children?: React.ReactNode;
}

export interface IContext {
    cardWidth: number;
    passageListWidth: number;
}

const maxWidth = 1416;
const RowCountsMap = new Map([
    [ResponsiveEnum.tiny, 1],
    [ResponsiveEnum.mid, 2],
    [ResponsiveEnum.normal, 3],
    [ResponsiveEnum.large, 3]
]);

export const calcPassageListWidth = (innerWidth?: number, _maxWidth = maxWidth, outerPadding = 0) => {
    return Math.min(_maxWidth, innerWidth || window.innerWidth) - 2 * outerPadding;
}

export const calcCardWidth = (rowCount = 3, innerWidth?: number, _maxWidth?: number, containerPadding = 20, gap = 10, borderWidth = 1, outerPadding?: number) => {
    const passagesListWidth = calcPassageListWidth(innerWidth, _maxWidth, outerPadding);
    return [passagesListWidth, Math.floor((passagesListWidth - containerPadding * 2 - gap * (rowCount - 1) - 2 * borderWidth * rowCount) / rowCount)];
}

const [defaultPassageListWidth, defaultCardWidth] = calcCardWidth(RowCountsMap.get(ResponsiveEnum.normal));

export const GroupContext = createContext<IContext>({
    cardWidth: defaultCardWidth,
    passageListWidth: defaultPassageListWidth
});

const Group: React.FC<IProps> = props => {
    const { cardsContainerClassName, className, maxWidth, rowCountOffset = 0, outerPadding, containerPadding, borderWidth, gap, children, headContent, id } = props;

    const { widthLevel, screenWidth } = usePageConfig();

    const rowCount = RowCountsMap.get(widthLevel || ResponsiveEnum.normal) || 3;
    const [passageListWidth, cardWidth] = calcCardWidth(
        Math.max(rowCount + rowCountOffset, 1),
        screenWidth,
        maxWidth,
        containerPadding,
        borderWidth,
        gap,
        outerPadding
    );

    return (
        <GroupContext.Provider value={{ cardWidth, passageListWidth }}>
            <div
                id={id}
                className={clsx(styles.outContainer, className)}
                style={{ '--passages-list-width': `${passageListWidth}px` } as React.CSSProperties}
            >
                {headContent}
                <div className={clsx(styles.container, cardsContainerClassName)}>
                    {children}
                </div>
            </div>
        </GroupContext.Provider>
    );
};

Group.displayName = 'Group';
export default Group;
