import { parse } from 'papaparse';

export interface IResp {
    data: string[][];
}

export async function getNotionPageTableCsv(params: { url?: string; }): Promise<IResp> {
    if (!params.url) {
        return { data: [] };
    }
    const res = await fetch(`${params.url}?r=${Math.random()}`);

    // 处理 CSV
    const csv = await res.text();

    return parse(csv, { skipEmptyLines: true });
}
