import { Outlet } from 'react-router-dom'
import { NavBar } from '../NavBar/NavBar'
import { ChatButton } from '../Buttons/ChatButton'


const Home = () => {
  return (
    <>
      <NavBar/>
      <section className='section'>
        <Outlet/>
      </section>
      <div className='chatButtonContainer'>
        <ChatButton/>        
      </div>
    </>
  )
}

export default Home