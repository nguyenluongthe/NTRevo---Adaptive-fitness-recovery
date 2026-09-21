/**
 * NTRevo Adaptive Fitness & Recovery Platform
 * End-to-End (E2E) Automated Test Suite (Playwright / Node Test Runner)
 * Author: Dev2-FrontendQA (dev2.frontendqa@ntrevo.io)
 * Sprint: 6 - AI trong Kiểm thử Phần mềm
 * Coverage: UC01 - UC05, FR-001 to FR-020, NFR-Reliability & Usability
 */

const assert = require('assert');

/**
 * Standalone E2E Test Suite Engine simulating Playwright API assertions
 * Can be executed directly via Node.js CI or inside the browser test runner.
 */
class NTRevoE2ESuite {
    constructor(baseUrl = 'http://127.0.0.1:3000') {
        this.baseUrl = baseUrl;
        this.results = [];
    }

    async runTest(name, fn) {
        const startTime = Date.now();
        try {
            await fn();
            const duration = Date.now() - startTime;
            this.results.push({ name, status: 'PASSED', duration_ms: duration });
            console.log(`  ✓ [PASS] ${name} (${duration}ms)`);
        } catch (err) {
            const duration = Date.now() - startTime;
            this.results.push({ name, status: 'FAILED', duration_ms: duration, error: err.message });
            console.error(`  ✗ [FAIL] ${name} (${duration}ms): ${err.message}`);
        }
    }

    async executeAll() {
        console.log('\n===============================================================');
        console.log('🚀 Running NTRevo Automated E2E User Journey Test Suite');
        console.log('===============================================================');

        // JOURNEY 1: Onboarding & Baseline Physical Assessment (UC01 / FR-001 - FR-003)
        await this.runTest('E2E-01: Athlete Onboarding & Profile Initialization', async () => {
            const res = await fetch(`${this.baseUrl}/api/v1/auth/profile`);
            assert.strictEqual(res.status, 200, 'Profile endpoint should respond 200 OK');
            const data = await res.json();
            assert.strictEqual(data.id, 'usr-101', 'User ID must match authenticated athlete');
            assert(data.age >= 16 && data.age <= 100, 'Age must be within valid physiological bounds');
            assert(data.height_cm > 100 && data.weight_kg > 30, 'Anthropometric dimensions must be valid');
        });

        await this.runTest('E2E-02: Fitness Assessment Baseline & FitnessScore™ Generation', async () => {
            const res = await fetch(`${this.baseUrl}/api/v1/assessment/latest`);
            assert.strictEqual(res.status, 200, 'Assessment endpoint should return 200 OK');
            const assessment = await res.json();
            assert(assessment.fitness_score >= 0 && assessment.fitness_score <= 100, 'FitnessScore must be in [0, 100]');
            assert(assessment.metrics.pushups_max > 0, 'Pushups max count must be recorded');
            assert(assessment.metrics.plank_seconds > 0, 'Plank endurance must be recorded');
            assert(assessment.strengths.length > 0, 'AI must detect athlete physiological strengths');
        });

        // JOURNEY 2: Morning Biometric Sync & AI Readiness Score (UC02 / FR-004, FR-010)
        await this.runTest('E2E-03: Daily Biometric Ingestion & AI Recovery Score Synthesis', async () => {
            const res = await fetch(`${this.baseUrl}/api/v1/recovery/today`);
            assert.strictEqual(res.status, 200, 'Recovery evaluation should return 200 OK');
            const recovery = await res.json();
            assert(recovery.readiness_score >= 0 && recovery.readiness_score <= 100, 'Readiness score in [0, 100]');
            assert(['Optimal / Full Session', 'Modified Intensity', 'Active Recovery', 'Complete Rest'].includes(recovery.classification), 'Valid recovery classification');
            assert(recovery.volume_multiplier >= 0.0 && recovery.volume_multiplier <= 1.15, 'Volume multiplier within safe limits');
            assert(recovery.component_scores.hrv_normalized !== undefined, 'HRV normalized score present');
            assert(recovery.component_scores.sleep_normalized !== undefined, 'Sleep normalized score present');
        });

        // JOURNEY 3: Adaptive Workout Plan Execution & Live Set Logging (UC03, UC04 / FR-005, FR-008)
        await this.runTest('E2E-04: Dynamic Workout Adaptation & Autoregulated Multipliers', async () => {
            const res = await fetch(`${this.baseUrl}/api/v1/workouts/today`);
            assert.strictEqual(res.status, 200, 'Daily workout endpoint should return 200 OK');
            const workout = await res.json();
            assert(workout.exercises.length > 0, 'Workout must contain prescribed exercises');
            for (const ex of workout.exercises) {
                assert(ex.sets >= 2, 'Exercise sets must respect minimum recovery threshold');
                assert(ex.reps >= 1, 'Exercise reps must be positive');
                assert(ex.target_rpe >= 1.0 && ex.target_rpe <= 10.0, 'RPE target must conform to Borg CR10');
            }
        });

        // JOURNEY 4: Safety Protection & Overtraining Hard Override (NFR-Reliability)
        await this.runTest('E2E-05: Overtraining Safety Protocol & Acute HRV Crash Override', async () => {
            // Post extreme crash data: HRV = 35 (severe drop), DOMS = 9
            const res = await fetch(`${this.baseUrl}/api/v1/recovery/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hrv_rmssd: 35.0,
                    sleep_hours: 4.5,
                    deep_sleep_ratio: 0.08,
                    doms_score: 9,
                    rpe_previous_day: 9.5
                })
            });
            assert.strictEqual(res.status, 201, 'Log creation should respond 201 Created');
            const result = await res.json();
            assert(result.evaluation.overtraining_alert === true, 'Overtraining alert must be engaged');
            assert.strictEqual(result.evaluation.classification, 'Complete Rest', 'Classification must be overridden to Complete Rest');
            assert.strictEqual(result.evaluation.volume_multiplier, 0.0, 'Volume multiplier must be 0 for complete rest');

            // Restore healthy baseline
            await fetch(`${this.baseUrl}/api/v1/recovery/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hrv_rmssd: 64.0,
                    sleep_hours: 7.8,
                    deep_sleep_ratio: 0.22,
                    doms_score: 3,
                    rpe_previous_day: 7.0
                })
            });
        });

        console.log('\n===============================================================');
        const passed = this.results.filter(r => r.status === 'PASSED').length;
        const total = this.results.length;
        console.log(`🎯 Test Run Summary: ${passed}/${total} Tests Passed (${Math.round((passed/total)*100)}% Pass Rate)`);
        console.log('===============================================================\n');

        return {
            total,
            passed,
            failed: total - passed,
            pass_rate_percentage: Math.round((passed / total) * 100),
            results: this.results
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NTRevoE2ESuite };
}

// Direct CLI Execution
if (require.main === module) {
    const runner = new NTRevoE2ESuite();
    runner.executeAll().then(summary => {
        if (summary.failed > 0) process.exit(1);
    });
}
