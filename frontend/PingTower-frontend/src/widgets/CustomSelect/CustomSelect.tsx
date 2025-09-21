import { useEffect, useRef, useState } from 'react'

import styles from './CustomSelect.module.scss'

interface CustomSelectProps {
	options: string[]
	value: string
	onChange: (value: string) => void
}

export function CustomSelect({ options, value, onChange }: CustomSelectProps) {
	const [isOpen, setIsOpen] = useState(false)
	const selectRef = useRef<HTMLDivElement>(null)

	const handleOptionClick = (option: string) => {
		onChange(option)
		setIsOpen(false)
	}

	// Hook to close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div className={styles.selectWrapper} ref={selectRef}>
			<button
				type="button"
				className={styles.selectDisplay}
				onClick={() => setIsOpen(!isOpen)}
			>
				{value}
				<span className={`${styles.arrow} ${isOpen ? styles.up : ''}`}></span>
			</button>

			{isOpen && (
				<div className={styles.optionsContainer}>
					<ul>
						{options.map(option => (
							<li
								key={option}
								onClick={() => handleOptionClick(option)}
								className={value === option ? styles.selected : ''}
							>
								{option}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
