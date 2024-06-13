import { User } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreateUserDto implements Partial<User> {
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
}