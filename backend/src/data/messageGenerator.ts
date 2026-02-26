/**
 * Message Generator Module
 * Generates synthetic Slack messages for the 8-week culture degradation simulation
 */

interface User {
  id: string;
  name: string;
  role: "backend" | "frontend" | "product" | "design" | "devops";
  team: string;
}

interface Channel {
  id: string;
  name: string;
  type: "team" | "cross-team" | "announcement";
}

interface Message {
  id: string;
  timestamp: string;
  author_id: string;
  channel_id: string;
  text: string;
  sentiment: number; // 0-1
  mentions: string[];
  reactions: string[];
  thread_replies?: number;
}

type SimulationState = "healthy" | "warning" | "critical" | "recovery";

class MessageGenerator {
  private users: User[];
  private channels: Channel[];

  constructor() {
    this.users = this.initializeUsers();
    this.channels = this.initializeChannels();
  }

  private initializeUsers(): User[] {
    // TODO: Load from CULTURE_STREAM_DATA_SCHEMA.md
    return [
      { id: "u1", name: "Alice", role: "backend", team: "platform" },
      { id: "u2", name: "Bob", role: "frontend", team: "web" },
      { id: "u3", name: "Charlie", role: "product", team: "product" },
      { id: "u4", name: "Diana", role: "design", team: "design" },
      { id: "u5", name: "Eve", role: "devops", team: "platform" },
      // ... expand to 15 users
    ];
  }

  private initializeChannels(): Channel[] {
    // TODO: Load from CULTURE_STREAM_DATA_SCHEMA.md
    return [
      { id: "c1", name: "general", type: "announcement" },
      { id: "c2", name: "engineering", type: "team" },
      { id: "c3", name: "product", type: "team" },
      { id: "c4", name: "design", type: "team" },
      { id: "c5", name: "eng-product", type: "cross-team" },
      { id: "c6", name: "random", type: "announcement" },
    ];
  }

  /**
   * Generate messages for a specific week
   * @param week Week number (1-8)
   * @param state Current simulation state
   * @returns Array of synthetic messages
   */
  public generateWeekMessages(week: number, state: SimulationState): Message[] {
    console.log(`📝 Generating messages for Week ${week} (${state})`);

    const messageCount = this.getMessageCountForWeek(week);
    const messages: Message[] = [];

    // TODO: Implement message generation based on state and week
    // See CULTURE_STREAM_DATA_SCHEMA.md for templates

    for (let i = 0; i < messageCount; i++) {
      const message: Message = {
        id: `msg_${week}_${i}`,
        timestamp: new Date().toISOString(),
        author_id: this.randomUser().id,
        channel_id: this.randomChannel().id,
        text: "TODO: Generate message based on state",
        sentiment: this.calculateSentimentForState(state),
        mentions: [],
        reactions: ["👍"],
      };
      messages.push(message);
    }

    return messages;
  }

  private getMessageCountForWeek(week: number): number {
    // 85-115 messages per week
    return Math.floor(Math.random() * 30) + 85;
  }

  private calculateSentimentForState(state: SimulationState): number {
    // TODO: Map state to sentiment score (0-1)
    // healthy: 0.75, warning: 0.60-0.65, critical: 0.32-0.35, recovery: 0.50-0.68
    switch (state) {
      case "healthy":
        return 0.75;
      case "warning":
        return 0.62;
      case "critical":
        return 0.33;
      case "recovery":
        return 0.60;
      default:
        return 0.75;
    }
  }

  private randomUser(): User {
    return this.users[Math.floor(Math.random() * this.users.length)];
  }

  private randomChannel(): Channel {
    return this.channels[Math.floor(Math.random() * this.channels.length)];
  }
}

export default MessageGenerator;
