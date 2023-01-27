import * as process from "process";

const isProd = process.env.NODE_ENV === 'production';

const debugOnlyLevel: Array<keyof Console> = ['log', 'debug'];

const logger = debugOnlyLevel.reduce((pre, key) => {
    return Object.assign(pre, {
        [key]: (...args: unknown[]) => {
            if (!isProd) {
                return typeof console[key] === 'function' && (console[key] as Function)(...args);
            }
            return null;
        }
    });
}, {} as Pick<Console, 'log' | 'info' | 'debug' | 'error' | 'warn'>);
export default logger;