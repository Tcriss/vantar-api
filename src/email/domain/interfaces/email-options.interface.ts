import { ModuleMetadata, Type } from '@nestjs/common';

import { EmailModuleOptionsFactory } from './emai-module-options-factory.interface';
import { EmailModuleOptions } from './email-module-options.interface';

export interface EmailModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<EmailModuleOptionsFactory>;
  useClass?: Type<EmailModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<EmailModuleOptions> | EmailModuleOptions;
  inject?: any[];
};