import React, { useMemo } from "react";
import { dirname } from 'path-browserify';

import { useNavigate } from '@/hooks';
import { useMessage, Icon } from '@/components';
import { usePassageContext } from '../../../context';

export interface IProps {
    keyword: string;
}

const PassageLink: React.FC<IProps> = props => {
    const { keyword: keyword_ } = props;
    const { catalogue = {}, curCatalogue } = usePassageContext();
    const navigator = useNavigate();
    const message = useMessage();

    // 找到包含当前关键词，并且和当前文章在同一个子目录的文章
    const passage = useMemo(() => {
        // 处理 keyword 内的斜杠
        const keyword = keyword_.replace('/', ' ');
        const entry = Object.entries(catalogue).find(([name, metas]) => {
            if (!name.includes(keyword)) {
                return false;
            }
            if (!metas?.['json-path'] || !curCatalogue?.['json-path']) {
                return false;
            }
            return dirname(metas['json-path']).includes(dirname(curCatalogue['json-path']));
        });
        return entry?.[1];
    }, [catalogue, curCatalogue, keyword_]);

    const onOpenPassage = () => {
        if (!passage) {
            message.fail({
                title: '打开失败',
                content: '未找到对应的文章'
            });
            return;
        }
        navigator(`/passage/${encodeURIComponent(passage['json-path'])}`)
    };

    return (
        <span style={{ cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }} onClick={onOpenPassage}>
            <Icon className="rp-dingdanbianji" />
            {passage?.title || keyword_}
        </span>
    );
};
export default PassageLink;
