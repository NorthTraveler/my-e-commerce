'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
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
import { ProductSchema, zProductSchema } from "@/types/product-schema"
import { useForm } from "react-hook-form"
import { DollarSign, Wallet } from "lucide-react"
import Tiptap from "./tiptap"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { createProduct } from "@/server/actions/create-product"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { getProduct } from "@/server/actions/get-product"
import { useEffect } from "react"
export default function ProductForm(){
    const form = useForm<zProductSchema>({
        resolver:zodResolver(ProductSchema),
        defaultValues:{
            title:"",
            description:"",
            price:0,
        },
        mode:'onChange',
    })

    const router = useRouter()
    const searchParam = useSearchParams();
    const editMode = searchParam.get('id')

    const checkProduct = async(id:number) =>{
        if(editMode){
            const data = await getProduct(id)
            if(data.error){
                toast.error(data.error)
                router.push("/dashboard/products")
                return
            }
            if(data.success){
                const id = parseInt(editMode)
                form.setValue("title",data.success.title)
                form.setValue("description",data.success.description)
                form.setValue("price",data.success.price)
                form.setValue("id",id)
            }
        }
    }

    useEffect(() =>{
        if(editMode){
            checkProduct(parseInt(editMode))
        }
    },[])

    const {execute,status} = useAction(createProduct,{
        onSuccess:(data) => {
            if(data.data?.error){
                toast.error(data.data?.error)
             }
            if(data.data?.success){
               router.push("/dashboard/products")
               toast.success(data.data?.success)
            }
        },
        onExecute:(data) => {
            if(editMode){
                toast.loading("正在保存")
            }
            if(!editMode){
                toast.loading("正在创建")
            }
        },
    })

    async function onSubmit(values:zProductSchema) {
        execute(values)
    }
    return(
        <Card>
        <CardHeader>
          <CardTitle>{editMode ? <span>编辑产品</span> : <span>创建产品</span>}</CardTitle>
          <CardDescription>{editMode ? '改变现有产品' : "添加全新产品"}</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                <FormItem>
                <FormLabel>产品名</FormLabel>
                <FormControl>
                    <Input placeholder="产品" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
            />

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                <FormItem>
                <FormLabel>产品简介</FormLabel>
                <FormControl>
                    <Tiptap val = {field.value}/>
                </FormControl> 
                <FormMessage />
            </FormItem>
            )}
            />
            
            <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                <FormItem>
                <FormLabel>产品价格</FormLabel>
                <FormControl>
                    <div className=" flex items-center gap-2">
                        <Wallet size ={34} className="p-2 bg-muted rounded-md" />
                        <Input {...field} 
                        type="number" 
                        placeholder="价格"
                        step= "0.1" 
                        min={0} />
                    </div>
                </FormControl> 
                <FormMessage />
            </FormItem>
            )}
            />
            <Button 
            disabled={status === 'executing' || !form.formState.isValid || !form.formState.isDirty} 
            type="submit">
                {editMode ? '保存产品' : '创建产品'}
            </Button>
            </form>
        </Form>
        </CardContent>

      </Card>
    )
}