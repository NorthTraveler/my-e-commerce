
'use client'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useCartStore } from "@/lib/client-store"
import formatPrice from "@/lib/format-price"
import { MinusCircle, PlusCircle } from "lucide-react"
import Image from "next/image"
import { useMemo } from "react"
import {AnimatePresence, delay, motion} from 'framer-motion'
import Lottie from 'lottie-react'
import emptyCart from '@/public/empty-box.json'
import { createId } from "@paralleldrive/cuid2"
import { Button } from "../ui/button"

export default function CartItems(){
    const {cart,addToCart,removeFromCart,setCheckoutProgress} = useCartStore()
    const totalPrice = useMemo(() => {
        return cart.reduce((acc,item) => {
            return acc + item.price! * item.variant.quantity
        },0)
    },[cart])
    const priceInLetters = useMemo(() => {
        return [...totalPrice.toFixed(2).toString()].map((letter) => {
            return {letter,id:createId() }
        })
    },[totalPrice])
    return (
        <motion.div  className="flex flex-col items-center">
            {cart.length === 0 && (
                <div className="flex-col w-full flex items-center justify-center">
                    <motion.div
                    animate={{ opacity:1 }}
                    initial={{ opacity:0 }}
                    transition={{ delay: 0.3,duration:0.5}} >
                    
                        <h2 className="text-2xl text-muted-foreground text-center items-center">
                            购物车暂时是空的
                        </h2>
                        <Lottie className="h-64" animationData={emptyCart}/>
                    </motion.div>
                </div>
            )}
            {cart.length > 0 && (
                <div className="max-h-80 w-full overflow-y-auto">
                    <Table className="max-w-2xl mx-auto">
                        <TableHeader>
                            <TableRow>
                                <TableCell>产品</TableCell>
                                <TableCell>价格</TableCell>
                                <TableCell>数量</TableCell>
                                <TableCell>总计</TableCell>
                            </TableRow> 
                        </TableHeader>
                        <TableBody>
                            {cart.map((item) => (
                                <TableRow key={(item.id + item.variant.variantID)}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{formatPrice(item.price)}</TableCell>
                                    <TableCell>
                                        <div>
                                            <Image
                                            className="rounded-md"
                                            width={48} 
                                            height={48} 
                                            src={item.image} 
                                            alt={item.name} priority/>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-between gap-2">
                                            <MinusCircle 
                                            onClick={() => {
                                                removeFromCart({
                                                    ...item,variant:{
                                                        quantity:1,
                                                        variantID:item.variant.variantID,
                                                    }
                                                })
                                            }}
                                            size={14} />
                                            <p className="text-md font-bold">{item.variant.quantity}</p>
                                            <PlusCircle 
                                            className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                                            onClick={() => {
                                                addToCart({
                                                    ...item,variant:{
                                                        quantity:1,
                                                        variantID:item.variant.variantID,}
                                                })
                                            }} 
                                            size={14} />
                                        </div>   
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            <motion.div className="flex items-center justify-center relative overflow-hidden my-4 ">
                <span className="text-md">总计：￥</span>
                <AnimatePresence mode="popLayout">
                    {priceInLetters.map((letter,i) => (
                        <motion.div key = {letter.id}>
                            <motion.span 
                            initial={{y:20}} 
                            animate={{y:0}} 
                            exit={{y:-20}}
                            transition={{delay:i*0.1}}
                            className="text-md inline-block"
                            >
                                {letter.letter}
                            </motion.span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            <Button 
            onClick={() => {
                setCheckoutProgress("payment-page")
            }}
            disabled={cart.length === 0} 
            className="max-w-md w-full">
                结账
            </Button>
        </motion.div>
    )
}