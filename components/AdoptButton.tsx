'use client'

import { useState } from 'react'
import ContactModal from './ContactModal'

interface AdoptButtonProps {
  productTitle: string
}

export default function AdoptButton({ productTitle }: AdoptButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full md:w-auto bg-secondary text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-secondary-dark transition-colors shadow-lg hover:shadow-xl"
      >
        Adopta este Grimmiz
      </button>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productTitle={productTitle}
      />
    </>
  )
}

