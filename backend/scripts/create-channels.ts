import fs from 'node:fs';
import path from 'node:path';
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
const OUTPUT_CHANNELS_FILE = path.join(__dirname, 'channels_mapping.json');

type DatasetMessage = { channel?: string; payload?: string };

async function loadDatasetChannels(): Promise<string[]> {
  const raw = fs.readFileSync(DATASET_FILE, 'utf8');
  const weeks = JSON.parse(raw) as DatasetMessage[][];

  const channels = new Set<string>();

  for (const weekMessages of weeks) {
    if (!Array.isArray(weekMessages)) continue;
    for (const item of weekMessages) {
      if (!item?.channel) continue;
      channels.add(item.channel);
    }
  }

  return Array.from(channels);
}

type ExistingChannelsByName = Record<string, string>;

async function loadExistingChannels(): Promise<ExistingChannelsByName> {
  const existingByName: ExistingChannelsByName = {};
  let cursor: string | undefined;

  do {
    const res: any = await web.conversations.list({
      limit: 1000,
      cursor,
      types: 'public_channel,private_channel',
    });

    for (const ch of res.channels ?? []) {
      if (!ch || !ch.name || !ch.id) continue;
      existingByName[ch.name] = ch.id;
    }

    cursor = res.response_metadata?.next_cursor || undefined;
  } while (cursor);

  return existingByName;
}

(async () => {
  try {
    const datasetChannels = await loadDatasetChannels();
    const existingByName = await loadExistingChannels();

    const mapping: Record<string, string> = {};

    for (const originalName of datasetChannels) {
      const apiName = originalName.replace(/^#/, '');

      if (!apiName) {
        console.warn(
          `Skipping invalid channel name from dataset: "${originalName}"`,
        );
        continue;
      }

      let channelId = existingByName[apiName];

      if (!channelId) {
        try {
          const created: any = await web.conversations.create({
            name: apiName,
          });

          const createdChannel = created.channel;
          if (!createdChannel || !createdChannel.id) {
            console.error(
              `Created channel response missing id for ${originalName}`,
            );
            continue;
          }

          channelId = createdChannel.id;
          existingByName[apiName] = channelId;

          console.log(`Created channel ${originalName} (${channelId})`);
        } catch (e: any) {
          console.error(
            `Error creating channel ${originalName}:`,
            e?.data || e?.message || e,
          );
          continue;
        }
      } else {
        console.log(`Channel ${originalName} already exists as ${channelId}`);
      }

      mapping[originalName] = channelId;
    }

    fs.writeFileSync(
      OUTPUT_CHANNELS_FILE,
      JSON.stringify(mapping, null, 2),
      'utf8',
    );
    console.log(
      `Channel name -> id mapping written to ${OUTPUT_CHANNELS_FILE}`,
    );
  } catch (err) {
    console.error('Error creating channels from dataset:', err);
  }
})();

