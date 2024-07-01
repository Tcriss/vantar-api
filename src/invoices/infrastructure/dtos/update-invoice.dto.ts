import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class UpdateInvoiceDto {
    @ApiProperty({ example: '2240.00' })
    @IsOptional()
    @IsNumber()
    total?: number;

    // @ApiProperty({ example: '2240.00', required: false })
    // @IsOptional()
    // products?: string[];
}