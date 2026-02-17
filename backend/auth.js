/**
 * Authentication & Authorization Middleware
 * - JWT access tokens (7-day expiry)
 * - Refresh token rotation
 * - Role-based access control (admin check)
 * - Rate limiting on sensitive routes
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// Configuration
// ============================================================
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const JWT_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Warn if using auto-generated secret (not persistent across restarts)
if (!process.env.JWT_SECRET) {
    logger.warn('JWT_SECRET not set in environment. Using auto-generated secret (tokens will invalidate on server restart).');
}

// ============================================================
// Admin Credentials Store (JSON file)
// ============================================================
const ADMINS_FILE = path.join(__dirname, 'data', 'admins.json');
const REFRESH_TOKENS_FILE = path.join(__dirname, 'data', 'refresh_tokens.json');

const ensureFile = (filePath, defaultContent = '[]') => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, defaultContent);
    }
};

const readJSON = (filePath) => {
    ensureFile(filePath);
    try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
    catch { return []; }
};

const writeJSON = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// ============================================================
// Seed default admin (first run only)
// ============================================================
export const seedDefaultAdmin = async () => {
    const admins = readJSON(ADMINS_FILE);
    const envUsername = process.env.ADMIN_USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (!envUsername || !envPassword) {
        logger.error('ADMIN_USERNAME or ADMIN_PASSWORD missing in .env. Cannot seed superadmin.');
        return;
    }

    const existingAdmin = admins.find(a => a.username === envUsername);

    if (existingAdmin) {
        // Ensure .env admin always has superadmin role
        if (existingAdmin.role !== 'superadmin') {
            existingAdmin.role = 'superadmin';
            writeJSON(ADMINS_FILE, admins);
            logger.info(`Upgraded "${envUsername}" to superadmin role.`);
        }
        return;
    }

    // .env admin doesn't exist yet — create as superadmin
    // Keep any existing dashboard-created admins intact
    const hashedPassword = await bcrypt.hash(envPassword, 12);
    const newAdmin = {
        id: crypto.randomUUID(),
        username: envUsername,
        password: hashedPassword,
        role: 'superadmin',
        createdAt: new Date().toISOString()
    };
    admins.push(newAdmin);
    writeJSON(ADMINS_FILE, admins);
    logger.info(`Superadmin account created. Username: ${envUsername}.`);
};

// ============================================================
// Token Generation
// ============================================================
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
};

const generateRefreshToken = (userId) => {
    const token = crypto.randomBytes(64).toString('hex');
    const refreshTokens = readJSON(REFRESH_TOKENS_FILE);

    // Remove old tokens for this user (rotation)
    const filtered = refreshTokens.filter(rt => rt.userId !== userId);

    filtered.push({
        token,
        userId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS).toISOString(),
        createdAt: new Date().toISOString()
    });

    writeJSON(REFRESH_TOKENS_FILE, filtered);
    return token;
};

// ============================================================
// Rate Limiter Store (in-memory, per-route)
// ============================================================
const rateLimitStore = new Map();

/**
 * Rate limiter factory
 * @param {string} key - Identifier prefix (e.g., 'login', 'password-reset')
 * @param {number} maxAttempts - Max requests allowed
 * @param {number} windowMs - Time window in milliseconds
 */
export const createRateLimiter = (key, maxAttempts, windowMs) => {
    return (req, res, next) => {
        const identifier = `${key}:${req.body?.email || req.body?.username || req.ip}`;
        const now = Date.now();
        const record = rateLimitStore.get(identifier);

        if (record) {
            // Clean expired entries
            if (now - record.windowStart > windowMs) {
                rateLimitStore.set(identifier, { count: 1, windowStart: now });
                return next();
            }
            if (record.count >= maxAttempts) {
                logger.warn('Rate limit exceeded', { key, identifier, attempts: record.count });
                return res.status(429).json({
                    error: 'Too many requests. Please try again later.'
                });
            }
            record.count++;
        } else {
            rateLimitStore.set(identifier, { count: 1, windowStart: now });
        }
        next();
    };
};

// ============================================================
// Auth Routes
// ============================================================
export const setupAuthRoutes = (app) => {
    // --- LOGIN ---
    const loginLimiter = createRateLimiter('login', 5, 15 * 60 * 1000); // 5 attempts per 15 min

    app.post('/api/auth/login', loginLimiter, async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required.' });
            }

            const admins = readJSON(ADMINS_FILE);
            const user = admins.find(a => a.username === username);

            if (!user || !(await bcrypt.compare(password, user.password))) {
                logger.warn('Failed login attempt', { username, ip: req.ip });
                // Generic message — don't reveal if user exists
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user.id);

            logger.info('Admin login successful', { userId: user.id, username: user.username });

            res.json({
                accessToken,
                refreshToken,
                user: { id: user.id, username: user.username, role: user.role }
            });
        } catch (error) {
            logger.error('Login error', error);
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    });

    // --- TOKEN REFRESH (with rotation) ---
    app.post('/api/auth/refresh', async (req, res) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ error: 'Refresh token required.' });
            }

            const tokens = readJSON(REFRESH_TOKENS_FILE);
            const stored = tokens.find(rt => rt.token === refreshToken);

            if (!stored) {
                logger.warn('Invalid refresh token used', { ip: req.ip });
                return res.status(401).json({ error: 'Invalid refresh token.' });
            }

            if (new Date(stored.expiresAt) < new Date()) {
                // Remove expired token
                writeJSON(REFRESH_TOKENS_FILE, tokens.filter(rt => rt.token !== refreshToken));
                return res.status(401).json({ error: 'Refresh token expired. Please login again.' });
            }

            const admins = readJSON(ADMINS_FILE);
            const user = admins.find(a => a.id === stored.userId);
            if (!user) {
                return res.status(401).json({ error: 'User no longer exists.' });
            }

            // ROTATION: Invalidate old refresh token, issue new pair
            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user.id);

            logger.info('Token refreshed with rotation', { userId: user.id });

            res.json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            });
        } catch (error) {
            logger.error('Token refresh error', error);
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    });

    // --- CHANGE PASSWORD (any admin, own password) ---
    const passwordLimiter = createRateLimiter('password-reset', 3, 60 * 60 * 1000); // 3 per hour

    app.post('/api/auth/change-password', passwordLimiter, requireAdmin, async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ error: 'Both current and new password are required.' });
            }
            if (newPassword.length < 8) {
                return res.status(400).json({ error: 'New password must be at least 8 characters.' });
            }

            const admins = readJSON(ADMINS_FILE);
            const admin = admins.find(a => a.id === req.user.id);

            if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) {
                return res.status(401).json({ error: 'Current password is incorrect.' });
            }

            admin.password = await bcrypt.hash(newPassword, 12);
            admin.updatedAt = new Date().toISOString();
            writeJSON(ADMINS_FILE, admins);

            // Invalidate all refresh tokens for this user
            const tokens = readJSON(REFRESH_TOKENS_FILE);
            writeJSON(REFRESH_TOKENS_FILE, tokens.filter(rt => rt.userId !== admin.id));

            logger.info('Password changed', { userId: admin.id });
            res.json({ message: 'Password updated successfully. Please login again.' });
        } catch (error) {
            logger.error('Password change error', error);
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    });

    // --- LIST ALL ADMINS (superadmin only) ---
    app.get('/api/auth/admins', requireSuperAdmin, (req, res) => {
        try {
            const admins = readJSON(ADMINS_FILE);
            // Never expose passwords
            const safe = admins.map(({ password, ...rest }) => rest);
            res.json(safe);
        } catch (error) {
            logger.error('List admins error', error);
            res.status(500).json({ error: 'Failed to fetch admins.' });
        }
    });

    // --- CREATE ADMIN (superadmin only) ---
    app.post('/api/auth/admins', requireSuperAdmin, async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required.' });
            }
            if (username.length < 3) {
                return res.status(400).json({ error: 'Username must be at least 3 characters.' });
            }
            if (password.length < 8) {
                return res.status(400).json({ error: 'Password must be at least 8 characters.' });
            }
            if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores.' });
            }

            const admins = readJSON(ADMINS_FILE);
            if (admins.find(a => a.username === username)) {
                return res.status(409).json({ error: 'Username already exists.' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const newAdmin = {
                id: crypto.randomUUID(),
                username,
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            admins.push(newAdmin);
            writeJSON(ADMINS_FILE, admins);

            logger.info('New admin created', { createdBy: req.user.username, newAdmin: username });
            res.status(201).json({ id: newAdmin.id, username: newAdmin.username, role: newAdmin.role, createdAt: newAdmin.createdAt });
        } catch (error) {
            logger.error('Create admin error', error);
            res.status(500).json({ error: 'Failed to create admin.' });
        }
    });

    // --- DELETE ADMIN (superadmin only, cannot delete self) ---
    app.delete('/api/auth/admins/:id', requireSuperAdmin, (req, res) => {
        try {
            const { id } = req.params;
            if (id === req.user.id) {
                return res.status(400).json({ error: 'You cannot delete your own account.' });
            }

            const admins = readJSON(ADMINS_FILE);
            const target = admins.find(a => a.id === id);
            if (!target) {
                return res.status(404).json({ error: 'Admin not found.' });
            }
            if (target.role === 'superadmin') {
                return res.status(403).json({ error: 'Cannot delete a superadmin account.' });
            }

            const filtered = admins.filter(a => a.id !== id);
            writeJSON(ADMINS_FILE, filtered);

            // Invalidate their refresh tokens
            const tokens = readJSON(REFRESH_TOKENS_FILE);
            writeJSON(REFRESH_TOKENS_FILE, tokens.filter(rt => rt.userId !== id));

            logger.info('Admin deleted', { deletedBy: req.user.username, deletedAdmin: target.username });
            res.json({ message: `Admin "${target.username}" deleted.` });
        } catch (error) {
            logger.error('Delete admin error', error);
            res.status(500).json({ error: 'Failed to delete admin.' });
        }
    });

    // --- RESET ANOTHER ADMIN'S PASSWORD (superadmin only) ---
    app.put('/api/auth/admins/:id/reset-password', requireSuperAdmin, async (req, res) => {
        try {
            const { id } = req.params;
            const { newPassword } = req.body;

            if (!newPassword || newPassword.length < 8) {
                return res.status(400).json({ error: 'New password must be at least 8 characters.' });
            }

            const admins = readJSON(ADMINS_FILE);
            const target = admins.find(a => a.id === id);
            if (!target) {
                return res.status(404).json({ error: 'Admin not found.' });
            }

            target.password = await bcrypt.hash(newPassword, 12);
            target.updatedAt = new Date().toISOString();
            writeJSON(ADMINS_FILE, admins);

            // Invalidate their sessions
            const tokens = readJSON(REFRESH_TOKENS_FILE);
            writeJSON(REFRESH_TOKENS_FILE, tokens.filter(rt => rt.userId !== id));

            logger.info('Admin password reset by superadmin', { resetBy: req.user.username, targetAdmin: target.username });
            res.json({ message: `Password reset for "${target.username}". They need to login again.` });
        } catch (error) {
            logger.error('Reset password error', error);
            res.status(500).json({ error: 'Failed to reset password.' });
        }
    });

    // --- GET CURRENT USER INFO ---
    app.get('/api/auth/me', requireAdmin, (req, res) => {
        const admins = readJSON(ADMINS_FILE);
        const user = admins.find(a => a.id === req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({ id: user.id, username: user.username, role: user.role, createdAt: user.createdAt });
    });
};

// ============================================================
// Middleware: Verify JWT
// ============================================================
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please refresh your token.' });
        }
        logger.warn('Invalid token used', { ip: req.ip, error: error.message });
        return res.status(403).json({ error: 'Invalid token.' });
    }
};

// ============================================================
// Middleware: Require Admin Role (admin OR superadmin)
// ============================================================
export const requireAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user || !['admin', 'superadmin'].includes(req.user.role)) {
            logger.warn('Unauthorized admin access attempt', {
                userId: req.user?.id,
                role: req.user?.role,
                ip: req.ip,
                path: req.originalUrl
            });
            return res.status(403).json({ error: 'Admin access required.' });
        }
        next();
    });
};

// ============================================================
// Middleware: Require Superadmin Role (only superadmin)
// ============================================================
const requireSuperAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user || req.user.role !== 'superadmin') {
            logger.warn('Unauthorized superadmin access attempt', {
                userId: req.user?.id,
                role: req.user?.role,
                ip: req.ip,
                path: req.originalUrl
            });
            return res.status(403).json({ error: 'Superadmin access required.' });
        }
        next();
    });
};

// ============================================================
// URL Redirect Allowlist Validator
// ============================================================
const ALLOWED_REDIRECT_DOMAINS = [
    'localhost',
    '127.0.0.1',
    // Add your production domains here:
    // 'yourdomain.com',
    // 'www.yourdomain.com',
];

const ALLOWED_REDIRECT_PATHS = [
    '/',
    '/admin',
    '/admin/services',
    '/admin/testimonials',
    '/admin/gallery',
    '/admin/cards',
    '/admin/bookings',
    '/admin/settings',
    '/services',
    '/gallery',
    '/book',
    '/contact',
    '/about',
];

export const validateRedirectUrl = (url) => {
    if (!url) return '/';

    // Allow relative paths that are in the allowlist
    if (url.startsWith('/')) {
        const pathOnly = url.split('?')[0].split('#')[0];
        if (ALLOWED_REDIRECT_PATHS.includes(pathOnly)) {
            return url;
        }
        logger.warn('Blocked redirect to disallowed path', { url });
        return '/';
    }

    // For absolute URLs, validate domain
    try {
        const parsed = new URL(url);
        if (ALLOWED_REDIRECT_DOMAINS.includes(parsed.hostname)) {
            return url;
        }
    } catch {
        // Invalid URL
    }

    logger.warn('Blocked redirect to disallowed URL', { url });
    return '/';
};
