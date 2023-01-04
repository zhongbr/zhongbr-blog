import { useRef } from 'react';
import { PromiseRes } from '@/types/utils';

export interface ISuspenseWrapper<R> {
    read: () => R;
}

export function suspensePromise<R extends any>(promise: Promise<R>): ISuspenseWrapper<R> {
    let status: 'pending' | 'success' | 'error' = 'pending';
    let res: R;
    let error: Error;
    const suspender = promise.then(
        r => {
            status = 'success';
            res = r;
        },
        e => {
            status = 'error';
            error = e;
        }
    )
    return {
        read: () => {
            switch (status) {
                case 'success': return res;
                case 'pending': throw suspender;
                case 'error': throw error;
            }
        }
    };
}

/**
 * 将异步函数包装成可以在 Suspense 组件的函数
 * @param asyncFn 要包装的异步函数
 * @param args 请求的参数
 */
export function useSuspense<
    Fn extends (...args: any) => Promise<any>
> (asyncFn: Fn, ...args: Parameters<Fn>): ISuspenseWrapper<PromiseRes<ReturnType<Fn>>>{
    const ref = useRef<ISuspenseWrapper<PromiseRes<ReturnType<Fn>>>>();
    if (!ref.current) {
        ref.current = suspensePromise(asyncFn(...args));
    }
    return ref.current;
}
