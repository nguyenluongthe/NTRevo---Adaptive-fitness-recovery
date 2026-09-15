/**
 * @file checkin.js
 * @description Morning Biometrics Check-in logic and form handler (US-002 / FR-01).
 */

import { storage } from './storage.js';
import { createBiometricsLog } from './models.js';

export class BiometricsCheckinForm {
    constructor({
        formElement,
        sleepSlider,
        sleepValLabel,
        starsContainer,
        rhrInput,
        stressSelect,
        dateInput,
        errorAlert,
        successAlert,
        summaryCard,
        onSuccess
    } = {}) {
        this.form = formElement;
        this.sleepSlider = sleepSlider;
        this.sleepValLabel = sleepValLabel;
        this.starsContainer = starsContainer;
        this.rhrInput = rhrInput;
        this.stressSelect = stressSelect;
        this.dateInput = dateInput;
        this.errorAlert = errorAlert;
        this.successAlert = successAlert;
        this.summaryCard = summaryCard;
        this.onSuccess = onSuccess;

        this.selectedRating = 4; // Default 4 stars
        this.init();
    }

    init() {
        if (!this.form) return;

        // Set default date to today
        if (this.dateInput && !this.dateInput.value) {
            this.dateInput.value = new Date().toISOString().split('T')[0];
        }

        // Setup sleep slider label listener
        if (this.sleepSlider && this.sleepValLabel) {
            this.sleepSlider.addEventListener('input', (e) => {
                this.sleepValLabel.textContent = `${parseFloat(e.target.value).toFixed(1)} giờ`;
            });
        }

        // Setup star rating buttons
        if (this.starsContainer) {
            const starButtons = this.starsContainer.querySelectorAll('.star-btn');
            starButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const rating = parseInt(btn.dataset.rating, 10);
                    this.setRating(rating);
                });
            });
            this.setRating(this.selectedRating);
        }

        // Form submit
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Load existing today's data if present
        this.loadExistingData();
    }

    setRating(rating) {
        this.selectedRating = Math.max(1, Math.min(5, rating));
        if (this.starsContainer) {
            const starButtons = this.starsContainer.querySelectorAll('.star-btn');
            starButtons.forEach(btn => {
                const r = parseInt(btn.dataset.rating, 10);
                if (r <= this.selectedRating) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    }

    validate(formData) {
        const errors = [];
        const sleepHours = parseFloat(formData.sleepHours);
        if (isNaN(sleepHours) || sleepHours < 0 || sleepHours > 14) {
            errors.push('Thời gian ngủ phải từ 0 đến 14 giờ.');
        }

        const rhr = parseInt(formData.rhrBpm, 10);
        if (isNaN(rhr) || rhr < 30 || rhr > 150) {
            errors.push('Nhịp tim nghỉ ngơi (RHR) phải nằm trong khoảng 30 - 150 bpm.');
        }

        const stress = parseInt(formData.stressLevel, 10);
        if (isNaN(stress) || stress < 1 || stress > 5) {
            errors.push('Mức độ căng thẳng phải từ 1 đến 5.');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    handleSubmit() {
        this.hideAlerts();

        const formData = {
            sleepHours: this.sleepSlider ? this.sleepSlider.value : 7.5,
            sleepQuality: this.selectedRating,
            rhrBpm: this.rhrInput ? this.rhrInput.value : 60,
            stressLevel: this.stressSelect ? this.stressSelect.value : 2,
            date: this.dateInput ? this.dateInput.value : new Date().toISOString().split('T')[0]
        };

        const validation = this.validate(formData);
        if (!validation.isValid) {
            this.showError(validation.errors.join('<br>'));
            return null;
        }

        try {
            const savedLog = storage.saveBiometrics(formData);
            this.showSuccess(`Đã lưu thành công dữ liệu thể lực cho ngày ${savedLog.date}!`);
            this.updateSummary(savedLog);
            if (typeof this.onSuccess === 'function') {
                this.onSuccess(savedLog);
            }
            return savedLog;
        } catch (err) {
            this.showError(err.message || 'Lỗi khi lưu dữ liệu.');
            return null;
        }
    }

    loadExistingData() {
        const targetDate = this.dateInput ? this.dateInput.value : new Date().toISOString().split('T')[0];
        const existing = storage.getBiometricsByDate(targetDate);
        if (existing) {
            if (this.sleepSlider) {
                this.sleepSlider.value = existing.sleepHours;
                if (this.sleepValLabel) this.sleepValLabel.textContent = `${existing.sleepHours} giờ`;
            }
            if (this.rhrInput) {
                this.rhrInput.value = existing.rhrBpm;
            }
            if (this.stressSelect) {
                this.stressSelect.value = existing.stressLevel;
            }
            this.setRating(existing.sleepQuality);
            this.updateSummary(existing);
        }
    }

    updateSummary(log) {
        if (!this.summaryCard) return;
        this.summaryCard.classList.remove('hidden');
        const contentEl = this.summaryCard.querySelector('.summary-content');
        if (contentEl) {
            contentEl.innerHTML = `
                <div class="summary-pill"><span class="label">Giấc ngủ:</span> <strong>${log.sleepHours}h (${'★'.repeat(log.sleepQuality)}${'☆'.repeat(5 - log.sleepQuality)})</strong></div>
                <div class="summary-pill"><span class="label">Nhịp tim RHR:</span> <strong>${log.rhrBpm} bpm</strong></div>
                <div class="summary-pill"><span class="label">Stress:</span> <strong>Mức ${log.stressLevel}/5</strong></div>
            `;
        }
    }

    showError(msg) {
        if (this.errorAlert) {
            this.errorAlert.innerHTML = msg;
            this.errorAlert.classList.remove('hidden');
        }
    }

    showSuccess(msg) {
        if (this.successAlert) {
            this.successAlert.innerHTML = msg;
            this.successAlert.classList.remove('hidden');
            setTimeout(() => {
                this.successAlert.classList.add('hidden');
            }, 4000);
        }
    }

    hideAlerts() {
        if (this.errorAlert) this.errorAlert.classList.add('hidden');
        if (this.successAlert) this.successAlert.classList.add('hidden');
    }
}
