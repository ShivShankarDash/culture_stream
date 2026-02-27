import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import dotenv from 'dotenv';
import { WebClient } from '@slack/web-api';

dotenv.config();

const token = process.env.SLACK_BOT_TOKEN;

if (!token) {
  console.error(
    'SLACK_BOT_TOKEN is not set. Add it to your environment or a .env file.',
  );
  process.exit(1);
}

const web = new WebClient(token);

const DATASET_FILE = path.join(__dirname, 'dataset.json');
const CHANNELS_MAPPING_FILE = path.join(__dirname, 'channels_mapping.json');

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type WeekMessages = Array<{
  channel: string;
  payload: string;
}>;

function loadDataset(): WeekMessages[] {
  const raw = fs.readFileSync(DATASET_FILE, 'utf8');
  return JSON.parse(raw) as WeekMessages[];
}

type ChannelMapping = Record<string, string>;

function loadChannelMapping(): ChannelMapping {
  const raw = fs.readFileSync(CHANNELS_MAPPING_FILE, 'utf8');
  return JSON.parse(raw) as ChannelMapping;
}

function askWeekNumber(maxWeeks: number): Promise<number> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      `Enter week number (1-${maxWeeks}) to upload: `,
      (answer: string) => {
        rl.close();
        const num = parseInt(answer, 10);
        if (!Number.isInteger(num) || num < 1 || num > maxWeeks) {
          console.error(
            `Invalid week number "${answer}". Please enter a number between 1 and ${maxWeeks}.`,
          );
          process.exit(1);
        }
        resolve(num);
      },
    );
  });
}

(async () => {
  try {
    const allWeeks = loadDataset();
    const channelMapping = loadChannelMapping();

    if (!Array.isArray(allWeeks)) {
      console.error('dataset.json is not an array of weeks.');
      process.exit(1);
    }

    const maxWeeks = allWeeks.length;
    const weekNumber = await askWeekNumber(maxWeeks);
    const weekIndex = weekNumber - 1; // week 1 -> index 0
    const weekMessages = allWeeks[weekIndex];

    if (!Array.isArray(weekMessages)) {
      console.error(`Week ${weekNumber} is not a list of messages.`);
      process.exit(1);
    }

    console.log(
      `Uploading messages for week ${weekNumber} (total ${weekMessages.length} messages)`,
    );

    for (let i = 0; i < weekMessages.length; i++) {
      const entry = weekMessages[i];
      if (!entry || !entry.channel || !entry.payload) {
        // eslint-disable-next-line no-console
        console.warn(`Skipping invalid entry at index ${i}:`, entry);
        continue;
      }

      const channelName = entry.channel;
      const channelId = channelMapping[channelName];

      if (!channelId) {
        console.error(
          `No channel ID found for "${channelName}" in channels_mapping.json. Skipping message index ${i}.`,
        );
        continue;
      }

      try {
        const res: any = await web.chat.postMessage({
          channel: channelId,
          text: entry.payload,
        });

        console.log(
          `Sent message ${i + 1}/${weekMessages.length} to ${channelName} (channelId=${channelId}) ts=${res.ts}`,
        );
      } catch (e: any) {
        console.error(
          `Failed to send message index ${i} to ${channelName}:`,
          e?.data || e?.message || e,
        );
      }

      // 500 ms delay before sending the next message
      await sleep(500);
    }

    console.log(`Finished sending all messages for week ${weekNumber}.`);
  } catch (err) {
    console.error('Error uploading messages from dataset:', err);
  }
})();

