"use server"

import { db } from "@/config/db";
import { Prisma } from "@/lib/generated/prisma";
import { apiResponse } from "@/lib/response"
import { QuerySchema, QuerySchemaType } from "@/schemas/query"

export const getProductUsers = async (query: QuerySchemaType) => {
    try {
        const validatedParams = QuerySchema.parse(query);

        const filter: Prisma.product_userWhereInput = {
            ...(validatedParams.search && {
                OR: [
                    {
                        work_area_code: {
                            startsWith: validatedParams.search
                        }
                    },
                    {
                        product: {
                            name: {
                                startsWith: validatedParams.search
                            }
                        }
                    }
                ]
            })
        }

        const [data, count] = await Promise.all([
            db.product_user.findMany({
                where: filter,
                take: validatedParams.size,
                skip: (validatedParams.page - 1) * validatedParams.size
            }),
            db.product_user.count({
                where: filter,
            }),
        ])

        return apiResponse.multi({
            message: "Successful",
            data, count
        })
    } catch (error) {
        console.error(error)
        return apiResponse.error({ error })
    }
} 