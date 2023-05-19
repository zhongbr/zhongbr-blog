import { ICatalogue, IPassage } from '@/data/posts';

export async function dividePostsByTag(catalogue: ICatalogue) {
    const results = new Map<string, IPassage[]>();

    Object.entries(catalogue).forEach(([filename, passage]) => {
        passage.tags.forEach(tag => {
            const posts = results.get(tag) || [];
            posts.push(passage);
            results.set(tag, posts);
        });
    });

    return results;
}
