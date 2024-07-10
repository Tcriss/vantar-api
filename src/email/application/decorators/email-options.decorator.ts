import { Inject } from "@nestjs/common";

import { EMAIL_OPTIONS_KEY } from "../constants/email-options.key";

export const EmailOptions = () => Inject(EMAIL_OPTIONS_KEY);