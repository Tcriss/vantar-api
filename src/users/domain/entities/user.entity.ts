import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Exclude } from "class-transformer";

import { Roles } from '../../../common/domain/enums'

export class UserEntity implements User {
    @ApiProperty({ format: 'uuid', uniqueItems: true })
    id: string;

    @ApiProperty({ default: 'Robert Ramos'})
    name: string;

    @ApiProperty({ example: 'exmaple@email.com', uniqueItems: true })
    email: string;

    @ApiProperty({ enum: Roles })
    role: string;

    @ApiProperty({ example: true })
    active: boolean;

    @ApiProperty({ format: 'date' })
    created_at: Date;

    @Exclude()
    password: string;

    @Exclude({ toPlainOnly: true })
    refresh_token: string | null;

    @Exclude({ toPlainOnly: true })
    activation_token: string | null;

    @Exclude({ toPlainOnly: true })
    reset_token: string | null;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}