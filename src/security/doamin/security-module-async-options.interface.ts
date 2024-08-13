import { InjectionToken, ModuleMetadata, OptionalFactoryDependency } from "@nestjs/common";

import { SecurityModuleOptions } from "./security-options.interface";

export interface SecurityModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: unknown[]) => SecurityModuleOptions;
    Inject?: (InjectionToken | OptionalFactoryDependency)[];
}