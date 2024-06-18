import { Role } from "@prisma/client"

export type Payload = {
    id: string,
    name: string,
    email: string,
    role: Role
}