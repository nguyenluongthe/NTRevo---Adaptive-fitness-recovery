import test from 'node:test';
import assert from 'node:assert/strict';
import { getPainColor, getPainDescription, DomsMapController, MUSCLE_DEFINITIONS } from '../frontend/js/doms.js';
import { storage } from '../frontend/js/storage.js';
import { MUSCLE_GROUPS } from '../frontend/js/models.js';

test('US-003: DOMS pain color and description mapping', () => {
    // Colors
    assert.equal(getPainColor(2), '#facc15'); // Yellow
    assert.equal(getPainColor(5), '#f97316'); // Orange
    assert.equal(getPainColor(8), '#ef4444'); // Red

    // Descriptions
    assert.match(getPainDescription(2), /Đau nhẹ/);
    assert.match(getPainDescription(5), /Đau vừa/);
    assert.match(getPainDescription(9), /Đau dữ dội/);
});

test('US-003: DOMS muscle selection and storage integration', () => {
    storage.clearAllData();
    const controller = new DomsMapController();

    // Select muscles
    controller.setMusclePain(MUSCLE_GROUPS.QUADS, 7);
    controller.setMusclePain(MUSCLE_GROUPS.SHOULDERS, 4);

    assert.equal(controller.selectedMuscles.get(MUSCLE_GROUPS.QUADS), 7);
    assert.equal(controller.selectedMuscles.get(MUSCLE_GROUPS.SHOULDERS), 4);

    // Save and check storage
    const savedLog = controller.saveAndContinue();
    assert.equal(savedLog.muscles.length, 2);

    const retrieved = storage.getDomsLogByDate(new Date().toISOString().split('T')[0]);
    assert.ok(retrieved);
    assert.equal(retrieved.muscles.find(m => m.muscle === MUSCLE_GROUPS.QUADS).painLevel, 7);

    // Remove a muscle
    controller.removeMuscle(MUSCLE_GROUPS.SHOULDERS);
    assert.equal(controller.selectedMuscles.has(MUSCLE_GROUPS.SHOULDERS), false);
});

test('US-003: Muscle definitions completeness', () => {
    assert.ok(MUSCLE_DEFINITIONS.length >= 8);
    const quads = MUSCLE_DEFINITIONS.find(m => m.id === MUSCLE_GROUPS.QUADS);
    assert.ok(quads);
    assert.equal(quads.view, 'front');
});
