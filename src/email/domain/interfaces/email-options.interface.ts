import { ModuleMetadata } from '@nestjs/common';

import { EmailModuleOptions } from './email-module-options.interface';

export interface EmailModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<EmailModuleOptions> | EmailModuleOptions;
  isGlobal?: boolean;
  inject?: any[];
};