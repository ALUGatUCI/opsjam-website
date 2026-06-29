"use server"

import { NextRequest } from 'next/server'
import databaseService from '../../../services/supabase'

export async function PUT(request: NextRequest) {
  const form = await request.formData();

  const appId = form.get('app_id');
  const confirmationCode = form.get('confirmation_code')

  if (!appId) {
    return Response.json(
      { ok: false, error: 'Missing application id' },
      { status: 400 },
    )
  }

  const trimmedAppId = String(appId).trim()
  const trimmedConfirmationCode = String(confirmationCode).trim()

  try {
    await databaseService.confirmApplication(trimmedAppId, trimmedConfirmationCode)
  } catch (error) {
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