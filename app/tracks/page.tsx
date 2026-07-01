import Image from 'next/image'
import { JSX } from 'react/jsx-runtime'
import './style.css'

type prizeParameters = {
  track: string
  description: string
  prizeName: string
  prizeImage: JSX.Element
}

function Prize({ track, description, prizeName, prizeImage }: prizeParameters) {
  return (
    <>
      <div className='track'>
        <h2>{track}</h2>
        <p>{description}</p>

        <p className='prizeHint'>Hover to reveal prize</p>
        <div className='prizeReveal'>
          <h3 className='prizeCaption'>{prizeName}</h3>
          {prizeImage}
        </div>
      </div>
    </>
  )
}

export default function Tracks() {
  // DevOps info
  const devopsDesc: string = "Everyday, developers feel like there is at least one thing that could be improved about their process. So why not build something fixes an issue you face as a developer?"
  const devopsPrizeImage = <Image className='prizeImage' width="2493" height="1292" src="/prizes/system76_keyboard.jpg" alt="System76 Launch Heavy Keyboard"></Image>

  // Orchestration info
  const orchesDesc: string = "The beauty of systems is that they can do tasks for us, and that's what orchestration's about. So how can this beauty be furthered?"
  const orchesPrizeImage = <Image className='prizeImage' width="370" height="200" src="/prizes/framework_board.webp" alt="DeepComputing RISC-V Mainboard"></Image>

  // Monitoring info
  const monitorDesc: string = "It's always important to be in the know for how well systems are doing. Is there a gap? Could information be more concise? What's a way to make monitoring better?"
  const monitorPrizeImage = <Image className='prizeImage' width="370" height="200" src="/prizes/trmnl.webp" alt="TRMNL"></Image>

  return (
    <>
      <h1>NOTICE: Tracks have not been finalized and are subject to change</h1>
      <h1>Tracks</h1>

      <p>
        We offer several tracks where you can build the future of infrastructure! Below are a list of tracks
        where we will select a winner from each category.
      </p>

      <div className='horizontal'>
        <Prize
          track='DevOps'
          description={devopsDesc}
          prizeName='System76 Launch Heavy Keyboard'
          prizeImage={devopsPrizeImage}
        />

        <Prize
          track='Orchestration'
          description={orchesDesc}
          prizeName='DeepComputing RISC-V Mainboard'
          prizeImage={orchesPrizeImage}
        />

        <Prize
          track='Monitoring'
          description={monitorDesc}
          prizeName='TRMNL (X)'
          prizeImage={monitorPrizeImage}
        />
      </div>

      <h1>Sponsor Tracks</h1>
    </>
  )
}