import { EmailModuleOptions } from "./email-module-options.interface";

export interface EmailModuleOptionsFactory {
    createEmailModuleOptions(): Promise<EmailModuleOptions> | EmailModuleOptions;
}