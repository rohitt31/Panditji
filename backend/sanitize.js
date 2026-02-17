/**
 * Input Sanitization Middleware
 * Strips HTML/script tags from all string values in request bodies.
 * Prevents stored XSS attacks.
 */

const HTML_TAG_REGEX = /<[^>]*>/g;

/**
 * Recursively sanitize all string values in an object.
 */
const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        return value
            .replace(HTML_TAG_REGEX, '')   // Strip HTML tags
            .replace(/javascript:/gi, '')   // Strip JS protocol
            .replace(/on\w+\s*=/gi, '')     // Strip inline event handlers
            .trim();
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }
    if (value && typeof value === 'object') {
        return sanitizeObject(value);
    }
    return value;
};

const sanitizeObject = (obj) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeValue(value);
    }
    return sanitized;
};

/**
 * Express middleware — sanitizes req.body on POST/PUT/PATCH requests.
 */
const sanitizeMiddleware = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    next();
};

export default sanitizeMiddleware;
