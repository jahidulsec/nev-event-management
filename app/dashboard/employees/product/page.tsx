import { SearchForm } from '@/components/shared/inputs/search'
import { Section, SectionActions, SectionContent, SectionHeader } from '@/components/shared/section/section'
import { TableSkeleton } from '@/components/shared/skeleton/table'
import { SectionHeadingWithBackButton } from '@/components/shared/typography/heading'
import CreateProductUserButton from '@/features/employee/components/product-user/create-button'
import ProductUserTable from '@/features/employee/components/product-user/table'
import { getProductUsers } from '@/features/employee/lib/product-user'
import { SearchParams } from '@/types/search-params'
import React, { Suspense } from 'react'

export default function EmployeeProductPage({ searchParams }: { searchParams: SearchParams }) {
    return (
        <>
            <Section>
                <SectionHeader>
                    <SectionHeadingWithBackButton title='Product User' subtitle='Employee' />

                    <SectionActions>
                        <SearchForm />
                        <CreateProductUserButton />
                    </SectionActions>
                </SectionHeader>

                <SectionContent>
                    <Suspense fallback={<TableSkeleton />}>
                        <DataTable searchParams={searchParams} />
                    </Suspense>
                </SectionContent>
            </Section>
        </>
    )
}


const DataTable = async ({ searchParams }: { searchParams: SearchParams }) => {

    const { search, page, size } = await searchParams;

    const res = await getProductUsers({
        page: Number(page) || 1,
        size: Number(size) || 20,
        search: search?.toString()
    })

    return <>
        <ProductUserTable data={res.data ?? []} />
    </>
}