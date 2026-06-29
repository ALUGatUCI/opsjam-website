"use server"

import { NextRequest } from 'next/server'
import databaseService from '../../../services/supabase'

export async function POST(request: NextRequest) {
  const form = await request.formData();

  const email = form.get('email');

  if (!email) {
    return;
  }

  const trimmedEmail = String(email).trim()

  try {
    await databaseService.joinMailingList(trimmedEmail)
  } catch (error) {
    return Response.json(
      { ok: false, message: String(error) },
      { status: 500 }
    )
  }

  return Response.json(
    { ok: true, message: "The email has been subscribed to the mailing list" },
    { status: 201 }
  )
}