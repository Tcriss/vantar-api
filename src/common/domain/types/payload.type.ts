import { Role } from "../enums"

export type Payload = {
    id: string,
    name: string,
    email: string,
    role: Role
}