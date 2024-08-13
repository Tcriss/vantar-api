import { SecurityModuleAsyncOptions } from "./security-module-async-options.interface";

export interface SecurityModuleOptionsForRoot extends SecurityModuleAsyncOptions {
    isGlobal?: boolean;
};