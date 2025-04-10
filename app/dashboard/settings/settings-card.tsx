'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Session } from "next-auth"
import { SettingsSchema } from "@/types/settings-schema"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { settings } from "@/server/actions/settings"
import { UploadButton } from "@/app/api/uploadthing/upload"
import { OurFileRouter } from "@/app/api/uploadthing/core"



//用于解决得到的不仅session的问题，
type SettingsForm = {
    session:Session
}

export default function SettingsCard(session:SettingsForm){
    const [error,setError] = useState<string|undefined>(undefined)
    const [success,setSuccess] = useState<string | undefined>(undefined)
    const [avatarUploading,setAvatarUploading] = useState(false)
    console.log(session.session)

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver:zodResolver(SettingsSchema),
        defaultValues:{
            password:undefined,
            newPassword:undefined,
            name:session.session.user?.name || undefined,
            email:session.session.user?.email || undefined,
            image:session.session.user?.image || undefined,
            isTwoFactorEnabled:session.session?.user?.isTwoFactorEnabled || undefined,
        }
    })
    const {execute, status} = useAction(settings,{

        onSuccess:(data) => {
            if(data?.data?.success) setSuccess(data?.data.success)
            if(data?.data?.error) setError (data?.data.error)
            setSuccess("已成功更新")
        },
        onError:(error) =>{
            setError ('Settings发生错误')
        }
    })

    const onSubmit = (values:z.infer<typeof SettingsSchema>) =>{
        execute(values)
    }
    return(
        <Card>
            <CardHeader>
                <CardTitle>个人信息</CardTitle>
                <CardDescription>此处为个人信息页面</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>名称</FormLabel>
                                <FormControl>
                                    <Input 
                                    placeholder="请输入想展示的名称" 
                                    disabled={status === "executing" } 
                                    {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}/>
                    
                    <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>头像</FormLabel>
                                <div className="flex">
                                    {!form.getValues('image') && (
                                        <div className="font-bold">
                                            {session.session.user?.name?.charAt(0)}
                                        </div>
                                    )}
                                    {form.getValues('image') && (
                                        <Image
                                        className="rounded-full"
                                        src={form.getValues("image")!}
                                        width={42}
                                        height={42}
                                        alt="用户图像"
                                        />
                                        )}
                                        <UploadButton
                                        className="scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"
                                        endpoint ="imageUploader" 
                                        onUploadBegin={() =>{
                                            setAvatarUploading(true)
                                        }}
                                        onUploadError={(error) => {
                                            form.setError('image',{
                                                type:'validate',
                                                message:error.message
                                            })
                                            setAvatarUploading(false)
                                            return 
                                        }}
                                        onClientUploadComplete={(res) => {
                                            form.setValue('image',res[0].url!)
                                            setAvatarUploading(false)
                                            return
                                        }}
                                        content={{button({ready}){
                                            if (ready) return <div> 上传用户图像 </div>
                                            return <div> 上传中...</div>
                                        },
                                    }} 
                                        />


                                </div>
                                <FormControl>
                                    <Input 
                                    placeholder="君の名字" 
                                    type="hidden"
                                    disabled={status === "executing" } 
                                    {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}/>

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>密码</FormLabel>
                                <FormControl>
                                    <Input 
                                    placeholder="*********" 
                                    disabled={status === "executing" } 
                                    {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}/>

                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>新密码</FormLabel>
                                <FormControl>
                                    <Input 
                                    placeholder="*********" 
                                    disabled={status === "executing" || session.session.user.isOAuth === true } 
                                    {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}/>

                        <FormField
                            control={form.control}
                            name="isTwoFactorEnabled"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>双因素验证</FormLabel>
                                <FormDescription>
                                    为你的账户采用双因素验证
                                </FormDescription>
                                <FormControl>
                                    <Switch 
                                    disabled={
                                        status === 'executing' 
                                        || session.session.user.isOAuth === true
                                        } 
                                    checked = {field.value}
                                    onCheckedChange={field.onChange}
                                        />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}/>
                
                <FormError message={error}/>
                <FormSuccess message={success}/>
                <Button disabled={status === "executing"}>
                    更新信息
                </Button>
                </form>
                </Form>
            </CardContent>
            <CardFooter>
                
            </CardFooter>
        </Card>

    )
}