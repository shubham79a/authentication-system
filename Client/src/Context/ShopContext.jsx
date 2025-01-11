import axios from "axios"
import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"


export const ShopContext = createContext()


export const ShopContextProvoder = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggendIn] = useState(false)
    const [userData, setUserData] = useState(false)

    axios.defaults.withCredentials = true


    const getUserData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/user/data')
            if (response.data.success) {
                setUserData(response.data.userData)
            }
            else {
                toast.error(response.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth')
            if (data.success) {
                setIsLoggendIn(true);
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getAuthState()
    }, [])


    const value = {
        backendUrl, isLoggedIn, setIsLoggendIn,
        userData, setUserData, getUserData
    }

    return (
        <ShopContext.Provider value={value}>
            {
                props.children
            }

        </ShopContext.Provider>
    )
}