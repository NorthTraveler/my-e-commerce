import { z } from "zod";

export const NewPasswordSchema = z.object({
    password:z.string().min(6,"密码至少要6个字符"),
    token:z.string().nullable().optional(),

})