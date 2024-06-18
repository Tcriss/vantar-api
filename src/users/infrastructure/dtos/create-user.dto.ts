import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";

import { Role } from "../../application/enums/role.enum";

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

    @ApiProperty({ enum: Role, example: Role.CUSTOMER, description: 'User role' })
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role
}