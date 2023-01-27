export interface IService {
    transformJsxComponentCode: (code: string) => Promise<{ code: string; deps: string[]; }>;
}

export const ServiceName = 'jsx-service';
