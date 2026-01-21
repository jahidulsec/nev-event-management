import { format } from 'date-fns'

export function formatDate(date: Date) {
    return format(date, 'LLL dd, yyyy')
}


export function getCleanData(data: object) {
    return Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined && v !== null && !Number.isNaN(v))
    )
}