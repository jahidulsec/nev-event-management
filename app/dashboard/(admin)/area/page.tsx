import { Section, SectionHeader } from '@/components/shared/section/section'
import { SectionHeading } from '@/components/shared/typography/heading'
import CreateAreaButton from '@/features/area/components/create-button'
import React from 'react'

export default function AreaPage() {
    return (
        < >
            <Section className='border  rounded-md p-6'>
                <SectionHeader>
                    <SectionHeading>Area</SectionHeading>

                    <CreateAreaButton />
                </SectionHeader>
            </Section>
        </>
    )
}
