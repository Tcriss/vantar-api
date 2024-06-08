import { CustomDecorator, SetMetadata } from "@nestjs/common";

import { PUBLIC_KEY } from "../constants/public-key.decorator";

export const PublicAccess = (): CustomDecorator<string> => SetMetadata(PUBLIC_KEY, true);