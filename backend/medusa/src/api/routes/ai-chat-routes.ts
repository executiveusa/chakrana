import { Router } from "express";
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import AIGatewayService, {
  StorefrontChatRequest,
  StorefrontChatResponse,
} from "../../services/ai-gateway-service";

/**
 * AI Chat Routes for the storefront
 *
 * POST /store/ai/chat - Main chat endpoint for the avatar
 */
export function aiChatRoutes(router: Router): Router {
  const aiRouter = Router();

  /**
   * POST /store/ai/chat
   *
   * Process a chat message from the storefront avatar interface.
   *
   * Request body follows the avatar_http_api contract:
   * {
   *   conversation_id?: string | null,
   *   message: string,
   *   customer: {
   *     id?: string | null,
   *     email?: string | null,
   *     locale?: string | null,
   *     region_id?: string | null
   *   },
   *   cart_id?: string | null,
   *   avatar_id: string,
   *   client_view: {
   *     page: string,
   *     url: string,
   *     device: "desktop" | "mobile" | "tablet"
   *   }
   * }
   */
  aiRouter.post("/chat", async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const aiGatewayService: AIGatewayService = req.scope.resolve("aiGatewayService");

      const {
        conversation_id,
        message,
        customer,
        cart_id,
        avatar_id,
        client_view,
      } = req.body;

      // Validate required fields
      if (!message || typeof message !== "string") {
        return res.status(400).json({
          message: "message is required and must be a string",
        });
      }

      if (!avatar_id || typeof avatar_id !== "string") {
        return res.status(400).json({
          message: "avatar_id is required and must be a string",
        });
      }

      if (!client_view || !client_view.page || !client_view.url || !client_view.device) {
        return res.status(400).json({
          message: "client_view with page, url, and device is required",
        });
      }

      // Validate device type
      const validDevices = ["desktop", "mobile", "tablet"];
      if (!validDevices.includes(client_view.device)) {
        return res.status(400).json({
          message: `client_view.device must be one of: ${validDevices.join(", ")}`,
        });
      }

      // Build the request
      const chatRequest: StorefrontChatRequest = {
        conversation_id: conversation_id || null,
        message,
        customer: customer || {},
        cart_id: cart_id || null,
        avatar_id,
        client_view: {
          page: client_view.page,
          url: client_view.url,
          device: client_view.device,
        },
      };

      // Process the chat through the AI gateway
      const response: StorefrontChatResponse =
        await aiGatewayService.processStorefrontChat(chatRequest);

      // Return the response following the avatar_http_api contract
      res.json({
        conversation_id: response.conversation_id,
        avatar_reply: response.avatar_reply,
        cart_delta: response.cart_delta,
        suggested_actions: response.suggested_actions,
      });
    } catch (error) {
      console.error("AI Chat error:", error);
      res.status(500).json({
        message: "Failed to process chat message",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      });
    }
  });

  /**
   * GET /store/ai/status
   *
   * Health check endpoint for the AI chat service
   */
  aiRouter.get("/status", async (_req: MedusaRequest, res: MedusaResponse) => {
    res.json({
      status: "ok",
      service: "chakrana-ai-avatar",
      timestamp: new Date().toISOString(),
    });
  });

  router.use("/store/ai", aiRouter);
  return router;
}
