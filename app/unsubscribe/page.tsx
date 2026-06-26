"use client"

import { useState, useEffect } from 'react'

import { NavBar } from '../../components/NavBar'

import '../globals.css'

export default function Unsubscribe() {
  const [status, setStatus] = useState<'Success' | 'Failed' | null>(null)
  // Unsubscribe from supabase
  useEffect(() => {
    async function unsubscribe() {
      const params = new URLSearchParams(window.location.search)
      const email = params.get('email')
      const unsubscribeKey = params.get('unsubscribe_key')

      if (!email || !unsubscribeKey) {
        setStatus('Failed')
        return
      }

      try {
        const formData = new FormData()
        formData.append('email', email)
        formData.append('unsubscribe_key', unsubscribeKey)

        const response = await fetch('/api/unsubscribe', {
          method: 'DELETE',
          body: formData
        })

        setStatus(response.ok ? 'Success' : 'Failed')
      } catch {
        setStatus('Failed')
      }
    }

    unsubscribe()
  }, [])

  return (
    <>
      <NavBar></NavBar>

      <h1>Unsubscribe</h1>

      {status === null && <p>Unsubscribing…</p>}
      {status === 'Success' && <p>You have been unsubscribed from our mailing list</p>}
      {status === 'Failed' && <p>An error occurred unsubscribing you. Please contact a site
        administrator so we can remove you</p>}
    </>
  )
}