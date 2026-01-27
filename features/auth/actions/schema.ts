import z from 'zod'

export const LoginSchema = z.object({
    employee_id: z
        .string()
        .min(2, "Employee ID must be at least 2 characters."),
    password: z
        .string()
        .min(6, "password must be at least 6 characters.")
        .max(100, "password must be at most 100 characters."),
})

export type LoginType = z.infer<typeof LoginSchema>