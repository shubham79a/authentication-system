import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import axios from 'axios'
import { ShopContext } from '../Context/ShopContext'
import { toast } from 'react-toastify'

function EmailVerify() {

  axios.defaults.withCredentials = true

  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(ShopContext)
  const navigate = useNavigate()
  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }


  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      const otpArray = inputRefs.current.map((e) => e.value)
      const otp = otpArray.join('')

      const response = await axios.post(backendUrl + '/api/auth/verify-account', { otp })

      if (response.data.success) {
        toast.success(response.data.message)
        getUserData()
        navigate('/')
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);

      toast.error(error.message)
    }
  }

  useEffect(() => {
    isLoggedIn && userData && userData.isVerfied && navigate('/')
  }, [isLoggedIn, userData])
  return (
    <div className=' flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the six digit code sent to your email id.</p>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>

          {
            Array(6).fill(0).map((_, index) => (
              <input
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={e => inputRefs.current[index] = e}
                className='w-12 h-12 bg-[#333A5C] text-white text-xl text-center rounded-md' type="text" maxLength='1' key={index} required />
            ))
          }

        </div>

        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
          Verify Email
        </button>

      </form>
    </div>
  )
}

export default EmailVerify