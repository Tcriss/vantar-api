import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty()
    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
}