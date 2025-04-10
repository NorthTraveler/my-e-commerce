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
import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { emailSignIn } from "@/server/actions/email-signin"
import { cn } from "@/lib/utils"
import { FormSuccess } from "./form-success"
import { FormError } from "./form-error"
import { NewPasswordSchema } from "@/types/new-password-schema"
import { newPassword } from "@/server/actions/new-password"
import { useSearchParams } from "next/navigation"
export const NewPasswordForm = () =>{
    //z.infer用于规范范式，来保证属性
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        //格式检查器
        resolver:zodResolver(NewPasswordSchema),
        //表格默认值
        defaultValues:{
            password:"",

        }
    })
const searchParams = useSearchParams();
const token = searchParams.get('token');
const [error,setError] = useState("")
const [success,setSuccess] =useState("")
const { execute,status } =  useAction(newPassword,{
    onSuccess(data){
        if(data.data?.error) setError(data.data?.error)
        if(data.data?.success) setSuccess(data.data?.success)  
    },
})

    const onSubmit = (values:z.infer<typeof NewPasswordSchema>)=>{
       execute({password:values.password,token})
    }
    return(
        <AuthCard 
            cardTitle="输入新密码" 
            backButtonHref="/auth/login"
            backButtonLabel="返回登陆"
            showSocials>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                    
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
                                disabled = {status === 'executing'}
                                autoComplete="current-password"/>
                            </FormControl>
                            <FormDescription />
                            <FormMessage /> 
                    </FormItem>
                    )}
                    />
                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button size={'sm'} variant={"link"} asChild>
                        <Link href='/auth/reset'>忘记密码?</Link>
                    </Button>
                    </div>
                        <Button 
                            type="submit"
                            className={cn("w-full",
                            status === "executing" ? "animate-pulse":"")}>
                                {"重置密码"}
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}