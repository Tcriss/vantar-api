import { ApiResponseOptions } from "@nestjs/swagger";
import { UserEntity } from "../../domain/entities/user.entity";
import { Error } from '../../../../types/error.type';

export const success: ApiResponseOptions = {
    status: 200, 
    description: 'Succesfull',
    type: UserEntity
};
export const success_array: ApiResponseOptions = {
    status: 200, 
    description: 'Succesfull',
    type: UserEntity,
    isArray: true,
};
export const uploaded: ApiResponseOptions = {
    status: 201, 
    description: 'Uploaded to the server succesfully',
    type: UserEntity
};
export const bad_req: ApiResponseOptions = {
    status: 400, 
    description: 'Bad request',
    type: Error
};
export const unauthorized: ApiResponseOptions = {
    status: 401, 
    description: 'Unauthorized',
    type: Error
};
export const forbidden: ApiResponseOptions = {
    status: 403, 
    description: 'Forbidden',
    type: Error
};
export const not_found: ApiResponseOptions = {
    status: 404, 
    description: 'Not found',
    type: Error
};
export const server_error: ApiResponseOptions = {
    status: 500, 
    description: 'Internal Server Error',
    type: Error
};