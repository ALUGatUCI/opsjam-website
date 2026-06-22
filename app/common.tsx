'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import './common.css'

export function NavButton({ text, link }) {
  const pathname = usePathname()
  const isCurrent = pathname === link

  return (
    <Link href={link}>
      <button className={isCurrent ? 'currentNavButton navButton' : 'navButton'}>
        {text}
      </button>
    </Link>
  )
}

export function NavBar() {
  return (
    <>
      <br/>
      <div className='navBar'>
        <NavButton text='Home' link='/'></NavButton>
        <NavButton text='Apply' link='/apply'></NavButton>
        <NavButton text='Tracks' link='/tracks'></NavButton>
      </div>
      <br/>
    </>
  )
}