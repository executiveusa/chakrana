/**
 * Medusa Store Adapter
 *
 * Client-side adapter for communicating with the Medusa backend
 * and AI avatar endpoints.
 */

import type {
  StorefrontChatRequest,
  StorefrontChatResponse,
  BlogPostListResponse,
  BlogPostDetailResponse,
  BlogTagListResponse,
  CustomerContext,
  ClientView,
  DeviceType,
} from "../../types/medusa";

// Default configuration
const DEFAULT_MEDUSA_URL =
  import.meta.env.VITE_MEDUSA_URL || "http://localhost:9000";
const DEFAULT_AVATAR_ID =
  import.meta.env.VITE_AVATAR_ID || "chakrana-guide";

/**
 * Configuration for the Medusa store adapter
 */
export interface MedusaConfig {
  baseUrl: string;
  avatarId: string;
}

/**
 * Get the current device type
 */
function getDeviceType(): DeviceType {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/**
 * Generate a unique message ID
 */
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Medusa Store Adapter Class
 */
class MedusaStoreAdapter {
  private config: MedusaConfig;
  private conversationId: string | null = null;
  private cartId: string | null = null;
  private customer: CustomerContext = {};

  constructor(config?: Partial<MedusaConfig>) {
    this.config = {
      baseUrl: config?.baseUrl || DEFAULT_MEDUSA_URL,
      avatarId: config?.avatarId || DEFAULT_AVATAR_ID,
    };
  }

  /**
   * Set the current customer context
   */
  setCustomer(customer: CustomerContext): void {
    this.customer = customer;
  }

  /**
   * Set the current cart ID
   */
  setCartId(cartId: string | null): void {
    this.cartId = cartId;
  }

  /**
   * Get the current conversation ID
   */
  getConversationId(): string | null {
    return this.conversationId;
  }

  /**
   * Clear the current conversation (start fresh)
   */
  clearConversation(): void {
    this.conversationId = null;
  }

  // ===========================================================================
  // Avatar Chat API
  // ===========================================================================

  /**
   * Send a message to the store avatar
   *
   * @param message - The user's message
   * @returns The avatar's response
   */
  async sendToStoreAvatar(message: string): Promise<StorefrontChatResponse> {
    const clientView: ClientView = {
      page: document.title || "Chakrana",
      url: window.location.href,
      device: getDeviceType(),
    };

    const request: StorefrontChatRequest = {
      conversation_id: this.conversationId,
      message,
      customer: this.customer,
      cart_id: this.cartId,
      avatar_id: this.config.avatarId,
      client_view: clientView,
    };

    const response = await this.post<StorefrontChatResponse>(
      "/store/ai/chat",
      request
    );

    // Update conversation ID for subsequent messages
    if (response.conversation_id) {
      this.conversationId = response.conversation_id;
    }

    // Update cart ID if modified
    if (response.cart_delta.cart_id) {
      this.cartId = response.cart_delta.cart_id;
    }

    return response;
  }

  /**
   * Check the AI chat service status
   */
  async checkAvatarStatus(): Promise<{
    status: string;
    service: string;
    timestamp: string;
  }> {
    return this.get("/store/ai/status");
  }

  // ===========================================================================
  // Blog API
  // ===========================================================================

  /**
   * List published blog posts
   */
  async listBlogPosts(params?: {
    q?: string;
    tag?: string;
    limit?: number;
    offset?: number;
  }): Promise<BlogPostListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set("q", params.q);
    if (params?.tag) searchParams.set("tag", params.tag);
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.offset) searchParams.set("offset", String(params.offset));

    const query = searchParams.toString();
    return this.get(`/store/blog/posts${query ? `?${query}` : ""}`);
  }

  /**
   * Get a single blog post by slug
   */
  async getBlogPost(slug: string): Promise<BlogPostDetailResponse> {
    return this.get(`/store/blog/posts/${encodeURIComponent(slug)}`);
  }

  /**
   * List all blog tags
   */
  async listBlogTags(): Promise<BlogTagListResponse> {
    return this.get("/store/blog/tags");
  }

  // ===========================================================================
  // HTTP Helpers
  // ===========================================================================

  private async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const medusaStore = new MedusaStoreAdapter();

// Export class for custom instances
export { MedusaStoreAdapter };

// Export utility functions
export { getDeviceType, generateMessageId };
