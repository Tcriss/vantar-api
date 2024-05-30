import { ApiProperty } from "@nestjs/swagger";
import { Product, Category } from "@prisma/client";
import { UUID } from "crypto";

export class CategoryEntity implements Category {
    @ApiProperty({ uniqueItems: true })
    id: UUID;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ required: false, nullable: true })
    products?: Product[]
}