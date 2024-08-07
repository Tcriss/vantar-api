import { Inject } from "@nestjs/common";

import { DatabaseModuleOptionsKey } from "../constans/database=module-options.key";

export const Options = () => Inject(DatabaseModuleOptionsKey);