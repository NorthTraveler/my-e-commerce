'use server'

import { db } from "@/src/db"
import { ResetSchema } from "@/types/reset-schema"
import { eq } from "drizzle-orm"
import { createSafeActionClient } from "next-safe-action"
import { users } from "../schema"
import {generatePasswordResetToken } from "./tokens"
import { sendPasswordResetEmail } from "./emails"

const action = createSafeActionClient()

export const reset = action
    .schema(ResetSchema)
    .action(
        async ({parsedInput:{email}}) => {
            const existingUser = await db.query.users.findFirst({
                where:eq(users.email,email)
            })
            if(!existingUser){
                return {error : "未找到用户"}
            }
            const passwordResetToken = await generatePasswordResetToken(email)
            if(!passwordResetToken){
                return {error:'令牌未生成'}
            }
            await sendPasswordResetEmail(
                passwordResetToken[0].email,
                passwordResetToken[0].token
                )
            return {success:"重置密码邮件已发送"}
        } )