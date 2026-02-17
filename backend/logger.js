/**
 * Server-Side Logger — replaces all console.log/console.error usage.
 * Logs detailed errors server-side only; never leaks stack traces to clients.
 * In production, this could be swapped for Winston/Pino/Datadog.
 */

const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const CURRENT_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;

const timestamp = () => new Date().toISOString();

const logger = {
    debug(msg, meta = {}) {
        if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
            process.stdout.write(`[${timestamp()}] DEBUG: ${msg} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}\n`);
        }
    },
    info(msg, meta = {}) {
        if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
            process.stdout.write(`[${timestamp()}] INFO: ${msg} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}\n`);
        }
    },
    warn(msg, meta = {}) {
        if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
            process.stderr.write(`[${timestamp()}] WARN: ${msg} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}\n`);
        }
    },
    error(msg, error = null, meta = {}) {
        if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
            const errorDetail = error instanceof Error
                ? { message: error.message, stack: error.stack }
                : error;
            process.stderr.write(`[${timestamp()}] ERROR: ${msg} ${JSON.stringify({ ...meta, error: errorDetail })}\n`);
        }
    }
};

export default logger;
