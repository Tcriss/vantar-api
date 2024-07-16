import { DatabaseOptions } from "./database-options.interface";

export interface DatabaseModuleOptions extends DatabaseOptions {
    isGlobal?: boolean;
}