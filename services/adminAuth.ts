import { NextRequest } from 'next/server'

// Shared admin gate for API routes. Matches the httpOnly `admin_auth` cookie
// (set by /api/admin-login) against ADMIN_PASSWORD. Fails closed when the
// password isn't configured.
export function isAdminRequest(request: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return request.cookies.get('admin_auth')?.value === expected
}
