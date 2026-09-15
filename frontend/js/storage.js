/**
 * @file storage.js
 * @description Storage manager for NTRevo supporting localStorage with in-memory fallback.
 */

import { createBiometricsLog, createDomsLog, createReadinessResult } from './models.js';

// In-memory fallback for environments without window.localStorage (e.g. Node tests)
class MemoryStorage {
    constructor() {
        this.store = new Map();
    }
    getItem(key) {
        return this.store.has(key) ? this.store.get(key) : null;
    }
    setItem(key, value) {
        this.store.set(key, String(value));
    }
    removeItem(key) {
        this.store.delete(key);
    }
    clear() {
        this.store.clear();
    }
}

const memoryStore = new MemoryStorage();

function getStorageEngine() {
    if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage;
    }
    return memoryStore;
}

export const STORAGE_KEYS = Object.freeze({
    BIOMETRICS: 'ntrevo_biometrics_history',
    DOMS: 'ntrevo_doms_history',
    READINESS: 'ntrevo_readiness_history',
    SETTINGS: 'ntrevo_settings'
});

export class NTRevoStorage {
    constructor(engine = null) {
        this.engine = engine || getStorageEngine();
    }

    _read(key) {
        try {
            const raw = this.engine.getItem(key);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error(`Error reading ${key} from storage:`, e);
            return [];
        }
    }

    _write(key, data) {
        try {
            this.engine.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error(`Error writing ${key} to storage:`, e);
            return false;
        }
    }

    // --- Biometrics Operations ---
    saveBiometrics(inputData) {
        const validated = createBiometricsLog(inputData);
        const list = this._read(STORAGE_KEYS.BIOMETRICS);
        // Replace existing log for same date or prepend
        const existingIndex = list.findIndex(item => item.date === validated.date);
        if (existingIndex >= 0) {
            list[existingIndex] = validated;
        } else {
            list.unshift(validated);
        }
        this._write(STORAGE_KEYS.BIOMETRICS, list);
        return validated;
    }

    getBiometricsByDate(date) {
        const list = this._read(STORAGE_KEYS.BIOMETRICS);
        return list.find(item => item.date === date) || null;
    }

    getAllBiometrics() {
        return this._read(STORAGE_KEYS.BIOMETRICS);
    }

    // --- DOMS Operations ---
    saveDomsLog(inputData) {
        const validated = createDomsLog(inputData);
        const list = this._read(STORAGE_KEYS.DOMS);
        const existingIndex = list.findIndex(item => item.date === validated.date);
        if (existingIndex >= 0) {
            list[existingIndex] = validated;
        } else {
            list.unshift(validated);
        }
        this._write(STORAGE_KEYS.DOMS, list);
        return validated;
    }

    getDomsLogByDate(date) {
        const list = this._read(STORAGE_KEYS.DOMS);
        return list.find(item => item.date === date) || null;
    }

    getAllDomsLogs() {
        return this._read(STORAGE_KEYS.DOMS);
    }

    // --- Readiness Operations ---
    saveReadinessResult(inputData) {
        const validated = createReadinessResult(inputData);
        const list = this._read(STORAGE_KEYS.READINESS);
        const existingIndex = list.findIndex(item => item.date === validated.date);
        if (existingIndex >= 0) {
            list[existingIndex] = validated;
        } else {
            list.unshift(validated);
        }
        this._write(STORAGE_KEYS.READINESS, list);
        return validated;
    }

    getReadinessByDate(date) {
        const list = this._read(STORAGE_KEYS.READINESS);
        return list.find(item => item.date === date) || null;
    }

    getReadinessHistory(limitDays = 7) {
        const list = this._read(STORAGE_KEYS.READINESS);
        // Sort chronologically ascending
        const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date));
        return sorted.slice(-limitDays);
    }

    /**
     * Check if user has had readiness below danger threshold for consecutive days
     * @param {number} threshold - Defaults to 40
     * @param {number} consecutiveDays - Defaults to 2
     * @returns {boolean}
     */
    checkConsecutiveDangerReadiness(threshold = 40, consecutiveDays = 2) {
        const history = this.getReadinessHistory(consecutiveDays);
        if (history.length < consecutiveDays) return false;
        return history.every(entry => entry.readinessScore < threshold);
    }

    // --- Clear & Export ---
    clearAllData() {
        this.engine.removeItem(STORAGE_KEYS.BIOMETRICS);
        this.engine.removeItem(STORAGE_KEYS.DOMS);
        this.engine.removeItem(STORAGE_KEYS.READINESS);
        return true;
    }

    exportAllData() {
        return {
            biometrics: this._read(STORAGE_KEYS.BIOMETRICS),
            doms: this._read(STORAGE_KEYS.DOMS),
            readiness: this._read(STORAGE_KEYS.READINESS),
            exportedAt: new Date().toISOString()
        };
    }
}

// Default singleton instance for quick usage
export const storage = new NTRevoStorage();
