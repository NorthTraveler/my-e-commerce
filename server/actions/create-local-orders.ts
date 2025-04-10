"use server"


import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth"
import { orderProduct, localorders } from "../schema"
import { db } from "@/src/db"
import { Dna } from "lucide-react"
import { createLocalOrderSchema } from "@/types/local-order-schema"


const action = createSafeActionClient()

export const createLocalOrder = action
  .schema(createLocalOrderSchema)
  .action(async({parsedInput:{ products, status, total, destination,paymentIntentID }}) => {
    const user = await auth()
    if (!user) return { error: "用户未找到 " }
    const order = await db
    .insert(localorders)
    .values({
        status,
        paymentIntentID,
        total,
        destination,
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
  