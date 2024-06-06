import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateCustomerDto {

    @ApiProperty({ example: 'Manuel Soto' })
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({ example: ['Family Storage, Beauty Salon'], isArray: true })
    @IsArray()
    @IsOptional()
    companies: string[];

    @ApiProperty({ example: '809-788-1111/manuel@example.com' })
    @IsString()
    @IsOptional()
    contact: string;
}