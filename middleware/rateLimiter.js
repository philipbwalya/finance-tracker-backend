import ratelimit from "../config/upstash.js";

export default async function rateLimiter(req, res, next) {
  try {
    // Use user ID if authenticated, fallback to IP address
    const identifier = req.user?.id || req.ip;
    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests, Please try again later" });
    }
    next();
  } catch (error) {
    console.log("Error rate limiting", error);
    next(error);
  }
}
