export declare const DemoServiceName = "demo-service";
export interface IDemoService {
    defineModule: (name: string, deps: string[], factory: string) => Promise<boolean>;
    executeModule: (name: string) => Promise<boolean>;
    setStyle: (name: string) => Promise<boolean>;
    setPlugins: (pluginsId: string[]) => Promise<void>;
    setBodyHtml: (html: string) => Promise<void>;
}
