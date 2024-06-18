import { Payload } from "./payload.type";

export type ReqUser = {
    user: Payload,
    headers: {
        Authorization: string
    }
};