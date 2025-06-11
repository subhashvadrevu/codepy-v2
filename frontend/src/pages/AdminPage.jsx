import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore';
import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminPage = () => {

  const navigate = useNavigate();
  const { authenticatedUser } = useAuthStore();

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center space-y-4'>
        <Button onClick={() => {authenticatedUser && authenticatedUser.isVerified && authenticatedUser.role == "ADMIN" ? navigate("/admin/addProblem") : "" }} >Add Problem</Button>
        <Button onClick={() => {authenticatedUser && authenticatedUser.isVerified && authenticatedUser.role == "ADMIN" ? navigate("/admin/deleteProblem") : "" }}>Delete Problem</Button>
    </div>
  )
}

export default AdminPage