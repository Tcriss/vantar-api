import { ApiProperty } from "@nestjs/swagger";
import { Product, Category } from "@prisma/client";

export class CategoryEntity implements Category {
    @ApiProperty({ format: 'uuid', uniqueItems: true })
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ required: false, nullable: true })
    products?: Product[]
}