/**
 * Backup Script — copies all JSON data files to a timestamped backup folder.
 * Keeps only the last 10 backups (auto-cleanup).
 *
 * Usage: node server/backup.js
 *    or: npm run backup
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const BACKUP_DIR = path.join(__dirname, 'backups');
const MAX_BACKUPS = 10;

const run = () => {
    // Create backups directory if needed
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Create timestamped subfolder
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const targetDir = path.join(BACKUP_DIR, timestamp);
    fs.mkdirSync(targetDir, { recursive: true });

    // Copy all JSON files from data/
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

    if (files.length === 0) {
        process.stdout.write('No data files found to backup.\n');
        return;
    }

    for (const file of files) {
        const src = path.join(DATA_DIR, file);
        const dest = path.join(targetDir, file);
        fs.copyFileSync(src, dest);
    }

    process.stdout.write(`Backed up ${files.length} files to: ${targetDir}\n`);

    // Auto-cleanup: keep only last MAX_BACKUPS
    const allBackups = fs.readdirSync(BACKUP_DIR)
        .map(name => ({ name, time: fs.statSync(path.join(BACKUP_DIR, name)).mtime }))
        .sort((a, b) => b.time - a.time);

    if (allBackups.length > MAX_BACKUPS) {
        const toDelete = allBackups.slice(MAX_BACKUPS);
        for (const dir of toDelete) {
            const dirPath = path.join(BACKUP_DIR, dir.name);
            fs.rmSync(dirPath, { recursive: true, force: true });
            process.stdout.write(`Cleaned old backup: ${dir.name}\n`);
        }
    }

    process.stdout.write('Backup complete.\n');
};

run();
