import React from "react";
import { useAsyncEffect, useAsyncFn } from '@zhongbr/react-hooks';

import { Splash, PassageCardGroup, Icon } from "@/components";
import { Node } from "@/types/markdown";
import { getNotionPageTableCsv } from '@/service/passage';

import { staticResourceUrl } from "../../../utils/static-resource-url";
import PassageLink from './PassageLink';

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

    if (!res?.data) {
        return null;
    }

    return (
        <PassageCardGroup
            id={node.key}
            maxWidth={1000}
            rowCountOffset={-1}
            containerPadding={40}
            outerPadding={20}
            headContent={
                <div style={{ textAlign: 'center' }}>
                    <Icon className="rp-wenjiandaochu" />
                    <span style={{ marginLeft: '8px' }}>相关文章</span>
                </div>}
        >
            {res.data.slice(1)?.map((value, index) => (
                <PassageLink
                    key={index}
                    keyword={value[0]}
                    extraInfos={value.slice(1)}
                    extraHeaders={res.data[0].slice(1)}
                />
            ))}
        </PassageCardGroup>
    );
};
PagesTable.displayName = 'PagesTable';
export default PagesTable;
