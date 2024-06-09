import { Pagination } from "."

export type CustomerQuery = {
    page: Pagination,
    fields?: string,
    q?: string
}