'use server'

import { db } from "@/src/db"
import { ProductSchema } from "@/types/product-schema"
import { createSafeActionClient } from "next-safe-action"
import { products } from "../schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()

export const createProduct = action
    .schema(ProductSchema)
    .action(async({parsedInput:{description,price,title,id}}) => {
        try{
            //EDIT MODE
            if(id) {
                const currentProduct = await db.query.products.findFirst({
                    where:eq(products.id,id)
                })
                if(!currentProduct) return {error:"产品未找到"}
                const editedProduct = await db
                    .update(products)
                    .set({description,price,title})
                    .where(eq(products.id,id))
                const returnNewProduct = await db.query.products.findFirst({
                    where:eq(products.id,id)
                    })
                revalidatePath('/dashboard/products')
                return {success : `产品 ${returnNewProduct?.title}已更新`}
            }
            if(!id){
                const newProduct = await db
                    .insert(products)
                    .values({description,price,title})
                    .$returningId()
                const returnNewProduct = await db.query.products.findFirst({
                    where:eq(products.id,newProduct[0].id)
                    })
                revalidatePath('/dashboard/products')
                return {success: `产品 ${returnNewProduct?.title}已添加`}
            }
        }catch (err) {
            return {error:JSON.stringify(err)}
        }

    })