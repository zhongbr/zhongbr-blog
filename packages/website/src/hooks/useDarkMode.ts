import { useEffect, useState } from "react";
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

export default function useDarkMode() {
    const [theme, setTheme_] = useState('light-theme');

    const setTheme = usePersistFn((theme) => {
        setTheme_(theme);
        document.body.classList.forEach((className) => {
            if (className.endsWith('-theme')) {
                document.body.classList.remove(className);
            }
        });
        document.body.classList.add(theme);
    });

    // 监听模式变化
    useEffect(() => {
        const lightDispose = onChangeTo('light', () => setTheme('light-theme'));
        const darkDispose = onChangeTo('dark',() => setTheme('dark-theme'));

        return () => {
            lightDispose();
            darkDispose();
        };
    }, [setTheme]);

    // 初始化主题
    useEffect(() => {
        // 检查是否是暗色模式
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        if (media.matches) {
            setTheme('dark-theme');
            return;
        }
        setTheme('light-theme');
    }, [setTheme])

    return { setTheme, theme };
}
