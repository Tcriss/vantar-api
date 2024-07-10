import { ModuleMetadata, Provider, Type } from '@nestjs/common';

import { EmailModuleOptionsFactory } from './emai-module-options-factory.interface';
import { EmailModuleOptions } from './email-module-options.interface';

export interface EmailModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<EmailModuleOptions> | EmailModuleOptions;
  isGlobal?: boolean;
  inject?: any[];
};