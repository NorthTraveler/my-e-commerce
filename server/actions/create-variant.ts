'use server'

import { db } from "@/src/db"
import { VariantSchema } from "@/types/variant-schema"
import { createSafeActionClient } from "next-safe-action"
import {
    productVariants,
    products,
    variantImages,
    variantTags,
  } from "../schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()

export const createVariant = action
    .schema(VariantSchema)
    .action( async({parsedInput:{color,editMode,id,productID,productType,tags,variantImages:newImgs }}) => {
        try{
            //某个产品的编辑模式中
            if(editMode && id){
                //对变体进行更新
                const editVariant = await db
                .update(productVariants)
                .set({color,productType,updated:new Date() })
                .where(eq(productVariants.id,id))

                const editVariantData = await db.query.productVariants.findMany({
                    where:eq(productVariants.id,id)})
                //删除该变体的标签
                await db
                .delete(variantTags)
                .where(eq(variantTags.variantID ,editVariantData[0].id))
                //插入该变体的新标签
                await db
                .insert(variantTags)
                .values(tags.map((tag) => ({
                    tag,
                    variantID:editVariantData[0].id,
                })))
                //删除该变体图片地址
                await db
                .delete(variantImages)
                .where(eq(variantImages.variantID, editVariantData[0].id))
                //插入新的图片数据
                await db.insert(variantImages).values(
                    newImgs.map((img,idx) => ({
                        name:img.name,
                        size:img.size,
                        url:img.url,
                        variantID:editVariantData[0].id,
                        order:idx,
                    }))
                    )
                    revalidatePath('/dashboard/products')
                    return {success:`${productType}已编辑`}
            }
            //非编辑模式下
            if(!editMode){
                //产品变体中插入新变体，并返回数据
                const newVariant = await db.insert(productVariants).values({
                    color,
                    productType,
                    productID
                }).$returningId()
                const newVariantData = await db.query.productVariants.findMany({
                    where:eq(productVariants.id,newVariant[0].id)
                })
                //向产品变体标签中插入
                await db.insert(variantTags).values(
                    tags.map((tag) =>({
                        tag,
                        variantID:newVariantData[0].id,
                    }))
                )
                //向图片中插入
                await db.insert(variantImages).values(
                    newImgs.map((img,idx) => ({
                        name:img.name,
                        size:img.size,
                        url:img.url,
                        variantID:newVariantData[0].id,
                        order:idx,
                    }))
                    )
                    revalidatePath('/dashboard/products')
                    return {success:`${productType}已添加`}
            }
        } catch(error){
            return { error: `创建产品变种失败:${error}` }
        }
    })