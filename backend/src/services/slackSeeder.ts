import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import { WebClient } from '@slack/web-api'

dotenv.config()

const token = process.env.SLACK_BOT_TOKEN

if (!token) {
  console.error('SLACK_BOT_TOKEN is not set. Add it to your environment or a .env file.')
  throw new Error('SLACK_BOT_TOKEN is required for seeding messages to Slack')
}

const web = new WebClient(token)

const DEFAULT_CHANNELS_MAPPING_FILE = path.join(
  __dirname,
  '..',
  '..',
  'scripts',
  'channels_mapping.json',
)

const CHANNELS_MAPPING_FILE =
  process.env.CHANNELS_MAPPING_FILE && process.env.CHANNELS_MAPPING_FILE.trim().length > 0
    ? process.env.CHANNELS_MAPPING_FILE
    : DEFAULT_CHANNELS_MAPPING_FILE

export type SeedMessage = {
  channel: string
  payload: string
}

type ChannelMapping = Record<string, string>

function loadChannelMapping(): ChannelMapping {
  if (!fs.existsSync(CHANNELS_MAPPING_FILE)) {
    throw new Error(
      `channels_mapping.json not found. Expected at "${CHANNELS_MAPPING_FILE}". Run the channel creation script first.`,
    )
  }

  const raw = fs.readFileSync(CHANNELS_MAPPING_FILE, 'utf8')
  return JSON.parse(raw) as ChannelMapping
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Seed a batch of messages to Slack.
 * This is fire-and-forget from the perspective of the metrics pipeline:
 * failures are logged but do not block GPT analysis.
 */
export async function seedMessagesToSlack(messages: SeedMessage[]): Promise<void> {
  if (!messages.length) return

  const channelMapping = loadChannelMapping()
  

  for (let i = 0; i < messages.length; i++) {
    const entry = messages[i]
    if (!entry || !entry.channel || !entry.payload) {
      // eslint-disable-next-line no-console
      console.warn(`Skipping invalid seed entry at index ${i}:`, entry)
      continue
    }

    const channelName = entry.channel
    const channelId = channelMapping[channelName]

    if (!channelId) {
      console.error(
        `No channel ID found for "${channelName}" in channels_mapping.json. Skipping message index ${i}.`,
      )
      continue
    }

    try {
      await web.chat.postMessage({
        channel: channelId,
        text: entry.payload,
      })
    } catch (e: any) {
      console.error(
        `Failed to send message index ${i} to ${channelName}:`,
        e?.data || e?.message || e,
      )
    }

    // Small delay to avoid hitting rate limits too aggressively for large weeks
    await sleep(200)
  }
}

