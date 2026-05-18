import type { Metadata } from 'next'
import AssessmentShell from './_components/AssessmentShell'

export const metadata: Metadata = {
  title: 'nest — take a moment for yourself',
  description: 'A short emotional intake to help us understand where you are right now.',
}

export default function AssessmentPage() {
  return <AssessmentShell />
}
