import { PolicyPage } from '@/components/layout/policy-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms and Conditions | Max Phone Repair',
    description: 'Terms and conditions governing the use of our website and services.'
}

export default function TermsPage() {
    return <PolicyPage policyKey="policy_terms" titleFallback="Terms and Conditions" />
}
