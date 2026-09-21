/**
 * @file doms.js
 * @description Interactive DOMS (Delayed Onset Muscle Soreness) body map controller (US-003 / FR-02).
 */

import { storage } from './storage.js';
import { createDomsLog, MUSCLE_GROUPS } from './models.js';

export const MUSCLE_DEFINITIONS = Object.freeze([
    { id: MUSCLE_GROUPS.CHEST, nameVi: 'Cơ Ngực (Chest)', view: 'front' },
    { id: MUSCLE_GROUPS.SHOULDERS, nameVi: 'Cơ Vai (Deltoids)', view: 'both' },
    { id: MUSCLE_GROUPS.BICEPS, nameVi: 'Cơ Bắp Tay Trước (Biceps)', view: 'front' },
    { id: MUSCLE_GROUPS.ABS, nameVi: 'Cơ Bụng (Abs / Core)', view: 'front' },
    { id: MUSCLE_GROUPS.QUADS, nameVi: 'Cơ Đùi Trước (Quadriceps)', view: 'front' },
    { id: MUSCLE_GROUPS.UPPER_BACK, nameVi: 'Lưng Trên / Xô (Upper Back / Lats)', view: 'back' },
    { id: MUSCLE_GROUPS.LOWER_BACK, nameVi: 'Lưng Dưới (Lower Back)', view: 'back' },
    { id: MUSCLE_GROUPS.TRICEPS, nameVi: 'Cơ Bắp Tay Sau (Triceps)', view: 'back' },
    { id: MUSCLE_GROUPS.GLUTES, nameVi: 'Cơ Mông (Glutes)', view: 'back' },
    { id: MUSCLE_GROUPS.HAMSTRINGS, nameVi: 'Cơ Đùi Sau (Hamstrings)', view: 'back' },
    { id: MUSCLE_GROUPS.CALVES, nameVi: 'Bắp Chân (Calves)', view: 'both' }
]);

export function getPainColor(level) {
    if (!level || level <= 0) return 'rgba(255, 255, 255, 0.08)';
    if (level <= 3) return '#facc15'; // Mild (Yellow)
    if (level <= 6) return '#f97316'; // Moderate (Orange)
    return '#ef4444';                // Severe (Red)
}

export function getPainDescription(level) {
    if (!level || level <= 0) return 'Không đau';
    if (level <= 3) return 'Đau nhẹ - Vẫn vận động linh hoạt';
    if (level <= 6) return 'Đau vừa - Hạn chế biên độ chuyển động';
    return 'Đau dữ dội - Căng cứng, cần phục hồi tích cực';
}

export class DomsMapController {
    constructor({
        containerElement,
        modalElement,
        sliderElement,
        painValLabel,
        painDescLabel,
        muscleNameLabel,
        saveMuscleBtn,
        removeMuscleBtn,
        selectedListElement,
        saveDomsBtn,
        onComplete
    } = {}) {
        this.container = containerElement;
        this.modal = modalElement;
        this.slider = sliderElement;
        this.painValLabel = painValLabel;
        this.painDescLabel = painDescLabel;
        this.muscleNameLabel = muscleNameLabel;
        this.saveMuscleBtn = saveMuscleBtn;
        this.removeMuscleBtn = removeMuscleBtn;
        this.selectedList = selectedListElement;
        this.saveDomsBtn = saveDomsBtn;
        this.onComplete = onComplete;

        this.selectedMuscles = new Map(); // muscleId -> painLevel
        this.currentEditingMuscle = null;

        this.init();
    }

    init() {
        if (!this.container) return;

        // Modal slider event
        if (this.slider && this.painValLabel) {
            this.slider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value, 10);
                this.painValLabel.textContent = `${val} / 10`;
                if (this.painDescLabel) {
                    this.painDescLabel.textContent = getPainDescription(val);
                }
            });
        }

        // Save pain rating from modal
        if (this.saveMuscleBtn) {
            this.saveMuscleBtn.addEventListener('click', () => {
                if (this.currentEditingMuscle && this.slider) {
                    const pain = parseInt(this.slider.value, 10);
                    this.setMusclePain(this.currentEditingMuscle, pain);
                    this.closeModal();
                }
            });
        }

        // Remove muscle soreness
        if (this.removeMuscleBtn) {
            this.removeMuscleBtn.addEventListener('click', () => {
                if (this.currentEditingMuscle) {
                    this.removeMuscle(this.currentEditingMuscle);
                    this.closeModal();
                }
            });
        }

        // Modal close on backdrop click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
            const closeBtn = this.modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal());
            }
        }

        // Save all DOMS logs to storage
        if (this.saveDomsBtn) {
            this.saveDomsBtn.addEventListener('click', () => this.saveAndContinue());
        }

        this.loadExistingData();
        this.renderAll();
    }

    selectMuscleForEdit(muscleId) {
        const def = MUSCLE_DEFINITIONS.find(m => m.id === muscleId);
        if (!def) return;

        this.currentEditingMuscle = muscleId;
        const currentPain = this.selectedMuscles.get(muscleId) || 5;

        if (this.muscleNameLabel) this.muscleNameLabel.textContent = def.nameVi;
        if (this.slider) this.slider.value = currentPain;
        if (this.painValLabel) this.painValLabel.textContent = `${currentPain} / 10`;
        if (this.painDescLabel) this.painDescLabel.textContent = getPainDescription(currentPain);

        if (this.modal) this.modal.classList.remove('hidden');
    }

    closeModal() {
        this.currentEditingMuscle = null;
        if (this.modal) this.modal.classList.add('hidden');
    }

    setMusclePain(muscleId, painLevel) {
        const level = Math.max(1, Math.min(10, Number(painLevel) || 1));
        this.selectedMuscles.set(muscleId, level);
        this.renderAll();
    }

    removeMuscle(muscleId) {
        this.selectedMuscles.delete(muscleId);
        this.renderAll();
    }

    renderAll() {
        this.updateSvgMapVisuals();
        this.renderSelectedChips();
    }

    updateSvgMapVisuals() {
        if (!this.container) return;

        // Update SVG muscle shapes
        const muscleNodes = this.container.querySelectorAll('[data-muscle]');
        muscleNodes.forEach(node => {
            const muscleId = node.dataset.muscle;
            const pain = this.selectedMuscles.get(muscleId);
            const color = getPainColor(pain);

            if (node.tagName.toLowerCase() === 'path' || node.tagName.toLowerCase() === 'rect' || node.tagName.toLowerCase() === 'polygon' || node.tagName.toLowerCase() === 'circle') {
                node.style.fill = color;
                if (pain) {
                    node.style.stroke = '#ffffff';
                    node.style.strokeWidth = '2px';
                    node.style.filter = `drop-shadow(0 0 8px ${color})`;
                } else {
                    node.style.stroke = 'rgba(255, 255, 255, 0.2)';
                    node.style.strokeWidth = '1px';
                    node.style.filter = 'none';
                }
            }
        });

        // Update list buttons if present
        const listCards = this.container.querySelectorAll('.muscle-quick-btn');
        listCards.forEach(btn => {
            const muscleId = btn.dataset.muscle;
            const pain = this.selectedMuscles.get(muscleId);
            if (pain) {
                btn.classList.add('active');
                btn.style.borderColor = getPainColor(pain);
                const badge = btn.querySelector('.pain-badge');
                if (badge) badge.textContent = `${pain}/10`;
            } else {
                btn.classList.remove('active');
                btn.style.borderColor = '';
                const badge = btn.querySelector('.pain-badge');
                if (badge) badge.textContent = '+';
            }
        });
    }

    renderSelectedChips() {
        if (!this.selectedList) return;

        if (this.selectedMuscles.size === 0) {
            this.selectedList.innerHTML = `
                <div class="empty-soreness">
                    <span>✨ Cơ thể hoàn toàn bình thường, không có nhóm cơ nào bị đau nhức.</span>
                </div>
            `;
            return;
        }

        let html = '';
        this.selectedMuscles.forEach((pain, muscleId) => {
            const def = MUSCLE_DEFINITIONS.find(m => m.id === muscleId) || { nameVi: muscleId };
            const color = getPainColor(pain);
            html += `
                <div class="soreness-chip" style="border-left: 4px solid ${color};">
                    <div class="chip-info">
                        <strong>${def.nameVi}</strong>
                        <span class="chip-severity" style="color: ${color};">Mức đau: ${pain}/10</span>
                    </div>
                    <button type="button" class="btn-chip-remove" data-remove="${muscleId}" title="Bỏ chọn">×</button>
                </div>
            `;
        });

        this.selectedList.innerHTML = html;

        // Bind chip remove buttons
        const removeBtns = this.selectedList.querySelectorAll('[data-remove]');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeMuscle(btn.dataset.remove);
            });
        });
    }

    loadExistingData() {
        const today = new Date().toISOString().split('T')[0];
        const existing = storage.getDomsLogByDate(today);
        if (existing && Array.isArray(existing.muscles)) {
            this.selectedMuscles.clear();
            existing.muscles.forEach(item => {
                this.selectedMuscles.set(item.muscle, item.painLevel);
            });
        }
    }

    saveAndContinue() {
        const muscleArray = [];
        this.selectedMuscles.forEach((painLevel, muscle) => {
            muscleArray.push({ muscle, painLevel });
        });

        const log = storage.saveDomsLog({
            muscles: muscleArray,
            date: new Date().toISOString().split('T')[0]
        });

        if (typeof this.onComplete === 'function') {
            this.onComplete(log);
        }
        return log;
    }
}
