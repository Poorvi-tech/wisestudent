import rateLimit from "express-rate-limit";

const baseConfig = {
  standardHeaders: true,
  legacyHeaders: false,
  // Skip CORS preflight OPTIONS requests from rate limiting
  skip: (req) => req.method === 'OPTIONS',
};

export const apiLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 1000,
  // Higher limit for development, much stricter in production (via environment variable)
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
});

export const authLimiter = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: "Too many login attempts, please try again after 15 minutes.",
  },
});

export const readLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 1000,
  max: 300,
});
