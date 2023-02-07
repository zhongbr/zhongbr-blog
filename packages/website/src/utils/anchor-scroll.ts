/**
 * 获取元素与容器顶端之间的距离
 * @param element
 * @param container
 * @returns 距离
 */
export function getOffsetTop(element: HTMLElement, container: HTMLElement) {
    const { width, height, top } = element.getBoundingClientRect();

    if (width || height) {
        return top + container.scrollTop;
    }

    return top;
}

/**
 * 平滑地滚动可滚动的容器到指定位置
 * @param y
 * @param conatiner
 * @returns 返回一个滚动动画的Promise
 */
export function smoothScrollTo(y: number, conatiner: HTMLElement, duration = 450) {

    const easeInOutCubic = (params: {time: number; startAxis: number; targetAxis: number; duration: number;}) => {
        const { time: time_, startAxis, targetAxis, duration } = params;
        let time = time_;
        const delta = targetAxis - startAxis;
        time /= duration / 2;
        if (time < 1) {
            return (delta / 2) * time * time * time + startAxis;
        }
        const res = (delta / 2) * ((time -= 2) * time * time + 2) + startAxis;
        return res;
    };

    return new Promise((resolve) => {
        const start = performance.now();
        const scrollTop = conatiner.scrollTop;

        const animationFrame: Parameters<typeof requestAnimationFrame>[0] = (timestamp) => {
            const time = timestamp - start;

            conatiner.scrollTop = easeInOutCubic({
                time: Math.min(time, duration),
                startAxis: scrollTop,
                targetAxis: y,
                duration
            });

            if (time < duration) {
                requestAnimationFrame(animationFrame);
            }
            else {
                resolve(undefined);
            }
        };

        requestAnimationFrame(animationFrame);
    });
}
