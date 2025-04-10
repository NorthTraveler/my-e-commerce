'use server'

import { NewPasswordSchema } from "@/types/new-password-schema"
import { createSafeActionClient } from "next-safe-action"
import { getPasswordResetTokenByToken } from "./tokens"
import { db } from "@/src/db"
import { eq } from "drizzle-orm"
import { passwordResetTokens, users } from "../schema"
import bcrypt from 'bcrypt'
const action = createSafeActionClient()

export const newPassword = action
    .schema(NewPasswordSchema)
    .action(async({parsedInput:{password,token}})=>{
        //检查token
        if(!token){
            return {error:"Token丢失"}
        }
        //检查token是否有效
        const existingToken = await getPasswordResetTokenByToken(token);
        if(!existingToken){
            return {error: '未找到Token'}
        }
        const hasExpired = new Date(existingToken.expires) < new Date();
        if(hasExpired) {
            return {error:'Token已过期'}
        }
        const existingUser = await db.query.users.findFirst({
            where:(eq(users.email,existingToken.email))
        })
        const hashPassword = await bcrypt.hash(password,10)

        //transaction:用于完成所有步骤，如果有一个失败，则恢复本来步骤的改变
        //tx
        await db.transaction(async (tx) => {
            await tx
                .update(users)
                .set({
                    password:hashPassword,
                })
                .where(eq(users.id,existingToken.id))
            await tx
                .delete(passwordResetTokens)
                .where(eq(passwordResetTokens.id,existingToken.id))

        })
        return {success:"密码已更新"}

})