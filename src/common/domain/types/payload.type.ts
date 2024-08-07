import { Roles } from "../enums"

export type Payload = {
    id: string,
    name: string,
    email: string,
    role: Roles
}