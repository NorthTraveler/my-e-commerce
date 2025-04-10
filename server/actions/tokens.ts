'use server'

import { db } from "@/src/db"
import { emailTokens, passwordResetTokens, twoFactorTokens, users } from "../schema"
import { eq } from "drizzle-orm"
import crypto from 'node:crypto';

//创建新的验证
export const newVerification = async (token: string) => {
    //如果不存在Token
    const existingToken = await getVerificationTokenByEmail(token)
    if (!existingToken) return { error: "Token not found" }
    const hasExpired = new Date(existingToken.expires) < new Date()
    
    if (hasExpired) return { error: "Token已过期" }
  
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    })
    if (!existingUser) return { error: "Email does not exist" }
  
    await db
      .update(users)
      .set({
        emailVerified: new Date(),
        email: existingToken.email,
      })
      .where(eq(users.id, existingUser.id))
  
    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
    return { success: "Email Verified" }
  }
  
//通过邮箱，尝试获取Token
export const getVerificationTokenByEmail = async(email:string) =>{
    try {
        const verificationToken = await db.query.emailTokens.findFirst({
            where:eq(emailTokens.token,email)
        })
        return verificationToken
    }catch(error){
        return null
    }
}

//生成邮箱验证Token
export const generateEmailVerificationToken = async (email:string) =>{
    //加密（crypto API 和 随机 UUID）
    const token = crypto.randomUUID()
    //指定过期时间，保证
    const expires = new Date(new Date().getTime() + 3600 * 1000)
    //检验是否现有Token
    const existingToken = await getVerificationTokenByEmail(email)
    //如果存在，则删除该Token
    if (existingToken){
        await db.delete(emailTokens).where(eq(emailTokens.id,existingToken.id))
    }
    //插入新的的Token,并返回
    const verificationToken = await db.insert(emailTokens).values({
        email,
        token,
        expires,
    })
    .$returningId()
    const data = await db.query.emailTokens.findMany({
        where:eq(emailTokens.id,verificationToken[0]?.id)
    })
    return data
}
//通过邮箱验证Token
export const verifyEmailToken = async (token:string)=>{
    //检验是否已有Token
    const existingToken = await getVerificationTokenByEmail(token);
    if(!existingToken) return {error:"未找到Token"}
    //检验Token是否已Expired
    const hasExpired = new Date(existingToken.expires)<new Date();
    if(hasExpired) return {error:"Token已expired"}
    //检验是否已有用户
    const existingUser = await db.query.users.findFirst({
        where:eq(users.email,existingToken.email)
    })
    if(!existingUser) return{error:'用户不存在'}
    //更新用户
    await db.update(users).set({
        emailVerified:new Date(),
        email:existingToken.email,
    })
    //删除对应的Token
    await db.delete(emailTokens)
    .where(eq(emailTokens.id,existingToken.id))
    return {success:'邮箱已验证'}

}
export const getPasswordResetTokenByToken = async(token:string) =>{
    try{ 
        const passwordResetToken = await db.query.passwordResetTokens.findFirst({
            where:eq(passwordResetTokens.token,token)
        }) 
        return passwordResetToken
    }catch{
        return null
    }
}

export const getPasswordResetTokenByEmail =async(email:string) =>{
    try{
        const passwordResetToken = await db.query.passwordResetTokens.findFirst({
            where:eq(passwordResetTokens.email,email)
        })
        return passwordResetToken
    }catch{
        return null
    }
}

export const getTwoFactorTokenByEmail = async(email:string) =>{
    try{
        const twoFactorToken = await db.query.twoFactorTokens.findFirst({
            where:eq(twoFactorTokens.email,email)
        })
        return  twoFactorToken
    }catch{
        return null
    }
}

export const getTwoFactorTokenByToken =async(token:string) =>{
    try{
        const twoFactorToken = await db.query.twoFactorTokens.findFirst({
            where:eq(twoFactorTokens.token,token)
        })
        return twoFactorToken
    }catch{
        return null
    }
}

export const generatePasswordResetToken = async(email:string) =>{

    try{
    const token = crypto.randomUUID()
    //指定过期时间，保证
    const expires = new Date(new Date().getTime() + 3600 * 1000)
    //检验是否现有Token
    const existingToken = await getPasswordResetTokenByEmail(email)
    if(existingToken){
        await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id,existingToken.id))
    }
    const passwordResetToken = await db
    .insert(passwordResetTokens)
    .values({
        email,
        token,
        expires,
    }).$returningId()

    const data = await db.query.passwordResetTokens.findMany({
        where:eq(passwordResetTokens.id,passwordResetToken[0].id)
    })
    return data
    }catch(error){
        return null
    } 
}


export const generateTwoFactorToken = async(email:string) =>{

    try{
    const token = crypto.randomInt(100_000,1_000_000).toString()
    //指定过期时间，保证
    const expires = new Date(new Date().getTime() + 3600 * 1000)
    //检验是否现有Token
    const existingToken = await getTwoFactorTokenByEmail(email)
    if(existingToken){
        await db
        .delete(twoFactorTokens)
        .where(eq(twoFactorTokens.id,existingToken.id))
    }
    const twoFactorToken = await db
    .insert(twoFactorTokens)
    .values({
        email,
        token,
        expires,
    }).$returningId()

    const data = await db.query.twoFactorTokens.findMany({
        where:eq(twoFactorTokens.id,twoFactorToken[0].id)
    })
    return data
    }catch(error){
        return null
    } 
}

