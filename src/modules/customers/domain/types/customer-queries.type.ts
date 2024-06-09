import { Pagination } from "."

export type CustomerQuery = {
    page: string,
    fields?: string,
    q?: string
}