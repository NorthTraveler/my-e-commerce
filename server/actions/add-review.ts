'use server'

import { reviewSchema } from "@/types/reviews-schema"
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth"
import { db } from "@/src/db"
import { and, eq } from "drizzle-orm"
import { reviews } from "../schema"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()

export const addReview = action
    .schema(reviewSchema)
    .action(async ({ parsedInput: { productID, rating, comment } }) => {
        try {
            const session = await auth();
            if (!session) return { error: '请登入' }
            const reviewExists = await db.query.reviews.findFirst({
                where: and(eq(reviews.productID, productID), eq(reviews.userID, session.user.id)),
            })
            if (reviewExists)
                return { error: '您已点评过商品' }
            const newReviews = await db.insert(reviews).values({
                productID,
                rating,
                comment,
                userID: session.user.id
            }).$returningId()
            const newReviewsData = await db.query.reviews.findFirst({
                where: eq(reviews.id, newReviews[0].id)
            })
            revalidatePath(`/products/${productID}`)
            return { success: newReviewsData }
        } catch (error) {
            return { error: JSON.stringify(error) }
        }
    })