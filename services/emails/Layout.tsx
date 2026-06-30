import {
  Html,
  Head,
  Font,
  Body,
  Container,
  Section,
  Text,
  Link,
} from '@react-email/components'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  email: string | null
  unsubscribeKey: string | null
}

// Shared base layout for every email: a centered, fixed-width card on the
// brand background, with a footer. Individual templates only provide content.
export default function EmailLayout({
  children,
  email,
  unsubscribeKey
}: Props) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Red Hat Display"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/redhatdisplay/v21/8vIQ7wUr0m80wwYf0QCXZzYzUoTQ_zSmZYo.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body style={main}>
        <Container style={container}>
          <Section>{children}</Section>
        </Container>
        {unsubscribeKey &&
          <Container style={footer}>
            <Text style={footerText}>
              If you would like to unsubscribe from the mailing list,{' '}
              <Link href={`https://hack.alugatuci.org/unsubscribe?email=${email}&unsubscribe_key=${unsubscribeKey}`} style={footerLink}>
                click here
              </Link>
              .
            </Text>
          </Container>
        }
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#1a1a2e',
  fontFamily:
    "'Red Hat Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: '32px 0',
}

const container = {
  backgroundColor: '#25254a',
  borderRadius: '8px',
  maxWidth: '480px',
  margin: '0 auto',
  padding: '32px',
}

const footer = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '16px 32px 0',
}

const footerText = {
  color: '#8a8aa6',
  fontSize: '13px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
  margin: '0',
}

const footerLink = {
  color: '#a5a6f6',
}
