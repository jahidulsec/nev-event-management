import Header from '@/components/dashboard/header'
import { Footer } from '@/components/shared/footer/footer'
import React from 'react'

export default function AdminLayout({ children }: React.PropsWithChildren) {
    return (
        <div className="min-h-screen bg-background relative">
            <Header />
            <main className='min-h-[calc(100vh-205px)] pt-6 flex flex-col gap-6'>
                {children}
            </main>
            <Footer />
        </div>
    )
}
