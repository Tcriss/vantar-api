import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Exclude } from "class-transformer";
import { IsEnum } from "class-validator";

import { Role } from "../../application/enums/role.enum";

export class UserEntity implements User {
    @ApiProperty({ format: 'uuid', uniqueItems: true })
    id: string;

    @ApiProperty({ default: 'Robert Ramos'})
    name: string;

    @ApiProperty({ format: 'email', uniqueItems: true })
    email: string;

    @IsEnum(Role)
    role: Role;

    @ApiProperty({ format: 'date' })
    created_at: Date;

    @Exclude()
    password: string;

    @Exclude()
    refresh_token: string;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}