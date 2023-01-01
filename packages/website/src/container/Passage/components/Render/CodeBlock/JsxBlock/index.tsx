/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-09-04 18:50:35
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-07 22:38:10
 */
import React, { useMemo, memo, Suspense } from "react";
import { ISource } from "@/types/markdown";

export interface IProps {
    imports?: string[];
    sources?: ISource[];
    jsCode?: string;
}

const JsxBlock: React.FC<IProps> = props => {
    const { jsCode, sources = [] } = props;

    const loadScript = (src?: string, name?: string) => {
        return new Promise((resolve, reject) => {
            console.log('load script', src, name);
            if (!src || !name) {
                reject();
                return;
            }
            // @ts-ignore
            if (window[name]) {
                // @ts-ignore
                resolve(window[name]);
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                // @ts-ignore
                if (window[name]) {
                    // @ts-ignore
                    resolve(window[name]);
                }
                else {
                    reject();
                }
            }
            script.onerror = (err) => {
                reject(err);
            }
            document.body.appendChild(script);
        });
    };

    const Comp = useMemo(() => {// eslint-disable-next-line no-eval
        const func = eval(jsCode || 'null');
        return React.lazy(() => {
            return Promise
                .all(sources.map(source => loadScript(source.cdn, source.name)))
                .then(() => {
                    const comp = func.bind(window)();
                    return { default: comp };
                })
        });
    }, [jsCode, sources]);

    return (
        <div style={{ height: '200px' }}>
            <Suspense fallback={"依赖加载中"}>
                <Comp/>
            </Suspense>
        </div>
    )
};

export default memo(JsxBlock);
