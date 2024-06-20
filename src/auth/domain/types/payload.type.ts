import { Role } from "../../../users/application/enums"

export type Payload = {
    id: string,
    name: string,
    email: string,
    role: Role
}