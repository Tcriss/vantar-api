import { ApiProperty, PartialType } from "@nestjs/swagger";

import { IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ example: 'Haroldy Martinez', description: 'User name' })
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({ description: 'User Password' })
    @IsStrongPassword()
    @IsOptional()
    @MinLength(6)
    password: string;
}