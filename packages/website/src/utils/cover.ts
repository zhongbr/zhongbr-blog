export enum ImageSize {
    Origin,
    Middle,
    Small,
}

export function imgLevel(link: string, size: ImageSize) {
    console.log('lll', link, size);
    const replaceSuffix = (mark: 'md' | 'th') => link.replace(/\.([^.]*?)$/, `.${mark}.$1`);

    switch (size) {
        case ImageSize.Origin:
            return link;
        case ImageSize.Middle:
            return replaceSuffix('md');
        case ImageSize.Small:
            return replaceSuffix('th');
    }
}
