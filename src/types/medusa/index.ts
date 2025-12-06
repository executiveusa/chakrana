/**
 * Medusa Store and Avatar API TypeScript Types
 *
 * These types correspond to the contracts defined in the spec:
 * - medusa_blog_module
 * - avatar_http_api
 * - runtime_tools
 */

// =============================================================================
// Avatar API Types
// =============================================================================

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
 * Request body for POST /store/ai/chat
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
 * Cart summary
 */
export interface CartSummary {
  line_items: CartLineItemSummary[];
  total: number;
}

/**
 * Cart delta information showing changes made by the avatar
 */
export interface CartDelta {
  action: "none" | "created" | "updated";
  cart_id?: string | null;
  summary?: CartSummary;
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
 * Suggested action for frontend navigation
 */
export interface SuggestedAction {
  type: SuggestedActionType;
  payload: Record<string, unknown>;
}

/**
 * Response body from POST /store/ai/chat
 */
export interface StorefrontChatResponse {
  conversation_id: string;
  avatar_reply: AvatarReply;
  cart_delta: CartDelta;
  suggested_actions: SuggestedAction[];
}

// =============================================================================
// Blog Module Types
// =============================================================================

/**
 * Blog post status
 */
export type BlogPostStatus = "draft" | "published" | "archived";

/**
 * Blog tag
 */
export interface BlogTag {
  id?: string;
  slug: string;
  name: string;
}

/**
 * Blog post (storefront version - no internal fields)
 */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  body_markdown: string;
  hero_image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  published_at?: string | null;
  tags: BlogTag[];
}

/**
 * Blog post (admin version - includes all fields)
 */
export interface AdminBlogPost extends BlogPost {
  status: BlogPostStatus;
  author_id?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Response from GET /store/blog/posts
 */
export interface BlogPostListResponse {
  posts: BlogPost[];
  count: number;
  offset: number;
  limit: number;
}

/**
 * Response from GET /store/blog/posts/:slug
 */
export interface BlogPostDetailResponse {
  post: BlogPost;
}

/**
 * Response from GET /store/blog/tags
 */
export interface BlogTagListResponse {
  tags: BlogTag[];
}

// =============================================================================
// Product Types (simplified for avatar use)
// =============================================================================

/**
 * Product variant
 */
export interface ProductVariant {
  id: string;
  title: string;
  prices: ProductPrice[];
  inventory_quantity?: number;
  sku?: string;
}

/**
 * Product price
 */
export interface ProductPrice {
  id: string;
  currency_code: string;
  amount: number;
}

/**
 * Product
 */
export interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string;
  thumbnail?: string | null;
  images?: ProductImage[];
  variants: ProductVariant[];
  collection_id?: string | null;
  tags?: ProductTag[];
}

/**
 * Product image
 */
export interface ProductImage {
  id: string;
  url: string;
}

/**
 * Product tag
 */
export interface ProductTag {
  id: string;
  value: string;
}

// =============================================================================
// Cart Types
// =============================================================================

/**
 * Cart line item
 */
export interface CartLineItem {
  id: string;
  title: string;
  variant_id: string;
  variant: ProductVariant;
  quantity: number;
  unit_price: number;
  subtotal: number;
  thumbnail?: string | null;
}

/**
 * Cart
 */
export interface Cart {
  id: string;
  region_id: string;
  items: CartLineItem[];
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  discount_total: number;
  total: number;
}

// =============================================================================
// Customer Types
// =============================================================================

/**
 * Customer
 */
export interface Customer {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
}

/**
 * Order (simplified)
 */
export interface Order {
  id: string;
  display_id: number;
  status: string;
  total: number;
  created_at: string;
  items: CartLineItem[];
}

// =============================================================================
// Chat Message Types (for UI state)
// =============================================================================

/**
 * Message role in conversation
 */
export type MessageRole = "user" | "assistant";

/**
 * Chat message for UI display
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  emotion?: AvatarEmotion;
  animation_key?: string | null;
  suggested_actions?: SuggestedAction[];
}
