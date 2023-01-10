import React from 'react';
import { IModule } from "@/utils/amd/types";
import { ISuspenseWrapper } from "@/hooks/useSuspense";

export interface IProps {
    _module?: ISuspenseWrapper<IModule>;
}

const Module: React.FC<IProps> = props => {
    const Comp = (props._module?.read())?.default;

    if (!Comp) {
        return null;
    }

    return <Comp/>;
};

Module.displayName = 'Module';
export default Module;
