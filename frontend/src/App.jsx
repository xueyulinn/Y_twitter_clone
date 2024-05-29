import { Route, Routes } from 'react-router-dom'
import RightPanel from './components/common/RightPanel.jsx'
import Sidebar from './components/common/SideBar.jsx'
import LoginPage from './pages/auth/login/loginPage.jsx'
import SignupPage from './pages/auth/signup/signupPage.jsx'
import HomePage from './pages/home/homePage.jsx'
import NotificationPage from './pages/notification/NotificationPage.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'


function App() {

  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/notifications' element={<NotificationPage />} />
        <Route path='/profile/:username' element={<ProfilePage />} />
      </Routes>
      <RightPanel />

    </div>
  );
}

export default App
