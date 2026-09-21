import test from 'node:test';
import assert from 'node:assert/strict';
import { createBiometricsLog, createDomsLog, createReadinessResult, READINESS_ZONES } from '../frontend/js/models.js';
import { NTRevoStorage } from '../frontend/js/storage.js';

test('US-001: BiometricsLog model creation & validation', () => {
    // Valid input
    const validLog = createBiometricsLog({
        sleepHours: 7.5,
        sleepQuality: 4,
        rhrBpm: 56,
        stressLevel: 2,
        date: '2026-09-15'
    });
    assert.equal(validLog.sleepHours, 7.5);
    assert.equal(validLog.sleepQuality, 4);
    assert.equal(validLog.rhrBpm, 56);
    assert.equal(validLog.stressLevel, 2);
    assert.equal(validLog.date, '2026-09-15');
    assert.ok(validLog.id.startsWith('bio_'));

    // Boundary / Validation errors
    assert.throws(() => createBiometricsLog({ sleepHours: -1, sleepQuality: 3, rhrBpm: 60, stressLevel: 2 }));
    assert.throws(() => createBiometricsLog({ sleepHours: 8, sleepQuality: 6, rhrBpm: 60, stressLevel: 2 }));
    assert.throws(() => createBiometricsLog({ sleepHours: 8, sleepQuality: 3, rhrBpm: 250, stressLevel: 2 }));
    assert.throws(() => createBiometricsLog({ sleepHours: 8, sleepQuality: 3, rhrBpm: 60, stressLevel: 6 }));
});

test('US-001: DomsLog model creation & validation', () => {
    const doms = createDomsLog({
        muscles: [
            { muscle: 'quads', painLevel: 7 },
            { muscle: 'shoulders', painLevel: 4 }
        ],
        date: '2026-09-15'
    });
    assert.equal(doms.muscles.length, 2);
    assert.equal(doms.muscles[0].muscle, 'quads');
    assert.equal(doms.muscles[0].painLevel, 7);

    // Validation errors
    assert.throws(() => createDomsLog({ muscles: 'not-an-array' }));
    assert.throws(() => createDomsLog({ muscles: [{ muscle: 'chest', painLevel: 15 }] }));
});

test('US-001: ReadinessResult model creation & zones', () => {
    const optimal = createReadinessResult({ readinessScore: 88 });
    assert.equal(optimal.zone, READINESS_ZONES.OPTIMAL);

    const caution = createReadinessResult({ readinessScore: 65 });
    assert.equal(caution.zone, READINESS_ZONES.CAUTION);

    const danger = createReadinessResult({ readinessScore: 35 });
    assert.equal(danger.zone, READINESS_ZONES.DANGER);
});

test('US-001: NTRevoStorage save, retrieve, and history', () => {
    const storage = new NTRevoStorage();

    // 1. Save Biometrics
    const bio1 = storage.saveBiometrics({
        sleepHours: 7,
        sleepQuality: 4,
        rhrBpm: 58,
        stressLevel: 2,
        date: '2026-09-14'
    });
    const bio2 = storage.saveBiometrics({
        sleepHours: 6.5,
        sleepQuality: 3,
        rhrBpm: 62,
        stressLevel: 3,
        date: '2026-09-15'
    });

    assert.equal(storage.getBiometricsByDate('2026-09-14').rhrBpm, 58);
    assert.equal(storage.getAllBiometrics().length, 2);

    // 2. Save DOMS
    storage.saveDomsLog({
        muscles: [{ muscle: 'quads', painLevel: 6 }],
        date: '2026-09-15'
    });
    assert.equal(storage.getDomsLogByDate('2026-09-15').muscles[0].painLevel, 6);

    // 3. Save Readiness & check consecutive danger warning
    storage.saveReadinessResult({ readinessScore: 35, date: '2026-09-14' });
    storage.saveReadinessResult({ readinessScore: 38, date: '2026-09-15' });

    assert.equal(storage.checkConsecutiveDangerReadiness(40, 2), true);

    // Clear data
    storage.clearAllData();
    assert.equal(storage.getAllBiometrics().length, 0);
});
