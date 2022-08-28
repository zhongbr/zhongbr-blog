/*
 * @Description: passages catalogues
 * @Author: 张盼宏
 * @Date: 2022-08-28 14:38:38
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-28 15:06:59
 */
import React, {useMemo} from "react";

import { ICatalogue } from "@/service/passage/catalogue";

export interface Props {
    /** trigger when entry passage */
    onEnterPassage: () => void;
    /** catalogues */
    catalogue: ICatalogue;
}

const Catalogue: React.FC<Props> = (props) => {
    const { onEnterPassage, catalogue } = props;

    const passages = useMemo(() => Object.values(catalogue), [catalogue])

    return (
        <div>
            {passages.map(passage => (
                <div></div>
            ))}
        </div>
    );
};
