import { Heading, Text } from '@react-email/components'
import EmailLayout from './Layout'

type Props = { appId: number, confirmationCode: string }

export default function ApplicationConfirmation({ appId, confirmationCode }: Props) {
  return (
    <EmailLayout email={ null } unsubscribeKey={ null }>
      <Heading style={heading}>OpsJam Application Confirmation</Heading>
      <Text style={text}>
        Thanks for applying to OpsJam! You are one step closer to us reviewing
        your application! Confirm it by clicking <a href={`https://hack.alugatuci.org/confirm?app_id=${appId}&confirmation_code=${confirmationCode}`}>here</a>!
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
