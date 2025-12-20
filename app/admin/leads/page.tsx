'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Pagination from '@/components/admin/Pagination'
import Link from 'next/link'

interface Lead {
  id: number
  product_title: string
  product_slug: string | null
  name: string
  email: string
  comments: string
  status: 'nuevo' | 'contactado' | 'convertido' | 'descartado'
  created_at: string
  updated_at: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Filtros
  const [search, setSearch] = useState('')
  const [productTitle, setProductTitle] = useState('')
  const [status, setStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const itemsPerPage = 10

  // Cargar leads
  const loadLeads = useCallback(async () => {
    try {
      setIsLoading(true)

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      })

      if (search) queryParams.append('search', search)
      if (productTitle) queryParams.append('product_title', productTitle)
      if (status) queryParams.append('status', status)
      if (dateFrom) queryParams.append('date_from', dateFrom)
      if (dateTo) queryParams.append('date_to', dateTo)

      const response = await fetch(`/api/admin/leads?${queryParams}`)
      const data = await response.json()

      setLeads(data.leads || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setTotalItems(data.pagination?.totalItems || 0)
    } catch (error) {
      console.error('Error loading leads:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, search, productTitle, status, dateFrom, dateTo])

  useEffect(() => {
    loadLeads()
  }, [loadLeads])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: leadId,
          status: newStatus
        })
      })

      if (response.ok) {
        loadLeads() // Recargar la lista
      } else {
        console.error('Error updating lead status')
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nuevo':
        return 'bg-blue-100 text-blue-800'
      case 'contactado':
        return 'bg-yellow-100 text-yellow-800'
      case 'convertido':
        return 'bg-green-100 text-green-800'
      case 'descartado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'nuevo':
        return 'Nuevo'
      case 'contactado':
        return 'Contactado'
      case 'convertido':
        return 'Convertido'
      case 'descartado':
        return 'Descartado'
      default:
        return status
    }
  }

  const clearFilters = () => {
    setSearch('')
    setProductTitle('')
    setStatus('')
    setDateFrom('')
    setDateTo('')
    setCurrentPage(1)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-grimmiz-text mb-2">Leads de Productos</h1>
            <p className="text-grimmiz-text-secondary">
              Gestiona los leads generados desde los formularios de contacto
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-grimmiz-text mb-2">Total Leads</h3>
            <p className="text-3xl font-bold text-primary">{totalItems}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-grimmiz-text mb-2">Nuevos</h3>
            <p className="text-3xl font-bold text-blue-600">
              {leads.filter(l => l.status === 'nuevo').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-grimmiz-text mb-2">Contactados</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {leads.filter(l => l.status === 'contactado').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-grimmiz-text mb-2">Convertidos</h3>
            <p className="text-3xl font-bold text-green-600">
              {leads.filter(l => l.status === 'convertido').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-grimmiz-text-secondary mb-1">
                Buscar
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre, email o comentarios..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Producto */}
            <div>
              <label className="block text-sm font-medium text-grimmiz-text-secondary mb-1">
                Producto
              </label>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="Nombre del producto..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-grimmiz-text-secondary mb-1">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Todos</option>
                <option value="nuevo">Nuevos</option>
                <option value="contactado">Contactados</option>
                <option value="convertido">Convertidos</option>
                <option value="descartado">Descartados</option>
              </select>
            </div>

            {/* Fecha desde */}
            <div>
              <label className="block text-sm font-medium text-grimmiz-text-secondary mb-1">
                Desde
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Fecha hasta */}
            <div>
              <label className="block text-sm font-medium text-grimmiz-text-secondary mb-1">
                Hasta
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Botón limpiar filtros */}
          {(search || productTitle || status || dateFrom || dateTo) && (
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary-dark transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-grimmiz-text-secondary uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-grimmiz-text-secondary mt-2">Cargando leads...</p>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <p className="text-grimmiz-text-secondary">No se encontraron leads</p>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-grimmiz-text">
                          {lead.name}
                        </div>
                        <div className="text-sm text-grimmiz-text-secondary line-clamp-2 max-w-xs">
                          {lead.comments}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-grimmiz-text">
                          {lead.product_title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-grimmiz-text">
                          {lead.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(lead.status)}`}
                        >
                          <option value="nuevo">Nuevo</option>
                          <option value="contactado">Contactado</option>
                          <option value="convertido">Convertido</option>
                          <option value="descartado">Descartado</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-grimmiz-text-secondary">
                        {formatDate(lead.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            <div className="divide-y divide-gray-200">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-grimmiz-text-secondary mt-2">Cargando leads...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-grimmiz-text-secondary">No se encontraron leads</p>
                </div>
              ) : (
                leads.map((lead) => (
                  <div key={lead.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-medium text-grimmiz-text truncate">
                            {lead.name}
                          </h3>
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(lead.status)}`}
                          >
                            <option value="nuevo">Nuevo</option>
                            <option value="contactado">Contactado</option>
                            <option value="convertido">Convertido</option>
                            <option value="descartado">Descartado</option>
                          </select>
                        </div>
                        <p className="text-sm text-grimmiz-text-secondary mb-2">
                          📧 {lead.email}
                        </p>
                        <p className="text-sm font-medium text-primary mb-2">
                          🛍️ {lead.product_title}
                        </p>
                        <p className="text-sm text-grimmiz-text-secondary line-clamp-3">
                          💬 {lead.comments}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          📅 {formatDate(lead.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
