/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:40:12
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-11 10:39:24
 */
import React from 'react';

import { IBaseProps, NodeType } from '@/types/markdown';
import * as Comp from './modules';

const ComponentsMap = new Map([
    [NodeType.Header, Comp.Header],
    [NodeType.Str, Comp.Str],
    [NodeType.Strong, Comp.Strong],
    [NodeType.Emphasis, Comp.Emphasis],
    [NodeType.Delete, Comp.Delete],
    [NodeType.Paragraph, Comp.Paragraph],
    [NodeType.CodeBlock, Comp.CodeBlock],
    [NodeType.Code, Comp.Code],
    [NodeType.BlockQuote, Comp.BlockQuote],
    [NodeType.Link, Comp.Link],
    [NodeType.Image, Comp.Image],
    [NodeType.Html, Comp.Html],
    [NodeType.Table, Comp.Table],
    [NodeType.TableRow, Comp.TableRow],
    [NodeType.TableCell, Comp.TableCell],
    [NodeType.Yaml, Comp.Yaml],
    [NodeType.List, Comp.List],
    [NodeType.ListItem, Comp.ListItem],
    [NodeType.HorizontalRule, Comp.HorizontalRule],
    [NodeType.Math, Comp.Math],
    [NodeType.InlineMath, Comp.InlineMath]
]);

const Index: React.FC<Partial<IBaseProps>> = (props) => {
    const { node, ast } = props;

    if (!node) {
        return null;
    }

    const children = node.children?.filter(
        child => child.visible !== false
    )?.map(
        child => <Index key={child.key} node={child}/>
    );

    if (node.type === NodeType.Document) {
        return (
            <>
                {children}
            </>
        );
    }

    const Component = ComponentsMap.get(node.type);
    if (!Component) {
        return (
            <>
                {children}
            </>
        );
    }

    return (
        <Component node={node} ast={ast}>
            {children}
        </Component>
    );
};

export default Index;
