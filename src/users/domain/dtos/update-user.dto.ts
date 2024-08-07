import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsStrongPassword } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ example: 'Haroldy Martinez', description: 'User name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'Actual user password' })
    @IsStrongPassword()
    @IsOptional()
    password?: string;

    @ApiProperty({ description: 'New user password' })
    @IsStrongPassword()
    @IsOptional()
    newPassword?: string
}