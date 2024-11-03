import { Inject } from "@nestjs/common";

import { DatabaseModuleOptionsKey } from "@database/application/constans";

export const Options = () => Inject(DatabaseModuleOptionsKey);