'use client'

import { useState, useEffect, useRef } from 'react'

interface Tag {
    id: number
    name: string
    slug: string
}

interface TagInputProps {
    productId?: number
    value: number[] // Array de IDs de tags seleccionadas
    onChange: (tagIds: number[]) => void
}

export default function TagInput({ productId, value, onChange }: TagInputProps) {
    const [allTags, setAllTags] = useState<Tag[]>([])
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [inputValue, setInputValue] = useState('')
    const [suggestions, setSuggestions] = useState<Tag[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isLoadingTags, setIsLoadingTags] = useState(true)
    const inputRef = useRef<HTMLInputElement>(null)
    const suggestionsRef = useRef<HTMLDivElement>(null)

    // Cargar todas las etiquetas disponibles
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('/api/admin/tags')
                const data = await response.json()
                setAllTags(data.tags || [])
            } catch (error) {
                console.error('Error loading tags:', error)
            } finally {
                setIsLoadingTags(false)
            }
        }

        fetchTags()
    }, [])

    // Actualizar selectedTags cuando cambian los IDs o allTags
    useEffect(() => {
        if (allTags.length > 0 && value.length > 0) {
            const tags = allTags.filter(tag => value.includes(tag.id))
            setSelectedTags(tags)
        } else {
            setSelectedTags([])
        }
    }, [value, allTags])

    // Filtrar sugerencias basadas en el input
    useEffect(() => {
        if (inputValue.trim()) {
            const filtered = allTags.filter(tag =>
                tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
                !value.includes(tag.id)
            )
            setSuggestions(filtered)
        } else {
            setSuggestions([])
        }
    }, [inputValue, allTags, value])

    // Cerrar sugerencias al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        setShowSuggestions(true)
    }

    const handleInputFocus = () => {
        setShowSuggestions(true)
    }

    const handleSelectTag = async (tag: Tag) => {
        const newValue = [...value, tag.id]
        onChange(newValue)
        setInputValue('')
        setShowSuggestions(false)
        inputRef.current?.focus()
    }

    const handleCreateTag = async () => {
        if (!inputValue.trim()) return

        try {
            const response = await fetch('/api/admin/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: inputValue.trim() })
            })

            const data = await response.json()

            if (response.ok && data.tag) {
                // Actualizar lista de todas las etiquetas
                setAllTags(prev => [...prev, data.tag])
                
                // Seleccionar la nueva etiqueta
                const newValue = [...value, data.tag.id]
                onChange(newValue)
                
                setInputValue('')
                setShowSuggestions(false)
                inputRef.current?.focus()
            }
        } catch (error) {
            console.error('Error creating tag:', error)
        }
    }

    const handleRemoveTag = (tagId: number) => {
        const newValue = value.filter(id => id !== tagId)
        onChange(newValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            
            if (suggestions.length > 0) {
                // Si hay sugerencias, seleccionar la primera
                handleSelectTag(suggestions[0])
            } else if (inputValue.trim()) {
                // Si no hay sugerencias pero hay texto, crear nueva etiqueta
                handleCreateTag()
            }
        } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
            // Eliminar la última etiqueta si no hay texto
            handleRemoveTag(selectedTags[selectedTags.length - 1].id)
        }
    }

    return (
        <div>
            <label htmlFor="tags" className="block text-sm font-semibold text-grimmiz-text mb-2">
                Etiquetas
            </label>

            {/* Tags seleccionadas */}
            <div className="mb-2 flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                    <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                        {tag.name}
                        <button
                            type="button"
                            onClick={() => handleRemoveTag(tag.id)}
                            className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </span>
                ))}
            </div>

            {/* Input para añadir etiquetas */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    id="tags"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe para buscar o crear etiquetas..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    disabled={isLoadingTags}
                />

                {/* Sugerencias */}
                {showSuggestions && (suggestions.length > 0 || inputValue.trim()) && (
                    <div
                        ref={suggestionsRef}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                        {suggestions.map(tag => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => handleSelectTag(tag)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span className="text-grimmiz-text">{tag.name}</span>
                            </button>
                        ))}

                        {/* Opción para crear nueva etiqueta */}
                        {inputValue.trim() && !suggestions.find(tag => tag.name.toLowerCase() === inputValue.toLowerCase()) && (
                            <button
                                type="button"
                                onClick={handleCreateTag}
                                className="w-full px-4 py-2 text-left bg-secondary/5 hover:bg-secondary/10 transition-colors flex items-center gap-2 border-t border-gray-200"
                            >
                                <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-secondary font-medium">
                                    Crear &quot;{inputValue}&quot;
                                </span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            <p className="text-xs text-grimmiz-text-secondary mt-1">
                Presiona Enter para seleccionar o crear. Backspace para eliminar la última.
            </p>
        </div>
    )
}

