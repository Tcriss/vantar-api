import { Inject } from "@nestjs/common";

import { InvoiceRepositoryToken } from "../../domain/interfaces";

export const Repository = () => Inject(InvoiceRepositoryToken);