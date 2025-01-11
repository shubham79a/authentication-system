import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function Login() {
    const navigate = useNavigate()
    const { backendUrl, setIsLoggendIn, getUserData } = useContext(ShopContext)
    const [state, setState] = useState('Sign Up')

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {

            axios.defaults.withCredentials = true

            if (state === 'Sign Up') {
                const response = await axios.post(backendUrl + '/api/auth/register', { name, email, password })
                if (response.data.success) {
                    setIsLoggendIn(true);
                    getUserData()
                    navigate('/')
                    toast.success(response.data.message)
                }
                else {
                    // alert(response.data.message)
                    toast.error(response.data.message)
                }
            }
            else {
                const response = await axios.post(backendUrl + '/api/auth/login', { email, password })
                if (response.data.success) {
                    setIsLoggendIn(true);
                    getUserData()
                    navigate('/')
                    toast.success(response.data.message)
                }
                else {
                    // alert(response.data.message)
                    toast.error(response.data.message)
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }



    return (
        <div className=' flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to to-purple-400 '>
            <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>
                    {
                        state === 'Sign Up' ? 'Create account' : 'Login '
                    }
                </h2>
                <p className='text-center text-sm mb-6' >
                    {
                        state === 'Sign Up' ? 'Create your account' : 'Login to your account'
                    }
                </p>

                <form onSubmit={onSubmitHandler}>
                    {state === 'Sign Up' ?
                        <div className='flex mb-4 items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A56]'>
                            <img src={assets.person_icon} alt="" />
                            <input className='bg-transparent outline-none' type="text" placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} required />

                        </div>
                        :
                        null
                    }
                    <div className='flex mb-4 items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A56]'>
                        <img src={assets.mail_icon} alt="" />
                        <input className='bg-transparent outline-none' type="email" placeholder='Email Address' value={email} onChange={(e) => setEmail(e.target.value)} required />

                    </div>
                    <div className='flex mb-4 items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A56]'>
                        <img src={assets.lock_icon} alt="" />
                        <input className='bg-transparent outline-none' type="password" placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} required />

                    </div>
                    <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-600 cursor-pointer'>Forget Password?</p>

                    <button className='rounded-full w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>
                        {state}
                    </button>
                </form>
                {
                    state === 'Sign Up' ?
                        (
                            <p className='pt-2 text-center text-gray-400 text-xs mt-4'>
                                Already have an account?{"  "}
                                <span className='text-blue-400 underline cursor-pointer' onClick={() => setState('Login')}>Login Here</span>
                            </p>
                        )
                        :
                        (
                            <p className='pt-2 text-center text-gray-400 text-xs mt-4'>
                                Don't have an account?{"  "}
                                <span className='text-blue-400 underline cursor-pointer' onClick={() => setState('Sign Up')}>Sign Up Here</span>
                            </p>
                        )
                }



            </div>
        </div>
    )
}

export default Login