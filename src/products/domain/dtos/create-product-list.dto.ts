import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

import { nameRegex } from "@common/constants";

export class CreateProductListDto {
    @ApiProperty({ example: 'Cloro' })
    @IsNotEmpty()
    @Matches(nameRegex, '', { message: 'name must not contain numbers' })
    @IsString()
    name: string;

    @ApiProperty({ example: 80.00 })
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    unit_price: number;

    @ApiProperty({ example: 3 })
    @IsNotEmpty()
    @IsNumber()
    amount: number;
}