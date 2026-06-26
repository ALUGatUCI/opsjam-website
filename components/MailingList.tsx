'use client'

import { useState } from 'react'

import './mailingList.css'

export function MailingList() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMesg, setErrorMesg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // don't reload the page
    setStatus('idle')

    try {
      const formData = new FormData()
      formData.append('email', email)

      const response = await fetch('/api/join-mailing', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMesg(`Subscription failed: ${(await response.json()).error}. Please try again.`)
      }
    } catch {
      setStatus('error')
      setErrorMesg('Could not reach the server. Please try again.')
    }
  }

  return (
    <>
      <form className="mailingList" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="you@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="applyButton">
          Subscribe
        </button>
      </form>

      {status === 'success' && (
        <p className="statusBox statusSuccess">
          You&apos;re on the list! We&apos;ll keep you posted.
        </p>
      )}
      {status === 'error' && (
        <p className="statusBox statusError">{errorMesg}</p>
      )}
    </>
  )
}
