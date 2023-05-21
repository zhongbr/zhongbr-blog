export enum NodeType {
    Document = 'Document',
    Header = 'Header',
    Paragraph = 'Paragraph',
    CodeBlock = 'CodeBlock',
    Code = 'Code',
    BlockQuote = 'BlockQuote',
    Table = 'Table',
    TableRow = 'TableRow',
    TableCell = 'TableCell',
    Html = 'Html',
    Image = 'Image',
    Link = 'Link',
    Yaml = 'Yaml',
    Str = 'Str',
    Strong = 'Strong',
    Emphasis = 'Emphasis',
    List = 'List',
    ListItem = 'ListItem',
    HorizontalRule = 'HorizontalRule',
    Delete = 'Delete',
    InlineMath = 'InlineMath',
    Math = 'Math'
}

export enum Align {
    Left = 'left',
    Right = 'right',
    Center = 'center'
}

export interface IPostion {
    line: number;
    column: number;
}

export type IRange = [number, number];

export interface ILocation {
    start: IPostion;
    end: IPostion;
}

export interface ISource {
    name: string;
    path: string;
    cdn: string;
}

export interface Node {
    key?: string;
    type: NodeType;
    children: Node[];
    loc: ILocation,
    range: IRange,
    raw: string;
    value: string;
    depth?: number;
    lang?: string;
    align?: Align[];
    ordered?: boolean;
    spread?: boolean;
    checked?: unknown;
    start?: number;
    title?: string;
    url?: string;
    alt?: string;
    _js?: string;
    imports?: string[];
    _sources?: ISource[];
    visible?: boolean;
}

export interface IAstNode extends Omit<Node, 'children'> {
    children: string[];
    parent?: string;
    nextSibling?: string;
    previousSibling?: string;
};

export interface IAst {
    [key: string]: IAstNode;
}

export interface IBaseProps {
    ast?: IAst;
    node: Node;
    children?: React.ReactNode;
}
