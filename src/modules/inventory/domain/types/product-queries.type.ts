import { Pagination } from "../../../../common/types"

export type ProductQueries = {
    page?: Pagination,
    q?: string,
    fields?: string
}