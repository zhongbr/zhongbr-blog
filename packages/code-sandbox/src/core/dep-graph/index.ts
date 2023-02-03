import {IDepNode, TraverseCallback} from './type';

export default class DepsGraph {
    private DepNodeIndexes: Map<IDepNode['path'], IDepNode> = new Map();

    public getDepNode (_target: IDepNode['path'], create = false) {
        const target = _target.replace(/\/$/, '');
        if (!this.DepNodeIndexes.has(target) && create) {
            this.DepNodeIndexes.set(target, {
                path: target,
                come: new Set(),
                out: new Set()
            });
        }
        return this.DepNodeIndexes.get(target);
    };

    /**
     * 更新 from -> to 的路径
     * @param from 起点 node 数组
     * @param to 终点 node
     */
    public updatePaths (from: IDepNode['path'][], to: IDepNode['path']) {
        const targetNode = this.getDepNode(to, true);
        // 删除原来所有入方向路径，然后重新生成
        if (targetNode.come.size) {
            targetNode.come.forEach(depNode => {
                depNode.out.delete(targetNode);
            });
            targetNode.come.clear();
        }
        from.forEach(nodePath => {
            const depNode = this.getDepNode(nodePath, true);
            targetNode.come.add(depNode);
            depNode.out.add(targetNode);
        });
    };

    /**
     * 删除 from -> to 的路径
     * @param from 起点 node 数组
     * @param to 终点 node
     */
    public deletePaths(from: IDepNode['path'][], to: IDepNode['path']) {
        const targetNode = this.getDepNode(to);
        if (!targetNode) return false;
        from.forEach(sourcePath => {
            const sourceNode = this.getDepNode(sourcePath);
            if (!sourceNode) return;
            sourceNode.out.delete(targetNode);
            targetNode.come.delete(sourceNode);
            // 如果删除了这条路径依赖，sourceNode 再没有被 node 依赖，删除 sourceNode
            this.deleteNode(sourceNode.path);
        });
    };

    /**
     * 删除指定的依赖节点
     * @param source
     */
    public deleteNode(source: IDepNode['path']) {
        const sourceNode = this.getDepNode(source);
        // 如果节点不存在直接返回 false
        if (!sourceNode) return false;

        // 从索引 Map 删除 source
        this.DepNodeIndexes.delete(source);

        // 清理 source 依赖的其他 node
        if (sourceNode.come.size) {
            sourceNode.come.forEach(comeNode => {
                comeNode.out.delete(sourceNode);
                // 如果除了 source，没有其他依赖 node 的节点后，递归删除 node
                if (!comeNode.out.size) {
                    this.deleteNode(comeNode.path);
                }
            });
        }

        return true;
    };

    /**
     * 遍历所有直接或者间接依赖 source 的节点
     * @param source 要遍历的节点
     * @param cb 对每个节点的处理
     * @param tracked 用于存储遍历过的节点
     * @param wait 用于存储需要遍历的节点
     * @param order 是否按照顺序开始遍历
     */
    public traverse(
        source: IDepNode['path'],
        cb?: TraverseCallback,
        tracked= new Set<IDepNode['path']>(),
        wait = new Set<IDepNode['path']>(),
        order = true
    ) {
        /**
         * 判断一个节点所有的 come 节点是否都被遍历
         * @param node 要判断的节点
         */
        const isAllDepsTracked = (node: IDepNode) => Array.from(node.come).every(dep => !wait.has(dep.path) || tracked.has(dep.path));
        const traverse = (node: IDepNode, order = false, cb_: typeof cb) => {
            if (!order) {
                wait.add(node.path);
            }
            else {
                // 如果节点还有依赖没有被遍历，就不遍历本节点
                if (!isAllDepsTracked(node)) return;
                tracked.add(node.path);
                cb_?.(node, tracked.size, wait.size);
            }
            node.out.forEach(child => {
                if (!order|| isAllDepsTracked(child)) {
                    traverse(child, order, cb_);
                }
            });
        };
        const sourceNode = this.getDepNode(source);
        if (!sourceNode) return;
        traverse(sourceNode, false, cb);
        if (order) {
            traverse(sourceNode, true, cb);
        }
    };

    /**
     * 批量遍历直接或者间接 sources 节点的所有节点
     * @param sources 被依赖的节点数组
     * @param cb 对每个节点的处理
     */
    public batchTraverse(sources: IDepNode['path'][], cb?: TraverseCallback) {
        const tracked = new Set<IDepNode['path']>();
        const wait = new Set<IDepNode['path']>();

        // 先确定所有需要遍历的节点
        sources.forEach(source => {
            this.traverse(source, cb, tracked, wait, false);
        });

        // 按照顺序遍历
        sources.forEach(source => {
            this.traverse(source, cb, tracked, wait, true);
        });

        return Array.from(tracked);
    }
}
