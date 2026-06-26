import { NextRequest } from 'next/server'
import supabase from '../../../services/supabase'
import { generateRandomCode } from '../../../services/security'

export async function PUT(request: NextRequest) {
  if (process.env.ACCEPTING_APPS == '0') {
    return Response.json(
      { ok: false, error: 'Applications are not being accepted at this time' },
      { status: 400 },
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

  // Re-validate on the server — the client's `required` is bypassable.
  if (
    !fullName ||
    !email ||
    !phoneNumber ||
    !school ||
    !country ||
    !(resume instanceof File)
  ) {
    return Response.json(
      { ok: false, error: 'Missing required fields' },
      { status: 400 },
    )
  }

  // Check the date of birth is 18 or over
  if (!dateOfBirth) {
    return Response.json(
      { ok: false, error: 'You must be 18 or over to participate' },
      { status: 400 },
    )
  }

  // Check that this email hasn't already applied.
  const { data: existing, error: lookupError } = await supabase
    .from('applications')
    .select('id')
    .eq('email', String(email))
    .maybeSingle()

  if (lookupError) {
    return Response.json(
      { ok: false, error: `Lookup failed: ${lookupError.message}` },
      { status: 500 },
    )
  }

  if (existing) {
    return Response.json(
      { ok: false, error: 'An application with this email already exists.' },
      { status: 409 },
    )
  }

  // 1. Upload the resume to the (private) `resumes` bucket.
  // Use only a UUID + safe extension — raw filenames can contain spaces,
  // parentheses, or non-ASCII chars that Supabase rejects as an invalid key.
  const ext = resume.name.split('.').pop()?.toLowerCase() ?? 'pdf'
  const resumePath = `${crypto.randomUUID()}.${ext}`
  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(resumePath, resume, { contentType: resume.type })

  if (uploadError) {
    console.error('Resume upload failed:', uploadError)
    return Response.json(
      { ok: false, error: `Resume upload failed: ${uploadError.message}` },
      { status: 500 },
    )
  }

  // 2. Insert the application row, storing only the path to the resume.
  const { error: insertError } = await supabase.from('applications').insert({
    full_name: String(fullName),
    email: String(email),
    phone_number: String(phoneNumber),
    over_18: dateOfBirth ? dateOfBirth : null,
    gender: gender ? String(gender) : null,
    school: String(school),
    level_of_study: levelOfStudy ? String(levelOfStudy) : null,
    major: major ? String(major) : null,
    graduation_year: graduationYear ? Number(graduationYear) : null,
    country: String(country),
    shirt_size: shirtSize ? String(shirtSize) : null,
    dietary_restrictions: dietaryRestrictions,
    resume_path: resumePath,
    confirmation_code: generateRandomCode()
  })

  if (insertError) {
    // Don't leave an orphaned file if the row failed to save.
    await supabase.storage.from('resumes').remove([resumePath])
    return Response.json(
      { ok: false, error: `Failed to save application: ${insertError.message}` },
      { status: 500 },
    )
  }

  return Response.json(
    { ok: true, message: 'Application submitted' },
    { status: 201 },
  )
}
