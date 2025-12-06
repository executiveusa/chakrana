import { TransactionBaseService } from "@medusajs/medusa";

/**
 * Avatar emotion types supported by the system
 */
export type AvatarEmotion =
  | "neutral"
  | "happy"
  | "excited"
  | "curious"
  | "thinking"
  | "reassuring"
  | "apologetic";

/**
 * Speech hint for avatar response pacing
 */
export type SpeechHint = "short" | "normal" | "detailed";

/**
 * Device type for client context
 */
export type DeviceType = "desktop" | "mobile" | "tablet";

/**
 * Client view context passed with chat requests
 */
export interface ClientView {
  page: string;
  url: string;
  device: DeviceType;
}

/**
 * Customer context for personalization
 */
export interface CustomerContext {
  id?: string | null;
  email?: string | null;
  locale?: string | null;
  region_id?: string | null;
}

/**
 * Chat request payload from storefront
 */
export interface StorefrontChatRequest {
  conversation_id?: string | null;
  message: string;
  customer: CustomerContext;
  cart_id?: string | null;
  avatar_id: string;
  client_view: ClientView;
}

/**
 * Avatar reply structure
 */
export interface AvatarReply {
  reply_text: string;
  emotion: AvatarEmotion;
  animation_key?: string | null;
  speech_hint: SpeechHint;
}

/**
 * Cart line item summary
 */
export interface CartLineItemSummary {
  title: string;
  variant_title?: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

/**
 * Cart delta information
 */
export interface CartDelta {
  action: "none" | "created" | "updated";
  cart_id?: string | null;
  summary?: {
    line_items: CartLineItemSummary[];
    total: number;
  };
}

/**
 * Suggested action types
 */
export type SuggestedActionType =
  | "go_to_checkout"
  | "show_product"
  | "show_blog_post"
  | "none";

/**
 * Suggested action for frontend
 */
export interface SuggestedAction {
  type: SuggestedActionType;
  payload: Record<string, unknown>;
}

/**
 * Chat response from the AI gateway
 */
export interface StorefrontChatResponse {
  conversation_id: string;
  avatar_reply: AvatarReply;
  cart_delta: CartDelta;
  suggested_actions: SuggestedAction[];
}

/**
 * Lead segment types for outbound campaigns
 */
export type LeadSegment =
  | "abandoned_cart_7_days"
  | "repeat_buyers"
  | "newsletter_subscribers"
  | "inactive_30_days";

/**
 * Lead information for outbound
 */
export interface Lead {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  segment: LeadSegment;
  metadata?: Record<string, unknown>;
}

/**
 * Outbound message request
 */
export interface OutboundMessageRequest {
  channel: "email" | "chat" | "sms";
  recipient_id?: string;
  recipient_address?: string;
  subject?: string;
  body_text: string;
  cta_url?: string;
  campaign_id?: string;
  is_transactional?: boolean;
}

/**
 * Daily outbound campaign result
 */
export interface DailyOutboundResult {
  messages_sent: number;
  segments_processed: LeadSegment[];
  observations: string[];
  draft_posts_created: number;
}

/**
 * Configuration for the AI Gateway
 */
interface AIGatewayConfig {
  url: string;
  apiKey: string;
}

/**
 * AI Gateway Service
 *
 * This service acts as an intermediary between the Medusa storefront
 * and the AI avatar runtime (e.g., CrewAI, Yappiverse).
 *
 * It handles:
 * - Storefront chat conversations
 * - Daily outbound campaign orchestration
 * - Avatar channel communication
 */
class AIGatewayService extends TransactionBaseService {
  private config_: AIGatewayConfig;

  constructor(container: Record<string, unknown>) {
    super(container);
    const config = (container as any).configModule;
    this.config_ = {
      url: config?.aiGateway?.url || process.env.AI_GATEWAY_URL || "http://localhost:3100",
      apiKey: config?.aiGateway?.apiKey || process.env.AI_GATEWAY_API_KEY || "",
    };
  }

  /**
   * Process a storefront chat message
   *
   * This method forwards the chat request to the AI avatar runtime
   * and returns the avatar's response along with any cart modifications
   * and suggested actions.
   */
  async processStorefrontChat(
    request: StorefrontChatRequest
  ): Promise<StorefrontChatResponse> {
    try {
      // In a real implementation, this would call the CrewAI/avatar runtime
      // For now, we return a helpful default response based on the context
      const response = await this.callAvatarRuntime(
        "/crews/medusa-store-avatar/storefront_chat",
        request
      );

      return response as StorefrontChatResponse;
    } catch (error) {
      // Fallback response if the AI gateway is unavailable
      return this.createFallbackResponse(request);
    }
  }

  /**
   * Trigger daily outbound campaign processing
   *
   * This method initiates the daily outbound workflow in the avatar runtime,
   * which pulls leads, generates personalized messages, and sends them
   * through the configured channels.
   */
  async triggerDailyOutbound(): Promise<DailyOutboundResult> {
    try {
      const response = await this.callAvatarRuntime(
        "/crews/medusa-store-avatar/daily_outbound",
        {}
      );

      return response as DailyOutboundResult;
    } catch (error) {
      return {
        messages_sent: 0,
        segments_processed: [],
        observations: ["Daily outbound failed: AI gateway unavailable"],
        draft_posts_created: 0,
      };
    }
  }

  /**
   * Send a message to the avatar channel
   *
   * This is used to send structured responses to the avatar engine
   * for rendering with appropriate emotion and animation.
   */
  async sendToAvatarChannel(
    conversation_id: string,
    avatar_id: string,
    reply_text: string,
    options: {
      emotion?: AvatarEmotion;
      animation_key?: string | null;
      speech_hint?: SpeechHint;
    } = {}
  ): Promise<void> {
    const payload = {
      conversation_id,
      avatar_id,
      reply_text,
      emotion: options.emotion || "neutral",
      animation_key: options.animation_key || null,
      speech_hint: options.speech_hint || "normal",
    };

    await this.callAvatarRuntime("/avatar/channel", payload);
  }

  /**
   * Call the avatar runtime API
   */
  private async callAvatarRuntime(
    endpoint: string,
    payload: Record<string, unknown>
  ): Promise<unknown> {
    const url = `${this.config_.url}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config_.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`AI Gateway request failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Create a fallback response when the AI gateway is unavailable
   */
  private createFallbackResponse(
    request: StorefrontChatRequest
  ): StorefrontChatResponse {
    const conversationId = request.conversation_id || this.generateConversationId();

    // Parse the message to provide a contextual fallback
    const message = request.message.toLowerCase();
    let replyText = "";
    let emotion: AvatarEmotion = "neutral";
    const suggestedActions: SuggestedAction[] = [];

    if (message.includes("help") || message.includes("question")) {
      replyText =
        "I'm here to help you on your wellness journey! I can assist you with finding the right chakra meditation products, answering questions about our offerings, or guiding you through our blog for wellness tips. What would you like to explore today?";
      emotion = "reassuring";
    } else if (message.includes("product") || message.includes("buy") || message.includes("shop")) {
      replyText =
        "I'd love to help you find the perfect wellness products! We have a beautiful selection of chakra meditation tools, crystals, and guided meditation programs. What aspect of your wellness practice are you looking to enhance?";
      emotion = "happy";
      suggestedActions.push({
        type: "show_product",
        payload: { category: "meditation-tools" },
      });
    } else if (message.includes("blog") || message.includes("article") || message.includes("learn")) {
      replyText =
        "Our blog has wonderful resources on chakra healing, meditation techniques, and holistic wellness. I can recommend some articles based on your interests. What topic would you like to learn more about?";
      emotion = "curious";
      suggestedActions.push({
        type: "show_blog_post",
        payload: { category: "wellness" },
      });
    } else if (message.includes("cart") || message.includes("checkout")) {
      replyText =
        "I see you're ready to complete your order! Let me help you with that. Would you like to review your cart before proceeding to checkout?";
      emotion = "excited";
      suggestedActions.push({
        type: "go_to_checkout",
        payload: {},
      });
    } else {
      replyText =
        "Welcome to Chakrana! 🌟 I'm your wellness guide, here to help you discover products and content that support your spiritual journey. Whether you're looking for chakra healing tools, meditation guides, or wellness insights from our blog, I'm here to assist. How can I support your path today?";
      emotion = "happy";
    }

    return {
      conversation_id: conversationId,
      avatar_reply: {
        reply_text: replyText,
        emotion,
        animation_key: null,
        speech_hint: "normal",
      },
      cart_delta: {
        action: "none",
        cart_id: request.cart_id || null,
      },
      suggested_actions: suggestedActions,
    };
  }

  /**
   * Generate a unique conversation ID
   */
  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

export default AIGatewayService;
