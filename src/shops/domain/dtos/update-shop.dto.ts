import { IsOptional, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { nameRegex } from "../../../common/constants";

export class UpdateShopDto {
    @ApiProperty({ example: 'Vantar' })
    @IsString()
    @IsOptional()
    @Matches(nameRegex, '', { message: 'name must not contain numbers' })
    name?: string;
}
