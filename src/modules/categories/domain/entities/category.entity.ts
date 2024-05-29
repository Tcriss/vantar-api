import { ApiProperty } from "@nestjs/swagger";
import { Product, Category } from "@prisma/client";

export class CategoryEntity implements Category {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ required: false })
    products: Product[]
}