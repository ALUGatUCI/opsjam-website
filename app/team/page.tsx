"use client"

import Image from 'next/image'
import './style.css'

type teamMemberParams = {
  name: string
  role: string
  imageSrc: string
  linkedin: string | null
}

function TeamMember({ name, role, imageSrc, linkedin }: teamMemberParams) {
  return (
    <div className='teamMember'>
      <Image className='teamPhoto' alt={name} width='300' height='225' src={imageSrc}></Image>
      <div className='teamInfo'>
        <div className='teamText'>
          <h2>{name}</h2>
          <h3>{role}</h3>
        </div>
        {linkedin && <a className='teamLinkedin' target="_blank" href={linkedin}><Image alt='LinkedIn' width='20' height='20' src='/logos/linkedin.svg'></Image></a>}
      </div>
    </div>
  )
}

export default function Team() {
  return (
    <>
      <h1>Meet the Team</h1>

      <div className='teamGrid'>
        <TeamMember
          name='Chris Rios'
          role='Lead Organizer'
          imageSrc='/team/chris_r.jpg'
          linkedin='https://www.linkedin.com/in/chris-rios-46898b381/'
        />
        <TeamMember
          name='Mark Valkin'
          role='Logistics'
          imageSrc='/team/mark_v.jpg'
          linkedin='https://www.linkedin.com/in/mark-valkin-b673772a6/'
        />
        <TeamMember
          name='Burhan Shahid'
          role='Logistics'
          imageSrc='/team/burhan_s.png'
          linkedin='https://www.linkedin.com/in/burhanshahid75/'
        />
        <TeamMember
          name='Albert Duong'
          role='Treasurer'
          imageSrc='/team/albert_t.jpg'
          linkedin='https://www.linkedin.com/in/alberttduong/'
        />
        <TeamMember
          name='Yizhe Lan (James)'
          role='Website Maintainer'
          imageSrc='/team/yizhie_l.jpg'
          linkedin='https://www.linkedin.com/in/yizhe-lan-james-1552b9377'
        />
        <TeamMember
          name='Navaneeth Sujith'
          role='Website Maintainer'
          imageSrc='/team/navaneeth_s.jpg'
          linkedin='https://www.linkedin.com/in/navaneethsujith/'
        />
        <TeamMember
          name='Akilan Paramasivam'
          role='Website Maintainer'
          imageSrc='/team/akilan_p.jpeg'
          linkedin='https://www.linkedin.com/in/akilan-paramasivam-uc-irvine/'
        />
        <TeamMember
          name='Abhinav Kumar'
          role='Website Maintainer'
          imageSrc='/team/abhinav_k.jpg'
          linkedin={null}
        />
      </div>
    </>
  )
}