'use server'

import { RegisterSchema } from "@/types/register-schema"
import { createSafeActionClient } from "next-safe-action"
import * as bcrypt from 'bcrypt';
import { db } from "@/src/db"
import { users } from "../schema"
import { eq } from "drizzle-orm"
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./emails";


const action = createSafeActionClient()

export const emailRegister = action
.schema(RegisterSchema)
.action(
    async({parsedInput:{email,password,name}}) =>{
        //哈希处理密码
        const hashedPassword = await bcrypt.hash(password,10)
        // 检查是否已存在用户
        const existingUser =  await db.query.users.findFirst({
            where:eq(users.email,email)
        })
        if (existingUser){
            if (!existingUser.emailVerified){
                //保证如果用户邮箱未验证，则进行重复验证，否则（已有验证）说明邮箱已注册
                const verificationToken =  await generateEmailVerificationToken(email);
                await sendVerificationEmail(
                    verificationToken[0].email,
                    verificationToken[0].token
                    )
                return {success:'已发送邮箱验证'}
            }
            return {error:'邮箱已被注册'}
        }
        // 当用户未注册时进行注册
        await db.insert(users).values({
            email,
            name,
            password:hashedPassword,
        })
        const verificationToken = await generateEmailVerificationToken(email)
        await sendVerificationEmail(
            //排序要对应
            verificationToken[0].email,
            verificationToken[0].token
            )


        return { success:"芜湖！可以注册！注册验证码已发送"}
    })