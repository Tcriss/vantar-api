import { CustomDecorator, SetMetadata } from "@nestjs/common";

export const PUBLIC_KEY = 'public'
export const PublicAccess = (): CustomDecorator<string> => SetMetadata(PUBLIC_KEY, true);