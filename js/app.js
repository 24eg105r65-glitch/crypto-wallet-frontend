/**
 * CryptoVault — Interactive Islands & Frontend Logic
 * Author: Adabala Pushkaran • 24EG105R65
 */

document.addEventListener('DOMContentLoaded', () => {
    initTickerLiveUpdate();
    initNotificationPoller();
    initClipboardCopy();
    initModals();
    initAddressValidator();
    initLiveConverter();
    initCanvasCharts();
    initQRCodes();
});

/* ====================================================================
   1. Live Ticker Island
   ==================================================================== */
function initTickerLiveUpdate() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;

    setInterval(async () => {
        try {
            const res = await fetch('/api/market/ticker');
            if (res.ok) {
                const tickers = await res.json();
                tickers.forEach(t => {
                    const priceElem = document.getElementById(`ticker-price-${t.code}`);
                    const changeElem = document.getElementById(`ticker-change-${t.code}`);
                    if (priceElem) {
                        priceElem.innerText = '₹' + Number(t.priceInr).toLocaleString('en-IN', { maximumFractionDigits: 2 });
                    }
                    if (changeElem) {
                        const isUp = Number(t.change24h) >= 0;
                        changeElem.className = `ticker-change ${isUp ? 'up' : 'down'}`;
                        changeElem.innerText = `${isUp ? '+' : ''}${t.change24h}%`;
                    }
                });
            }
        } catch (e) {
            console.debug('Ticker poll error:', e);
        }
    }, 15000);
}

/* ====================================================================
   2. Unread Notification Poller
   ==================================================================== */
function initNotificationPoller() {
    const badge = document.getElementById('navNotificationBadge');
    if (!badge) return;

    setInterval(async () => {
        try {
            const res = await fetch('/api/notifications/unread-count');
            if (res.ok) {
                const data = await res.json();
                if (data.unreadCount > 0) {
                    badge.innerText = data.unreadCount;
                    badge.style.display = 'inline-flex';
                } else {
                    badge.style.display = 'none';
                }
            }
        } catch (e) {
            console.debug('Notification poll error:', e);
        }
    }, 20000);
}

/* ====================================================================
   3. Copy to Clipboard Utility with Toast
   ==================================================================== */
function initClipboardCopy() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (navigator.clipboard && textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast('Copied to clipboard!', 'success');
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✓ Copied';
                    setTimeout(() => { btn.innerHTML = originalText; }, 2000);
                }).catch(() => {
                    fallbackCopy(textToCopy);
                });
            } else {
                fallbackCopy(textToCopy);
            }
        });
    });
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast('Copied to clipboard!', 'success');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
    document.body.removeChild(textarea);
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: #060911;
        font-weight: 600;
        font-size: 0.9rem;
        padding: 0.75rem 1.25rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        gap: 8px;
        animation: toast-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

/* ====================================================================
   4. Modal Management
   ==================================================================== */
function initModals() {
    // Open Modal
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-modal-target');
            const modal = document.getElementById(targetId);
            if (modal) modal.classList.add('active');
        });
    });

    // Close Modal
    document.querySelectorAll('.modal-close-btn, [data-modal-close]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = btn.closest('.modal-backdrop');
            if (modal) modal.classList.remove('active');
        });
    });

    // Backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                backdrop.classList.remove('active');
            }
        });
    });
}

/* ====================================================================
   5. Real-Time Address Validator Island
   ==================================================================== */
function initAddressValidator() {
    const addressInput = document.getElementById('receiverAddressInput');
    const feedbackBox = document.getElementById('addressValidationFeedback');
    if (!addressInput || !feedbackBox) return;

    let debounceTimer;
    addressInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const val = addressInput.value.trim();
        if (!val) {
            feedbackBox.style.display = 'none';
            return;
        }

        debounceTimer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/wallet/validate-address?address=${encodeURIComponent(val)}`);
                if (res.ok) {
                    const data = await res.json();
                    feedbackBox.style.display = 'block';
                    if (data.valid) {
                        feedbackBox.style.color = '#10b981';
                        feedbackBox.innerHTML = `✓ ${data.message}`;
                    } else {
                        feedbackBox.style.color = '#ef4444';
                        feedbackBox.innerHTML = `✗ ${data.message}`;
                    }
                }
            } catch (err) {
                console.debug('Validation error:', err);
            }
        }, 300);
    });
}

/* ====================================================================
   6. Live Crypto Converter Island
   ==================================================================== */
let marketRates = {};

async function initLiveConverter() {
    const cryptoSelect = document.getElementById('converterCryptoSelect');
    const cryptoAmountInput = document.getElementById('converterCryptoAmount');
    const inrResultElem = document.getElementById('converterInrResult');
    const usdResultElem = document.getElementById('converterUsdResult');

    if (!cryptoSelect || !cryptoAmountInput) return;

    try {
        const res = await fetch('/api/rates');
        if (res.ok) {
            marketRates = await res.json();
            calculateConversion();
        }
    } catch (e) {
        console.debug('Failed to fetch rates:', e);
    }

    function calculateConversion() {
        const selected = cryptoSelect.value;
        const amount = parseFloat(cryptoAmountInput.value) || 0;
        const rateInfo = marketRates[selected];

        if (rateInfo) {
            const inrTotal = (amount * rateInfo.inr).toLocaleString('en-IN', { maximumFractionDigits: 2 });
            const usdTotal = (amount * rateInfo.usd).toLocaleString('en-US', { maximumFractionDigits: 2 });
            if (inrResultElem) inrResultElem.innerText = '₹ ' + inrTotal;
            if (usdResultElem) usdResultElem.innerText = '$ ' + usdTotal;
        }
    }

    cryptoSelect.addEventListener('change', calculateConversion);
    cryptoAmountInput.addEventListener('input', calculateConversion);
}

/* ====================================================================
   7. Interactive Canvas Trend Charts (Lightweight Chart Island)
   ==================================================================== */
function initCanvasCharts() {
    const canvas = document.getElementById('cryptoTrendChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let currentCurrency = canvas.getAttribute('data-default-currency') || 'BTC';
    let currentTimeframe = '7D';

    async function loadAndDrawChart(currency, timeframe) {
        try {
            const res = await fetch(`/api/charts/history?currency=${currency}&timeframe=${timeframe}`);
            if (!res.ok) return;
            const chartData = await res.json();
            drawSmoothLineChart(ctx, canvas, chartData.labels, chartData.data, chartData.symbol);
        } catch (e) {
            console.debug('Chart error:', e);
        }
    }

    loadAndDrawChart(currentCurrency, currentTimeframe);

    // Timeframe selector buttons
    document.querySelectorAll('[data-timeframe]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('[data-timeframe]').forEach(b => b.classList.remove('btn-primary'));
            btn.classList.add('btn-primary');
            currentTimeframe = btn.getAttribute('data-timeframe');
            loadAndDrawChart(currentCurrency, currentTimeframe);
        });
    });

    // Asset switcher
    document.querySelectorAll('[data-chart-asset]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('[data-chart-asset]').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCurrency = tab.getAttribute('data-chart-asset');
            loadAndDrawChart(currentCurrency, currentTimeframe);
        });
    });
}

function drawSmoothLineChart(ctx, canvas, labels, data, symbol) {
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = 280;
    const padding = 45;

    ctx.clearRect(0, 0, width, height);

    if (!data || data.length === 0) return;

    const min = Math.min(...data) * 0.985;
    const max = Math.max(...data) * 1.015;
    const range = max - min || 1;

    const stepX = (width - padding * 2) / (data.length - 1);
    const points = data.map((val, idx) => ({
        x: padding + idx * stepX,
        y: height - padding - ((val - min) / range) * (height - padding * 2)
    }));

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (i * (height - padding * 2) / 4);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();

        const labelVal = max - (i * range / 4);
        ctx.fillStyle = '#64748b';
        ctx.font = '11px JetBrains Mono';
        ctx.fillText('₹' + Math.round(labelVal).toLocaleString('en-IN'), 5, y + 4);
    }

    // Gradient Fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.lineTo(points[0].x, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Chart Stroke Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Data Points
    points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#060911';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

/* ====================================================================
   8. Pure Canvas QR Code Generator Island (High-Performance Zero-Dep)
   ==================================================================== */
function initQRCodes() {
    document.querySelectorAll('[data-qr-content]').forEach(canvas => {
        const content = canvas.getAttribute('data-qr-content');
        if (content) {
            renderSimulatedQr(canvas, content);
        }
    });
}

function renderSimulatedQr(canvas, text) {
    const ctx = canvas.getContext('2d');
    const size = canvas.width || 200;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Deterministic pseudo-random pattern based on string hash
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash) + text.charCodeAt(i);
        hash |= 0;
    }

    const gridSize = 25;
    const cellSize = size / gridSize;

    ctx.fillStyle = '#0a0f1d';

    // Corner Alignment Marks (standard QR code pattern)
    function drawFinderPattern(ox, oy) {
        ctx.fillRect(ox * cellSize, oy * cellSize, 7 * cellSize, 7 * cellSize);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect((ox + 1) * cellSize, (oy + 1) * cellSize, 5 * cellSize, 5 * cellSize);
        ctx.fillStyle = '#0a0f1d';
        ctx.fillRect((ox + 2) * cellSize, (oy + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    }

    drawFinderPattern(1, 1);
    drawFinderPattern(gridSize - 8, 1);
    drawFinderPattern(1, gridSize - 8);

    // QR Data Matrix
    let seed = Math.abs(hash);
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            // Skip finder patterns
            if ((r < 9 && c < 9) || (r < 9 && c > gridSize - 10) || (r > gridSize - 10 && c < 9)) {
                continue;
            }
            seed = (seed * 9301 + 49297) % 233280;
            if (seed / 233280 > 0.48) {
                ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            }
        }
    }
}
