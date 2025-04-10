"use server"

import { createOrderSchema } from "@/types/order-schema"
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth"
import { orderProduct, orders } from "../schema"
import { db } from "@/src/db"
import { Dna } from "lucide-react"


const action = createSafeActionClient()

export const createOrder = action
  .schema(createOrderSchema)
  .action(async({parsedInput:{ products, status, total, paymentIntentID }}) => {
    const user = await auth()
    if (!user) return { error: "用户未找到 " }
    const order = await db
    .insert(orders)
    .values({
        status,
        paymentIntentID,
        total,
        userID: user.user.id,
      }).$returningId()
      const orderProducts = products.map(
        async ({ productID, quantity, variantID }) => {
          const newOrderProduct = await db
          .insert(orderProduct)
          .values({
            quantity:quantity ,
            orderID: order[0].id,
            productID: productID,
            productVariantID: variantID,
          }
          )}
      )


      return { success: "订单已成功添加" }
    }
  )
  