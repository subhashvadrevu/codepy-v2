import { Button } from '@/components/ui/button'
import React from 'react'

const AdminPage = () => {
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center space-y-4'>
        <Button>Add Problem</Button>
        <Button>Update Problem</Button>
        <Button>Delete Problem</Button>
    </div>
  )
}

export default AdminPage