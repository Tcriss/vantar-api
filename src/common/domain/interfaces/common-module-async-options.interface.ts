import { InjectionToken, ModuleMetadata, OptionalFactoryDependency } from "@nestjs/common";

import { CommonModuleOptions } from "./common-options.interface";

export interface CommonModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: unknown[]) => CommonModuleOptions;
    Inject?: (InjectionToken | OptionalFactoryDependency)[];
}