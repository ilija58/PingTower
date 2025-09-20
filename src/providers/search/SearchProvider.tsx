import { type ReactNode, useState } from 'react'

import { SearchedContext } from './search.context'

export function SearchProvider({ children }: { children: ReactNode }) {
	const [search, setSearch] = useState('')

	return (
		<SearchedContext.Provider value={{ search, setSearch }}>
			{children}
		</SearchedContext.Provider>
	)
}
