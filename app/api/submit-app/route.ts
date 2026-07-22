"use server"

import { NextRequest } from 'next/server'
import databaseService from '@/services/supabase'
import emailService from '@/services/email'
import { generateRandomCode } from '@/services/security'
import { createLogger, maskEmail, serializeError } from '@/services/logger'

const logger = createLogger('api/submit-app')

export async function PUT(request: NextRequest) {
  if (process.env.ACCEPTING_APPS == '0') {
    logger.warn('Application submission rejected: applications are closed')
    return Response.json(
      { ok: false, error: 'Applications are not being accepted at this time' },
    )
  }

  const form = await request.formData()

  // Plain text/select fields — pull by the `name` you set on each input.
  const fullName = form.get('fullName')
  const email = form.get('email')
  const phoneNumber = form.get('phoneNumber')
  const dateOfBirth = form.get('dateOfBirth')
  const gender = form.get('gender')
  const school = form.get('school')
  const levelOfStudy = form.get('levelOfStudy')
  const major = form.get('major')
  const graduationYear = form.get('graduationYear')
  const country = form.get('country')
  const shirtSize = form.get('shirtSize')

  // Multi-value field — several checkboxes share the name, so use getAll().
  const dietaryRestrictions = form.getAll('dietaryRestrictions').map(String)

  // The resume comes through as a File (or null if none was attached).
  const resume = form.get('resume')

  // Generate the confirmation confirmationCode
  const confirmationCode = generateRandomCode()

  // Re-validate on the server — the client's `required` is bypassable.
  if (
    !fullName ||
    !email ||
    !phoneNumber ||
    !school ||
    !country ||
    !(resume instanceof File)
  ) {
    logger.warn('Application submission rejected: missing required fields', {
      email: email ? maskEmail(String(email)) : null,
      missingFields: [
        !fullName && 'fullName',
        !email && 'email',
        !phoneNumber && 'phoneNumber',
        !school && 'school',
        !country && 'country',
        !(resume instanceof File) && 'resume',
      ].filter(Boolean),
    })
    return Response.json(
      { ok: false, error: 'Missing required fields' },
    )
  }

  // Check the date of birth is 18 or over
  if (!dateOfBirth) {
    logger.warn('Application submission rejected: missing date of birth', { email: maskEmail(String(email)) })
    return Response.json(
      { ok: false, error: 'You must be 18 or over to participate' },
    )
  }

  logger.info('Application submission received', { email: maskEmail(String(email)) })

  try {
    const appId = await databaseService.submitApplication({
      fullName: String(fullName),
      email: String(email),
      phoneNumber: String(phoneNumber),
      dateOfBirth: String(dateOfBirth),
      gender: gender ? String(gender) : null,
      school: String(school),
      levelOfStudy: levelOfStudy ? String(levelOfStudy) : null,
      major: major ? String(major) : null,
      graduationYear: graduationYear ? Number(graduationYear) : null,
      country: String(country),
      shirtSize: shirtSize ? String(shirtSize) : null,
      dietaryRestrictions: dietaryRestrictions,
      resume: resume,
      confirmationCode: confirmationCode
    })
    // Fire-and-forget: the application is already saved, so a mail failure
    // shouldn't fail the request — but we must catch it or the rejection
    // surfaces as an unhandledRejection and crashes the process.
    emailService
      .sendApplicationConfirmation(String(email), appId, confirmationCode)
      .catch((err) => logger.error('Failed to send application confirmation email', { appId, error: serializeError(err) }))
  } catch (error) {
    logger.error('Application submission failed', { email: maskEmail(String(email)), error: serializeError(error) })
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }

  return Response.json(
    { ok: true, message: 'Application submitted' },
    { status: 201 }
  )
}
