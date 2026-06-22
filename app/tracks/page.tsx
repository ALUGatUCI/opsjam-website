import { NavBar } from '../common'
import './style.css'

export default function Tracks() {
  return (
    <>
      <NavBar></NavBar>
      <h1>Tracks</h1>

      <p>
        We offer several tracks where you can build the future of infrastructure! Below are a list of tracks
        where we will select a winner from each category.
      </p>

      <div className='horizontal'>
        <div className='track'>
          <h2>DevOps</h2>
          <p>
            Everyday, developers feel like there is at least one thing that could be improved about
            their process. So why not build something fixes an issue you face as a developer?
          </p>
        </div>

        <div className='track'>
          <h2>Sysadmin</h2>
          <p>
            Administrating systems can sometimes be a little... tedious, no? Maybe you can
            do something that brings it closer to seamless?
          </p>
        </div>

        <div className='track'>
          <h2>Networking</h2>
          <p>
            Networking is fascinating, but also can be a little intricate. So what's something that
            can make networking easier?
          </p>
        </div>
      </div>

      <h1>Sponsor Tracks</h1>
    </>
  )
}