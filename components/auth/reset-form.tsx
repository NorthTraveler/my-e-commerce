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
import { ResetSchema } from "@/types/reset-schema"
import { reset } from "@/server/actions/password-reset"
export const ResetForm = () =>{
    //z.infer用于规范范式，来保证属性
    const form = useForm<z.infer<typeof ResetSchema>>({
        //格式检查器
        resolver:zodResolver(ResetSchema),
        //表格默认值
        defaultValues:{
        }
    })
const [error,setError] = useState("")
const [success,setSuccess] =useState("")
const { execute,status } =  useAction(reset,{
    onSuccess(data){
        if(data.data?.error) setError(data.data?.error)
        if(data.data?.success) setSuccess(data.data?.success)  
    },
})

    const onSubmit = (values:z.infer<typeof ResetSchema>)=>{
       execute(values)
    }
    return(
        <AuthCard 
            cardTitle="忘记密码？" 
            backButtonHref="/auth/login"
            backButtonLabel="返回登陆"
            showSocials>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                    
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                     <FormItem>
                        <FormLabel>请输入邮箱</FormLabel>
                            <FormControl>
                                <Input 
                                {...field}
                                placeholder="598189208@qq.com"
                                type="email"
                                disabled ={status === "executing"}
                                autoComplete="email"/>
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