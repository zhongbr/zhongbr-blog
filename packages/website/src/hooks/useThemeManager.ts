import { useEffect } from "react";
import usePersistFn from "./usePersistFn";

const onChangeTo = (theme: 'dark' | 'light', cb: () => void) => {
    const media = window.matchMedia(`(prefers-color-scheme: ${theme})`);
    const fn = (e: MediaQueryListEvent) => {
        if (e.matches) {
            cb();
        }
    };
    if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', fn);
    }
    else if (typeof media.addListener !== 'function') {
        media.addListener(fn);
    }
    return () => {
        if (typeof media.removeEventListener === 'function') {
            media.removeEventListener('change', fn);
        }
        else if (typeof media.removeListener !== 'function') {
            media.removeListener(fn);
        }
    };
};

export interface IOptions {
    onThemeChange?: (theme: string) => void;
}

export default function useThemeManager(opt: IOptions) {
    const { onThemeChange: onThemeChange_ = () => {} } = opt;
    const onThemeChange = usePersistFn(onThemeChange_);

    // 监听模式变化
    useEffect(() => {
        const lightDispose = onChangeTo('light', () => onThemeChange?.('light-theme'));
        const darkDispose = onChangeTo('dark',() => onThemeChange?.('dark-theme'));

        return () => {
            lightDispose();
            darkDispose();
        };
    }, [onThemeChange]);

    // 初始化主题
    useEffect(() => {
        // 检查是否是暗色模式
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        if (media.matches) {
            onThemeChange?.('dark-theme');
            return;
        }
        onThemeChange?.('light-theme');
    }, [onThemeChange]);
}
