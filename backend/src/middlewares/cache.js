import NodeCache from 'node-cache';

// Cache objects for 5 minutes (300 seconds) by default
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

/**
 * Cache middleware to store API responses
 * @param {number} duration - Cache duration in seconds
 */
export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // We only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key based on the URL and query parameters
    const key = '__express__' + req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log(`[CACHE HIT] ${key}`);
      return res.json(cachedResponse);
    } else {
      console.log(`[CACHE MISS] ${key}`);
      
      // Override res.json to cache the response before sending it
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cache.set(key, body, duration);
        }
        originalJson(body);
      };
      
      next();
    }
  };
};

/**
 * Utility function to map and clear cached routes if records are updated
 * @param {string} prefix - The path prefix to flush
 */
export const clearCache = (prefix = null) => {
  if (prefix) {
    const keys = cache.keys();
    const keysToDelete = keys.filter(key => key.includes(prefix));
    cache.del(keysToDelete);
    console.log(`[CACHE CLEAR] Cleared keys containing: ${prefix}`);
  } else {
    cache.flushAll();
    console.log('[CACHE CLEAR ALL] Cleared all cache');
  }
};
