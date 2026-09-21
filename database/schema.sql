-- =============================================================================
-- NTRevo Adaptive Fitness & Recovery Platform
-- 3NF Relational Database Schema DDL (PostgreSQL & SQLite Compatible)
-- Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
-- Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm
-- Specifications: Conforms 100% to OpenAPI 3.0 Contract & SRS Section 5
-- =============================================================================

-- 1. USERS TABLE (Identity & Authentication)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'athlete' CHECK (role IN ('athlete', 'coach', 'admin')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER_PROFILES TABLE (Biometric & Anthropometric Baseline)
CREATE TABLE IF NOT EXISTS user_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 16 AND age <= 100),
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    height_cm REAL NOT NULL CHECK (height_cm >= 100.0 AND height_cm <= 250.0),
    weight_kg REAL NOT NULL CHECK (weight_kg >= 30.0 AND weight_kg <= 300.0),
    fitness_level VARCHAR(30) NOT NULL DEFAULT 'intermediate' CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
    primary_goal VARCHAR(50) NOT NULL DEFAULT 'hypertrophy_and_conditioning',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 3. FITNESS_ASSESSMENTS TABLE (Baseline Physical Capacity Assessments)
CREATE TABLE IF NOT EXISTS fitness_assessments (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    assessment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estimated_vo2max REAL CHECK (estimated_vo2max >= 15.0 AND estimated_vo2max <= 90.0),
    pushups_count INTEGER NOT NULL CHECK (pushups_count >= 0 AND pushups_count <= 250),
    plank_duration_sec INTEGER NOT NULL CHECK (plank_duration_sec >= 0 AND plank_duration_sec <= 1200),
    squat_1rm_kg REAL CHECK (squat_1rm_kg >= 0.0 AND squat_1rm_kg <= 500.0),
    resting_heart_rate INTEGER NOT NULL CHECK (resting_heart_rate >= 30 AND resting_heart_rate <= 150),
    fitness_score REAL NOT NULL CHECK (fitness_score >= 0.0 AND fitness_score <= 100.0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 4. TRAINING_PLANS TABLE (Macrocycle & Mesocycle Definitions)
CREATE TABLE IF NOT EXISTS training_plans (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_weeks INTEGER NOT NULL CHECK (total_weeks >= 1 AND total_weeks <= 52),
    status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'paused')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 5. WORKOUTS TABLE (Individual Microcycle Workout Sessions)
CREATE TABLE IF NOT EXISTS workouts (
    id VARCHAR(36) PRIMARY KEY,
    plan_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    scheduled_date DATE NOT NULL,
    title VARCHAR(150) NOT NULL,
    intensity_target VARCHAR(30) NOT NULL DEFAULT 'Standard' CHECK (intensity_target IN ('Deload', 'Standard', 'Overload', 'Active Recovery')),
    session_type VARCHAR(30) NOT NULL DEFAULT 'Strength' CHECK (session_type IN ('Strength', 'HIIT', 'Cardio', 'Mobility')),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES training_plans (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 6. EXERCISE_SETS TABLE (Fine-grained Exercise Logs within a Workout)
CREATE TABLE IF NOT EXISTS exercise_sets (
    id VARCHAR(36) PRIMARY KEY,
    workout_id VARCHAR(36) NOT NULL,
    exercise_name VARCHAR(100) NOT NULL,
    set_order INTEGER NOT NULL CHECK (set_order >= 1),
    target_reps INTEGER NOT NULL CHECK (target_reps >= 1),
    actual_reps INTEGER CHECK (actual_reps >= 0),
    target_weight_kg REAL NOT NULL CHECK (target_weight_kg >= 0.0),
    actual_weight_kg REAL CHECK (actual_weight_kg >= 0.0),
    rpe_actual REAL CHECK (rpe_actual >= 1.0 AND rpe_actual <= 10.0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
);

-- 7. RECOVERY_LOGS TABLE (Daily Biometrics & AI Readiness Inputs)
CREATE TABLE IF NOT EXISTS recovery_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    log_date DATE NOT NULL,
    hrv_rmssd REAL NOT NULL CHECK (hrv_rmssd >= 5.0 AND hrv_rmssd <= 250.0),
    sleep_hours REAL NOT NULL CHECK (sleep_hours >= 0.0 AND sleep_hours <= 24.0),
    deep_sleep_ratio REAL NOT NULL CHECK (deep_sleep_ratio >= 0.0 AND deep_sleep_ratio <= 1.0),
    doms_score INTEGER NOT NULL CHECK (doms_score >= 1 AND doms_score <= 10),
    rpe_previous_day REAL NOT NULL CHECK (rpe_previous_day >= 1.0 AND rpe_previous_day <= 10.0),
    readiness_score REAL NOT NULL CHECK (readiness_score >= 0.0 AND readiness_score <= 100.0),
    classification VARCHAR(50) NOT NULL CHECK (classification IN ('Optimal / Full Session', 'Modified Intensity', 'Active Recovery', 'Complete Rest')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (user_id, log_date)
);

-- 8. PROGRESS_METRICS TABLE (Longitudinal Tracking of Biomarkers & Volume)
CREATE TABLE IF NOT EXISTS progress_metrics (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    recorded_date DATE NOT NULL,
    weight_kg REAL NOT NULL CHECK (weight_kg >= 30.0 AND weight_kg <= 300.0),
    body_fat_percentage REAL CHECK (body_fat_percentage >= 3.0 AND body_fat_percentage <= 60.0),
    recovery_avg_7d REAL NOT NULL CHECK (recovery_avg_7d >= 0.0 AND recovery_avg_7d <= 100.0),
    training_load_7d REAL NOT NULL CHECK (training_load_7d >= 0.0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE (user_id, recorded_date)
);

-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_fitness_assessments_user_date ON fitness_assessments(user_id, assessment_date);
CREATE INDEX IF NOT EXISTS idx_workouts_plan_date ON workouts(plan_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_workout ON exercise_sets(workout_id);
CREATE INDEX IF NOT EXISTS idx_recovery_logs_user_date ON recovery_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_progress_metrics_user_date ON progress_metrics(user_id, recorded_date);
