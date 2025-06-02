import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';

import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import Layout from './layout/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import AdminPanelPage from './pages/AdminPanelPage.jsx';
import AddProblemPage from './pages/AddProblemPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

const App = () => {


  const { authenticatedUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  if(isCheckingAuth && !authenticatedUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  return (
    <>
      <div className='flex flex-col items-center justify-start w-full'>
        <Toaster />
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={authenticatedUser ? <HomePage />: <Navigate to={"/login"} />} />
            <Route path='/login' element={!authenticatedUser ? <LoginPage /> : <Navigate to={"/"} /> } />
            <Route path='/signup' element={!authenticatedUser ? <SignupPage /> : <Navigate to={"/"} /> } /> 
            <Route path='/user/:username' element={<ProfilePage />} />
            <Route path='/admin' element={<AdminPanelPage />}>
              <Route index element={<AdminPage />} />
              <Route path='/admin/addProblem' element={<AddProblemPage />} />
            </Route>
            </Route>
        </Routes>
      </div>
    </>
  )
}

export default App