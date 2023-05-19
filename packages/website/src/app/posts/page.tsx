import React from 'react';

import { getCatalogue } from '@/data/posts';
import { dividePostsByTag } from '@/app/posts/actions/dividePosts';

import { Tags } from './modules';

async function Page() {
    const catalogue = await getCatalogue();
    const tags = await dividePostsByTag(catalogue);

    return (
        <div>
            <Tags
                tagsMap={tags}
            />
        </div>
    );
}

export default Page;
