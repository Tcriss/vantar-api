import { Pagination } from "src/common/types"
import { SearchTerms } from "./search-terms.type"

export type ProductQueries = {
    page?: Pagination,
    q?: SearchTerms,
    selected?: string
}