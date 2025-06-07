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
import ProblemPage from './pages/ProblemPage.jsx';
import { useThemeStore } from './store/useThemeStore.js';
import ViewAllSubmissions from './components/ViewAllSubmissions.jsx';

const App = () => {

  const { theme, toggleTheme } = useThemeStore();
  const { authenticatedUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  if(isCheckingAuth && !authenticatedUser) {
    return (
      <div className='flex items-center justify-center h-screen w-full'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  return (
    <>
      <div className={`dark:bg-[#18181b] ${theme} flex flex-col items-center justify-start w-full h-screen`}>
        <Toaster />
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={authenticatedUser ? <HomePage />: <Navigate to={"/login"} />} />
            <Route path='/problems' element={authenticatedUser ? <HomePage />: <Navigate to={"/login"} />} />
            <Route path='/login' element={!authenticatedUser ? <LoginPage /> : <Navigate to={"/"} /> } />
            <Route path='/signup' element={!authenticatedUser ? <SignupPage /> : <Navigate to={"/"} /> } /> 
            <Route path='/me' element={authenticatedUser ? <ProfilePage /> : <Navigate to={"/"} /> } />
            <Route path="/viewAllSubmissions" element={authenticatedUser ? <ViewAllSubmissions /> : <Navigate to={"/"} /> } />
            <Route path='/admin' element={<AdminPanelPage />}>
              <Route index element={<AdminPage />} />
              <Route path='/admin/addProblem' element={<AddProblemPage />} />
            </Route>
            <Route path='/problem/:id' element={<ProblemPage />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App