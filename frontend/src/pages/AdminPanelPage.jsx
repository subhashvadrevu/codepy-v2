import { useAuthStore } from '@/store/useAuthStore'
import { Loader } from 'lucide-react';
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const AdminPanelPage = () => {
    
    const { authenticatedUser, isCheckingAuth } = useAuthStore();

    if(isCheckingAuth) {
        return <div className='flex items-center justify-center h-screen'>
            <Loader className='size-10 animate-spin' />
        </div>
    }

    if(!authenticatedUser || sessionStorage.getItem("role") !== "ADMIN") {
        return <Navigate to="/" />
    }

    return <Outlet />
}

export default AdminPanelPage