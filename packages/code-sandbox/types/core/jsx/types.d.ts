export interface IService {
    transformJsxComponentCode: (code: string) => Promise<{
        code: string;
        deps: string[];
    }>;
}
export declare const ServiceName = "jsx-service";
