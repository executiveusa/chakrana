import {
  type ScheduledJobConfig,
  type ScheduledJobArgs,
} from "@medusajs/medusa";
import AIGatewayService from "../services/ai-gateway-service";

/**
 * AI Sales Daily Outbound Job
 *
 * This scheduled job runs once per day to trigger the AI avatar's
 * outbound campaign workflow. It:
 *
 * 1. Pulls targeted lead segments (abandoned carts, repeat buyers, etc.)
 * 2. Generates personalized outreach messages
 * 3. Sends messages via configured channels (email, SMS, chat)
 * 4. Optionally creates draft blog posts based on observed patterns
 *
 * The job is designed to respect:
 * - Frequency caps per lead
 * - Quiet hours configuration
 * - Opt-in preferences
 */
export default async function handler({ container, data, pluginOptions }: ScheduledJobArgs) {
  const aiGatewayService: AIGatewayService = container.resolve("aiGatewayService");

  console.log("[ai-sales-daily-outbound] Starting daily outbound campaign...");

  try {
    const result = await aiGatewayService.triggerDailyOutbound();

    console.log("[ai-sales-daily-outbound] Campaign completed:", {
      messages_sent: result.messages_sent,
      segments_processed: result.segments_processed,
      draft_posts_created: result.draft_posts_created,
    });

    if (result.observations.length > 0) {
      console.log("[ai-sales-daily-outbound] Observations:", result.observations);
    }
  } catch (error) {
    console.error("[ai-sales-daily-outbound] Failed to complete campaign:", error);
    throw error;
  }
}

/**
 * Job configuration
 *
 * Runs daily at 9:00 AM (server time)
 * Can be adjusted via DAILY_OUTBOUND_CRON env variable
 */
export const config: ScheduledJobConfig = {
  name: "ai-sales-daily-outbound",
  schedule: process.env.DAILY_OUTBOUND_CRON || "0 9 * * *",
  data: {},
};
