import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject } from "@nestjs/common";

export const Cached = () => Inject(CACHE_MANAGER);