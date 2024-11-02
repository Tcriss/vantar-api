import { CommonModuleAsyncOptions } from "./security-module-async-options.interface";

export interface CommonModuleOptionsForRoot extends CommonModuleAsyncOptions {
    isGlobal?: boolean;
};