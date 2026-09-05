import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Projects from './Projects'
import { Navigate, Outlet } from 'react-router-dom'
const API_URL=import.meta.env.VITE_API_URL || 'http://localhost:4000'
function Dashboard() {
      const [user,setUser] = useState(null)
    const [status,setStatus] = useState('loading')
    useEffect(()=>{
        let isMounted =true
        async function checkSession() {
            try {
                const response = await fetch(`${API_URL}/api/auth/me`,{
                    credentials:'include'
                })
                if(!isMounted){
                    return
                }
                if(!response.ok){
                    setStatus("unauthenticated")
                    return
                }
                const data = await response.json()
                setUser(data.user)
                setStatus("authenticated")
            } catch (error) {
                if(isMounted){
                    setStatus("error")
                }
            }
        }
        checkSession()
        return()=>{
            isMounted=false
        }
    },[])
    if(status=="loading"){
        return(
        <div className="grid min-h-screen place-items-center bg-[#141414] text-white">
            Checking your session...
        </div>
        )
    }
    if(status==="unauthenticated"){
        return <Navigate to="/login" replace />
    }
    if(status==="error"){
        return(
            <div className='grid min-h-screen place-items-center bg-[#141414] text-white'>
                Could not reach Kindly Deploy. Please try again later.
            </div>
        )
    }
  

  return (
    <div className="flex min-h-screen bg-[#141414]">
      <Sidebar user={user} />

      <main className="flex-1 p-6 text-white">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard
