"use server"

import { NextRequest, NextResponse } from 'next/server'
import databaseService from '@/services/supabase'
import emailService from '@/services/email'
import { isAdminRequest } from '@/services/adminAuth'
import { createLogger, serializeError } from '@/services/logger'

const logger = createLogger('api/admin/broadcast')

const DEFAULT_SUBJECT = 'A message from OpsJam'

export async function POST(request: NextRequest) {
  // Feature flag: broadcasting is OFF unless ENABLE_BROADCAST is '1'. This keeps
  // the app fully runnable without SMTP configured.
  if (process.env.ENABLE_BROADCAST !== '1') {
    logger.warn('Broadcast rejected: feature disabled')
    return NextResponse.json({ ok: false, error: 'Email sending is disabled' }, { status: 403 })
  }

  if (!isAdminRequest(request)) {
    logger.warn('Broadcast rejected: unauthorized')
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const form = await request.formData()
  const message = form.get('message')
  const subjectField = form.get('subject')
  const subject = subjectField && String(subjectField).trim() ? String(subjectField).trim() : DEFAULT_SUBJECT

  if (!message || !String(message).trim()) {
    return NextResponse.json({ ok: false, error: 'Message is empty' }, { status: 400 })
  }
  const body = String(message)

  let recipients: string[]
  try {
    recipients = await databaseService.getMailingList()
  } catch (error) {
    logger.error('Broadcast failed: could not load mailing list', { error: serializeError(error) })
    return NextResponse.json({ ok: false, error: 'Could not load the mailing list' }, { status: 500 })
  }

  if (recipients.length === 0) {
    return NextResponse.json({ ok: false, error: 'The mailing list is empty' }, { status: 400 })
  }

  logger.info('Broadcast started', { recipientCount: recipients.length })

  // Send individually so recipients never see each other's addresses. Track
  // per-recipient failures instead of aborting the whole run on one bad send.
  let sent = 0
  let failed = 0
  for (const recipient of recipients) {
    try {
      await emailService.sendBroadcast(recipient, subject, body)
      sent += 1
    } catch {
      failed += 1
    }
  }

  logger.info('Broadcast finished', { sent, failed })

  return NextResponse.json({ ok: true, sent, failed, total: recipients.length }, { status: 200 })
}
