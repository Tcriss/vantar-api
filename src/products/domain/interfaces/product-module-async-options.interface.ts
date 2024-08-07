import { ModuleMetadata } from "@nestjs/common";

export interface ProductModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
}