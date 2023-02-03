export const DemoServiceName = 'demo-service';


export interface IDemoService {
    run: (jsEntry: string, htmlEntry?: string, stylesEntry?: string) => Promise<boolean>;
    setPlugins: (pluginsId: string[]) => Promise<void>;
}
