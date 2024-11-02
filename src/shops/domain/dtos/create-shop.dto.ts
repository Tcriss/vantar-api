import { IsNotEmpty, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { nameRegex } from "../../../common/constants";

export class CreateShopDto {
    @ApiProperty({ example: 'Vantar' })
    @IsString()
    @IsNotEmpty()
    @Matches(nameRegex, '', { message: 'name must not contain numbers' })
    name: string;
}
