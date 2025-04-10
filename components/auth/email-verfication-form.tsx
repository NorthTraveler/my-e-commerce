'use client'

import { newVerification } from "@/server/actions/tokens"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useCallback, useDebugValue, useEffect, useState } from "react"
import { AuthCard } from "./auth-card"
import { FormSuccess } from "./form-success"
import { FormError } from "./form-error"

export const EmailVerificationForm =() =>{
    //在client中可以使用useSearchParams，用于获取URL中数据
    const  token = useSearchParams().get("token")
    const router = useRouter()
    const [error,setError] = useState('')
    const [success,setSuccess] = useState('')
    //包装入useCallback，来保证仅运行一次或者当依赖
    const handleVerification = useCallback(() =>
    { 
        if(success || error) return
        if(!token){
            setError('未找到Token')
            return
        }
        newVerification(token).then((data) =>{
            if(data.error){
                setError(data.error)
            }
            if(data.success){
                setSuccess(data.success)
                router.push('/auth/login')
            }
        })},[])
    useEffect(() =>{
        handleVerification()
    },[])

    return (
        <AuthCard 
            backButtonLabel="返回登录"
            backButtonHref="/auth/login"
            cardTitle="验证账户"  
            showSocials
        >
        <div className="flex items-center flex-col w-full justify-center ">
            <p>{!success && !error ? 'Verifying email...':null}</p>
            <FormSuccess message={success} />
            <FormError message={error} />
        </div>
        </AuthCard>
    )
}