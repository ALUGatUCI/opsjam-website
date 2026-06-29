"use server"

import { NextRequest } from 'next/server'
import databaseService from '../../../services/supabase'

export async function DELETE(request: NextRequest) {
  const form = await request.formData();

  const email = form.get('email');
  const unsubscribeKey = form.get('unsubscribe_key')

  if (!email) {
    return Response.json(
      { ok: false, error: 'Missing email' },
      { status: 400 },
    )
  }

  const trimmedEmail = String(email).trim()
  const trimmedUnsubscribeKey = String(unsubscribeKey).trim()

  try {
    await databaseService.unsubscribeFromMailingList(trimmedEmail, trimmedUnsubscribeKey)
  } catch (error) {
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