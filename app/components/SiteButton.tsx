import Link from 'next/link'

type SiteButtonParameters = {
  className?: string,
  text: string,
  link: string
}

export function SiteButton({ text, link, className = 'applyButton secondaryButton' }: SiteButtonParameters) {
  return (
    <>
      <Link href={ link }>
        <button className= { className }>
          { text }
        </button>
      </Link>
    </>
  )
}