import { ApiProperty } from "@nestjs/swagger";
import { Category } from "@prisma/client";
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDTO implements Partial<Category> {
    @ApiProperty({example: 'Limpieza', description: 'Category name'})
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty({example: 'Producto de limpieza', description: 'Category description'})
    @IsString()
    @IsNotEmpty()
    description: string;
}