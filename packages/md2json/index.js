import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkFootnotes from 'remark-footnotes';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkFrontmatter from "remark-frontmatter";
import traverse from 'traverse';
import { SyntaxMap, ASTNodeTypes } from './sytax-map.js';

const debug = console.log;

const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkGfm)
    .use(remarkFootnotes)
    .use(remarkMath);

export { ASTNodeTypes };

/**
 * 解析 markdown 为 语法树
 * @param markdown
 */
export function parse(markdown) {
    const ast = processor.parse(markdown);
    traverse(ast).forEach(function (node) {
        // eslint-disable-next-line no-invalid-this
        if (this.notLeaf) {
            if (node.type) {
                const replacedType = SyntaxMap[node.type];
                if (!replacedType) {
                    debug(`replacedType : ${replacedType} , node.type: ${node.type}`);
                } else {
                    node.type = replacedType;
                }
            }
            // map `range`, `loc` and `raw` to node
            if (node.position) {
                const position = node.position;
                // line start with 1
                // column start with 0
                const positionCompensated = {
                    start: { line: position.start.line, column: Math.max(position.start.column - 1, 0) },
                    end: { line: position.end.line, column: Math.max(position.end.column - 1, 0) }
                };
                const range = [position.start.offset, position.end.offset];
                node.loc = positionCompensated;
                node.range = range;
                node.raw = markdown.slice(range[0], range[1]);
                // Compatible for https://github.com/syntax-tree/unist, but it is hidden
                Object.defineProperty(node, "position", {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: position
                });
            }
        }
    });
    return ast;
}
