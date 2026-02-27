import fs from 'node:fs';
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

// Same channel as your main script
const CHANNEL_ID = 'C0AGU54TZ0F';

// 26 Feb 2026 00:00:00 IST = 25 Feb 2026 18:30:00 UTC
const oldestTimestamp = Date.UTC(2026, 1, 25, 18, 30) / 1000; // seconds since epoch

// Output text file (overwritten on each run)
const OUTPUT_TEXT_FILE = 'messages_since_2026_02_26_IST.txt';
// Output JSON file (overwritten on each run)
const OUTPUT_JSON_FILE = 'messages_since_2026_02_26_IST.json';

// Cache for userId -> display name
const userNameCache: Record<string, string> = {};

async function getUserName(userId?: string): Promise<string> {
  if (!userId) return 'Unknown';
  if (userNameCache[userId]) return userNameCache[userId];

  try {
    const res: any = await web.users.info({ user: userId });
    const profile = res.user?.profile ?? {};
    const name =
      profile.display_name ||
      profile.real_name ||
      res.user?.name ||
      userId;
    userNameCache[userId] = name;
    return name;
  } catch (e: any) {
    console.error(
      `Failed to fetch user info for ${userId}:`,
      e?.data || e?.message || e,
    );
    userNameCache[userId] = userId;
    return userId;
  }
}

type SlackRichTextElement = {
  type: string;
  text?: string;
  unicode?: string;
  name?: string;
  elements?: SlackRichTextElement[];
};

type SlackMessage = {
  ts?: string;
  user?: string;
  text?: string;
  blocks?: Array<{
    elements?: SlackRichTextElement[];
  }>;
  thread_ts?: string;
  reply_count?: number;
};

function extractTextWithEmojis(msg: SlackMessage): string {
  if (msg.text) {
    return msg.text;
  }

  if (!Array.isArray(msg.blocks)) {
    return '';
  }

  const parts: string[] = [];

  for (const block of msg.blocks) {
    if (!Array.isArray(block.elements)) continue;

    for (const el of block.elements) {
      if (el.type === 'rich_text_section' && Array.isArray(el.elements)) {
        for (const child of el.elements) {
          if (child.type === 'text' && child.text) {
            parts.push(child.text);
          } else if (child.type === 'emoji') {
            if (child.unicode) {
              parts.push(child.unicode);
            } else if (child.name) {
              parts.push(`:${child.name}:`);
            }
          }
        }
      }
    }
  }

  return parts.join('');
}

(async () => {
  try {
    let allMessages: SlackMessage[] = [];
    let cursor: string | undefined;

    // 1) Fetch the whole channel history since oldestTimestamp
    do {
      const result: any = await web.conversations.history({
        channel: CHANNEL_ID,
        oldest: oldestTimestamp.toString(),
        limit: 200,
        cursor,
      });

      allMessages = allMessages.concat((result.messages ?? []) as SlackMessage[]);
      cursor = result.response_metadata?.next_cursor || undefined;
    } while (cursor);

    // Sort by time ascending to get full conversation from beginning
    allMessages.sort(
      (a, b) => parseFloat(a.ts ?? '0') - parseFloat(b.ts ?? '0'),
    );

    // 2) For any message that has replies, fetch the full thread
    const threadRepliesMap = new Map<string, SlackMessage[]>(); // threadId -> replies[]
    const threadSummaries: {
      threadId: string;
      parent: SlackMessage;
      replies: SlackMessage[];
    }[] = [];
    const parentByThreadId = new Map<string, SlackMessage>();

    for (const msg of allMessages) {
      if (!msg || !msg.ts) continue;

      const isThreadStarterExplicit =
        msg.thread_ts && msg.thread_ts === msg.ts;
      const isTopLevelWithReplies =
        !!msg.reply_count && msg.reply_count > 0 && !msg.thread_ts;

      if (!isThreadStarterExplicit && !isTopLevelWithReplies) {
        continue;
      }

      const threadId = isThreadStarterExplicit ? msg.thread_ts! : msg.ts;

      // Avoid refetching if we already processed this thread
      if (threadRepliesMap.has(threadId)) {
        continue;
      }

      parentByThreadId.set(threadId, msg);
      const replies: SlackMessage[] = [];
      let cursorReplies: string | undefined;

      try {
        do {
          const res: any = await web.conversations.replies({
            channel: CHANNEL_ID,
            ts: threadId,
            cursor: cursorReplies,
            limit: 200,
            oldest: oldestTimestamp.toString(),
          });

          const msgs = (res.messages ?? []).filter(
            (m: SlackMessage) => m.ts !== threadId,
          ) as SlackMessage[];
          replies.push(...msgs);

          cursorReplies = res.response_metadata?.next_cursor || undefined;
        } while (cursorReplies);
      } catch (e: any) {
        console.error(
          `Failed to fetch replies for thread ${threadId}:`,
          e?.data || e?.message || e,
        );
      }

      replies.sort(
        (a, b) => parseFloat(a.ts ?? '0') - parseFloat(b.ts ?? '0'),
      );

      threadRepliesMap.set(threadId, replies);
      threadSummaries.push({ threadId, parent: msg, replies });
    }

    // 3) Build text lines in a single chronological pass over allMessages
    const lines: string[] = [];
    const printedTs = new Set<string>();

    for (const msg of allMessages) {
      if (!msg || !msg.ts) continue;
      if (printedTs.has(msg.ts)) continue; // already printed via a thread

      const isReply = !!msg.thread_ts && msg.thread_ts !== msg.ts;
      const indent = isReply ? '\t' : '';

      const name = await getUserName(msg.user);
      const tsNum = parseFloat(msg.ts);
      const utcDate = Number.isNaN(tsNum) ? null : new Date(tsNum * 1000);
      const istTime = utcDate
        ? utcDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : 'Unknown time';
      const rawText = extractTextWithEmojis(msg);
      const text = (rawText || '').replace(/\s+/g, ' ').trim();

      lines.push(`${indent}${name}: ${text || '[no text]'} | ${istTime}`);
      printedTs.add(msg.ts);

      // If this is a thread starter, also dump its replies immediately after it
      const threadId =
        msg.thread_ts && msg.thread_ts === msg.ts ? msg.thread_ts : msg.ts;
      const replies = threadRepliesMap.get(threadId) ?? [];

      for (const child of replies) {
        if (!child || !child.ts || printedTs.has(child.ts)) continue;

        const childName = await getUserName(child.user);
        const childTsNum = parseFloat(child.ts);
        const childUtcDate = Number.isNaN(childTsNum)
          ? null
          : new Date(childTsNum * 1000);
        const childIstTime = childUtcDate
          ? childUtcDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
          : 'Unknown time';

        const childRawText = extractTextWithEmojis(child);
        const childText = (childRawText || '').replace(/\s+/g, ' ').trim();

        lines.push(
          `\t${childName}: ${childText || '[no text]'} | ${childIstTime}`,
        );
        printedTs.add(child.ts);
      }
    }

    // Write pretty text file (overwrite)
    fs.writeFileSync(OUTPUT_TEXT_FILE, lines.join('\n'), 'utf8');

    // Write JSON structure (threads with parent + replies)
    const jsonPayload = {
      channelId: CHANNEL_ID,
      oldestTimestamp,
      generatedAt: new Date().toISOString(),
      // Full flat history from oldest to newest (includes thread starters and any replies that appear in history)
      messages: allMessages,
      // Thread view built from conversations.replies
      threads: threadSummaries.map((t) => ({
        threadId: t.threadId,
        parent: t.parent,
        replies: t.replies,
      })),
    };

    fs.writeFileSync(
      OUTPUT_JSON_FILE,
      JSON.stringify(jsonPayload, null, 2),
      'utf8',
    );

    console.log(
      `Threaded messages written to ${OUTPUT_TEXT_FILE} and ${OUTPUT_JSON_FILE}`,
    );
  } catch (error) {
    console.error('Error exporting messages since 26 Feb 2026 IST:', error);
  }
})();

