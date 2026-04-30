"use client"

import React from 'react'
import dynamic from 'next/dynamic';
import { EventSingleProps } from '../../lib/event';
import { EventApproverMultProps } from '../../lib/event-approver';

const PrintSection = dynamic(() => import('./print-section'), {
    ssr: false,
});

export default function PrintContainer({
    eventData,
    eventApprover,
}: {
    eventData: EventSingleProps;
    eventApprover: EventApproverMultProps[];
}) {
    return (
        <div>
            <PrintSection
                eventApprover={eventApprover}
                eventData={eventData}
            />
        </div>
    )
}
