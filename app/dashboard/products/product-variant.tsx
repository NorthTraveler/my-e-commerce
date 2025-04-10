'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
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
import { VariantsWithImagesTags } from "@/lib/infer-type"
import { VariantSchema } from "@/types/variant-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { InputTags } from "./input-tags"
import VariantImages from "./variants-images"
import { useAction } from "next-safe-action/hooks"
import { createVariant } from "@/server/actions/create-variant"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { url } from "inspector"
import { deleteVariant } from "@/server/actions/delete-variant"

export const ProductVariant=({
    children,
    editMode,
    productID,
    variant,
    }: {
    children:React.ReactNode
    editMode:boolean
    productID?:number
    variant?:VariantsWithImagesTags
    
    }) => {
        const form = useForm<z.infer<typeof VariantSchema>>({
            resolver:zodResolver(VariantSchema),
            defaultValues:{
                tags:[],
                variantImages:[],
                color:'#000000',
                editMode,
                id:undefined,
                productID,
                productType:'请输入产品类型'
            },
        })

    const [open,setOpen] = useState(false)
    const setEdit = () => {
        if(!editMode){
            form.reset()
            return
        }
        if(editMode && variant){
            form.setValue('editMode',true)
            form.setValue('id',variant.id)
            form.setValue('productID',variant.productID)
            form.setValue('productType',variant.productType)
            form.setValue("tags",variant.variantTags.map((tag) =>tag.tag))
            form.setValue('variantImages',variant.variantImages.map((img) =>({
                name:img.name,
                size:img.size,
                url:img.url,
            })))
        }
    }

    useEffect(() =>{
        setEdit()
    },[])
    const {execute,status} = useAction(createVariant,{
        onExecute(){
            toast.loading("正在创建变体", {duration:500})
        },
        onSuccess(data){
            if(data.data?.error){
                toast.error(data.data?.error)
            }
            if(data.data?.success){
                toast.success(data.data?.success)
            }
        },
    })

    const variantAction = useAction(deleteVariant,{
        onExecute(){
            toast.loading("删除变体中",{duration:500})
            setOpen(false)
        },
        onSuccess(data){
            if(data.data?.error){
                toast.error(data.data.error)
            }
            if(data.data?.success){
                toast.success(data.data.success)
            }
        }
    })
    
    function onSubmit(values:z.infer<typeof VariantSchema>){
        execute(values)
    }

    // function onSubmit(values:any){
    //     execute(values)
    // }
    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            {/* 此处用于调节窗口高度，并给与上下滑动 */}
            <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[640px]">
                <DialogHeader>
                    <DialogTitle>{editMode ? "编辑": "创建"}产品变体</DialogTitle>
                    <DialogDescription>
                    简介
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-4">
                    <FormField
                        control={form.control}
                        name="productType"
                        render={({ field }) => (
                    <FormItem>
                        <FormLabel>产品名称</FormLabel>
                        <FormControl>
                            <Input placeholder="为你的产品进行命名" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}/>

                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                    <FormItem>
                        <FormLabel>产品颜色</FormLabel>
                        <FormControl>
                            <Input type="color" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}/>

                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                    <FormItem>
                        <FormLabel>产品标签</FormLabel>
                        <FormControl>
                            <InputTags
                            {...field}
                            onChange={(e) => field.onChange(e)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}/>

                    <VariantImages /> 
                    <div className="flex gap-4 item-center justify-center">
                        {editMode && variant && (
                        <Button variant={"destructive"} 
                        type="button" 
                        onClick={(e) => {e.preventDefault();
                        variantAction.execute({id:variant.id})} }>
                            删除产品分支
                        </Button>
                    )}
                    <Button  type="submit">
                        {editMode ? "更新产品分支" : "创建产品分支"}
                    </Button>
                    </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

ProductVariant.displayName = "ProductVariant"
