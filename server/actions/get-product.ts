'use server'

import { db } from "@/src/db"
import { eq } from "drizzle-orm"
import { products } from "../schema"

export async function getProduct(id:number) {
    try{
        const product = await db.query.products.findFirst({
            where:eq(products.id,id)
        })
        if(!product) throw new Error ("产品未找到")
        return {success:product}
    }catch(error){
        return {error: "获取产品失败"}
    }
}