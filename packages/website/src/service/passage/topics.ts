import axios from 'axios';

import { IIconProps } from "@/components";
import { IPassage } from './catalogue';

export interface ITopic {
    id: string;
    icon: IIconProps['className'];
    topicName: string;
    desc: string;
    tags: string[];
    color?: string;
    passages?: Array<IPassage>;
}

export default async function getTopics() {
    return await axios.get<{ topics: Array<ITopic>; }>(`/md/topic.json?r=${Math.random()}`);
}
