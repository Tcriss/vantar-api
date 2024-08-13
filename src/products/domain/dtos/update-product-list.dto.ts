import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Matches } from "class-validator";

import { nameRegex } from "../../../security/application/constants";

export class UpdateProductListDto {
    @ApiProperty({ example: 'Cloro' })
    @IsOptional()
    @Matches(nameRegex, '', { message: 'name must not contain numbers' })
    @IsString()
    name?: string;

    @ApiProperty({ example: 80.00 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    unit_price?: number;

    @ApiProperty({ example: 3 })
    @IsOptional()
    @IsNumber()
    amount?: number;
}