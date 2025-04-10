"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useAction } from "next-safe-action/hooks"

import { toast } from "sonner"
import { error } from "console"
import Link from "next/link"
import { VariantsWithImagesTags } from "@/lib/infer-type"
import {ProductVariant} from "./product-variant"
import { deleteProduct } from "@/server/actions/delete-product"

type ProductColumn = {
    title:string
    price:number
    image:string
    variants:VariantsWithImagesTags[]
    id:number
}

// async function deletProductWrapper(id:number) {
//     const data = await deletProduct({id})
//     if(!data){
//         return new Error("未找到数据")
//     }
//     if(data.data?.success){
//         toast.success(data.data.success)
//     }
//     if(data.data?.error){
//         toast.error(data.data.error)
//     }
// }

const ActionCell =({row}:{row:Row<ProductColumn>}) => {
const {execute,status} = useAction(deleteProduct,{
    onSuccess:(data) => {
        if(data.data?.success){
            toast.success(data.data.success)
        }
        if(data.data?.error){
            toast.error(data.data.error)
        }
    },
    onExecute:() =>{
        toast.loading("删除产品中")
    },
})
    const product = row.original
    // console.log(product)
    return(
        <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'ghost'} className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem 
                        className="dark:focus:bg-primary
                        focus:bg-primary/50 cursor-pointer">
                            <Link href={`/dashboard/add-product?id=${product.id}`}>
                                编辑产品
                                </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                        // onClick={() => deletProductWrapper(product.id)}
                        onClick={() => execute({id:product.id})}
                        className="dark:focus:bg-destructive 
                        focus:bg-destructive/50 cursor-pointer">
                            删除产品
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
    )
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey:'id',
        header:'ID',
    },
    {
        accessorKey:'title',
        header:'标题',
    },
    {
        accessorKey:'variants',
        header:'种类',
        cell:({row}) => {
            const variants = row.getValue('variants') as VariantsWithImagesTags[]
            return(
                <div  className="flex gap-2">
                    {variants.map((variant) => (
                        <div key={variant.id}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ProductVariant 
                                        productID={variant.productID} 
                                        variant={variant}
                                        editMode={true} >
                                            <div 
                                            className="w-5 h-5 rounded-full" 
                                            key={variant.id} 
                                            style={{background:variant.color}}/>
                                        </ProductVariant>
                                    </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{variant.productType}</p>
                                        </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    ))}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span>
                                        <ProductVariant productID={row.original.id} editMode={false}>
                                            <PlusCircle className="w-5 h-5"/>
                                        </ProductVariant>
                                    </span>
                                    </TooltipTrigger>
                                <TooltipContent>
                                    <p>创建新产品</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                </div>
            )},},
    {   
        accessorKey:'price',
        header:'价格',
        cell:({row}) =>{
            const price =parseFloat( row.getValue('price'));
            const formatted = new Intl.NumberFormat('zh-CH', {
                currency:'RMB',
                style:"currency"
            }).format(price)
            return (<div className="font-medium text-xs">
                {formatted}
            </div>)
        }
    },
    {
        accessorKey:'image',
        header:'图像',
        cell:({row}) =>{
            const cellImage = row.getValue("image") as string
            const cellTitle = row.getValue("title") as string
            return(
                <div className="">
                    <Image 
                    src={cellImage} 
                    alt={cellTitle} 
                    width={50} 
                    height={50}
                    className="rounded-md"/>
                </div>
            )
        }
    },
    {
        id:"action",
        header:'操作',
        cell:ActionCell
        } 
]

