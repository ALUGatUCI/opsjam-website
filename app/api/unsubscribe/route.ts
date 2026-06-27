"use server"

import { NextRequest } from 'next/server'
import supabase from '../../../services/supabase'

export async function DELETE(request: NextRequest) {
  try {
    const form = await request.formData();

    const email = form.get('email');
    const unsubscribeKey = form.get('unsubscribe_key')

    if (!email) {
      return;
    }

    const trimmedEmail = String(email).trim()
    const trimmedUnsubscribeKey = String(unsubscribeKey).trim()

    // Check if email is already in the database
    const { data, error } = await supabase
      .from('mailing')
      .select('email, unsubscribe_key')
      .eq('email', trimmedEmail)
      .maybeSingle()

    if (error) {
      return Response.json(
        { ok: false, error: `Email was not found` },
        { status: 404 }
      )
    }

    // Now check that they key is equal
    if (data?.unsubscribe_key === trimmedUnsubscribeKey) {
      const { data, error } = await supabase
        .from('mailing')
        .delete()
        .eq('email', trimmedEmail)

      if (error) {
        return Response.json(
          { ok: false, details: 'Something went wrong unsubscribing you' },
          { status: 500 }
        )
      }

      return Response.json(
        { ok: true, details: 'Successfully unsubscribed' },
        { status: 200 }
      )
    } else {
      return Response.json(
        { ok: false, error: `The unsubscribe token does not match` },
        { status: 400 }
      )
    }
  } catch (error) {
    return Response.json(
      { ok: false, error: `An unknown error occurred: ${error}` },
      { status: 500 }
    )
  }
}