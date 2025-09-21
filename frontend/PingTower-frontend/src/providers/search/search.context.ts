import { type Dispatch, type SetStateAction, createContext } from 'react'

export interface ISearchedContext {
	search: string
	setSearch: Dispatch<SetStateAction<string>>
}

export const SearchedContext = createContext<ISearchedContext>({
	search: '',
	setSearch: () => {}
})
