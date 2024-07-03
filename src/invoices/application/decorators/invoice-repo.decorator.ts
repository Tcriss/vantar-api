import { Inject } from "@nestjs/common";

import { InvoiceRepositoryToken } from "../../domain/interfaces";

export const InvoiceRepository = () => Inject(InvoiceRepositoryToken);