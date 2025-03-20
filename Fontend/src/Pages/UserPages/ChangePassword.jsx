import React from 'react'

const ChangePassword = () => {
  return (
    <div className='w-full h-screen bg-black text-white'>
        <div className='max-w-screen-lg mx-auto p-4'>
          <h1 className='text-3xl text-center font-bold'>Change Password</h1>
          <form className='flex flex-col space-y-4 w-[60%] mx-auto mt-8'>
            <div className='flex flex-col'>
              <label htmlFor='current-password' className='text-lg'>Current Password</label>
              <input type='password' id='current-password' className='p-2 rounded-md border border-gray-500' />
            </div>
            <div className='flex flex-col'>
              <label htmlFor='new-password' className='text-lg'>New Password</label>
              <input type='password' id='new-password' className='p-2 rounded-md border border-gray-500' />
            </div>
            <div className='flex flex-col'>
              <label htmlFor='confirm-password' className='text-lg'>Confirm Password</label>
              <input type='password' id='confirm-password' className='p-2 rounded-md border border-gray-500' />
            </div>
            <button type='submit' className='bg-blue-500 text-white p-2 rounded-md'>Change Password</button>
          </form>

        </div>
    </div>
  )
}

export default ChangePassword