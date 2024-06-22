import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";

import { Roles } from "../../../common/domain/enums";

export class CreateUserDto {
    @ApiProperty({ example: 'Haroldy Martinez', description: 'User name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'example@email.com', description: 'User email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'User Password' })
    @IsStrongPassword()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: Roles, example: Roles.CUSTOMER, description: 'User role' })
    @IsEnum(Roles)
    @IsNotEmpty()
    role: Roles
}