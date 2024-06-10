import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateCustomerDto {
    @ApiProperty({ example: 'Manuel Soto' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: [
        'Family Storage',
        'Beauty Salon'
    ], isArray: true })
    @IsArray()
    @IsNotEmpty()
    companies: string[];

    @ApiProperty({ example: '809-788-1111/manuel@example.com' })
    @IsString()
    @IsNotEmpty()
    contact: string;
}