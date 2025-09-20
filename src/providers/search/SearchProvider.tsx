import { type ReactNode, useState } from 'react'

import { SearchedContext } from './search.context'

export function SearchProvider({ children }: { children: ReactNode }) {
	const [search, setSearch] = useState('')

	const setFilter = (value: string) => {
		setSearch(value)
	}

	return (
		<SearchedContext.Provider value={{ search, setFilter }}>
			{children}
		</SearchedContext.Provider>
	)
}
