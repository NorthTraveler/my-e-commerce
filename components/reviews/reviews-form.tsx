'use client'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import { reviewSchema } from "@/types/reviews-schema"
import { Textarea } from "../ui/textarea"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAction } from "next-safe-action/hooks"
import { addReview } from "@/server/actions/add-review"
import { toast } from "sonner"



export default function ReviewsForm() {
    const params = useSearchParams();
    const productID = Number(params.get('productID'))

    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            productID,
            rating: 0,
            comment: '',
        }
    })

    const { execute, status } = useAction(addReview, {
        onSuccess(data) {
            if (data.data?.error) {
                toast.error(data.data.error);
            }
            if (data.data?.success) {
                toast.success("评论已添加")
                form.reset()
            }
        }
    })

    function onSubmit(values: z.infer<typeof reviewSchema>) {
        execute({
            comment: values.comment,
            rating: values.rating,
            productID
        })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="w-full">
                    <Button className="font-medium w-full" variant={'secondary'}>
                        留下评论
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <Form {...form}>
                    <form
                        className="space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='comment'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>留下你的评论</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="请评论下啦"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>

                            )}>
                        </FormField>
                        <FormField
                            control={form.control}
                            name='comment'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>留下你的评分</FormLabel>
                                    <FormControl>
                                        <Input type="hidden" placeholder="评分" {...field} />
                                    </FormControl>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((value) => {
                                            return (
                                                <motion.div
                                                    className="relative cursor-pointer "
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.8 }}
                                                    key={value}
                                                >
                                                    <Star key={value}
                                                        onClick={() => {
                                                            form.setValue("rating", value, {
                                                                shouldValidate: true,
                                                              })
                                                        }}
                                                        className={cn('text-primary bg-transparent transition-all duration-300 ease-in-out',
                                                            form.getValues("rating") >= value
                                                                ? "text-primary"
                                                                : "text-muted"
                                                        )}
                                                    />

                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </FormItem>

                            )}>
                        </FormField>
                        <Button
                            disabled={status === 'executing'}
                            className="w-full"
                            type="submit"
                        >
                            {status === 'executing' ? "添加评论中..." : "添加评论"}
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}
