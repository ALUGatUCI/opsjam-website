"use server"

import { NextRequest, NextResponse } from 'next/server'
import { createLogger } from '@/services/logger'

const logger = createLogger('api/admin-login')

export async function POST(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD

  // Fail closed: if no password is configured, nobody gets in.
  if (!expected) {
    logger.error('Admin login rejected: ADMIN_PASSWORD is not set')
    return NextResponse.json(
      { ok: false, error: 'Admin access is not configured' },
      { status: 500 },
    )
  }

  const form = await request.formData()
  const password = form.get('password')

  if (!password || String(password) !== expected) {
    logger.warn('Admin login rejected: incorrect password')
    return NextResponse.json(
      { ok: false, error: 'Incorrect password' },
      { status: 401 },
    )
  }

  logger.info('Admin login succeeded')

  const response = NextResponse.json({ ok: true }, { status: 200 })
  // httpOnly so client JS can't read it; the server compares it back to
  // ADMIN_PASSWORD on every admin page load.
  response.cookies.set('admin_auth', expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { status: 200 })
  response.cookies.delete('admin_auth')
  return response
}
