import { Roles } from "../../../common/domain/enums"

export type Payload = {
    id: string,
    name: string,
    email: string,
    role: Roles
}