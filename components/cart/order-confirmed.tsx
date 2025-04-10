'use client'

import Link from "next/link"
import { Button } from "../ui/button"
import { useCartStore } from "@/lib/client-store"
import Lottie from "lottie-react"
import {motion} from 'framer-motion'
import orederConfirmed from '@/public/order-confirmed.json'
export default function OrderConfirmed(){
    const {setCheckoutProgress,setCartOpen} = useCartStore()
    return(
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-medium">
                感谢您的惠顾！
            </h2>
            <Link href={"/dashboard/orders"}>
                <Button 
                onClick={() => {
                    setCheckoutProgress("cart-page")
                    setCartOpen(false)
                }}>
                    查看订单
                </Button>
            </Link>
            <motion.div 
            animate={{opacity:1,scale:0}} 
            initial={{opacity:0,scale:0}}
            transition={{delay:0.35}}>
                <Lottie 
                className="h-48 my-4" 
                animationData={orederConfirmed} />
            </motion.div>
            <h2 className="text-2xl font-medium" >
                感谢您的惠顾！
            </h2>
            <Button
            
                onClick={() => {
                    setCheckoutProgress('cart-page')
                    setCartOpen(false)
                }}>
                    查看你的订单
                </Button>
        </div>
    )
}