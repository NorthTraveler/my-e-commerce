'use server'

import { db } from "@/src/db"
import { createSafeActionClient } from "next-safe-action"
import { z } from "zod"
import { products } from "../schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()
export const deleteProduct = action
    .schema(z.object({id:z.number()}))
    .action(
    async({parsedInput:{id}}) =>{
        try{
            const getProductData = await db.query.products.findFirst({
                where:eq(products.id,id)})
            await db
            .delete(products)
            .where(eq(products.id,id))
        revalidatePath("/dashboard/products")
        return { success:`产品${getProductData?.title}已删除`}
        }catch(error){
            return { error:"删除失败" }
        }
    })