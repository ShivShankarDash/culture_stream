import dotenv from 'dotenv'
import OpenAI from 'openai'
import type { MessageMetrics } from '../types'

dotenv.config()

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.error('OPENAI_API_KEY is not set. Add it to your environment or a .env file.')
  throw new Error('OPENAI_API_KEY is required for OpenAI analysis')
}

const openaiModel = process.env.OPENAI_MODEL || 'gpt-4.1-mini'

const client = new OpenAI({
  apiKey,
})

export type AnalyzableMessage = {
  channel: string
  payload: string
}

type OpenAIResponsePayload = {
  messages: MessageMetrics[]
}

function buildPrompt(weekNum: number, messages: AnalyzableMessage[], startIndex: number): string {
  return (
    'You are an expert organizational psychologist analyzing Slack messages to detect cultural health signals.\n' +
    'You will be given a JSON payload with an array "inputMessages". Each element has { index, channel, payload }.\n' +
    'Return ONLY a JSON object with a single property "messages", which is an array of metrics objects in the SAME ORDER\n' +
    'as the provided messages (same length, index 0 corresponds to inputMessages[0], etc.).\n\n' +
    'Each metrics object must have these numeric fields:\n' +
    '- silosScore (0–1)\n' +
    '- sentiment (0–1)\n' +
    '- responseTimeHours (number)\n' +
    '- burnoutRisk (0–1)\n' +
    '- crossTeamPercentage (0–100)\n' +
    '- lateNightPercentage (0–100)\n' +
    '- blameScore (0–1)\n' +
    '- trustScore (0–1)\n' +
    '- productivity (0–1)\n' +
    '- wlb (0–100)\n' +
    '- workSatisfaction (0–100)\n\n' +
    'Infer these from tone, wording, and any timestamps in the payload text.\n\n' +
    JSON.stringify({
      week: weekNum,
      inputMessages: messages.map((m, i) => ({
        index: startIndex + i,
        channel: m.channel,
        payload: m.payload,
      })),
    })
  )
}

async function analyzeChunk(
  weekNum: number,
  messages: AnalyzableMessage[],
  startIndex: number,
): Promise<MessageMetrics[]> {
  const prompt = buildPrompt(weekNum, messages, startIndex)
  const completion = await client.chat.completions.create({
    model: openaiModel,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  })
  const text = completion.choices[0]?.message?.content
  if (!text) throw new Error('OpenAI response has no content')
  let parsed: OpenAIResponsePayload
  try {
    parsed = JSON.parse(text) as OpenAIResponsePayload
  } catch (err) {
    console.error('Failed to parse OpenAI JSON response:', text)
    throw err
  }
  if (!parsed.messages || !Array.isArray(parsed.messages)) {
    throw new Error('OpenAI response is missing "messages" array')
  }
  const count = Math.min(parsed.messages.length, messages.length)
  return parsed.messages.slice(0, count)
}

export async function analyzeMessagesWithOpenAI(
  weekNum: number,
  messages: AnalyzableMessage[],
): Promise<MessageMetrics[]> {
  if (!messages.length) return []

  const mid = Math.ceil(messages.length / 2)
  const topHalf = messages.slice(0, mid)
  const bottomHalf = messages.slice(mid)

  console.log(`OpenAI: analyzing ${messages.length} messages in 2 calls (top ${topHalf.length}, bottom ${bottomHalf.length})`)

  const [topResults, bottomResults] = await Promise.all([
    analyzeChunk(weekNum, topHalf, 0),
    bottomHalf.length ? analyzeChunk(weekNum, bottomHalf, mid) : Promise.resolve([]),
  ])

  const combined = [...topResults, ...bottomResults]
  if (combined.length !== messages.length) {
    console.warn(
      `OpenAI returned ${combined.length} metrics but input had ${messages.length} messages. Truncating to min length.`,
    )
  }
  return combined.slice(0, messages.length)
}

