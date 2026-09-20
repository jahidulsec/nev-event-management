"use client"

import React from 'react'
import dynamic from 'next/dynamic';
import { EventSingleProps } from '../../libs/events';
import { EventApproverMultiProps } from '@/features/event-approvers/libs/event-approvers';

const PrintSection = dynamic(() => import('./print-section'), {
    ssr: false,
});

export default function PrintContainer({
    eventData,
    eventApprover,
}: {
    eventData: EventSingleProps;
    eventApprover: EventApproverMultiProps[];
}) {
    return (
        <div>
            <PrintSection eventData={eventData} eventApprover={eventApprover} />
        </div>
    )
}
