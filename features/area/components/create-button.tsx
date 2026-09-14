"use client"

import { FormSheet } from '@/components/shared/sheet/sheet'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import React from 'react'

export default function CreateAreaButton() {
    const [open, setOpen] = React.useState(false)
    return (
        <>
            <Button onClick={() => setOpen(true)}><PlusCircle /> Area</Button>

            <FormSheet formTitle='Create Area' open={open} onOpenChange={setOpen}>
                
            </FormSheet>
        </>
    )
}
