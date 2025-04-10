"use server"
import { LoginSchema } from "@/types/login-schema"
import { createSafeActionClient } from "next-safe-action"
import { db } from "@/src/db"
import { eq } from "drizzle-orm"
import { twoFactorTokens, users } from "../schema"

// import {
//   generateEmailVerificationToken,
//   generateTwoFactorToken,
//   getTwoFactorTokenByEmail,
// } from "./tokens"
// import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "./email"
import { signIn } from "../auth"
import { AuthError } from "next-auth"
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "./emails"
import { generateEmailVerificationToken, generateTwoFactorToken, getTwoFactorTokenByEmail } from "./tokens"

const action = createSafeActionClient()

export const emailSignIn = action
  .schema(LoginSchema)
  .action(
  async ({ parsedInput:{email, password, code} }) => {
    try {
           //Check if the user is in the database
           const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
          })
    
          if (existingUser?.email !== email) {
            return { error: "Email not  found" }
          }
          //如果用户未验证
          if (!existingUser.emailVerified) {
                    const verificationToken = await generateEmailVerificationToken(
                      existingUser.email
                    )
                    await sendVerificationEmail(
                      verificationToken[0].email,
                      verificationToken[0].token
                    )
                    return { success: "证明邮件已发送!" }
                  }
            
          if (existingUser.twoFactorEnabled && existingUser.email){
            if(code){
              const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
              if(!twoFactorToken){
                return {error:"无效令牌"}
              }
              if(twoFactorToken.token !== code){
                return {error:'无效令牌'}
              }
              const hasExpired = new Date(twoFactorToken.expires) < new Date()
              if (hasExpired){
                return {error:'令牌已过期'}
              }
              await db
              .delete(twoFactorTokens)
              .where(eq(twoFactorTokens.id,twoFactorToken.id))

              const existingConfirmation = await getTwoFactorTokenByEmail(existingUser.email)
              if(existingConfirmation){
                await db
                .delete(twoFactorTokens)
                .where(eq(twoFactorTokens.email,existingUser.email))
              }

          }else{
            const token =  await generateTwoFactorToken(existingUser.email);
             if(!token){
              return {error:"令牌未产生"}
             }
             await sendTwoFactorTokenByEmail(token[0].email,token[0].token);
             return {twoFactor:'双因素验证已发送'}
          }}
           
          await signIn("credentials", {
            email,
            password,
            redirectTo: "/",
          })
    
           return {success:'用户已登录'}
          }catch(error){
            console.log(error)
            if(error instanceof AuthError){
              //选择错误类型播报
              switch(error.type){
                case "CredentialsSignin":
                  return { error: "邮箱或密码有误" }
                case 'AccessDenied':
                  return {error:error.message}
                case 'OAuthSignInError':
                  return {error:error.message}
                default:
                  return {error:'Wrong！发生咯'}
              }
            }
            throw error
          }
    })
