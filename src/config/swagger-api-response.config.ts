import { ApiResponseOptions } from "@nestjs/swagger";

export const success: ApiResponseOptions = {
    status: 200, 
    description: 'Succesfull'
};
export const success_array: ApiResponseOptions = {
    status: 200, 
    description: 'Succesfull',
    isArray: true,
};
export const uploaded: ApiResponseOptions = {
    status: 201, 
    description: 'Uploaded to the server succesfully'
};
export const bad_req: ApiResponseOptions = {
    status: 400, 
    description: 'Bad request'
};
export const unauthorized: ApiResponseOptions = {
    status: 401, 
    description: 'Unauthorized'
};
export const forbidden: ApiResponseOptions = {
    status: 403, 
    description: 'Forbidden'
};
export const not_found: ApiResponseOptions = {
    status: 404, 
    description: 'Not found'
};
export const server_error: ApiResponseOptions = {
    status: 500, 
    description: 'Internal Server Error'
};