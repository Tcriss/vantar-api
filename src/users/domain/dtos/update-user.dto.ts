import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsStrongPassword, Matches, MaxLength, MinLength } from "class-validator";

import { nameRegex, pwRegex } from "../../../security/application/constants";

export class UpdateUserDto {
    @ApiProperty({ example: 'Haroldy Martinez', description: 'User name' })
    @IsString()
    @Matches(nameRegex, '', { message: 'name must not contain numbers' })
    @MaxLength(30)
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'Actual user password' })
    @IsStrongPassword()
    @Matches(pwRegex, '', { message: 'Invalid password' })
    @MinLength(6)
    @MaxLength(130)
    @IsOptional()
    password?: string;

    @ApiProperty({ description: 'New user password' })
    @IsStrongPassword()
    @Matches(pwRegex, '', { message: 'Invalid password' })
    @MinLength(6)
    @MaxLength(130)
    @IsOptional()
    newPassword?: string
}