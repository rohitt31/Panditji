/**
 * Frontend Logger Utility
 * Replaces raw console.log/console.error with a structured, suppressible logger.
 * In production, all logs are silenced — errors are reported to a monitoring service
 * (or simply hidden from DevTools to prevent information leakage).
 */

const IS_PRODUCTION = import.meta.env.PROD;

const frontendLogger = {
    /** Debug — only in development */
    debug(msg: string, meta?: unknown) {
        if (!IS_PRODUCTION) {
            // eslint-disable-next-line no-console
            console.debug(`[DEBUG] ${msg}`, meta ?? '');
        }
    },

    /** Info — only in development */
    info(msg: string, meta?: unknown) {
        if (!IS_PRODUCTION) {
            // eslint-disable-next-line no-console
            console.info(`[INFO] ${msg}`, meta ?? '');
        }
    },

    /** Warn — dev only */
    warn(msg: string, meta?: unknown) {
        if (!IS_PRODUCTION) {
            // eslint-disable-next-line no-console
            console.warn(`[WARN] ${msg}`, meta ?? '');
        }
    },

    /**
     * Error — logs in development, silently reports in production.
     * In production, you'd send this to Sentry/LogRocket/your monitoring service.
     */
    error(msg: string, error?: unknown) {
        if (!IS_PRODUCTION) {
            // eslint-disable-next-line no-console
            console.error(`[ERROR] ${msg}`, error ?? '');
        } else {
            // Production: send to monitoring service (Sentry, etc.)
            // Example: Sentry.captureException(error);
        }
    }
};

export default frontendLogger;
