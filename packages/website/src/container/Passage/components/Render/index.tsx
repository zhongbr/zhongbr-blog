/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:40:12
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 22:40:12
 */
import React, { lazy, memo } from 'react';

import { NodeType, IBaseProps } from '@/types/markdown';

const ComponentsMap = new Map([
    [NodeType.Header, lazy(() => import('./Header'))],
    [NodeType.Str, lazy(() => import('./Str'))],
    [NodeType.Strong, lazy(() => import('./Strong'))],
    [NodeType.Emphasis, lazy(() => import('./Emphasis'))],
    [NodeType.Delete, lazy(() => import('./Delete'))],
    [NodeType.Paragraph, lazy(() => import('./Paragraph'))],
    [NodeType.CodeBlock, lazy(() => import('./CodeBlock'))],
    [NodeType.BlockQuote, lazy(() => import('./BlockQuote'))],
    [NodeType.Link, lazy(() => import('./Link'))],
    [NodeType.Image, lazy(() => import('./Image'))],
    [NodeType.Html, lazy(() => import('./Html'))],
    [NodeType.Table, lazy(() => import('./Table'))],
    [NodeType.TableRow, lazy(() => import('./TableRow'))],
    [NodeType.TableCell, lazy(() => import('./TableCell'))],
    [NodeType.Yaml, lazy(() => import('./Yaml'))],
    [NodeType.List, lazy(() => import('./List'))],
    [NodeType.ListItem, lazy(() => import('./ListItem'))],
    [NodeType.HorizontalRule, lazy(() => import('./HorizontalRule'))]
]);

const Render: React.FC<IBaseProps> = (props) => {
    const { node } = props;

    if (!node) {
        return null;
    }

    const children = node.children?.map(child => <Render key={child.key} node={child}/>);

    if (node.type === NodeType.Document) {
        return <>{children}</>;
    }

    const Component = ComponentsMap.get(node.type);
    if (!Component) {
        return <>{children}</>;
    }

    return (
        <Component node={node}>
            {children}
        </Component>
    );
};

export default memo(Render);
