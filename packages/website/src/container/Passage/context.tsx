import { createContext, useContext } from 'react';
import { ICatalogue, IPassage } from "@/service/passage/catalogue";

export interface IContext {
    catalogue?: ICatalogue;
    curCatalogue?: IPassage;
}

export const Context = createContext<IContext>({});

export const usePassageContext = () => {
    return useContext(Context);
};
