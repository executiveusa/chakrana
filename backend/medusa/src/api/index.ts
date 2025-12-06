import { Router } from "express";
import { aiChatRoutes } from "./routes";
import { storefrontBlogRoutes, adminBlogRoutes } from "../modules/blog/routes";

/**
 * Main API router for Chakrana Medusa backend
 *
 * This router registers all custom routes for:
 * - Blog module (storefront and admin)
 * - AI chat avatar endpoint
 */
export default function initializeRoutes(router: Router): Router {
  // Register storefront blog routes: /store/blog/*
  storefrontBlogRoutes(router);

  // Register admin blog routes: /admin/blog/*
  adminBlogRoutes(router);

  // Register AI chat routes: /store/ai/*
  aiChatRoutes(router);

  return router;
}
