import React from "react";
import clsx from "clsx";

import { Splash } from "@/components";
import { useAsyncEffect, useAsyncFn } from '@/hooks';
import { Node } from "@/types/markdown";
import { getNotionPageTableCsv } from '@/service/passage';

import { staticResourceUrl } from "../../../utils/static-resource-url";
import PassageLink from './PassageLink';
import styles from './style.module.less';

export interface IProps {
    node: Node;
}

const PagesTable: React.FC<IProps> = props => {
    const { node } = props;
    const [fetch, res, loading] = useAsyncFn(getNotionPageTableCsv);

    useAsyncEffect(async () => {
        await fetch({ url: staticResourceUrl(node.url) });
    }, [node.url]);

    if (loading) {
        return <Splash texts="🚀🚀子模块加载中" full={false}/>;
    }

    return (
        <table
            id={node.key}
            className={styles.passageTable}
        >
            <thead>
                {res?.data?.[0]?.map((value, index) => (
                    <td className={clsx(styles.tableCell, styles.header)} key={index}>{value}</td>
                ))}
            </thead>
            {res?.data?.slice(1)?.map((value, index) => (
                <tr key={index}>
                    {value.map((value, index) => (
                        <td className={styles.tableCell}>
                            {index === 0 ? (
                                <PassageLink key={index} keyword={value}/>
                            ) : (
                                value
                            )}
                        </td>
                    ))}
                </tr>
            ))}
        </table>
    );
};
PagesTable.displayName = 'PagesTable';
export default PagesTable;
