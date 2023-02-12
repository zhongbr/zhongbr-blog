import { dirname, isAbsolute, join } from "path-browserify";

export function staticResourceUrl(relativeUrl?: string) {
    if (!relativeUrl || isAbsolute(relativeUrl) || /^(https?:)\/\//.test(relativeUrl)) return relativeUrl;
    const path = decodeURIComponent(window.location.hash);
    return join(dirname(path.replace(/^#\/passage/, '/md')), relativeUrl);
}
