export enum NodeType {
    Document = 'Document',
    Header = 'Header',
    Paragraph = 'Paragraph',
    CodeBlock = 'CodeBlock',
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
    Delete = 'Delete'
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
    parent?: Node;
    nextSibling?: Node;
    previousSibling?: Node;
}

export interface IBaseProps {
    node: Node;
    children?: React.ReactNode;
}
