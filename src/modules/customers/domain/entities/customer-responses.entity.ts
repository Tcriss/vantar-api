import { ApiProperty } from "@nestjs/swagger";

import { CustomerResponse } from "../types";
import { CustomerEntity } from "./customer.entity";

export class CustomerResponseEntity implements CustomerResponse {
    @ApiProperty()
     message: string;

     @ApiProperty()
     data?: Partial<CustomerEntity>;
}