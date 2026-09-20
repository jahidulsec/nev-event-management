"use client"

import React from 'react'
import dynamic from 'next/dynamic';
import { EventSingleProps } from '../../libs/events';

const PrintSection = dynamic(() => import('./print-section'), {
    ssr: false,
});

export default function PrintContainer({
    eventData,
}: {
    eventData: EventSingleProps;
}) {
    return (
        <div>
            <PrintSection eventData={eventData} />
        </div>
    )
}
