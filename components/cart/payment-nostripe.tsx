'use client'

import { useCartStore } from "@/lib/client-store"
import {motion} from "framer-motion"
import PaymentFormNoStripe from "./payment-form-nostripe";
export default function PaymentNoStripe(){
    const {cart} = useCartStore();
    const totalPrice = cart.reduce((acc, item) => {
        return acc + item.price * item.variant.quantity
    }, 0)
    return(
        <motion.div className="max-w-2xl mx-auto">
            <PaymentFormNoStripe totalPrice={totalPrice}/>
        </motion.div>
    )
}