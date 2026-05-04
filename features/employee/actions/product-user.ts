"use server"

import { apiResponse, response } from "@/lib/response"
import { ProductUserSchemaType } from "./schema"
import { db } from "@/config/db"
import { revalidatePath } from "next/cache"
import { handleError } from "@/lib/error"

export const createProductUser = async (data: ProductUserSchemaType) => {
    try {
        const res = await db.product_user.create({
            data: data
        })

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/employees')
        revalidatePath('/dashboard/employees/product')

        return apiResponse.single({
            message: "Successful", data: res
        })
    } catch (error) {
        console.error(error)
        return apiResponse.error({ error })
    }
}

export const updateProductUser = async (id: string, data: ProductUserSchemaType) => {
    try {
        const res = await db.product_user.update({
            where: {
                id
            },
            data: data
        })

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/employees')
        revalidatePath('/dashboard/employees/product')

        return apiResponse.single({
            message: "Successful", data: res
        })
    } catch (error) {
        console.error(error)
        return apiResponse.error({ error })
    }
}


export const deleteProductUser = async (id: string) => {
    try {
        const data = await db.product_user.delete({ where: { id } });

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/employees')
        revalidatePath('/dashboard/employees/product')


        return apiResponse.single({
            message: "Successful", data: data
        })
    } catch (error) {
        console.error(error)
        const err = handleError(error)
        return response({
            success: false, message: err.message ?? 'Something Went wrong'
        })
    }
}