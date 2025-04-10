'use server'

import { SettingsSchema } from "@/types/settings-schema"
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth"
import { eq } from "drizzle-orm"
import { db } from "@/src/db"
import { users } from "../schema"
import bcrypt from 'bcrypt'
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()
//先检查是否通过Google 或 Github登录
//检查数据库中是否有用户
//比较密码
//

export const settings = action
    .schema(SettingsSchema)
    .action(
        async({parsedInput:values})  => {
        const user = await auth();
    if(!user){
        return {error: "用户未找到"}
        }
    //
    const dbUser = await db.query.users.findFirst({
        where:eq(users.id,user.user.id)
    })

    if(!dbUser){
        return {error: "用户未找到"}
    }
    //检查用户是否使用google登录
    if(user.user.isOAuth){
        values.email = undefined
        values.password = undefined
        values.newPassword = undefined
        values.isTwoFactorEnabled = undefined
    }
    //检查用户新老密码是否一致
    if(values.password && values.newPassword && dbUser.password){
        const passwordMatch = await bcrypt.compare(values.password,dbUser.password)
        if(!passwordMatch){
            return {error : '密码不匹配'}
        }
        const samePassword = await bcrypt.compare(values.newPassword,dbUser.password)
        if(samePassword) {
            return {error: '新老密码一致'}
        }
        const hashedPassword = await bcrypt.hash(values.newPassword,10)
        values.password = hashedPassword
        values.newPassword = undefined
    }
    const updateUser = await db.update(users).set({
        twoFactorEnabled:values.isTwoFactorEnabled,
        name:values.name,
        email:values.email,
        password:values.password,
        image:values.image,
    })
    .where(eq(users.id,dbUser.id))
    revalidatePath('/dashboard/settings')
    return {success: "已更新"}
    } )

