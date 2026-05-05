"use server"

import { db } from "@/config/db"
import { approver } from "@/lib/generated/prisma"
import { apiResponse } from "@/lib/response"

export const getApproverList = async (eventTypeId: string) => {
    try {
        const data = await db.approver.findMany({
            where: {
                event_type_id: eventTypeId
            },
            orderBy: {
                created_at: 'asc'
            }
        })

        return apiResponse.multi<approver>({
            message: "GET successful",
            data, count: data.length
        })
    } catch (error) {
        console.error(error)
        return apiResponse.error({ error })
    }
}