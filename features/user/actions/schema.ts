import z from "zod";

export const ResetPasswordSchema = z.object({
    password: z.string("Password required").min(6, "At least 6 characters")
})

export const ProfileSchema = z.object({
    full_name: z.string('Enter your name').min(2, 'At least 2 characters').optional(),
    mobile: z.string("Enter your mobile number").regex(new RegExp(/^01[3-9]{1}\d{8}$/), 'Invalid phone number').optional()
})

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>
export type ProfileType = z.infer<typeof ProfileSchema>