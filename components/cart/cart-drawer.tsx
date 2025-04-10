'use client'
import { useCartStore } from "@/lib/client-store"
import {  ShoppingBag } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "../ui/drawer";
import { AnimatePresence,motion } from "framer-motion";
import CartItems from "./cart-items";
import { check } from "drizzle-orm/pg-core";
import CartMessage from "./cart-message";
import Payment from "./payment";
import OrderConfirmed from "./order-confirmed";
import PaymentNoStripe from "./payment-nostripe";

 
export default function CartDrawer(){
    const {cart,checkoutProgress,removeFromCart,cartOpen,setCartOpen,setCheckoutProgress} = useCartStore();
    return(
        <Drawer open={cartOpen} onOpenChange={setCartOpen}>
            <DrawerTrigger>
                <div className="relative px-2">
                    <AnimatePresence>
                        {cart.length > 0 && (
                            <motion.span 
                            animate={{scale:1,opacity:1}}
                            initial={{opacity:0,scale:0}} 
                            exit={{scale:0}}
                            className="absolute flex items-center justify-center -top-1 -right-0.5 w-4 h-4 dark:bg-primary bg-primary text-white text-xs font-bold rounded-full">
                                {cart.length}
                            </motion.span>
                         )} 
                    </AnimatePresence>
                </div>
                <ShoppingBag />
            </DrawerTrigger>
            <DrawerContent 
            className="fixed bottom-0 left-0 max-h-[70vh] min-h-[50vh] items-center">
                <DrawerHeader >
                    <CartMessage />
                </DrawerHeader>
                <div className="overflow-auto p-4">
                    {checkoutProgress === 'cart-page' && <CartItems />}
                    {checkoutProgress === 'payment-page' && <PaymentNoStripe />}
                    {checkoutProgress === 'confirmation-page' && <OrderConfirmed />}
                </div>
            </DrawerContent>
        </Drawer>
    )
}