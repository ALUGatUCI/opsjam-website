import { NavBar } from '../../components/NavBar'
import './style.css'

export default function Tracks() {
  return (
    <>
      <h1>NOTICE: Tracks have not been finalized and are subject to change</h1>
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
          <h2>Orchestration</h2>
          <p>
            The beauty of systems is that they can do tasks for us, and that's what orchestration's
            about. So how can this beauty be furthered?
          </p>
        </div>

        <div className='track'>
          <h2>Monitoring</h2>
          <p>
            It's always important to be in the know for how well systems are doing. Is there a gap? Could
            information be more concise? What's a way to make monitoring better?
          </p>
        </div>
      </div>

      <h1>Sponsor Tracks</h1>
    </>
  )
}