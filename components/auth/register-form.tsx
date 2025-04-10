'use client'
 
import { RegisterSchema } from "@/types/register-schema"
import { Form,FormControl, FormDescription, FormField,FormItem, FormLabel, FormMessage } from "../ui/form"
import * as z from "zod"
import { AuthCard } from "./auth-card"
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from "react-hook-form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAction } from "next-safe-action/hooks"
import { emailRegister } from "@/server/actions/email-register"
import { FormSuccess } from "./form-success"
import { FormError } from "./form-error"
export const RegisterForm = () =>{
    const form = useForm({
        //格式检查器
        resolver:zodResolver(RegisterSchema),
        //表格默认值
        defaultValues:{
            name:"",
            email:"",
            password:"",

        }
    })
const [error,setError] = useState("")
const [success,setSuccess] = useState("")
const {execute,status} =useAction(emailRegister,{
    onSuccess(data){
        if(data.data?.error) setError(data.data?.error)
        if(data.data?.success) setSuccess(data.data.success)
    },
})

    const onSubmit = (values:z.infer<typeof RegisterSchema>)=>{
        execute(values)
    }
    return(
        <AuthCard cardTitle="创建账户" 
            backButtonHref="/auth/login"
            backButtonLabel="已有账户？点此登录"
            showSocials>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                        <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                     <FormItem>
                       <FormLabel>名称</FormLabel>
                            <FormControl>
                                <Input 
                                {...field}
                                placeholder="请输入名称"
                                type="text"/>
                            </FormControl>
                            <FormDescription />
                            <FormMessage /> 
                    </FormItem>
                    )}
                    />

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
                            {"注册"}
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}