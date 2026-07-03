# OpsJam

This is the source code for the official [OpsJam website](https://hack.alugatuci.org). It is currently in development and not feature-complete
at this time.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## To-Do
- Currently, the API endpoints (`app/api`) as well as the controllers in the `services` folder do not have any logging functionally, which would make debugging more difficult for us should we run into any future issues. So we should implement such where possible in those areas

- Currently, error handling is not very well done, which is mostly me acting out of haste. So like there's little distinction between various error cases that can happen. Like all API endpoints currently return `500` even if it does not fit the actual error.

- Error reporting on the frontend is also not neatly done. Like for instance, an error in the mailing list, such as entering an already signed-up email, returns `Subscription failed: undefined. Please try again.`.

## Setup
Here are the environment variables you will need to put in a .env.local file in the root directory:

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY

NEXT_PUBLIC_ACCEPTING_APPS=1

SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
```

NEXT_PUBLIC_ACCEPTING_APPS is what allows us to disable applications ATM (both on the frontend and backend). Setting it to 0 will disable it.