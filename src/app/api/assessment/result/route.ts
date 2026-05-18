import { NextResponse } from 'next/server'
import { getAnthropicClient } from '@/lib/anthropic'
import type { ResultData } from '@/lib/assessment/types'

const FALLBACK: ResultData = {
  headline: 'You showed up for yourself today — that matters.',
  summary:
    "Whatever brought you here, it took something to start. You've been carrying a lot, and you deserve a space where that's okay.",
  pullquote: "Here's what might help you most right now.",
  primaryPathway: 'ally',
  pathwayReason: 'A warm human who gets it — no waiting, no clinical framing.',
}

const SYSTEM_PROMPT = `You are Nest's emotional assessment engine. Nest is a warm, private platform for people navigating loneliness, heartbreak, anxiety, and emotional heaviness. Your voice is honest, unhurried, and human — never clinical. Never use the words: therapy, diagnosis, disorder, symptoms, mental illness. Always respond with only valid JSON — no markdown, no explanation, no extra fields.`

export async function POST(request: Request) {
  let answers: Array<{ questionId: string; questionText: string; answer: string }>

  try {
    const body = await request.json()
    answers = body.answers
    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: 'Invalid answers payload' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)

  try {
    const anthropic = getAnthropicClient()

    const userMessage = `Based on these ${answers.length} answers from an emotional wellness intake, generate a warm emotional snapshot.

Answers:
${JSON.stringify(answers.map(a => ({ question: a.questionText, answer: a.answer })), null, 2)}

Return exactly this JSON shape:
{
  "headline": "12 words max. Warm, specific to what they shared. Not a cliché.",
  "summary": "2-3 sentences. Reflect what you heard like a perceptive friend.",
  "pullquote": "1 sentence. A bridge toward action.",
  "primaryPathway": "one of: ally | sai | resources | events",
  "pathwayReason": "1 sentence explaining why this pathway fits them."
}`

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const rawText =
      message.content[0].type === 'text' ? message.content[0].text.trim() : ''

    let result: ResultData
    try {
      result = JSON.parse(rawText) as ResultData

      // Validate required fields are present
      if (
        !result.headline ||
        !result.summary ||
        !result.pullquote ||
        !result.primaryPathway ||
        !result.pathwayReason
      ) {
        throw new Error('Missing required fields in response')
      }
    } catch {
      result = FALLBACK
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[assessment/result]', error instanceof Error ? error.message : String(error))
    return NextResponse.json(FALLBACK)
  } finally {
    clearTimeout(timeout)
  }
}
