import { ApiProperty } from "@nestjs/swagger"

export class Error {
    @ApiProperty()
    statusCode: number;

    @ApiProperty()
    message: string;
}