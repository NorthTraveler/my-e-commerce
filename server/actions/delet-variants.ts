"use server"

import { db } from "@/src/db"
import { createSafeActionClient } from "next-safe-action"
import { z } from "zod"
import { productVariants } from "../schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()
export const deleteVariant =  action
.schema(z.object({id:z.number()}))
.action(async({parsedInput:{id}}) =>{
    try{

        const deleteVariantData =  await db.query.productVariants.findMany({
            where:eq(productVariants.id,id)
        })
        const deleteVariant = await db.delete(productVariants)
        .where(eq(productVariants.id,id))
        revalidatePath('dashboard/products')
        return {success:`${deleteVariantData[0].productType}已删除`}
    }catch(error){
        return {error:'删除失败'}

    }
}) 