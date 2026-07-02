'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import './navbar.css'

type NavButtonProps = {
  text: string
  link: string
  imageSrc?: string // when set, render this image instead of the text
}

export function NavButton(props: NavButtonProps) {
  const pathname = usePathname()
  const isCurrent = pathname === props.link

  const classes = ['navButton']
  if (isCurrent) classes.push('currentNavButton')
  if (props.imageSrc) classes.push('logoButton')

  return (
    <Link href={props.link}>
      <button className={classes.join(' ')}>
        {props.imageSrc ? (
          <Image
            src={props.imageSrc}
            alt={props.text}
            width={72}
            height={72}
            className="navLogo"
          />
        ) : (
          props.text
        )}
      </button>
    </Link>
  )
}

export function NavBar() {
  return (
    <>
      <div className='navBar'>
        <NavButton text='Home' link='/' imageSrc='/infrajam-logo.svg'></NavButton>
        <div className='navBarScroll'>
          <NavButton text='Apply' link='/apply'></NavButton>
          <NavButton text='Tracks' link='/tracks'></NavButton>
          <NavButton text='Team' link='/team'></NavButton>
        </div>
      </div>
      <br/>
    </>
  )
}