import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";

export class UserEntity implements User {
    @ApiProperty({ format: 'uuid', uniqueItems: true })
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ format: 'email', uniqueItems: true })
    email: string;

    password: string;
}