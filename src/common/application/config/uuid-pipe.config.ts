import { HttpException, HttpStatus, ParseUUIDPipeOptions } from "@nestjs/common";

export const uuidPipeOptions: ParseUUIDPipeOptions = {
    exceptionFactory(errors) {
        throw new HttpException('id must be in uuid format', HttpStatus.BAD_REQUEST)
    }
};