'use client'

import { Button } from "@/components/ui/button"

import { useCartStore } from "@/lib/client-store"
import { createLocalOrder } from "@/server/actions/create-local-orders"
import { createOrder } from "@/server/actions/create-orders";
import { createPaymentIntent } from "@/server/actions/create-payment-intent";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation"
import { useState } from "react";
import { useForm } from "react-hook-form"
import { toast } from "sonner";


export default function PaymentFormNoStripe({totalPrice}:{totalPrice:number}){
    const [province,setProvince] = useState("")
    const [city,setCity] = useState("")
    const [destination,setDestination] = useState("")
    const {cart,setCheckoutProgress, clearCart, setCartOpen} = useCartStore();
    const [isLoading,setIsLoading] = useState(false);
    const [errorMessage,setErrorMessage] = useState('')
    const router = useRouter()
    const {execute} = useAction(createLocalOrder,{
        onSuccess:(data) =>{
            if(data.data?.error){
                toast.error(data.data.error)
            }
            if(data.data?.success){
                setIsLoading(false)
                toast.success(data.data.success)
                setCheckoutProgress("confirmation-page")
                clearCart()
            }
        }
    })
    const handleSubmit = async(e:React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const data = await createPaymentIntent({
            amount: totalPrice * 100,
            currency: "usd",
            cart: cart.map((item) => ({
              quantity: item.variant.quantity,
              productID: item.id,
              title: item.name,
              price: item.price,
              image: item.image,
            })),
          })
          if (data?.data?.error) {
            setErrorMessage(data?.data.error)
            setIsLoading(false)
            router.push("/auth/login")
            setCartOpen(false)
            return }
        if (data?.data?.success) {
            setIsLoading(false)
            const address = province+city+destination
            execute({
                status: "pending",
                paymentIntentID: data.data.success.paymentIntentID,
                total: totalPrice,
                destination:address,
                products: cart.map((item) => ({
                  productID: item.id,
                  variantID: item.variant.variantID,
                  quantity: item.variant.quantity,
                })),
              })
        }
    }

    return (
        <form onSubmit={handleSubmit}>   
        <div className="bg-white shadow-md rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">请输入地址信息</h2>
        <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" >省份</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="province" type="text" placeholder="省份" value={province}
            onChange={(e:any) => setProvince(e.target.value)}/>
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" >城市</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="city" type="text" placeholder="城市" value={city}
            onChange={(e:any) => setCity(e.target.value)}/>
        </div>
        <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" >详细地址</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="address" type="text" placeholder="详细地址" value={destination}
            onChange={(e:any) => setDestination(e.target.value)}/>
        </div>
    </div>


        <Button
        className="my-4  w-full"
        disabled={ isLoading}
      >
        {isLoading ? "Processing..." : "Pay now"}
      </Button>
      </form>
    )
}