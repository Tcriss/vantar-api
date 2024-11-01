import { ApiProperty } from "@nestjs/swagger";
import { Shop } from "@prisma/client";

export class ShopEntity implements Shop {
    @ApiProperty({ format: 'date' })
    created_at: Date;

    @ApiProperty({ format: 'uuid'})
    id: string;

    @ApiProperty({ example: 'Vantar' })
    name: string;

    @ApiProperty({ example: 'uuid' })
    user_id: string;
}
