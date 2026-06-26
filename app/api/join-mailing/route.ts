import { NextRequest } from 'next/server'
import supabase from '../../../services/supabase'
import { generateRandomCode } from '../../../services/security'

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const email = form.get('email');

    if (!email) {
      return;
    }

    const trimmedEmail = String(email).trim()

    // Check if email is already in the database
    const { data: dupData, error: dupError } = await supabase
      .from('mailing')
      .select('email')
      .eq('email', trimmedEmail)
      .maybeSingle()

    if (dupError) {
      return Response.json(
        { ok: false, error: 'A database error occurred' },
        { status: 500 },
      )
    }

    if (dupData) {
      return Response.json(
        { ok: false, error: 'You are already subscribed' },
        { status: 409 },
      )
    }

    const { error: addError } = await supabase
      .from('mailing')
      .insert({ email: trimmedEmail, unsubscribe_key: generateRandomCode() })

    if (addError) {
      return Response.json(
        { ok: false, error: `A database error occurred` },
        { status: 500 }
      )
    }

    return Response.json(
      { ok: true, message: "Email added to the mailing list" },
      { status: 201 }
    )
  } catch (error) {
    return Response.json(
      { ok: false, error: `An unknown error occurred: ${error}` },
      { status: 500 }
    )
  }
}