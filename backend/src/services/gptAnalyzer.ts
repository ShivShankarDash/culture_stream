import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { MessageMetrics } from '../types'

dotenv.config()

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set. Add it to your environment or a .env file.')
  throw new Error('GEMINI_API_KEY is required for Gemini analysis')
}

const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

export type AnalyzableMessage = {
  channel: string
  payload: string
}

type GptResponsePayload = {
  messages: MessageMetrics[]
}

export async function analyzeMessagesWithGPT(
  weekNum: number,
  messages: AnalyzableMessage[],
): Promise<MessageMetrics[]> {
  if (!messages.length) return []

  const prompt =
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
      inputMessages: messages.map((m, index) => ({
        index,
        channel: m.channel,
        payload: m.payload,
      })),
    })

  console.log("calling the gemini api");
  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
    },
  })
  console.log("done")
  console.log(result)

  const text = result.response.text()
  let parsed: GptResponsePayload

  try {
    parsed = JSON.parse(text) as GptResponsePayload
  } catch (err) {
    console.error('Failed to parse Gemini JSON response:', text)
    throw err
  }

  if (!parsed.messages || !Array.isArray(parsed.messages)) {
    throw new Error('Gemini response is missing "messages" array')
  }

  if (parsed.messages.length !== messages.length) {
    console.warn(
      `Gemini returned ${parsed.messages.length} metrics but input had ${messages.length} messages. Truncating to min length.`,
    )
  }

  const count = Math.min(parsed.messages.length, messages.length)
  return parsed.messages.slice(0, count)
}

