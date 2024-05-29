import { ApiProperty } from "@nestjs/swagger";
import { Category } from "@prisma/client";
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDTO implements Partial<Category> {
    @ApiProperty({example: 'Limpieza', description: 'Nombre de la categoria'})
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty({example: 'Producto de limpieza', description: 'Descripión de la categoria'})
    @IsString()
    @IsNotEmpty()
    description: string;
}