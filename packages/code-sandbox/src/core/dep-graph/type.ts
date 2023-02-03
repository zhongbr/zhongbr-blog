export interface IDepNode {
    path: string;
    come: Set<IDepNode>;
    out: Set<IDepNode>;
}

export type TraverseCallback = (
    path: IDepNode,
    index: number,
    all: number
) => void;
