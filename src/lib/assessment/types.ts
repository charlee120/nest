export interface QuestionOption {
  label: string
  microcopy: string
}

export interface Question {
  id: string
  text: string
  subtext: string
  options: QuestionOption[]
}

export interface AnswerRecord {
  questionId: string
  questionText: string
  answer: string
  microcopy: string
}

export type Phase = 'question' | 'pause' | 'loading' | 'result'

export type PrimaryPathway = 'ally' | 'sai' | 'resources' | 'events'

export interface ResultData {
  headline: string
  summary: string
  pullquote: string
  primaryPathway: PrimaryPathway
  pathwayReason: string
}

export interface AssessmentState {
  phase: Phase
  currentIndex: number
  answers: AnswerRecord[]
  currentAnswer: { label: string; microcopy: string } | null
  result: ResultData | null
  error: string | null
}
