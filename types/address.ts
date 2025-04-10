import * as z from "zod"

export const AddressSchema = z.object({
    address:z.string().({
        message:"无效邮箱地址",
    }),
    password:z.string().min(1,{
        message:"需要输入密码",
    }),
    code:z.optional(z.string())
    
})