import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CardSidebar from '../src/components/CardSidebar'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

// Simulare axios
vi.mock('axios')

describe('CardSidebar - Functionalitati Cos Cumparaturi', () => {
  const mockCartItems = [
    {
      productId: 101,
      title: 'MongoDB: The Definitive Guide',
      author: 'Shannon Bradshaw',
      price: 39.99,
      quantity: 2,
      imageUrl: 'test-image.jpg'
    }
  ]

  const mockCart = {
    items: mockCartItems,
    total: 79.98,
    totalItems: 2
  }

  const mockOnClose = vi.fn()
  const mockCartResponse = {
    data: { success: true, cart: mockCart }
  }

  const mockEmptyCartResponse = {
    data: { 
      success: true, 
      cart: { items: [], total: 0, totalItems: 0 }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    global.alert = vi.fn()
  })

  const renderComponent = (isOpen = true) => {
    return render(
      <BrowserRouter>
        <CardSidebar isOpen={isOpen} onClose={mockOnClose} />
      </BrowserRouter>
    )
  }

  // Teste de bază
  it('nu ar trebui să fie vizibil când isOpen este false', () => {
    renderComponent(false)
    expect(screen.queryByText('Coșul de cumpărături')).not.toBeInTheDocument()
  })

  it('ar trebui să afișeze coșul cu produse când este deschis', async () => {
    axios.get.mockResolvedValueOnce(mockCartResponse)
    
    renderComponent(true)

    await waitFor(() => {
      expect(screen.getByText('Coșul de cumpărături')).toBeInTheDocument()
      expect(screen.getByText('MongoDB: The Definitive Guide')).toBeInTheDocument()
      expect(screen.getByText('de Shannon Bradshaw')).toBeInTheDocument()
    })
  })

  it('ar trebui să afișeze coșul gol corect', async () => {
    axios.get.mockResolvedValueOnce(mockEmptyCartResponse)
    
    renderComponent(true)

    await waitFor(() => {
      expect(screen.getByText('Coșul tău este gol')).toBeInTheDocument()
      expect(screen.getByText('Adaugă produse din catalog')).toBeInTheDocument()
    })
  })

  it('ar trebui să afișeze totalurile corecte', async () => {
    axios.get.mockResolvedValueOnce(mockCartResponse)
    
    renderComponent(true)

    await waitFor(() => {
      expect(screen.getByText('Total produse: 2')).toBeInTheDocument()
      expect(screen.getByText(/79.98 RON/)).toBeInTheDocument()
    })
  })

  it('ar trebui să închidă sidebar-ul la click pe overlay', async () => {
    axios.get.mockResolvedValueOnce(mockCartResponse)
    
    renderComponent(true)

    await waitFor(() => {
      expect(screen.getByText('Coșul de cumpărături')).toBeInTheDocument()
    })

    const overlay = document.querySelector('.card-sidebar-overlay')
    fireEvent.click(overlay)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('ar trebui să închidă sidebar-ul la click pe butonul de închidere', async () => {
    axios.get.mockResolvedValueOnce(mockCartResponse)
    
    renderComponent(true)

    await waitFor(() => {
      expect(screen.getByText('Coșul de cumpărături')).toBeInTheDocument()
    })

    const closeButton = screen.getByText('×')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('ar trebui să afișeze butonul de checkout cu prețul corect', async () => {
    axios.get.mockResolvedValueOnce(mockCartResponse)
    
    renderComponent(true)

    await waitFor(() => {
      expect(screen.getByText('Finalizează comanda - 99.97 RON')).toBeInTheDocument()
    })
  })

  it('ar trebui să gestioneze checkout-ul cu succes fără erori', async () => {
    axios.get.mockResolvedValueOnce(mockCartResponse)
    
    // Simulare pentru checkout cu succes
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, sessionUrl: 'https://checkout.stripe.com/session_123' })
    })

    // Simulare pentru window.location pentru a evita erori de navigare
    const originalLocation = window.location
    delete window.location
    window.location = { href: '' }

    renderComponent(true)

    await waitFor(() => {
      expect(screen.getByText('Finalizează comanda - 99.97 RON')).toBeInTheDocument()
    })

    const checkoutButton = screen.getByText('Finalizează comanda - 99.97 RON')
    fireEvent.click(checkoutButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    // Restaureaza window.location
    window.location = originalLocation
  })

  // Test simplificat pentru butonul de ștergere - doar verifică că există
  it('ar trebui să afișeze butoanele de ștergere pentru produse', async () => {
    axios.get.mockResolvedValueOnce(mockCartResponse)
    
    renderComponent(true)

    await waitFor(() => {
      expect(screen.getByText('MongoDB: The Definitive Guide')).toBeInTheDocument()
      expect(screen.getByText('Șterge')).toBeInTheDocument()
    })
  })

  it('ar trebui să afișeze informațiile complete ale produselor', async () => {
    axios.get.mockResolvedValueOnce(mockCartResponse)
    
    renderComponent(true)

    await waitFor(() => {
      expect(screen.getByText('MongoDB: The Definitive Guide')).toBeInTheDocument()
      expect(screen.getByText('de Shannon Bradshaw')).toBeInTheDocument()
      expect(screen.getByText('39.99 RON')).toBeInTheDocument()
      expect(screen.getByText('x 2')).toBeInTheDocument()
    })
  })

  it('ar trebui să afișeze butonul de checkout enabled inițial', async () => {
    axios.get.mockResolvedValueOnce(mockCartResponse)
    
    renderComponent(true)

    await waitFor(() => {
      const checkoutButton = screen.getByText('Finalizează comanda - 99.97 RON')
      expect(checkoutButton).not.toBeDisabled()
    })
  })
})