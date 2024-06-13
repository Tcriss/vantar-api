import { CustomDecorator, SetMetadata } from "@nestjs/common";

import { PUBLIC_KEY } from "../../domain/constants";

export const PublicAccess = (): CustomDecorator<string> => SetMetadata(PUBLIC_KEY, true);