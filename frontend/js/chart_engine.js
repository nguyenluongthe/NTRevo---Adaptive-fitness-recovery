/**
 * NTRevo Interactive Canvas Chart Engine
 * Sprint 4 (Chương 6: AI Code Generation & Visualization)
 * Author: Dev2-FrontendQA
 * Capabilities: High-DPI crisp rendering, HRV Trend Line, Training Load Bar Charts
 */

class BiometricChartEngine {
    constructor() {
        this.colors = {
            accentOrange: '#FF4500',
            accentOrangeGlow: 'rgba(255, 69, 0, 0.3)',
            accentGreen: '#10B981',
            accentGreenGlow: 'rgba(16, 185, 129, 0.2)',
            textMuted: '#A1A1AA',
            gridLine: 'rgba(39, 39, 42, 0.8)',
            cardBg: '#18181B'
        };
    }

    /**
     * Fix canvas resolution on High-DPI (Retina) displays
     */
    prepareCanvas(canvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        return { ctx, width: rect.width, height: rect.height };
    }

    /**
     * Render 7-Day HRV Trend Line Chart
     * @param {HTMLCanvasElement} canvas 
     * @param {Array} historyData [{date: 'T2', hrv: 64}, ...]
     * @param {number} baseline 
     */
    renderHrvTrend(canvas, historyData, baseline = 68) {
        if (!canvas) return;
        const { ctx, width, height } = this.prepareCanvas(canvas);
        
        const padding = { top: 30, right: 25, bottom: 40, left: 45 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Compute Y range
        const values = historyData.map(d => d.hrv);
        const minVal = Math.min(...values, baseline) - 10;
        const maxVal = Math.max(...values, baseline) + 10;

        const getY = (val) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
        const getX = (idx) => padding.left + (idx / (historyData.length - 1)) * chartW;

        // Draw horizontal grid lines
        ctx.strokeStyle = this.colors.gridLine;
        ctx.lineWidth = 1;
        ctx.fillStyle = this.colors.textMuted;
        ctx.font = '11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'right';

        const steps = 4;
        for (let i = 0; i <= steps; i++) {
            const val = Math.round(minVal + (i / steps) * (maxVal - minVal));
            const y = getY(val);
            
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();

            ctx.fillText(`${val} ms`, padding.left - 8, y + 4);
        }

        // Draw Baseline line (Dashed green)
        const baselineY = getY(baseline);
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = this.colors.accentGreen;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(padding.left, baselineY);
        ctx.lineTo(width - padding.right, baselineY);
        ctx.stroke();

        ctx.fillStyle = this.colors.accentGreen;
        ctx.textAlign = 'left';
        ctx.fillText(`Baseline: ${baseline}ms`, width - padding.right - 85, baselineY - 6);
        ctx.restore();

        // Draw Gradient Fill under HRV Line
        const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
        gradient.addColorStop(0, 'rgba(255, 69, 0, 0.45)');
        gradient.addColorStop(1, 'rgba(255, 69, 0, 0.0)');

        ctx.beginPath();
        ctx.moveTo(getX(0), getY(historyData[0].hrv));
        for (let i = 1; i < historyData.length; i++) {
            ctx.lineTo(getX(i), getY(historyData[i].hrv));
        }
        ctx.lineTo(getX(historyData.length - 1), padding.top + chartH);
        ctx.lineTo(getX(0), padding.top + chartH);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw HRV Main Line
        ctx.beginPath();
        ctx.strokeStyle = this.colors.accentOrange;
        ctx.lineWidth = 3;
        ctx.shadowColor = this.colors.accentOrangeGlow;
        ctx.shadowBlur = 8;
        for (let i = 0; i < historyData.length; i++) {
            const x = getX(i);
            const y = getY(historyData[i].hrv);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // Draw Data Points & X-Axis Labels
        for (let i = 0; i < historyData.length; i++) {
            const item = historyData[i];
            const x = getX(i);
            const y = getY(item.hrv);

            // Outer circle
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.strokeStyle = this.colors.accentOrange;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label X
            ctx.fillStyle = this.colors.textMuted;
            ctx.textAlign = 'center';
            ctx.font = '12px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(item.date, x, height - padding.bottom + 22);

            // Value text on hover/point
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(`${item.hrv}`, x, y - 10);
        }
    }

    /**
     * Render Weekly Training Load (Volume kg) Bar Chart
     */
    renderTrainingLoad(canvas, historyData) {
        if (!canvas) return;
        const { ctx, width, height } = this.prepareCanvas(canvas);

        const padding = { top: 25, right: 20, bottom: 40, left: 55 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        ctx.clearRect(0, 0, width, height);

        const loads = historyData.map(d => d.load || 5000);
        const maxLoad = Math.max(...loads) * 1.15;

        const barW = (chartW / historyData.length) * 0.55;
        const slotW = chartW / historyData.length;

        // Horizontal guides
        ctx.strokeStyle = this.colors.gridLine;
        ctx.fillStyle = this.colors.textMuted;
        ctx.font = '11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'right';

        for (let i = 0; i <= 3; i++) {
            const val = Math.round((i / 3) * maxLoad);
            const y = padding.top + chartH - (val / maxLoad) * chartH;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
            ctx.fillText(`${(val / 1000).toFixed(1)}k kg`, padding.left - 8, y + 4);
        }

        // Draw Bars
        historyData.forEach((d, idx) => {
            const x = padding.left + (idx * slotW) + (slotW - barW) / 2;
            const barH = (d.load / maxLoad) * chartH;
            const y = padding.top + chartH - barH;

            // Highlight latest day
            const isToday = idx === historyData.length - 1;
            ctx.fillStyle = isToday ? this.colors.accentOrange : '#27272A';

            // Rounded rectangle
            this.roundRect(ctx, x, y, barW, barH, 4);
            ctx.fill();

            // Label X
            ctx.fillStyle = isToday ? '#FFFFFF' : this.colors.textMuted;
            ctx.textAlign = 'center';
            ctx.font = isToday ? 'bold 12px "Plus Jakarta Sans", sans-serif' : '12px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(d.date, x + barW / 2, height - padding.bottom + 22);
        });
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}

// Global Export
window.biometricChartEngine = new BiometricChartEngine();
