import Image from 'next/image'

import { NavBar } from '../components/NavBar'
import { MailingList } from '../components/MailingList'
import { SiteButton } from '../components/SiteButton'

export default function Home() {
  return (
    <>
      <Image width="400" height="250" alt="InfraJam Horizontal Logo" src="/infrajam-logo-horizontal.svg"></Image>
      <h2>January 16-17, 2027</h2>
      <p>
        An in-development <em style={{ color: '#6366f1' }}>infrastructure-focused hackathon</em> hosted at UC Irvine.
      </p>


      <p>
        The event brings together students across universities to build, break,
        and scale real infrastructure over a single weekend. And during that
        weekend, you will be able to attend workshops and join social events
        with other talented students.
      </p>

      <div className='horizontal'>
        {/* Comment out the apply button until apps open */}
        {/*<SiteButton text='Apply Today!å' link='/apply'></SiteButton>*/}
      </div>

      <h2>Be The First To Know!</h2>
      <p>
        Join our mailing list for updates and to be informed when
        applications open!
      </p>
      <MailingList />

      <h2>Thanks To Our Sponsors</h2>
      {/* This is for when we have actual sponsors to showcase */}
      <div className='horizontal sponsors'>

      </div>
      <SiteButton text='Interested in Sponsoring?' link='mailto:contact@alugatuci.org'></SiteButton>

      <h2>Brought To You By</h2>
      <div className="horizontal">
        <a href="https://alugatuci.org" target="_blank"><Image alt="ALUG@UCI" width="300" height="175" src="/alug-logo.png" /></a>
      </div>
    </>
  );
}
