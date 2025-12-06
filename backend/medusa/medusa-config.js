const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS origins for the storefront and admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";
const STORE_CORS = process.env.STORE_CORS || "http://localhost:5173,http://localhost:8000";
const AUTH_CORS =
  process.env.AUTH_CORS || "http://localhost:7000,http://localhost:7001,http://localhost:5173";

// Database
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-chakrana";

// Redis
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// JWT secrets
const JWT_SECRET = process.env.JWT_SECRET || "supersecret-chakrana-jwt";
const COOKIE_SECRET = process.env.COOKIE_SECRET || "supersecret-chakrana-cookie";

// Avatar AI gateway configuration
const AI_GATEWAY_URL = process.env.AI_GATEWAY_URL || "http://localhost:3100";
const AI_GATEWAY_API_KEY = process.env.AI_GATEWAY_API_KEY || "";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: process.env.STRIPE_API_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  },
];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL,
    },
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL,
    },
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: JWT_SECRET,
  cookieSecret: COOKIE_SECRET,
  database_url: DATABASE_URL,
  redis_url: REDIS_URL,
  store_cors: STORE_CORS,
  admin_cors: ADMIN_CORS,
  auth_cors: AUTH_CORS,
  database_extra:
    process.env.NODE_ENV === "production"
      ? { ssl: { rejectUnauthorized: false } }
      : {},
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
  featureFlags: {
    product_categories: true,
    tax_inclusive_pricing: true,
  },
  // Custom configuration for the AI avatar gateway
  aiGateway: {
    url: AI_GATEWAY_URL,
    apiKey: AI_GATEWAY_API_KEY,
  },
};
