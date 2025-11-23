'use client'

import { useState, useRef, ChangeEvent, DragEvent } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    label?: string
    error?: string
}

export default function ImageUpload({ value, onChange, label = 'Imagen', error }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (file: File) => {
        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            setUploadError('Tipo de archivo no permitido. Solo se aceptan JPG, PNG y WebP.')
            return
        }

        // Validar tamaño (máx 5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            setUploadError('El archivo es demasiado grande. Tamaño máximo: 5MB.')
            return
        }

        setUploadError('')
        setIsUploading(true)

        try {
            // Crear FormData para enviar el archivo
            const formData = new FormData()
            formData.append('file', file)

            // Subir a Supabase Storage a través de una API route
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al subir la imagen')
            }

            // Actualizar el valor con la URL de la imagen
            onChange(data.url)
        } catch (error: any) {
            console.error('Error uploading image:', error)
            setUploadError(error.message || 'Error al subir la imagen')
        } finally {
            setIsUploading(false)
        }
    }

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleRemove = () => {
        onChange('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div>
            <label className="block text-sm font-semibold text-grimmiz-text mb-2">
                {label}
            </label>

            {value ? (
                // Preview de la imagen
                <div className="relative group">
                    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                            src={value}
                            alt="Preview"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                // Área de upload
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging
                            ? 'border-primary bg-primary/5'
                            : error || uploadError
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                        }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileInputChange}
                        className="hidden"
                        disabled={isUploading}
                    />

                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-grimmiz-text font-medium">Subiendo imagen...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-grimmiz-text font-medium mb-2">
                                Arrastra una imagen aquí o haz clic para seleccionar
                            </p>
                            <p className="text-sm text-grimmiz-text-secondary">
                                JPG, PNG o WebP (máx. 5MB)
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Mensajes de error */}
            {(error || uploadError) && (
                <p className="text-red-500 text-sm mt-2">{error || uploadError}</p>
            )}
        </div>
    )
}
