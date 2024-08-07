import { ApiProperty } from "@nestjs/swagger";

export class AuthEntity {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    refresh_token: string
}