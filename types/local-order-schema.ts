import * as z from "zod"

export const createLocalOrderSchema = z.object({
  total: z.number(),
  status: z.string(),
  paymentIntentID: z.string(),
  destination:z.string(),
  products: z.array(
    z.object({
      productID: z.number(),
      variantID: z.number(),
      quantity: z.number(),
    })
  ),
})