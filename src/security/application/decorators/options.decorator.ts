import { Inject } from "@nestjs/common";

import { SECURITY_OPTIONS_KEY } from "../constants";

export const SecurityOptions = () => Inject(SECURITY_OPTIONS_KEY);