import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInvoiceDto {
    @ApiProperty({ format: 'uuid' })
    @IsNotEmpty()
    @IsString()
    user_id: string;

    @ApiProperty({ example: '2240.00' })
    @IsNotEmpty()
    @IsNumber()
    total: number;

    // @ApiProperty({ example: '2240.00', required: false })
    // @IsOptional()
    // products?: string[];
}