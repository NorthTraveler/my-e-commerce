'use client'

import { useCartStore } from "@/lib/client-store"
import { useState } from "react"
import { Button } from "../ui/button"
import { Minus, Plus } from "lucide-react"
import { toast } from "sonner"
import { title } from "process"
import { redirect, useSearchParams } from "next/navigation"
export default function AddCart(){
    const {addToCart} = useCartStore()
    const [quantity,setQuantity] = useState(1)
    const params = useSearchParams();
    const id = Number(params.get('id'))
    const productID = Number(params.get('productID'))
    const title = params.get('title')
    const type = params.get('type')
    const price =Number(params.get('price'))
    const image = params.get('image')

    if(!id || !productID || !title || !type || !price || !image){
        toast.error('产品未找到')
        return redirect('/')
    }

    return(
        <>
        <div className="flex items-center gap-4 justify-stretch my-4">
            <Button onClick={() => {
                if(quantity >1)
                    setQuantity(quantity-1)
                }} variant={'secondary'} className="text-primary">
                <Minus size={18} strokeWidth={3} />
            </Button>
            <Button className="flex-1">
                数量:{quantity}
            </Button>
            <Button onClick={() => {
                    setQuantity(quantity+1)
                }}
            variant={'secondary'} className="text-primary">
                <Plus size={18} strokeWidth={3} />
            </Button>
        </div>
        <Button onClick={()=>{
            toast.success(`已添加 ${title + ' ' + type }到购物车`)
            addToCart({
                id:productID,
                variant:{variantID:id,quantity},
                name:title+'  '+type,price,image})
        }}>加入购物车</Button>
        </>
    )
}