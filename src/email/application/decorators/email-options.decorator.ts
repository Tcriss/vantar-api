import { Inject } from "@nestjs/common";

import { EMAIL_OPTIONS_KEY } from "@email/application/constants";

export const EmailOptions = () => Inject(EMAIL_OPTIONS_KEY);