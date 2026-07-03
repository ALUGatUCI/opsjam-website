"use server"

import { NextRequest } from 'next/server'
import databaseService from '../../../services/supabase'
import { createLogger, serializeError } from '../../../services/logger'

const logger = createLogger('api/confirm-app')

export async function PUT(request: NextRequest) {
  const form = await request.formData();

  const appId = form.get('app_id');
  const confirmationCode = form.get('confirmation_code')

  if (!appId) {
    logger.warn('Confirmation request rejected: missing application id')
    return Response.json(
      { ok: false, error: 'Missing application id' },
      { status: 400 },
    )
  }

  const trimmedAppId = String(appId).trim()
  const trimmedConfirmationCode = String(confirmationCode).trim()

  logger.info('Application confirmation request received', { appId: trimmedAppId })

  try {
    await databaseService.confirmApplication(trimmedAppId, trimmedConfirmationCode)
  } catch (error) {
    logger.error('Application confirmation failed', { appId: trimmedAppId, error: serializeError(error) })
    return Response.json(
      { ok: false, error: String(error) },
      { status: 500 }
    )
  }

  return Response.json(
    { ok: true, message: "Application has been confirmed" },
    { status: 201 }
  )
}