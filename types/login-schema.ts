import * as z from "zod"

export const LoginSchema = z.object({
    email:z.string().email({
        message:"无效邮箱地址",
    }),
    password:z.string().min(1,{
        message:"需要输入密码",
    }),
    code:z.optional(z.string())
    
})