/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-08-29 22:40:12
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-11 10:39:24
 */
import React, { memo } from 'react';

import { NodeType, IBaseProps } from '@/types/markdown';
import { Loading } from '@/components';

import Header from './Header';
import Str from './Str';
import Strong from './Strong';
import Emphasis from "./Emphasis";
import Delete from './Delete';
import Paragraph from './Paragraph';
import CodeBlock from './CodeBlock';
import BlockQuote from './BlockQuote';
import Link from './Link';
import Image from './Image';
import Html from './Html';
import Table from './Table';
import TableRow from './TableRow';
import TableCell from './TableCell';
import Yaml from './Yaml';
import List from './List';
import ListItem from './ListItem';
import HorizontalRule from './HorizontalRule';

const ComponentsMap = new Map([
    [NodeType.Header, Header],
    [NodeType.Str, Str],
    [NodeType.Strong, Strong],
    [NodeType.Emphasis, Emphasis],
    [NodeType.Delete, Delete],
    [NodeType.Paragraph, Paragraph],
    [NodeType.CodeBlock, CodeBlock],
    [NodeType.BlockQuote, BlockQuote],
    [NodeType.Link, Link],
    [NodeType.Image, Image],
    [NodeType.Html, Html],
    [NodeType.Table, Table],
    [NodeType.TableRow, TableRow],
    [NodeType.TableCell, TableCell],
    [NodeType.Yaml, Yaml],
    [NodeType.List, List],
    [NodeType.ListItem, ListItem],
    [NodeType.HorizontalRule, HorizontalRule],
]);

const Render: React.FC<Partial<IBaseProps>> = (props) => {
    const { node } = props;

    if (!node) {
        return <Loading texts="文章加载中..."/>;
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
