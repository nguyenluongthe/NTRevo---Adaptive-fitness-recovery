/**
 * @file models.js
 * @description Data models and schema definitions for NTRevo Adaptive Fitness & Recovery Platform.
 */

/**
 * Valid muscle groups for DOMS mapping
 */
export const MUSCLE_GROUPS = Object.freeze({
    CHEST: 'chest',
    UPPER_BACK: 'upper_back',
    LOWER_BACK: 'lower_back',
    SHOULDERS: 'shoulders',
    BICEPS: 'biceps',
    TRICEPS: 'triceps',
    ABS: 'abs',
    QUADS: 'quads',
    HAMSTRINGS: 'hamstrings',
    GLUTES: 'glutes',
    CALVES: 'calves'
});

/**
 * Recovery readiness status zones
 */
export const READINESS_ZONES = Object.freeze({
    OPTIMAL: 'OPTIMAL',   // 80 - 100 (Green)
    CAUTION: 'CAUTION',   // 50 - 79  (Yellow)
    DANGER: 'DANGER'      // 0 - 49   (Red)
});

/**
 * Factory and validator for BiometricsLog
 * @param {Object} data
 * @param {number} data.sleepHours - Hours of sleep (0 to 14)
 * @param {number} data.sleepQuality - Quality rating (1 to 5)
 * @param {number} data.rhrBpm - Resting heart rate in bpm (30 to 150)
 * @param {number} data.stressLevel - Stress score (1 to 5)
 * @param {string} [data.date] - Format YYYY-MM-DD (defaults to today)
 * @returns {Object} Validated BiometricsLog
 */
export function createBiometricsLog({ sleepHours, sleepQuality, rhrBpm, stressLevel, date }) {
    const hours = Number(sleepHours);
    if (isNaN(hours) || hours < 0 || hours > 14) {
        throw new Error('Số giờ ngủ phải nằm trong khoảng từ 0 đến 14 giờ.');
    }

    const quality = Number(sleepQuality);
    if (isNaN(quality) || quality < 1 || quality > 5) {
        throw new Error('Chất lượng giấc ngủ phải từ 1 đến 5 sao.');
    }

    const rhr = Number(rhrBpm);
    if (isNaN(rhr) || rhr < 30 || rhr > 150) {
        throw new Error('Nhịp tim nghỉ ngơi (RHR) phải nằm trong khoảng 30 - 150 bpm.');
    }

    const stress = Number(stressLevel);
    if (isNaN(stress) || stress < 1 || stress > 5) {
        throw new Error('Mức độ căng thẳng (Stress Level) phải từ 1 đến 5.');
    }

    const logDate = date || new Date().toISOString().split('T')[0];

    return {
        id: `bio_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        date: logDate,
        sleepHours: hours,
        sleepQuality: quality,
        rhrBpm: rhr,
        stressLevel: stress,
        recordedAt: new Date().toISOString()
    };
}

/**
 * Factory and validator for DomsLog
 * @param {Object} data
 * @param {Array<{muscle: string, painLevel: number}>} data.muscles - Selected sore muscles
 * @param {string} [data.date] - Format YYYY-MM-DD
 * @returns {Object} Validated DomsLog
 */
export function createDomsLog({ muscles = [], date }) {
    if (!Array.isArray(muscles)) {
        throw new Error('Danh sách nhóm cơ phải là một mảng.');
    }

    const validatedMuscles = muscles.map(item => {
        if (!item || typeof item.muscle !== 'string') {
            throw new Error('Tên nhóm cơ không hợp lệ.');
        }
        const pain = Number(item.painLevel);
        if (isNaN(pain) || pain < 1 || pain > 10) {
            throw new Error(`Độ đau của cơ ${item.muscle} phải nằm trong khoảng 1 đến 10.`);
        }
        return {
            muscle: item.muscle.toLowerCase().trim(),
            painLevel: pain
        };
    });

    const logDate = date || new Date().toISOString().split('T')[0];

    return {
        id: `doms_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        date: logDate,
        muscles: validatedMuscles,
        recordedAt: new Date().toISOString()
    };
}

/**
 * Factory and validator for ReadinessResult
 * @param {Object} data
 * @param {number} data.readinessScore - 0 to 100
 * @param {string} [data.zone] - OPTIMAL | CAUTION | DANGER
 * @param {Object} [data.breakdown] - Score components
 * @param {boolean} [data.overtrainingAlert] - True if 2 consecutive low readiness days
 * @param {string[]} [data.recommendations] - List of recovery tips
 * @param {string} [data.date] - Format YYYY-MM-DD
 * @returns {Object} Validated ReadinessResult
 */
export function createReadinessResult({
    readinessScore,
    zone,
    breakdown = {},
    overtrainingAlert = false,
    recommendations = [],
    date
}) {
    const score = Math.max(0, Math.min(100, Math.round(Number(readinessScore) || 0)));
    
    let computedZone = zone;
    if (!computedZone) {
        if (score >= 80) computedZone = READINESS_ZONES.OPTIMAL;
        else if (score >= 50) computedZone = READINESS_ZONES.CAUTION;
        else computedZone = READINESS_ZONES.DANGER;
    }

    const resultDate = date || new Date().toISOString().split('T')[0];

    return {
        id: `ready_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        date: resultDate,
        readinessScore: score,
        zone: computedZone,
        breakdown: {
            hrvRhrScore: breakdown.hrvRhrScore || 0,
            sleepScore: breakdown.sleepScore || 0,
            stressScore: breakdown.stressScore || 0,
            domsPenalty: breakdown.domsPenalty || 0
        },
        overtrainingAlert: Boolean(overtrainingAlert),
        recommendations: Array.isArray(recommendations) ? recommendations : [],
        calculatedAt: new Date().toISOString()
    };
}
