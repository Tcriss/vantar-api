import { SearchTerms } from "./search-terms.type"

export type ProductQueries = {
    page?: string,
    q?: SearchTerms,
    selected?: string
}