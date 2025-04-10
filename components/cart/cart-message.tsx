'use client'

import { useCartStore } from "@/lib/client-store"
import {motion} from 'framer-motion'
import { DrawerDescription, DrawerTitle } from "../ui/drawer"
import { ArrowLeft } from "lucide-react"
export default function CartMessage(){
    const {checkoutProgress,setCheckoutProgress} = useCartStore()
    return (
        <motion.div 
        className="text-center"
        animate={{opacity:1,x:0}}
        initial={{opacity:0,x:10}}

        >
            <DrawerTitle>
                {checkoutProgress === 'cart-page' ? '你的购物车' : null}
                {checkoutProgress === 'payment-page' ? '选择一种付款方式' : null}
                {checkoutProgress === 'confirmation-page' ? '订单验证' : null}
            </DrawerTitle>
            <DrawerDescription className="py-1"> 
            {checkoutProgress === 'cart-page' ? '查看并编辑你的购物车' : null}
            {checkoutProgress === 'payment-page' ? 
            <span
            onClick={() => setCheckoutProgress('cart-page')}
            className="flex items-center justify-center gap-1 cursor-pointer hover:text-primary">
                <ArrowLeft size={14} /> 回到购物车 
            </span> : null}
            {checkoutProgress === 'confirmation-page' ? '你会收到一封包含收据的邮件' : null}
            </DrawerDescription>

        </motion.div>
    )
}