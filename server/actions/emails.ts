'use server'
import getBaseURL from "@/lib/base-url"
import {Resend} from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
const domain = getBaseURL();

export const sendVerificationEmail = async(email:string,token:string) =>{
    //实际应用则需要获取域名，而非本地，使用lib/base-url获取
    const confirmLink = `${domain}/auth/new-verification?token=${token}`
    const {data, error} = await resend.emails.send({
        //通过某发送
        from:'onboarding@resend.dev',
        //使用本身的email，否则不起作用
        to:email,
        subject:'项目注册邮箱测试',
        html:`<p>点此来<a href='${confirmLink}'>验证邮箱</a> </p>`
    })
    if(error) return console.log(error) 
    if(data) return data
}

export const sendPasswordResetEmail = async(email:string,token:string) =>{
    //实际应用则需要获取域名，而非本地，使用lib/base-url获取
    const confirmLink = `${domain}/auth/new-verification?token=${token}`
    const {data, error} = await resend.emails.send({
        //通过某发送
        from:'onboarding@resend.dev',
        //使用本身的email，否则不起作用
        to:email,
        subject:'密码重置邮箱测试',
        html:`<p>点此来<a href='${confirmLink}'>重置密码</a> </p>`
    })
    if(error) return console.log(error) 
    if(data) return data
}

export const sendTwoFactorTokenByEmail = async(email:string,token:string) =>{
    //实际应用则需要获取域名，而非本地，使用lib/base-url获取
    const confirmLink = `${domain}/auth/new-verification?token=${token}`
    const {data, error} = await resend.emails.send({
        //通过某发送
        from:'onboarding@resend.dev',
        //使用本身的email，否则不起作用
        to:email,
        subject:'使用双因素令牌验证',
        html:`<p> 验证码为:${token} </p>`
    })
    if(error) return console.log(error) 
    if(data) return data
}