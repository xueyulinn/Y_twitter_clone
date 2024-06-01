import { Navigate, Route, Routes } from 'react-router-dom'


import { useQuery } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import LoadingSpinner from './components/common/LoadingSpinner.jsx'
import RightPanel from './components/common/RightPanel.jsx'
import Sidebar from './components/common/SideBar.jsx'
import LoginPage from './pages/auth/login/loginPage.jsx'
import SignupPage from './pages/auth/signup/signupPage.jsx'
import HomePage from './pages/home/homePage.jsx'
import NotificationPage from './pages/notification/NotificationPage.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'



function App() {

  const { isPending, data } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me');

        // when logout the server will return a 401 status code
        // and data will be null thus navigate to login page
        if (res.status === 401) {
          return null;
        }

        // if the there's no token in the cookie
        // the server will return a 401 status code 
        if (!res.ok) {
          throw new Error('Unauthorized User');
        }

        const data = await res.json();

        return data;

      } catch (error) {
        console.error(error.message);
        throw new Error('Unauthorized User');
      }
    },
    retry: 1,
  });

  if (isPending) {
    return (
      <div className='h-screen flex justify-center items-center '>
        <LoadingSpinner />
      </div>
    )
  }


  return (
    <div className='flex max-w-6xl mx-auto'>
      {data && <Sidebar />}
      <Routes>
        <Route path='/' element={data ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!data ? <SignupPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!data ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/notifications' element={data ? <NotificationPage /> : <Navigate to="/login" />} />
        <Route path='/profile/:userName' element={data ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      {data && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App
