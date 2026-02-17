/**
 * Pandit Ji — Production-Hardened Express Server
 * ================================================
 * Security measures implemented:
 *   1. Helmet (secure HTTP headers, env-aware CSP)
 *   2. CORS with origin allowlist
 *   3. Rate limiting (global + per-route)
 *   4. JWT auth with 7-day expiry + refresh token rotation
 *   5. Server-side admin role check on all protected routes
 *   6. Structured logger (no console.log in production)
 *   7. Generic error messages to clients; detailed logging server-side
 *   8. URL redirect allowlist validation
 *   9. File upload validation (type + size + path traversal prevention)
 *   10. Resource name allowlist (prevent arbitrary file access)
 *   11. XSS input sanitization on all request bodies
 *   12. Audit logging for all admin write operations
 *   13. Automated JSON data backups (npm run backup)
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import logger from './logger.js';
import sanitizeMiddleware from './sanitize.js';
import auditLog from './auditLog.js';
import {
    requireAdmin,
    setupAuthRoutes,
    seedDefaultAdmin,
    validateRedirectUrl
} from './auth.js';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// 1. SECURITY HEADERS (Helmet)
// ============================================================
app.use(helmet({
    contentSecurityPolicy: IS_PRODUCTION ? {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'blob:'],
            connectSrc: ["'self'"],
        }
    } : false,
    crossOriginEmbedderPolicy: false
}));

// ============================================================
// 2. CORS — Origin Allowlist
// ============================================================
const ALLOWED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:5173',
    'http://localhost:3000',
    // Add production domain here:
    // 'https://yourdomain.com',
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server, Postman, etc.)
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            logger.warn('CORS blocked request from disallowed origin', { origin });
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// ============================================================
// 3. GLOBAL RATE LIMITING
// ============================================================
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn('Global rate limit exceeded', { ip: req.ip, path: req.originalUrl });
        res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
});
app.use('/api/', globalLimiter);

// ============================================================
// Body Parsing
// ============================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// XSS Input Sanitization — applied AFTER body parsing
app.use(sanitizeMiddleware);

// Serve uploads (hardened: deny dotfiles, no directory listing)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    dotfiles: 'deny',
    index: false  // Disable directory listing
}));

// ============================================================
// 4. FILE UPLOAD VALIDATION
// ============================================================
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Sanitize filename: remove special chars, add timestamp
        const sanitized = file.originalname
            .replace(/[^a-zA-Z0-9.\-_]/g, '-')
            .toLowerCase();
        cb(null, `${Date.now()}-${sanitized}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            logger.warn('Rejected file upload with invalid MIME type', {
                mimetype: file.mimetype,
                originalname: file.originalname
            });
            cb(new Error('Invalid file type. Only JPEG, PNG, WebP, GIF, and SVG are allowed.'));
        }
    }
});

// ============================================================
// 5. RESOURCE ALLOWLIST (prevent arbitrary file-system access)
// ============================================================
const ALLOWED_RESOURCES = ['services', 'testimonials', 'gallery', 'cards', 'bookings'];

const validateResource = (req, res, next) => {
    const { resource } = req.params;
    if (!ALLOWED_RESOURCES.includes(resource)) {
        logger.warn('Attempted access to disallowed resource', { resource, ip: req.ip });
        return res.status(400).json({ error: 'Invalid resource.' });
    }
    next();
};

// ============================================================
// Data Helpers
// ============================================================
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const getFilePath = (resource) => path.join(dataDir, `${resource}.json`);

const readData = (resource) => {
    const file = getFilePath(resource);
    if (!fs.existsSync(file)) return [];
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
        logger.error(`Failed to read data file for ${resource}`, err);
        return [];
    }
};

const writeData = (resource, data) => {
    try {
        fs.writeFileSync(getFilePath(resource), JSON.stringify(data, null, 2));
    } catch (err) {
        logger.error(`Failed to write data file for ${resource}`, err);
        throw err;
    }
};

// ============================================================
// 6. AUTH ROUTES (login, refresh, change-password)
// ============================================================
setupAuthRoutes(app);

// ============================================================
// 7. REDIRECT VALIDATION ENDPOINT
// ============================================================
app.get('/api/redirect', (req, res) => {
    const target = validateRedirectUrl(req.query.to);
    res.redirect(target);
});

// ============================================================
// 8. AUDIT LOG — Read endpoint (admin only)
//    MUST be before generic /:resource routes to avoid conflict
// ============================================================
app.get('/api/admin/audit-log', requireAdmin, (req, res) => {
    try {
        const entries = auditLog.getRecent(100);
        res.json(entries);
    } catch (error) {
        logger.error('Error reading audit log', error);
        res.status(500).json({ error: 'Failed to load audit log.' });
    }
});

// ============================================================
// 9. AI AUTO-FILL — Generate service details from a prompt
//    MUST be before generic /:resource routes to avoid conflict
// ============================================================
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    handler: (req, res) => {
        logger.warn('AI rate limit exceeded', { ip: req.ip });
        res.status(429).json({ error: 'Too many AI requests. Please try again later.' });
    }
});

app.post('/api/ai/generate-service', aiLimiter, requireAdmin, async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 2) {
            return res.status(400).json({ error: 'Please provide a service name or description.' });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            logger.warn('GEMINI_API_KEY not set, returning fallback');
            return res.status(503).json({ error: 'AI service not configured. Please set GEMINI_API_KEY in .env' });
        }

        const systemPrompt = `You are an expert on Hindu religious ceremonies and Vedic rituals. Generate ONLY a valid JSON object (no markdown, no code fences) for a pooja/ritual service card for a Hindu priest's website.

The user will provide a service name or short description. Generate these fields:
- "title": Service name in English (max 30 chars)
- "subtitle": Short tagline (max 40 chars)
- "description": Compelling description for the website (EXACTLY 150-200 characters, no more)
- "duration": Typical duration (e.g., "2-3 hours", "Full day")
- "icon": A single relevant emoji representing this pooja/ritual
- "priceRange": Realistic Indian price range in rupees (e.g., "₹5,000 – ₹15,000")
- "features": Array of 4-6 short strings listing what's included (e.g., ["Ganesh Puja", "Vastu Shanti", "Navagraha Havan"])

Respond with ONLY the JSON object, no explanation.`;

        const fs = require('fs');
        fs.appendFileSync('debug.log', `\n--- START REQUEST ---\nPrompt: ${prompt}\n`);

        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: `${systemPrompt}\n\nGenerate service card for: ${prompt.trim()}` }] }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    }
                })
            }
        );

        fs.appendFileSync('debug.log', `Fetch Status: ${geminiRes.status} ${geminiRes.statusText}\n`);

        if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            fs.appendFileSync('debug.log', `API Error: ${errText}\n`);
            logger.error('Gemini API error', { status: geminiRes.status, body: errText });
            return res.status(502).json({ error: 'AI service temporarily unavailable.' });
        }

        const geminiData = await geminiRes.json();
        fs.appendFileSync('debug.log', `Response JSON parsed. Candidates: ${geminiData?.candidates?.length}\n`);

        const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        fs.appendFileSync('debug.log', `Raw Text: ${rawText}\n`);

        // Extract JSON from response (handle markdown code fences)
        let jsonStr = rawText.trim();
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
        }

        const parsed = JSON.parse(jsonStr);

        // Validate and sanitize
        const result = {
            title: String(parsed.title || '').substring(0, 50),
            subtitle: String(parsed.subtitle || '').substring(0, 60),
            description: String(parsed.description || '').substring(0, 200),
            duration: String(parsed.duration || '').substring(0, 30),
            icon: String(parsed.icon || '🙏').substring(0, 4),
            priceRange: String(parsed.priceRange || '').substring(0, 40),
            features: Array.isArray(parsed.features) ? parsed.features.slice(0, 8).map(f => String(f).substring(0, 60)) : []
        };

        logger.info('AI service generated', { prompt: prompt.trim(), adminId: req.user.id });
        res.json(result);
    } catch (error) {
        require('fs').appendFileSync('debug.log', `EXCEPTION: ${error.message}\nSTACK: ${error.stack}\n`);
        logger.error('AI generation error', error);
        res.status(500).json({ error: 'Failed to generate service details. Please try manually.' });
    }
});

// ============================================================
// 10. BOOKINGS — Public POST (rate-limited, no admin auth needed)
//     MUST be before generic /:resource routes to avoid conflict
// ============================================================
const bookingLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // max 5 bookings per IP per hour
    handler: (req, res) => {
        logger.warn('Booking rate limit exceeded', { ip: req.ip });
        res.status(429).json({ error: 'Too many booking requests. Please try again later.' });
    }
});

app.post('/api/bookings/public', bookingLimiter, (req, res) => {
    try {
        const { name, phone, service, date, location, message, email } = req.body;

        if (!name || !phone || !service) {
            return res.status(400).json({ error: 'Name, phone, and service are required.' });
        }

        const bookings = readData('bookings');
        const newBooking = {
            id: Date.now().toString(),
            name: String(name).substring(0, 100),
            phone: String(phone).substring(0, 20),
            email: email ? String(email).substring(0, 100) : null,
            service: String(service).substring(0, 100),
            date: date ? String(date).substring(0, 30) : null,
            location: location ? String(location).substring(0, 200) : null,
            message: message ? String(message).substring(0, 500) : null,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        bookings.push(newBooking);
        writeData('bookings', bookings);

        logger.info('New booking received', { bookingId: newBooking.id, service: newBooking.service });
        res.status(201).json({ message: 'Booking request submitted successfully.' });
    } catch (error) {
        logger.error('Error creating booking', error);
        res.status(500).json({ error: 'Failed to submit booking request.' });
    }
});

// ============================================================
// 10. PUBLIC READ ROUTES (no auth required for frontend display)
// ============================================================
app.get('/api/:resource', validateResource, (req, res) => {
    try {
        const data = readData(req.params.resource);
        res.json(data);
    } catch (error) {
        logger.error('Error reading resource', error, { resource: req.params.resource });
        res.status(500).json({ error: 'Failed to load data.' });
    }
});

app.get('/api/:resource/:id', validateResource, (req, res) => {
    try {
        const data = readData(req.params.resource);
        const item = data.find(i => i.id === req.params.id);
        if (item) res.json(item);
        else res.status(404).json({ error: 'Item not found.' });
    } catch (error) {
        logger.error('Error reading resource item', error, { resource: req.params.resource, id: req.params.id });
        res.status(500).json({ error: 'Failed to load data.' });
    }
});

// ============================================================
// 11. PROTECTED WRITE ROUTES (admin auth + role check)
// ============================================================

// POST — Create new item (admin only)
app.post('/api/:resource', validateResource, requireAdmin, upload.single('image'), (req, res) => {
    try {
        const { resource } = req.params;
        const body = req.body;
        const currentData = readData(resource);

        const newItem = {
            id: Date.now().toString(),
            ...body,
            image: req.file ? `/uploads/${req.file.filename}` : body.image || null,
            createdAt: new Date().toISOString()
        };

        // Parse JSON fields safely
        if (typeof newItem.features === 'string') {
            try { newItem.features = JSON.parse(newItem.features); } catch { /* keep as string */ }
        }

        currentData.push(newItem);
        writeData(resource, currentData);

        auditLog.record({
            adminId: req.user.id,
            adminUsername: req.user.username,
            action: 'CREATE',
            resource,
            itemId: newItem.id,
            ip: req.ip
        });

        logger.info('Item created', { resource, itemId: newItem.id, adminId: req.user.id });
        res.status(201).json(newItem);
    } catch (error) {
        logger.error('Error creating item', error, { resource: req.params.resource });
        res.status(500).json({ error: 'Failed to create item.' });
    }
});

// PUT — Update item (admin only)
app.put('/api/:resource/:id', validateResource, requireAdmin, upload.single('image'), (req, res) => {
    try {
        const { resource, id } = req.params;
        const body = req.body;
        const currentData = readData(resource);
        const index = currentData.findIndex(i => i.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'Item not found.' });
        }

        const updatedItem = {
            ...currentData[index],
            ...body,
            image: req.file ? `/uploads/${req.file.filename}` : (body.image || currentData[index].image),
            updatedAt: new Date().toISOString()
        };

        if (typeof updatedItem.features === 'string') {
            try { updatedItem.features = JSON.parse(updatedItem.features); } catch { /* keep as string */ }
        }

        currentData[index] = updatedItem;
        writeData(resource, currentData);

        auditLog.record({
            adminId: req.user.id,
            adminUsername: req.user.username,
            action: 'UPDATE',
            resource,
            itemId: id,
            ip: req.ip
        });

        logger.info('Item updated', { resource, itemId: id, adminId: req.user.id });
        res.json(updatedItem);
    } catch (error) {
        logger.error('Error updating item', error, { resource: req.params.resource, id: req.params.id });
        res.status(500).json({ error: 'Failed to update item.' });
    }
});

// DELETE — Remove item (admin only)
app.delete('/api/:resource/:id', validateResource, requireAdmin, (req, res) => {
    try {
        const { resource, id } = req.params;
        const currentData = readData(resource);

        const itemToRemove = currentData.find(i => i.id === id);
        if (itemToRemove?.image?.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, itemToRemove.image.substring(1));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                logger.debug('Deleted associated image file', { path: imagePath });
            }
        }

        const newData = currentData.filter(i => i.id !== id);
        writeData(resource, newData);

        auditLog.record({
            adminId: req.user.id,
            adminUsername: req.user.username,
            action: 'DELETE',
            resource,
            itemId: id,
            ip: req.ip
        });

        logger.info('Item deleted', { resource, itemId: id, adminId: req.user.id });
        res.json({ success: true });
    } catch (error) {
        logger.error('Error deleting item', error, { resource: req.params.resource, id: req.params.id });
        res.status(500).json({ error: 'Failed to delete item.' });
    }
});

// ============================================================
// GLOBAL ERROR HANDLER — catch-all, generic messages only
// ============================================================
app.use((err, req, res, _next) => {
    // Multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }

    // Multer other errors
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'File upload error.' });
    }

    // Log the full error server-side
    logger.error('Unhandled server error', err, {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip
    });

    // Return generic message to client — NEVER leak stack traces
    res.status(err.status || 500).json({
        error: 'An unexpected error occurred. Please try again.'
    });
});

// ============================================================
// START SERVER
// ============================================================
const startServer = async () => {
    await seedDefaultAdmin();
    app.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT}`);
    });
};

startServer();
