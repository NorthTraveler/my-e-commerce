import * as z from 'zod'

export const reviewSchema = z.object({
    productID:z.number(),
    rating: z
        .number()
        .min(1, { message: '请增加至少1星' })
        .max(5, { message: '最高评分为5星' }),
    comment: z.string().min(10, { message: '请评论至少10个字符' })
})