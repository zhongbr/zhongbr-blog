/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-08-29 23:24:09
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-29 23:53:08
 */
import { Node, NodeType } from '@/types/markdown';

const generateKey = (n: number) => String.fromCharCode(...n.toString().split('').map(i => Number('a'.charCodeAt(0) + Number(i))));
/**
 * Traverse markdown ast to set parent, nextSibling and previousSibling.
 * The unique key of each node will be set, too.
 * */
export function traverseAst(node: Node, parent?: Node, scope = '', index = 0) {
    node.key = `${scope ? scope + '-' : ''}${generateKey(index)}`;

    if (parent) {
        node.parent = parent;
    }

    if (!node?.children?.length) {
        return;
    }

    for (let i=0; i<node.children.length; i++) {
        if (node.children[i-1]) {
            node.children[i].previousSibling = node.children[i-1];
        }
        if (node.children[i+1]) {
            node.children[i].nextSibling = node.children[i+1];
        }
        traverseAst(node.children[i], node, node.key, i);
    }
}

export interface Title {
    text: string;
    depth: number;
    key: string;
}
/**
 * Parse the catalogue sketch of the passage
 * */
export function generateSketch(document: Node) {
    const res: Title[] = [];
    const traverse = (node: Node) => {
        if (node.type === NodeType.Header) {
            res.push({
                text: node.raw.replace(/#+\s*/g, ''),
                depth: node.depth || 0,
                key: node.key || '',
            });
        }
        if (node.children?.length) {
            node.children.forEach(traverse);
        }
    };
    traverse(document);
    return res;
}
