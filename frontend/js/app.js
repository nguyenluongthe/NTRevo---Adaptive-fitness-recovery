/**
 * @file app.js
 * @description Main application entry point for NTRevo.
 */

import { BiometricsCheckinForm } from './checkin.js';
import { storage } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('⚡ NTRevo - Adaptive Fitness Recovery App Initializing...');

    // Initialize Morning Biometrics Checkin Form (FR-01 / US-002)
    const checkinForm = new BiometricsCheckinForm({
        formElement: document.getElementById('biometrics-form'),
        sleepSlider: document.getElementById('sleep-slider'),
        sleepValLabel: document.getElementById('sleep-val-label'),
        starsContainer: document.getElementById('stars-container'),
        rhrInput: document.getElementById('rhr-input'),
        stressSelect: document.getElementById('stress-select'),
        dateInput: document.getElementById('date-input'),
        errorAlert: document.getElementById('error-alert'),
        successAlert: document.getElementById('success-alert'),
        summaryCard: document.getElementById('summary-card'),
        onSuccess: (savedLog) => {
            console.log('✅ Biometrics recorded successfully:', savedLog);
            // In subsequent stories (US-003), this will transition to the DOMS map tab
        }
    });

    // Update quality label on star clicks
    const starsContainer = document.getElementById('stars-container');
    const qualityValLabel = document.getElementById('quality-val-label');
    if (starsContainer && qualityValLabel) {
        starsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.star-btn');
            if (btn) {
                const rating = btn.dataset.rating;
                qualityValLabel.textContent = `${rating} / 5 sao`;
            }
        });
    }

    // Expose storage for browser debugging
    window.NTRevo = {
        storage,
        checkinForm
    };
});
