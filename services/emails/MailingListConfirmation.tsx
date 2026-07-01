import { Heading, Text } from '@react-email/components'
import EmailLayout from './Layout'

type Props = { email: string, unsubscribeKey: string }

export default function MailingListConfirmation({ email, unsubscribeKey }: Props) {
  return (
    <EmailLayout email={ email } unsubscribeKey={ unsubscribeKey }>
      <Heading style={heading}>Welcome to OpsJam</Heading>
      <Text style={text}>
        Thanks for joining the mailing list, {email}. We&apos;ll keep you
        posted on announcements, applications, and event details.
      </Text>
    </EmailLayout>
  )
}

const heading = {
  color: '#a5a6f6',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 16px',
}

const text = {
  color: '#c7c7d9',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0',
}
