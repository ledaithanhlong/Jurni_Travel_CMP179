const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// This middleware checks for a valid Clerk JWT in the request headers (Authorization: Bearer <token>)
exports.requireAuth = ClerkExpressRequireAuth({});
