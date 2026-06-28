"use client"

import { useState, useEffect } from 'react'

export default function Confirm() {
  const [status, setStatus] = useState<'Success' | 'Failed' | null>(null)

  useEffect(() => {
    async function confirmApp() {
      const params = new URLSearchParams(window.location.search)
      const appId = params.get('app_id')
      const confirmationCode = params.get('confirmation_code')

      if (!appId || !confirmationCode) {
        setStatus('Failed')
        return
      }

      try {
        const formData = new FormData()
        formData.append('app_id', appId)
        formData.append('confirmation_code', confirmationCode)

        const response = await fetch('/api/confirm-app', {
          method: 'PUT',
          body: formData
        })

        setStatus(response.ok ? 'Success' : 'Failed')
      } catch {
        setStatus('Failed')
      }
    }

    confirmApp()
  }, [])

  return (
    <>
      <h1>Confirm Application</h1>

      {status === null && <p>Confirming your application...</p>}
      {status === 'Success' && <p>Your application has been successfully confirmed! We look forward to reviewing it soon!</p>}
      {status === 'Failed' && <p>Something went wrong with confirming your application. Please contact a site administrator for help.</p>}
    </>
  )
}