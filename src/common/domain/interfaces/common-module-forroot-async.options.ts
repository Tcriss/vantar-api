import { CommonModuleAsyncOptions } from "./common-module-async-options.interface";

export interface CommonModuleOptionsForRoot extends CommonModuleAsyncOptions {
    isGlobal?: boolean;
};