import test from 'node:test';
import assert from 'node:assert/strict';
import { BiometricsCheckinForm } from '../frontend/js/checkin.js';
import { storage } from '../frontend/js/storage.js';

test('US-002: BiometricsCheckinForm validation logic', () => {
    const controller = new BiometricsCheckinForm();

    // 1. Valid input
    const valid = controller.validate({
        sleepHours: 8.0,
        sleepQuality: 5,
        rhrBpm: 52,
        stressLevel: 2
    });
    assert.equal(valid.isValid, true);
    assert.equal(valid.errors.length, 0);

    // 2. Invalid sleep (< 0 or > 14)
    const invalidSleep = controller.validate({
        sleepHours: 16,
        sleepQuality: 4,
        rhrBpm: 60,
        stressLevel: 2
    });
    assert.equal(invalidSleep.isValid, false);
    assert.match(invalidSleep.errors[0], /0 đến 14/);

    // 3. Invalid RHR (< 30 or > 150)
    const invalidRhr = controller.validate({
        sleepHours: 7,
        sleepQuality: 4,
        rhrBpm: 220,
        stressLevel: 2
    });
    assert.equal(invalidRhr.isValid, false);
    assert.match(invalidRhr.errors[0], /30 - 150 bpm/);

    // 4. Invalid stress
    const invalidStress = controller.validate({
        sleepHours: 7,
        sleepQuality: 4,
        rhrBpm: 60,
        stressLevel: 7
    });
    assert.equal(invalidStress.isValid, false);
    assert.match(invalidStress.errors[0], /căng thẳng phải từ 1 đến 5/);
});

test('US-002: Storage persistence via BiometricsCheckinForm', () => {
    storage.clearAllData();
    const saved = storage.saveBiometrics({
        sleepHours: 7.5,
        sleepQuality: 4,
        rhrBpm: 54,
        stressLevel: 2,
        date: '2026-09-15'
    });

    assert.ok(saved);
    assert.equal(saved.sleepHours, 7.5);
    assert.equal(saved.rhrBpm, 54);

    const retrieved = storage.getBiometricsByDate('2026-09-15');
    assert.equal(retrieved.rhrBpm, 54);
    assert.equal(retrieved.sleepQuality, 4);
});
