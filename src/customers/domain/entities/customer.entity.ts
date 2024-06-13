import { ApiProperty } from "@nestjs/swagger";
import { Customer } from "@prisma/client";

export class CustomerEntity implements Customer {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ format: 'uuid' })
    user_id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    contact: string;

    @ApiProperty({ isArray: true })
    companies: string[];

    @ApiProperty()
    active: boolean;

    @ApiProperty()
    created_at: Date;
}