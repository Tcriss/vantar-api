import { ModuleMetadata } from "@nestjs/common";

import { DatabaseOptions } from "./database-options.interface";

export interface DatabaseModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory: (...args: any[]) => DatabaseOptions;
    isGlobal?: boolean;
    inject?: any[];
};