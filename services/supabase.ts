import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createLogger, maskEmail } from './logger'

const logger = createLogger('services/supabase')

type ApplicationSubmission = {
  fullName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string | null
  school: string
  levelOfStudy: string | null
  major: string | null
  graduationYear: number | null
  country: string
  shirtSize: string | null
  dietaryRestrictions: string[]
  resume: File
  confirmationCode: string | null
}

class DatabaseService {
  private supabase: SupabaseClient

  public constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
  }

  public async confirmApplication(appId: string, confirmationCode: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('applications')
      .select('confirmed, confirmation_code')
      .eq('id', appId)
      .maybeSingle()

    if (error) {
      logger.error('Failed to look up application for confirmation', { appId, supabaseError: error })
    }

    if (!data) {
      logger.warn('Confirmation attempted for unknown application', { appId })
      throw new Error("Application was not found")
    }

    if (data?.confirmed) {
      logger.warn('Confirmation attempted for already-confirmed application', { appId })
      throw new Error("Application has already been confirmed")
    }

    if (confirmationCode == data?.confirmation_code) {
      const { error: updateError } = await this.supabase
        .from('applications')
        .update({ confirmed: true })
        .eq('id', appId)

      if (updateError) {
        logger.error('Failed to mark application as confirmed', { appId, supabaseError: updateError })
        throw new Error("An error occurred confirming your application")
      }

      logger.info('Application confirmed', { appId })
    } else {
      logger.warn('Confirmation code mismatch', { appId })
      throw new Error("The confirmation code does not match")
    }
  }

  public async joinMailingList(email: string, randomCode: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('mailing')
      .select('email')
      .eq('email', email)
      .maybeSingle()

    if (error) {
      logger.error('Failed to check mailing list for existing email', { email: maskEmail(email), supabaseError: error })
    }

    if (data) {
      logger.warn('Mailing list signup attempted for already-subscribed email', { email: maskEmail(email) })
      throw new Error("The email is already subscribed")
    }

    const { error: subscribeError } = await this.supabase
      .from('mailing')
      .insert({ email: email, unsubscribe_key: randomCode })

    if (subscribeError) {
      logger.error('Failed to insert email into mailing list', { email: maskEmail(email), supabaseError: subscribeError })
      throw new Error("There was a problem subscribing the email to the mailing list")
    }

    logger.info('Email subscribed to mailing list', { email: maskEmail(email) })
  }

  public async unsubscribeFromMailingList(email: string, unsubscribeKey: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('mailing')
      .select('email, unsubscribe_key')
      .eq('email', email)
      .maybeSingle()

    if (error) {
      logger.error('Failed to look up email for unsubscribe', { email: maskEmail(email), supabaseError: error })
    }

    if (!data) {
      logger.warn('Unsubscribe attempted for unknown email', { email: maskEmail(email) })
      throw new Error("The email was not found")
    }

    if (data?.unsubscribe_key === unsubscribeKey) {
      const { error: deleteError } = await this.supabase
        .from('mailing')
        .delete()
        .eq('email', email)

      if (deleteError) {
        logger.error('Failed to delete email from mailing list', { email: maskEmail(email), supabaseError: deleteError })
        throw new Error("Something went wrong unsubscribing you")
      }

      logger.info('Email unsubscribed from mailing list', { email: maskEmail(email) })
    } else {
      logger.warn('Unsubscribe key mismatch', { email: maskEmail(email) })
      throw new Error("The unsubscribe token does not match")
    }
  }

  public async submitApplication(application: ApplicationSubmission): Promise<number> {
    // Reject a second application from the same email.
    const { data: existing, error: lookupError } = await this.supabase
      .from('applications')
      .select('id')
      .eq('email', application.email)
      .maybeSingle()

    if (lookupError) {
      logger.error('Failed to check for existing application', { email: maskEmail(application.email), supabaseError: lookupError })
      throw new Error("There was a problem checking for an existing application")
    }

    if (existing) {
      logger.warn('Duplicate application attempted', { email: maskEmail(application.email), existingAppId: existing.id })
      throw new Error("An application with this email already exists")
    }

    // Upload the resume to the (private) `resumes` bucket. Use only a UUID +
    // safe extension — raw filenames can contain characters Supabase rejects.
    const ext = application.resume.name.split('.').pop()?.toLowerCase() ?? 'pdf'
    const resumePath = `${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await this.supabase.storage
      .from('resumes')
      .upload(resumePath, application.resume, { contentType: application.resume.type })

    if (uploadError) {
      logger.error('Failed to upload resume to storage', { email: maskEmail(application.email), resumePath, supabaseError: uploadError })
      throw new Error("There was a problem uploading the resume")
    }

    // Insert the application row, storing only the path to the resume.
    // Return the new row's id so the caller can build the confirmation link.
    const { data: inserted, error: insertError } = await this.supabase
      .from('applications')
      .insert({
        full_name: application.fullName,
        email: application.email,
        phone_number: application.phoneNumber,
        over_18: application.dateOfBirth,
        gender: application.gender,
        school: application.school,
        level_of_study: application.levelOfStudy,
        major: application.major,
        graduation_year: application.graduationYear,
        country: application.country,
        shirt_size: application.shirtSize,
        dietary_restrictions: application.dietaryRestrictions,
        resume_path: resumePath,
        confirmation_code: application.confirmationCode,
      })
      .select('id')
      .single()

    if (insertError || !inserted) {
      logger.error('Failed to insert application row, removing uploaded resume', { email: maskEmail(application.email), resumePath, supabaseError: insertError })
      // Don't leave an orphaned file if the row failed to save.
      await this.supabase.storage.from('resumes').remove([resumePath])
      throw new Error("There was a problem saving the application")
    }

    logger.info('Application submitted', { appId: inserted.id, email: maskEmail(application.email) })

    return inserted.id as number
  }
}

const database = new DatabaseService()

export default database