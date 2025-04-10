'use client'

import { LoginSchema } from "@/types/login-schema"
import { Form,FormControl, FormDescription, FormField,FormItem, FormLabel, FormMessage } from "../ui/form"
import * as z from "zod"
import { AuthCard } from "./auth-card"
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from "react-hook-form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"
import { useReducer, useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { emailSignIn } from "@/server/actions/email-signin"
import { cn } from "@/lib/utils"
import { FormSuccess } from "./form-success"
import { FormError } from "./form-error"
import { useRouter } from "next/navigation"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"



export const LoginForm = () =>{
    const form = useForm<z.infer<typeof LoginSchema>>({
        //格式检查器
        resolver:zodResolver(LoginSchema),
        //表格默认值
        defaultValues:{
            email:"",
            password:"",
            code:"",

        }
    })
const [error,setError] = useState("")
const [success,setSuccess] =useState("")
const  [showTwoFactor,setShowTwoFactor] = useState(false)

const { execute,status } =  useAction(emailSignIn,{
    onSuccess(data){
        if(data.data?.error) setError(data.data?.error)
        if(data.data?.success) setSuccess(data.data?.success)  
        if(data.data?.twoFactor) setShowTwoFactor(true)
    },

})

    const onSubmit = (values:z.infer<typeof LoginSchema>)=>{
        execute(values)
    }
    return(
        <AuthCard 
            cardTitle="欢迎回来" 
            backButtonHref="/auth/register"
            backButtonLabel="创建新账户"
            showSocials>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            {showTwoFactor && (
                                <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                             <FormItem>
                               <FormLabel>
                                {" "}
                                双因素验证码已发送至邮箱
                                </FormLabel>
                                    <FormControl>
                                        <InputOTP 
                                        disabled = {status === 'executing'}
                                        {...field}
                                        maxLength={6}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0}/>
                                                <InputOTPSlot index={1}/>
                                                <InputOTPSlot index={2}/>
                                                <InputOTPSlot index={3}/>
                                                <InputOTPSlot index={4}/>
                                                <InputOTPSlot index={5}/>
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage /> 
                            </FormItem>
                            )}
                            /> 
                            )}
                    {! showTwoFactor && (
                    <>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                     <FormItem>
                       <FormLabel>邮箱</FormLabel>
                            <FormControl>
                                <Input 
                                {...field}
                                placeholder="XXX@xx.com"
                                type="email"
                                autoComplete="email"/>
                            </FormControl>
                            <FormDescription />
                            <FormMessage /> 
                    </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                     <FormItem>
                        <FormLabel>密码</FormLabel>
                            <FormControl>
                                <Input 
                                {...field}
                                placeholder="*********"
                                type="password"
                                autoComplete="current-password"/>
                            </FormControl>
                            <FormDescription />
                            <FormMessage /> 
                    </FormItem>
                    )}
                    />
                    </>)}
                    
                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button 
                    size={'sm'} 
                    className="px-0"
                    variant={"link"} asChild>
                        <Link href='/auth/reset'>忘记密码?</Link>
                    </Button>
                    </div>
                        <Button 
                            type="submit"
                            className={cn("w-full my-3",
                            status === "executing" ? "animate-pulse":"")}>
                                {showTwoFactor ? '验证' : '登入'}
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}