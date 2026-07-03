"use server"

import { NextRequest } from 'next/server'
import databaseService from '../../../services/supabase'
import { createLogger, maskEmail, serializeError } from '../../../services/logger'

const logger = createLogger('api/unsubscribe')

export async function DELETE(request: NextRequest) {
  const form = await request.formData();

  const email = form.get('email');
  const unsubscribeKey = form.get('unsubscribe_key')

  if (!email) {
    logger.warn('Unsubscribe request rejected: missing email')
    return Response.json(
      { ok: false, error: 'Missing email' },
      { status: 400 },
    )
  }

  const trimmedEmail = String(email).trim()
  const trimmedUnsubscribeKey = String(unsubscribeKey).trim()

  logger.info('Unsubscribe request received', { email: maskEmail(trimmedEmail) })

  try {
    await databaseService.unsubscribeFromMailingList(trimmedEmail, trimmedUnsubscribeKey)
  } catch (error) {
    logger.error('Unsubscribe request failed', { email: maskEmail(trimmedEmail), error: serializeError(error) })
    return Response.json(
      { ok: false, error: String(error) },
      { status: 500 }
    )
  }

  return Response.json(
    { ok: true, message: "Successfully unsubscribed" },
    { status: 201 }
  )
}