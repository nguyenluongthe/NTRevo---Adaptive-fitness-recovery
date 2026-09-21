/**
 * @file app.js
 * @description Main application controller and tab manager for NTRevo.
 */

import { BiometricsCheckinForm } from './checkin.js';
import { DomsMapController } from './doms.js';
import { storage } from './storage.js';

class NTRevoApp {
    constructor() {
        this.currentTab = 'checkin';
        this.initTabs();
        this.initCheckin();
        this.initDoms();
    }

    initTabs() {
        const tabs = document.querySelectorAll('.flow-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        // Update tab header buttons
        document.querySelectorAll('.flow-tab').forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Toggle views
        const views = {
            checkin: document.getElementById('view-checkin'),
            doms: document.getElementById('view-doms'),
            sprints: document.getElementById('view-sprints')
        };

        Object.keys(views).forEach(key => {
            const viewEl = views[key];
            if (viewEl) {
                if (key === tabName) {
                    viewEl.classList.remove('hidden');
                } else {
                    viewEl.classList.add('hidden');
                }
            }
        });

        // If switching to DOMS tab, re-render DOMS state to ensure SVG and list sync
        if (tabName === 'doms' && this.domsController) {
            this.domsController.renderAll();
        }
    }

    initCheckin() {
        this.checkinForm = new BiometricsCheckinForm({
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
                console.log('✅ Biometrics recorded:', savedLog);
                // Auto transition to Step 2 (DOMS map) after short delay
                setTimeout(() => {
                    this.switchTab('doms');
                }, 800);
            }
        });

        // Update star label on click
        const starsContainer = document.getElementById('stars-container');
        const qualityValLabel = document.getElementById('quality-val-label');
        if (starsContainer && qualityValLabel) {
            starsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.star-btn');
                if (btn) {
                    qualityValLabel.textContent = `${btn.dataset.rating} / 5 sao`;
                }
            });
        }
    }

    initDoms() {
        const domsContainer = document.getElementById('view-doms');
        if (!domsContainer) return;

        this.domsController = new DomsMapController({
            containerElement: domsContainer,
            modalElement: document.getElementById('doms-modal'),
            sliderElement: document.getElementById('pain-level-slider'),
            painValLabel: document.getElementById('modal-pain-val'),
            painDescLabel: document.getElementById('modal-pain-desc'),
            muscleNameLabel: document.getElementById('modal-muscle-name'),
            saveMuscleBtn: document.getElementById('modal-save-muscle'),
            removeMuscleBtn: document.getElementById('modal-remove-muscle'),
            selectedListElement: document.getElementById('selected-soreness-list'),
            saveDomsBtn: document.getElementById('btn-save-doms'),
            onComplete: (savedLog) => {
                console.log('✅ DOMS muscle soreness saved:', savedLog);
                alert(`Đã lưu ${savedLog.muscles.length} nhóm cơ đau nhức! AI Engine đang chuẩn bị tính toán Readiness Score.`);
            }
        });

        // Bind SVG muscle clicks
        const svgMuscles = domsContainer.querySelectorAll('.muscle-path');
        svgMuscles.forEach(node => {
            node.addEventListener('click', () => {
                const muscleId = node.dataset.muscle;
                this.domsController.selectMuscleForEdit(muscleId);
            });
        });

        // Bind quick button clicks
        const quickBtns = domsContainer.querySelectorAll('.muscle-quick-btn');
        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const muscleId = btn.dataset.muscle;
                this.domsController.selectMuscleForEdit(muscleId);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('⚡ NTRevo - Initializing Application...');
    window.NTRevo = new NTRevoApp();
});
