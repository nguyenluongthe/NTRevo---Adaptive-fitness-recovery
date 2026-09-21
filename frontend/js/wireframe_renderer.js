/**
 * NTRevo Dynamic Wireframe Renderer
 * Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
 * Parses JSON Wireframe Schema and builds interactive accessible DOM forms
 */

class WireframeRenderer {
    constructor(containerId, schemaData) {
        this.container = document.getElementById(containerId);
        this.schema = schemaData;
        this.formData = {};
    }

    render() {
        if (!this.container || !this.schema) return;
        this.container.innerHTML = "";

        // Build Header
        const headerEl = document.createElement("div");
        headerEl.className = "wireframe-header";
        headerEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span class="badge" style="background:rgba(255,69,0,0.15); color:#FF4500; padding:4px 10px; border-radius:20px; font-size:0.8rem; font-weight:600; border:1px solid rgba(255,69,0,0.3);">${this.schema.header.badge || 'Component Layout'}</span>
                <span style="font-size:0.8rem; color:#71717A;">Schema v${this.schema.version}</span>
            </div>
            <h1 style="font-size:1.6rem; font-weight:700; color:#FAFAFA; margin:0 0 6px 0;">${this.schema.header.title}</h1>
            <p style="font-size:0.95rem; color:#A1A1AA; margin:0 0 24px 0;">${this.schema.header.subtitle}</p>
        `;
        this.container.appendChild(headerEl);

        // Build Sections
        const formEl = document.createElement("form");
        formEl.id = "dynamic-wireframe-form";
        formEl.addEventListener("submit", (e) => this.handleSubmit(e));

        this.schema.sections.forEach(section => {
            const secEl = document.createElement("div");
            secEl.className = "wireframe-section card";
            secEl.style.cssText = `
                background: #18181B;
                border: 1px solid #27272A;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            `;

            const secTitle = document.createElement("h2");
            secTitle.style.cssText = "font-size: 1.1rem; color: #E4E4E7; margin-top:0; margin-bottom: 16px; border-bottom: 1px solid #27272A; padding-bottom: 8px;";
            secTitle.textContent = section.title;
            secEl.appendChild(secTitle);

            const gridEl = document.createElement("div");
            gridEl.className = `grid-${section.layout_type}`;
            gridEl.style.cssText = section.layout_type === "grid-3" 
                ? "display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;" 
                : "display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;";

            section.components.forEach(cmp => {
                const cmpEl = this.renderComponent(cmp);
                gridEl.appendChild(cmpEl);
            });

            secEl.appendChild(gridEl);
            formEl.appendChild(secEl);
        });

        // Submit Button
        const submitWrap = document.createElement("div");
        submitWrap.style.cssText = "display: flex; gap: 12px; margin-top: 24px;";
        submitWrap.innerHTML = `
            <button type="submit" id="btn-calculate-baseline" style="background:#FF4500; color:#fff; border:none; padding:12px 24px; border-radius:8px; font-weight:600; cursor:pointer; font-size:1rem; transition:0.2s;">
                🚀 Phân tích Điểm Thể lực & Lưu Baseline
            </button>
            <button type="button" id="btn-mock-load" style="background:#27272A; color:#E4E4E7; border:1px solid #3F3F46; padding:12px 20px; border-radius:8px; font-weight:500; cursor:pointer;">
                🔄 Nạp Dữ liệu Mẫu (Biometrics)
            </button>
        `;
        formEl.appendChild(submitWrap);

        // Result Container
        const resultContainer = document.createElement("div");
        resultContainer.id = "wireframe-result-output";
        resultContainer.style.cssText = "margin-top:24px; display:none;";
        formEl.appendChild(resultContainer);

        this.container.appendChild(formEl);

        // Wire Mock Data Loader
        const mockBtn = formEl.querySelector("#btn-mock-load");
        if (mockBtn) {
            mockBtn.addEventListener("click", () => this.loadMockData());
        }
    }

    renderComponent(cmp) {
        const wrap = document.createElement("div");
        wrap.className = "form-group";
        wrap.style.marginBottom = "12px";

        const label = document.createElement("label");
        label.style.cssText = "display: block; font-size: 0.85rem; color: #A1A1AA; margin-bottom: 6px;";
        label.textContent = cmp.label + (cmp.unit ? ` (${cmp.unit})` : "");
        wrap.appendChild(label);

        if (cmp.type === "number-input") {
            const input = document.createElement("input");
            input.type = "number";
            input.name = cmp.field_name;
            input.id = cmp.id;
            input.min = cmp.min;
            input.max = cmp.max;
            input.step = cmp.step || 1;
            input.value = cmp.default_value !== undefined ? cmp.default_value : "";
            input.required = !!cmp.required;
            input.style.cssText = `
                width: 100%;
                background: #09090B;
                border: 1px solid #27272A;
                border-radius: 6px;
                color: #FAFAFA;
                padding: 10px 12px;
                font-size: 0.95rem;
                box-sizing: border-box;
            `;
            this.formData[cmp.field_name] = cmp.default_value;
            input.addEventListener("input", (e) => { this.formData[cmp.field_name] = parseFloat(e.target.value); });
            wrap.appendChild(input);
        } else if (cmp.type === "range-slider") {
            const sliderWrap = document.createElement("div");
            sliderWrap.style.display = "flex";
            sliderWrap.style.alignItems = "center";
            sliderWrap.style.gap = "12px";

            const slider = document.createElement("input");
            slider.type = "range";
            slider.name = cmp.field_name;
            slider.id = cmp.id;
            slider.min = cmp.min;
            slider.max = cmp.max;
            slider.step = cmp.step || 1;
            slider.value = cmp.default_value || cmp.min;
            slider.style.cssText = "flex: 1; accent-color: #FF4500;";

            const valBadge = document.createElement("span");
            valBadge.textContent = slider.value + (cmp.unit || "");
            valBadge.style.cssText = "font-size: 0.9rem; font-weight:700; color: #FF4500; min-width: 40px;";

            slider.addEventListener("input", (e) => {
                valBadge.textContent = e.target.value + (cmp.unit || "");
                this.formData[cmp.field_name] = parseInt(e.target.value);
            });
            this.formData[cmp.field_name] = parseInt(slider.value);

            sliderWrap.appendChild(slider);
            sliderWrap.appendChild(valBadge);
            wrap.appendChild(sliderWrap);
        } else if (cmp.type === "tag-selector") {
            const tagContainer = document.createElement("div");
            tagContainer.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px;";
            (cmp.options || []).forEach(opt => {
                const tag = document.createElement("button");
                tag.type = "button";
                tag.textContent = opt;
                const isSelected = opt === cmp.default_value;
                tag.style.cssText = `
                    background: ${isSelected ? '#FF4500' : '#27272A'};
                    color: ${isSelected ? '#FFFFFF' : '#D4D4D8'};
                    border: 1px solid ${isSelected ? '#FF4500' : '#3F3F46'};
                    padding: 6px 12px;
                    border-radius: 16px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: 0.15s;
                `;
                tag.addEventListener("click", () => {
                    Array.from(tagContainer.children).forEach(c => {
                        c.style.background = '#27272A';
                        c.style.color = '#D4D4D8';
                        c.style.borderColor = '#3F3F46';
                    });
                    tag.style.background = '#FF4500';
                    tag.style.color = '#FFFFFF';
                    tag.style.borderColor = '#FF4500';
                    this.formData[cmp.field_name] = opt;
                });
                tagContainer.appendChild(tag);
            });
            this.formData[cmp.field_name] = cmp.default_value;
            wrap.appendChild(tagContainer);
        }

        return wrap;
    }

    loadMockData() {
        const sample = {
            resting_heart_rate: 54,
            estimated_vo2max: 51.5,
            pushups_count: 45,
            plank_duration_sec: 150,
            squat_1rm_kg: 125,
            doms_level: 2,
            sore_muscle_groups: "Không đau"
        };
        Object.keys(sample).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = sample[key];
                input.dispatchEvent(new Event('input'));
            }
        });
        alert("Đã nạp thành công bộ dữ liệu sinh trắc học mẫu từ Mock Biometrics Datastore!");
    }

    handleSubmit(e) {
        e.preventDefault();
        const rhr = Number(this.formData.resting_heart_rate) || 60;
        const pushups = Number(this.formData.pushups_count) || 30;
        const plank = Number(this.formData.plank_duration_sec) || 60;
        const vo2 = Number(this.formData.estimated_vo2max) || 40;

        // Basic Fitness Score heuristic
        const score = Math.round(
            (pushups * 0.7) +
            (plank / 4) +
            (vo2 * 0.6) +
            (Math.max(0, 80 - rhr) * 0.4)
        );
        const clampedScore = Math.min(100, Math.max(10, score));

        const resDiv = document.getElementById("wireframe-result-output");
        resDiv.style.display = "block";
        resDiv.innerHTML = `
            <div style="background:rgba(39,39,42,0.8); border:1px solid #FF4500; border-radius:12px; padding:20px;">
                <h3 style="color:#FF4500; margin-top:0;">🎯 Kết quả Đánh giá Thể lực AI Baseline</h3>
                <div style="display:flex; align-items:center; gap:20px;">
                    <div style="font-size:3rem; font-weight:800; color:#FAFAFA;">${clampedScore}<span style="font-size:1.2rem; color:#71717A;">/100</span></div>
                    <div>
                        <p style="margin:0; color:#E4E4E7; font-weight:600;">Hạng thể lực: ${clampedScore >= 80 ? 'Elite Athlete' : clampedScore >= 65 ? 'Advanced Fit' : 'Active Intermediate'}</p>
                        <p style="margin:4px 0 0 0; font-size:0.9rem; color:#A1A1AA;">Thuật toán đã ghi nhận hồ sơ và điều chỉnh phân phối tải tập thích nghi cho chu kỳ tiếp theo.</p>
                    </div>
                </div>
            </div>
        `;
    }
}
