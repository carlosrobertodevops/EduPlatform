import { z } from "zod";

export const courseReviewSchema = z.object({
    rating: z.string({ required_error: "A avaliação é obrigatória" }).regex(/^[1-5]$/, "Deve ser um número entre 1 e 5"),
    comment: z.string().min(10, "O comentário deve ter pelo menos 10 caracteres")
})

export type CourseReviewForm = z.infer<typeof courseReviewSchema>