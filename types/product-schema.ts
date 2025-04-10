import * as z from "zod"

export const ProductSchema = z.object({
    id:z.number().optional(),
    title:z.string().min(2,{
        message:'标题至少两个字符'
    }),
    description:z.string().min(10,{
        message:'介绍至少10个字符'
    }),
    price:z.coerce
    .number({invalid_type_error:'价格必须为数字'})
    .positive({message:"价格必须为正数"})
})

export type zProductSchema = z.infer<typeof ProductSchema>