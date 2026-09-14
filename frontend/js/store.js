/**
 * NTRevo Frontend Reactive State Store
 * Sprint 4 (Chương 6: AI Code Generation & State Management)
 * Author: Dev2-FrontendQA
 * Pattern: Observer / Publish-Subscribe with LocalStorage persistence
 */

class ReactiveStore {
    constructor() {
        this.subscribers = new Map();
        
        // Initial State
        this.state = this.loadState() || {
            user: {
                id: 'usr_athlete_01',
                name: 'Alex Nguyen',
                role: 'athlete',
                weightKg: 75.0,
                hrvBaseline: 68.0
            },
            biometrics: {
                sleepHours: 7.5,
                rhr: 58,
                hrv: 72,
                stressLevel: 3,
                recordedAt: new Date().toISOString()
            },
            readiness: {
                score: 78,
                category: 'OPTIMAL_STRAIN',
                recommendation: 'Hệ thần kinh tự chủ phục hồi tốt, sẵn sàng cho buổi tập tạ nặng.'
            },
            activeWorkout: {
                id: 'wk_today_001',
                title: 'Upper Body Hypertrophy & Stability',
                isModifiedByAi: true,
                targetRpeMax: 8.0,
                startedAt: new Date().toISOString(),
                status: 'in_progress'
            },
            exerciseSets: [
                { id: 1, exercise: 'Dumbbell Incline Bench Press', weightKg: 30, reps: 10, rpe: 7.5 },
                { id: 2, exercise: 'Dumbbell Incline Bench Press', weightKg: 32, reps: 8, rpe: 8.0 },
                { id: 3, exercise: 'Chest Supported Dumbbell Row', weightKg: 28, reps: 10, rpe: 7.5 }
            ],
            hrvHistory7d: [
                { date: 'T2', hrv: 64, rhr: 60, load: 7200 },
                { date: 'T3', hrv: 68, rhr: 58, load: 8500 },
                { date: 'T4', hrv: 70, rhr: 57, load: 6400 },
                { date: 'T5', hrv: 62, rhr: 62, load: 9200 },
                { date: 'T6', hrv: 75, rhr: 56, load: 4500 },
                { date: 'T7', hrv: 71, rhr: 58, load: 8800 },
                { date: 'CN', hrv: 74, rhr: 57, load: 6100 }
            ]
        };
    }

    /**
     * Subscribe to changes on a specific state key
     * @param {string} key 
     * @param {Function} callback 
     * @returns {Function} Unsubscribe function
     */
    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key).add(callback);
        
        // Immediate invocation with current value
        callback(this.state[key]);

        return () => {
            this.subscribers.get(key).delete(callback);
        };
    }

    /**
     * Internal notify mechanism
     */
    notify(key) {
        if (this.subscribers.has(key)) {
            const currentVal = this.state[key];
            for (const cb of this.subscribers.get(key)) {
                try {
                    cb(currentVal);
                } catch (err) {
                    console.error(`[ReactiveStore] Error in subscriber for key "${key}":`, err);
                }
            }
        }
        this.saveState();
    }

    /**
     * Get snapshot of specific state key
     */
    get(key) {
        return this.state[key];
    }

    /**
     * Add an exercise set to current workout
     */
    addExerciseSet(exercise, weightKg, reps, rpe) {
        const newSet = {
            id: Date.now(),
            exercise: exercise || 'Exercise',
            weightKg: parseFloat(weightKg) || 0,
            reps: parseInt(reps, 10) || 0,
            rpe: parseFloat(rpe) || 7.0
        };
        this.state.exerciseSets = [...this.state.exerciseSets, newSet];
        this.notify('exerciseSets');
        return newSet;
    }

    /**
     * Remove an exercise set
     */
    removeExerciseSet(setId) {
        this.state.exerciseSets = this.state.exerciseSets.filter(s => s.id !== setId);
        this.notify('exerciseSets');
    }

    /**
     * Calculate total volume in kg
     */
    getTotalVolumeKg() {
        return this.state.exerciseSets.reduce((total, s) => total + (s.weightKg * s.reps), 0);
    }

    /**
     * Calculate average RPE
     */
    getAverageRpe() {
        if (this.state.exerciseSets.length === 0) return 0;
        const sum = this.state.exerciseSets.reduce((acc, s) => acc + s.rpe, 0);
        return (sum / this.state.exerciseSets.length).toFixed(1);
    }

    /**
     * Update Morning Biometrics & Recalculate Readiness
     */
    updateBiometrics(sleepHours, rhr, hrv, stress) {
        this.state.biometrics = {
            sleepHours: parseFloat(sleepHours),
            rhr: parseInt(rhr, 10),
            hrv: parseFloat(hrv),
            stressLevel: parseInt(stress, 10),
            recordedAt: new Date().toISOString()
        };
        this.notify('biometrics');

        // Adaptive calculation
        let score = 100;
        if (sleepHours < 6) score -= 25;
        if (rhr > 70) score -= 15;
        if (hrv < 60) score -= 20;
        score -= stress * 2;
        score = Math.max(15, Math.min(99, score));

        this.state.readiness = {
            score,
            category: score >= 75 ? 'OPTIMAL_STRAIN' : (score >= 50 ? 'MODERATE_RECOVERY' : 'OVERTRAINING_RISK'),
            recommendation: score >= 75 
                ? 'Sẵn sàng nâng tạ với cường độ tối ưu (RPE <= 8.5)' 
                : 'Giảm 20% Volume tập luyện, ưu tiên giãn cơ và bổ sung nước.'
        };
        this.notify('readiness');
    }

    /**
     * Persistence helpers
     */
    saveState() {
        try {
            localStorage.setItem('ntrevo_reactive_state', JSON.stringify(this.state));
        } catch (e) {
            // Storage quota exceeded or disabled
        }
    }

    loadState() {
        try {
            const raw = localStorage.getItem('ntrevo_reactive_state');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }
}

// Global Singleton Export
window.ntrevoStore = new ReactiveStore();
