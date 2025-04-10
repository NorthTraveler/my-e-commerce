import * as z from 'zod'

export const VariantSchema = z.object({
    productID:z.number(),
    id:z.number().optional(),
    editMode:z.boolean(),
    productType:z.string().min(1,{message:"产品类型至少有一个字符"}),
    color:z.string().min(1,{message:'产品颜色至少有一个字符'}),
    tags:z.array(z.string()).min(1,{message:'至少添加一个tag'}),
    variantImages:z.array(z.object({
        url:z.string().refine((url) => url.search('blob:') !== 0 , {message:'请等待图片上传'}),
        size:z.number(),
        key:z.string().optional(),
        id:z.number().optional(),
        name:z.string(),
    }))
})
