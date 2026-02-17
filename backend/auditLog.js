/**
 * Audit Logger — records all critical admin actions.
 * Logs: timestamp, adminId, action, resource, itemId, ip
 * Caps at 1000 entries to prevent unbounded growth.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIT_FILE = path.join(__dirname, 'data', 'audit_log.json');
const MAX_ENTRIES = 1000;

const readAuditLog = () => {
    try {
        if (!fs.existsSync(AUDIT_FILE)) return [];
        return JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));
    } catch {
        return [];
    }
};

const writeAuditLog = (entries) => {
    try {
        fs.writeFileSync(AUDIT_FILE, JSON.stringify(entries, null, 2));
    } catch (err) {
        logger.error('Failed to write audit log', err);
    }
};

/**
 * Record an admin action in the audit log.
 * @param {object} params
 * @param {string} params.adminId — ID of the admin performing the action
 * @param {string} params.adminUsername — Username for readability
 * @param {string} params.action — CREATE | UPDATE | DELETE
 * @param {string} params.resource — Resource type (services, gallery, etc.)
 * @param {string} params.itemId — ID of the affected item
 * @param {string} params.ip — Request IP address
 */
const auditLog = {
    record({ adminId, adminUsername, action, resource, itemId, ip }) {
        const entries = readAuditLog();

        entries.push({
            timestamp: new Date().toISOString(),
            adminId,
            adminUsername: adminUsername || 'unknown',
            action,
            resource,
            itemId: itemId || null,
            ip: ip || 'unknown'
        });

        // Cap to MAX_ENTRIES (keep most recent)
        const trimmed = entries.length > MAX_ENTRIES
            ? entries.slice(entries.length - MAX_ENTRIES)
            : entries;

        writeAuditLog(trimmed);

        logger.info('Audit log entry', { action, resource, itemId, adminId });
    },

    /** Get recent audit entries */
    getRecent(count = 50) {
        const entries = readAuditLog();
        return entries.slice(-count).reverse();
    }
};

export default auditLog;
