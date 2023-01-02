import useEventListener from './useEventListener';
import useDebounce from "./useDebounce";

export enum ResponsiveEnum {
    /** 极窄：屏幕宽度小于 800px */
    tiny = 1,
    /** 适中：屏幕宽度处于 800px - 1400px */
    mid = 2,
    /** 正常：屏幕宽度处于 1400px - 2000px */
    normal = 3,
    /** 很大：屏幕宽度大于 2000px */
    large = 4
}

/**
 * 响应式布局监听
 * @param onLevelChange
 */
export default function useResponsive(onLevelChange: (level: ResponsiveEnum, width: number) => void) {
    useEventListener('resize', useDebounce(() => {
        const width = window.innerWidth;
        let level = ResponsiveEnum.large;
        if (width <= 800) {
            level = ResponsiveEnum.tiny;
        }
        else if (width <= 1400) {
            level = ResponsiveEnum.mid;
        }
        else if (width <= 2000) {
            level = ResponsiveEnum.normal;
        }
        onLevelChange(level, width);
    }));
}
