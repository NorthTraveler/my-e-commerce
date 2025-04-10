'use client'
import {motion} from "framer-motion"
import { useCartStore } from "@/lib/client-store"

export default function PaymentLocal(){
    const {cart} = useCartStore();
    const totalPrice = cart.reduce((acc, item) => {
        return acc + item.price * item.variant.quantity
    }, 0)
    return(
        <motion.div className="max-w-2xl mx-auto">
                    
        </motion.div>
    )
}