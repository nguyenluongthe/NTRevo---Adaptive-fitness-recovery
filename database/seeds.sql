-- =============================================================================
-- NTRevo Adaptive Fitness & Recovery Platform
-- Database Seed Data Script (8 Core Entities)
-- Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
-- Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm
-- =============================================================================

-- 1. USERS SEED
INSERT INTO users (id, email, password_hash, role, created_at, updated_at) VALUES
('usr-101', 'athlete@ntrevo.io', '$2b$12$e8x/0bA8L0F01nU7J9Z2qe4d1y0F4cZ/2fE9g8H7i6j5k4l3m2n1o', 'athlete', '2026-08-01 08:00:00', '2026-08-01 08:00:00'),
('usr-102', 'coach.sarah@ntrevo.io', '$2b$12$e8x/0bA8L0F01nU7J9Z2qe4d1y0F4cZ/2fE9g8H7i6j5k4l3m2n1o', 'coach', '2026-08-01 08:00:00', '2026-08-01 08:00:00'),
('usr-103', 'elite.marathoner@ntrevo.io', '$2b$12$e8x/0bA8L0F01nU7J9Z2qe4d1y0F4cZ/2fE9g8H7i6j5k4l3m2n1o', 'athlete', '2026-08-02 09:00:00', '2026-08-02 09:00:00')
ON CONFLICT (id) DO NOTHING;

-- 2. USER_PROFILES SEED
INSERT INTO user_profiles (id, user_id, full_name, age, gender, height_cm, weight_kg, fitness_level, primary_goal, created_at, updated_at) VALUES
('prf-101', 'usr-101', 'Nguyen The Long', 28, 'male', 178.5, 74.0, 'intermediate', 'hypertrophy_and_conditioning', '2026-08-01 08:15:00', '2026-08-01 08:15:00'),
('prf-103', 'usr-103', 'Tran Minh Duc', 32, 'male', 172.0, 65.5, 'elite', 'marathon_endurance', '2026-08-02 09:15:00', '2026-08-02 09:15:00')
ON CONFLICT (id) DO NOTHING;

-- 3. FITNESS_ASSESSMENTS SEED
INSERT INTO fitness_assessments (id, user_id, assessment_date, estimated_vo2max, pushups_count, plank_duration_sec, squat_1rm_kg, resting_heart_rate, fitness_score, created_at) VALUES
('asm-889', 'usr-101', '2026-08-01 08:30:00', 47.5, 38, 125, 115.0, 58, 78.5, '2026-08-01 08:30:00'),
('asm-890', 'usr-101', '2026-08-15 08:30:00', 49.0, 42, 140, 120.0, 56, 82.0, '2026-08-15 08:30:00'),
('asm-891', 'usr-103', '2026-08-02 09:30:00', 68.2, 55, 240, 95.0, 42, 94.5, '2026-08-02 09:30:00')
ON CONFLICT (id) DO NOTHING;

-- 4. TRAINING_PLANS SEED
INSERT INTO training_plans (id, user_id, title, description, start_date, end_date, total_weeks, status, created_at) VALUES
('pln-501', 'usr-101', 'Hypertrophy & Conditioning 8-Week Macrocycle', 'Adaptive 4-day split with daily autoregulated volume and recovery scoring', '2026-08-10', '2026-10-05', 8, 'active', '2026-08-09 10:00:00'),
('pln-502', 'usr-103', 'Sub-3 Hour Marathon Prep Peak Cycle', 'High mileage aerobic base with weekly lactate threshold tempo runs', '2026-08-05', '2026-11-20', 16, 'active', '2026-08-04 11:00:00')
ON CONFLICT (id) DO NOTHING;

-- 5. WORKOUTS SEED
INSERT INTO workouts (id, plan_id, user_id, scheduled_date, title, intensity_target, session_type, status, completed_at, created_at) VALUES
('wk-001', 'pln-501', 'usr-101', '2026-08-10', 'Upper Body Heavy Push & Lateral Delts', 'Standard', 'Strength', 'completed', '2026-08-10 18:45:00', '2026-08-09 12:00:00'),
('wk-002', 'pln-501', 'usr-101', '2026-08-11', 'Lower Body Quad Dominant & Core Stability', 'Overload', 'Strength', 'completed', '2026-08-11 19:10:00', '2026-08-10 12:00:00'),
('wk-003', 'pln-501', 'usr-101', '2026-08-13', 'Active Recovery & Hip Mobility Protocol', 'Active Recovery', 'Mobility', 'completed', '2026-08-13 17:30:00', '2026-08-12 12:00:00'),
('wk-004', 'pln-501', 'usr-101', '2026-08-14', 'Posterior Chain Deadlift & Pull Specialization', 'Standard', 'Strength', 'pending', NULL, '2026-08-13 12:00:00')
ON CONFLICT (id) DO NOTHING;

-- 6. EXERCISE_SETS SEED
INSERT INTO exercise_sets (id, workout_id, exercise_name, set_order, target_reps, actual_reps, target_weight_kg, actual_weight_kg, rpe_actual, created_at) VALUES
('set-001', 'wk-001', 'Barbell Bench Press', 1, 8, 8, 80.0, 80.0, 7.5, '2026-08-10 18:05:00'),
('set-002', 'wk-001', 'Barbell Bench Press', 2, 8, 8, 82.5, 82.5, 8.0, '2026-08-10 18:10:00'),
('set-003', 'wk-001', 'Incline Dumbbell Press', 1, 10, 10, 28.0, 28.0, 8.5, '2026-08-10 18:22:00'),
('set-004', 'wk-002', 'Barbell Back Squat', 1, 6, 6, 110.0, 110.0, 8.0, '2026-08-11 18:35:00'),
('set-005', 'wk-002', 'Barbell Back Squat', 2, 6, 6, 112.5, 112.5, 8.5, '2026-08-11 18:42:00')
ON CONFLICT (id) DO NOTHING;

-- 7. RECOVERY_LOGS SEED
INSERT INTO recovery_logs (id, user_id, log_date, hrv_rmssd, sleep_hours, deep_sleep_ratio, doms_score, rpe_previous_day, readiness_score, classification, created_at) VALUES
('rec-001', 'usr-101', '2026-08-10', 65.2, 8.1, 0.22, 2, 6.5, 86.4, 'Optimal / Full Session', '2026-08-10 07:00:00'),
('rec-002', 'usr-101', '2026-08-11', 63.8, 7.5, 0.20, 3, 8.0, 81.2, 'Optimal / Full Session', '2026-08-11 07:00:00'),
('rec-003', 'usr-101', '2026-08-12', 58.1, 6.8, 0.16, 5, 8.5, 67.5, 'Modified Intensity', '2026-08-12 07:00:00'),
('rec-004', 'usr-101', '2026-08-13', 52.0, 5.9, 0.12, 7, 9.0, 51.3, 'Active Recovery', '2026-08-13 07:00:00'),
('rec-005', 'usr-101', '2026-08-14', 44.5, 5.2, 0.09, 9, 9.5, 34.2, 'Complete Rest', '2026-08-14 07:00:00')
ON CONFLICT (id) DO NOTHING;

-- 8. PROGRESS_METRICS SEED
INSERT INTO progress_metrics (id, user_id, recorded_date, weight_kg, body_fat_percentage, recovery_avg_7d, training_load_7d, created_at) VALUES
('met-001', 'usr-101', '2026-08-10', 74.2, 14.5, 84.5, 2450.0, '2026-08-10 07:30:00'),
('met-002', 'usr-101', '2026-08-14', 73.8, 14.2, 64.1, 3850.0, '2026-08-14 07:30:00')
ON CONFLICT (id) DO NOTHING;
