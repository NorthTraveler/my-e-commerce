import * as z from "zod"

export const RegisterSchema = z.object({
    email:z.string().email({
        message:"无效邮箱地址",
    }),
    password:z.string().min(8,{
        message:"密码至少需要8位",
    }),
    name:z.string().min(2,{
        message:'请添加至少2位字符'
    }),
})