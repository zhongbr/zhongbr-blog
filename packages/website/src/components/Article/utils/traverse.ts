import { IAst, Node, NodeType } from '@/types/markdown';
/**
 * Traverse markdown ast to set parent, nextSibling and previousSibling.
 * The unique key of each node will be set, too.
 * */
export function buildAst(node: Node) {
    const res: IAst = {};
    const traverse = (node: Node, parent?: string, index = 0) => {
        const key = node.key || '';
        const { children, ...others } = node;

        res[key] = {
            ...others,
            parent,
            previousSibling: res?.[parent || '-1']?.children?.[index-1],
            nextSibling: res?.[parent || '-1']?.children?.[index+1],
            children: node?.children?.map?.(child => child.key || '')
        };

        node?.children?.forEach?.((child, index) => traverse(child, key, index));
    };
    traverse(node);
    return res;
}

export function nodeParent(ast?: IAst, node?: { key?: string; }) {
    return ast?.[ast[node?.key || '']?.parent || ''];
};

export interface Title {
    text: string;
    depth: number;
    key: string;
}
/**
 * 构建一篇文章的目录
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
