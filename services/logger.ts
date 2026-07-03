type LogLevel = 'info' | 'warn' | 'error'

type LogContext = Record<string, unknown>

/**
 * Minimal structured logger. Emits a single line per event so entries are
 * easy to grep locally and are parsed cleanly by hosted log collectors.
 */
function log(level: LogLevel, scope: string, message: string, context?: LogContext) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    scope,
    message,
    ...(context && Object.keys(context).length > 0 ? { context } : {}),
  }

  const line = JSON.stringify(entry)

  if (level === 'error') {
    console.error(line)
  } else if (level === 'warn') {
    console.warn(line)
  } else {
    console.log(line)
  }
}

/** Serialize an unknown thrown value so stack traces survive JSON.stringify. */
export function serializeError(error: unknown): LogContext {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }
  return { message: String(error) }
}

/** Mask an email for logs, e.g. "navan@example.com" -> "na***@example.com". */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return '***'
  return `${local.slice(0, 2)}***@${domain}`
}

export function createLogger(scope: string) {
  return {
    info: (message: string, context?: LogContext) => log('info', scope, message, context),
    warn: (message: string, context?: LogContext) => log('warn', scope, message, context),
    error: (message: string, context?: LogContext) => log('error', scope, message, context),
  }
}
