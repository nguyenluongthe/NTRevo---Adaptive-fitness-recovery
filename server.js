/**
 * NTRevo - Adaptive Fitness & Recovery Platform
 * Unified Application & REST API Server (Zero-Dependency Node.js)
 * Serves all Sprints 1-5 Frontend Views and Core AI Engine API endpoints.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';

// In-Memory Cache Store for NFR-P02 sub-2s query latency
const cacheStore = new Map();

// In-Memory Biometric Log Store (initialized with mock data)
let dailyBiometrics = {
    athlete_id: "usr-101",
    hrv_rmssd: 64.0,
    resting_hr: 56,
    sleep_hours: 7.8,
    deep_sleep_ratio: 0.22,
    doms_score: 3,
    rpe_previous_day: 7.0,
    sore_muscles: ["Shoulders"]
};

// AI Recovery Algorithm Evaluation
function evaluateReadiness(data) {
    const baseline_mean = 62.0;
    const baseline_std = 6.5;

    // 1. HRV Normalization (Z-score sigmoid scaling)
    const z_hrv = (data.hrv_rmssd - baseline_mean) / baseline_std;
    const hrv_norm = Math.max(0, Math.min(100, Math.round(50 + (z_hrv * 20))));

    // 2. Sleep Normalization
    const duration_score = (Math.min(data.sleep_hours, 9.0) / 8.0) * 70.0;
    const deep_score = (Math.min(data.deep_sleep_ratio, 0.30) / 0.20) * 30.0;
    const sleep_norm = Math.max(0, Math.min(100, Math.round(duration_score + deep_score)));

    // 3. RPE & DOMS Normalization
    const rpe_norm = Math.max(0, Math.min(100, Math.round(100 - ((data.rpe_previous_day - 1) * (100 / 9)))));
    const doms_norm = Math.max(0, Math.min(100, Math.round(100 - ((data.doms_score - 1) * (100 / 9)))));

    // 4. Weighted Synthesis (40% HRV, 30% Sleep, 15% RPE, 15% DOMS)
    let composite = Math.round((0.40 * hrv_norm) + (0.30 * sleep_norm) + (0.15 * rpe_norm) + (0.15 * doms_norm));

    let overtraining_alert = false;
    let override_reason = null;

    if (data.hrv_rmssd < (baseline_mean - (2.5 * baseline_std))) {
        overtraining_alert = true;
        override_reason = "HRV dropped >2.5 SD below 14-day baseline. Autonomic nervous system fatigue detected.";
        composite = Math.min(composite, 38);
    } else if (data.doms_score >= 9) {
        overtraining_alert = true;
        override_reason = "Extreme DOMS (>=9) reported. Musculoskeletal overload protection engaged.";
        composite = Math.min(composite, 45);
    }

    let classification, vol_mult, int_mult, recommendation;
    if (composite >= 80) {
        classification = "Optimal / Full Session";
        vol_mult = 1.05;
        int_mult = 1.00;
        recommendation = "Full training capacity. Recommended to pursue progressive overload or standard prescribed intensity.";
    } else if (composite >= 60) {
        classification = "Modified Intensity";
        vol_mult = 0.85;
        int_mult = 0.90;
        recommendation = "Moderate recovery. Proceed with primary compound exercises, reduce accessory volume by 15%.";
    } else if (composite >= 40) {
        classification = "Active Recovery";
        vol_mult = 0.50;
        int_mult = 0.60;
        recommendation = "Suboptimal recovery. Pivot to Zone 2 cardio, mobility flow, and foam rolling.";
    } else {
        classification = "Complete Rest";
        vol_mult = 0.00;
        int_mult = 0.00;
        recommendation = "Exhaustion risk. Take complete passive rest, prioritize 8+ hours sleep and protein repletion.";
    }

    return {
        readiness_score: composite,
        classification,
        volume_multiplier: vol_mult,
        intensity_multiplier: int_mult,
        component_scores: {
            hrv_normalized: hrv_norm,
            sleep_normalized: sleep_norm,
            rpe_normalized: rpe_norm,
            doms_normalized: doms_norm
        },
        recommendation,
        overtraining_alert,
        override_reason
    };
}

// MIME Types Map
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.yaml': 'text/yaml; charset=utf-8',
    '.yml': 'text/yaml; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8'
};

function sendJSON(res, statusCode, data) {
    const jsonStr = JSON.stringify(data, null, 2);
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'no-cache'
    });
    res.end(jsonStr);
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Handle CORS Preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        res.end();
        return;
    }

    // ==========================================
    // REST API ROUTES (/api/v1/*)
    // ==========================================
    if (pathname.startsWith('/api/v1/')) {
        const apiPath = pathname.replace('/api/v1', '');

        // GET /api/v1/health
        if (apiPath === '/health' && req.method === 'GET') {
            return sendJSON(res, 200, {
                status: "healthy",
                service: "NTRevo Adaptive Fitness & Recovery Engine",
                version: "1.0.0-PROD",
                timestamp: new Date().toISOString(),
                sprints_active: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5"],
                modules: {
                    auth: "Online",
                    assessment: "Online",
                    recovery_engine: "Online",
                    adaptive_planner: "Online",
                    cache_manager: "Active (MemoryStore)"
                }
            });
        }

        // POST /api/v1/auth/login
        if (apiPath === '/auth/login' && req.method === 'POST') {
            return sendJSON(res, 200, {
                success: true,
                access_token: "mock-jwt-token-ntrevo-user-001",
                token_type: "bearer",
                expires_in: 86400,
                user: {
                    id: "usr-101",
                    email: "athlete@ntrevo.io",
                    full_name: "Nguyen The Long",
                    role: "athlete"
                }
            });
        }

        // GET /api/v1/auth/profile
        if (apiPath === '/auth/profile' && req.method === 'GET') {
            return sendJSON(res, 200, {
                id: "usr-101",
                email: "athlete@ntrevo.io",
                full_name: "Nguyen The Long",
                age: 28,
                height_cm: 178.5,
                weight_kg: 74.0,
                fitness_level: "intermediate",
                primary_goal: "hypertrophy_and_conditioning"
            });
        }

        // GET /api/v1/assessment/latest
        if (apiPath === '/assessment/latest' && req.method === 'GET') {
            return sendJSON(res, 200, {
                assessment_id: "asm-889",
                user_id: "usr-101",
                completed_at: "2026-08-01T08:30:00Z",
                fitness_score: 78.5,
                metrics: {
                    estimated_vo2max: 47.5,
                    pushups_max: 38,
                    plank_seconds: 125,
                    resting_hr: 58,
                    squat_1rm_kg: 115.0
                },
                strengths: ["Upper body muscular endurance", "Cardiorespiratory recovery rate"],
                weaknesses: ["Posterior chain hamstring flexibility"]
            });
        }

        // GET /api/v1/recovery/today
        if (apiPath === '/recovery/today' && req.method === 'GET') {
            const cacheKey = "user:usr-101:recovery:today";
            const cached = cacheStore.get(cacheKey);
            if (cached) {
                return sendJSON(res, 200, { ...cached, cached: true });
            }

            const evalResult = evaluateReadiness(dailyBiometrics);
            const responseData = {
                date: new Date().toISOString().split('T')[0],
                athlete_id: dailyBiometrics.athlete_id,
                ...evalResult,
                raw_biometrics: dailyBiometrics,
                cached: false
            };
            cacheStore.set(cacheKey, responseData);
            return sendJSON(res, 200, responseData);
        }

        // POST /api/v1/recovery/log
        if (apiPath === '/recovery/log' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
                try {
                    const parsed = JSON.parse(body || '{}');
                    dailyBiometrics = { ...dailyBiometrics, ...parsed };
                    // Invalidate cache
                    cacheStore.delete("user:usr-101:recovery:today");
                    const evalResult = evaluateReadiness(dailyBiometrics);
                    return sendJSON(res, 201, {
                        success: true,
                        message: "Recovery metrics recorded & AI score recalculated",
                        evaluation: evalResult
                    });
                } catch (e) {
                    return sendJSON(res, 400, { error: "Invalid JSON format" });
                }
            });
            return;
        }

        // GET /api/v1/workouts/today
        if (apiPath === '/workouts/today' && req.method === 'GET') {
            const evalResult = evaluateReadiness(dailyBiometrics);
            const baseWorkout = {
                workout_id: "wk-today-404",
                title: "Upper Body Hypertrophy (Push Focus)",
                intensity_target: "Standard",
                readiness_score: evalResult.readiness_score,
                classification: evalResult.classification,
                volume_multiplier: evalResult.volume_multiplier,
                intensity_multiplier: evalResult.intensity_multiplier,
                recommendation: evalResult.recommendation,
                exercises: [
                    { name: "Barbell Bench Press", sets: Math.max(2, Math.round(4 * evalResult.volume_multiplier)), reps: 8, target_rpe: Math.round(8 * evalResult.intensity_multiplier * 10) / 10 },
                    { name: "Incline Dumbbell Press", sets: Math.max(2, Math.round(3 * evalResult.volume_multiplier)), reps: 10, target_rpe: Math.round(8 * evalResult.intensity_multiplier * 10) / 10 },
                    { name: "Cable Lateral Raises", sets: Math.max(2, Math.round(3 * evalResult.volume_multiplier)), reps: 15, target_rpe: Math.round(8.5 * evalResult.intensity_multiplier * 10) / 10 },
                    { name: "Hanging Leg Raises", sets: Math.max(2, Math.round(3 * evalResult.volume_multiplier)), reps: 12, target_rpe: Math.round(7.5 * evalResult.intensity_multiplier * 10) / 10 }
                ]
            };
            return sendJSON(res, 200, baseWorkout);
        }

        // GET /api/v1/metrics/trends
        if (apiPath === '/metrics/trends' && req.method === 'GET') {
            return sendJSON(res, 200, {
                athlete_id: "usr-101",
                days: ["08-10", "08-11", "08-12", "08-13", "08-14", "08-15", "08-16"],
                hrv_rmssd: [65.2, 63.8, 58.1, 52.0, 44.5, 59.4, 66.8],
                readiness_scores: [86.4, 81.2, 67.5, 51.3, 34.2, 74.8, 91.0],
                training_loads: [480, 520, 610, 420, 100, 380, 550]
            });
        }

        return sendJSON(res, 404, { error: "API Endpoint Not Found", path: pathname });
    }

    // ==========================================
    // STATIC FILE SERVING
    // ==========================================
    let filePath = '';
    if (pathname === '/' || pathname === '/index.html') {
        filePath = path.join(__dirname, 'frontend', 'index.html');
    } else if (pathname.endsWith('.html') && !pathname.includes('frontend')) {
        filePath = path.join(__dirname, 'frontend', pathname);
    } else {
        filePath = path.join(__dirname, pathname);
        if (!fs.existsSync(filePath) && fs.existsSync(path.join(__dirname, 'frontend', pathname))) {
            filePath = path.join(__dirname, 'frontend', pathname);
        }
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head><title>404 - Not Found</title></head>
                <body style="background:#09090B; color:#FAFAFA; font-family:sans-serif; text-align:center; padding:50px;">
                    <h1 style="color:#FF4500;">404 - Trang không tồn tại</h1>
                    <p>Đường dẫn <code>${pathname}</code> không tìm thấy.</p>
                    <a href="/index.html" style="color:#FF4500;">Quay lại Trang Chủ Dashboard</a>
                </body>
                </html>
            `);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*'
        });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`\n===============================================================`);
    console.log(`🚀 NTRevo Adaptive Fitness & Recovery Platform is LIVE!`);
    console.log(`🌐 Server running at: http://${HOST}:${PORT}`);
    console.log(`===============================================================`);
    console.log(`📌 Các màn hình chính trong dự án:`);
    console.log(`   1. Dashboard Hub:         http://${HOST}:${PORT}/index.html`);
    console.log(`   2. AI Prompt Generator:   http://${HOST}:${PORT}/ai-generator.html`);
    console.log(`   3. Prototype Glassmorphism: http://${HOST}:${PORT}/prototype.html`);
    console.log(`   4. Dynamic Wireframe:     http://${HOST}:${PORT}/wireframe-viewer.html`);
    console.log(`   5. Swagger OpenAPI 3.0:   http://${HOST}:${PORT}/swagger.html`);
    console.log(`   6. Reactive Workout Tracker: http://${HOST}:${PORT}/workout-tracker.html`);
    console.log(`---------------------------------------------------------------`);
    console.log(`⚡ REST API Endpoints:`);
    console.log(`   - Health Check:           http://${HOST}:${PORT}/api/v1/health`);
    console.log(`   - AI Recovery Score:      http://${HOST}:${PORT}/api/v1/recovery/today`);
    console.log(`   - Adaptive Workout:       http://${HOST}:${PORT}/api/v1/workouts/today`);
    console.log(`   - Biometric Trends:       http://${HOST}:${PORT}/api/v1/metrics/trends`);
    console.log(`===============================================================\n`);
});
