/**
 * Chart-Komponente für Provider-Matrix
 *
 * @fileoverview 2D-Matrix-Visualisierung der Cloud-Provider
 * @module components/chart
 */

(function() {
    'use strict';

    // SEAL-Daten aus SCC_DATA (wird später geladen)
    const getSealData = () => window.SCC_DATA || {};

    /**
     * Chart-Konfiguration - eliminiert Magic Numbers
     * @readonly
     */
    const CONFIG = Object.freeze({
        /** Padding vom Rand in Prozent */
        PADDING: 10,

        /** Skalierungsfaktor für Koordinaten */
        SCALE: 0.8,

        /** Offset für Y-Achse (100 - PADDING) */
        Y_OFFSET: 90,

        /** Punkt-Größen nach Ranking (in Pixel) */
        POINT_SIZES: Object.freeze({
            WINNER: 36,
            TOP_3: 32,
            TOP_6: 28,
            TOP_10: 24,
            DEFAULT: 20
        }),

        /** Offsets für gruppierte Provider (Hyperscaler mit gleichen Werten) */
        GROUP_OFFSETS: Object.freeze([
            { x: 1.5, y: 0.4 },   // Index 0 (AWS)
            { x: 0, y: -0.8 },    // Index 1 (Azure)
            { x: -1.5, y: 0.4 }   // Index 2 (GCP)
        ]),

        /** Z-Index Basis für Provider-Punkte */
        Z_INDEX_BASE: 50
    });

    /**
     * Berechnet die Punkt-Größe basierend auf dem Ranking
     * @param {number} index - Position im Ranking (0-basiert)
     * @returns {number} Größe in Pixeln
     */
    function getPointSize(index) {
        if (index === 0) return CONFIG.POINT_SIZES.WINNER;
        if (index <= 2) return CONFIG.POINT_SIZES.TOP_3;
        if (index <= 5) return CONFIG.POINT_SIZES.TOP_6;
        if (index <= 9) return CONFIG.POINT_SIZES.TOP_10;
        return CONFIG.POINT_SIZES.DEFAULT;
    }

    /**
     * Berechnet Chart-Koordinaten für einen Provider
     * @param {Object} provider - Provider-Daten
     * @returns {{x: number, y: number}} Prozentuale Koordinaten
     */
    function calculatePosition(provider) {
        let x = CONFIG.PADDING + (provider.performance * CONFIG.SCALE);
        let y = CONFIG.Y_OFFSET - (provider.control * CONFIG.SCALE);

        // Gruppierung für Hyperscaler mit identischen Werten
        if (provider.groupIndex !== undefined && CONFIG.GROUP_OFFSETS[provider.groupIndex]) {
            const offset = CONFIG.GROUP_OFFSETS[provider.groupIndex];
            x += offset.x;
            y += offset.y;
        }

        return { x, y };
    }

    /**
     * Erstellt ein Provider-Punkt-Element
     * @param {Object} provider - Provider mit Score
     * @param {number} index - Ranking-Position
     * @returns {HTMLElement}
     */
    function createPointElement(provider, index) {
        const point = document.createElement('div');
        point.className = 'provider-point';

        if (index === 0) {
            point.classList.add('winner');
        }

        const { x, y } = calculatePosition(provider);
        const size = getPointSize(index);

        point.style.left = `${x}%`;
        point.style.top = `${y}%`;
        point.style.backgroundColor = provider.color;
        point.style.width = `${size}px`;
        point.style.height = `${size}px`;
        point.style.zIndex = CONFIG.Z_INDEX_BASE - index;

        // Tooltip mit SEAL-Info
        const tooltip = document.createElement('div');
        tooltip.className = 'provider-tooltip';

        const { getSealLevel } = getSealData();
        if (getSealLevel) {
            const seal = getSealLevel(provider.control);
            tooltip.innerHTML = `
                <strong>${provider.name}</strong>
                <span class="tooltip-score">Score: ${provider.score.toFixed(1)}</span>
                <span class="tooltip-seal seal-color-${seal.level}">
                    <i class="fa-solid fa-shield-halved"></i> ${seal.shortLabel}
                </span>
            `;
        } else {
            tooltip.textContent = `${provider.name} (Score: ${provider.score.toFixed(1)})`;
        }

        point.appendChild(tooltip);

        return point;
    }

    /**
     * Entfernt alle Provider-Punkte aus dem Chart
     * @param {HTMLElement} container - Chart-Container
     */
    function clearPoints(container) {
        if (!container) return;
        container.querySelectorAll('.provider-point').forEach(point => point.remove());
    }

    /**
     * Rendert die SEAL-Zonen als Hintergrundbänder
     * @param {HTMLElement} container - Chart-Container
     */
    function renderSealZones(container) {
        const { SEAL_ZONES, SEAL_LEVELS } = getSealData();
        if (!SEAL_ZONES) return;

        // Existierende Zonen entfernen
        container.querySelectorAll('.seal-zone').forEach(z => z.remove());

        const fragment = document.createDocumentFragment();

        SEAL_ZONES.forEach(zone => {
            const zoneEl = document.createElement('div');
            zoneEl.className = `seal-zone seal-zone-${zone.level}`;
            zoneEl.style.top = `${zone.top}%`;
            zoneEl.style.height = `${zone.height}%`;

            if (zone.label) {
                const labelEl = document.createElement('span');
                labelEl.className = 'seal-zone-label';
                labelEl.textContent = zone.label;
                zoneEl.appendChild(labelEl);
            }

            fragment.appendChild(zoneEl);
        });

        // Am Anfang einfügen (hinter anderen Elementen)
        container.insertBefore(fragment, container.firstChild);
    }

    /**
     * Rendert das Chart mit Providern
     * @param {HTMLElement|string} containerOrId - Chart-Container oder ID
     * @param {Array} scoredProviders - Sortierte Provider mit Scores
     */
    function render(containerOrId, scoredProviders) {
        const container = typeof containerOrId === 'string'
            ? document.getElementById(containerOrId)
            : containerOrId;

        if (!container) {
            console.error('ChartComponent.render: Container nicht gefunden');
            return;
        }

        // Bestehende Punkte entfernen
        clearPoints(container);

        // SEAL-Zonen rendern (einmalig, falls noch nicht vorhanden)
        if (!container.querySelector('.seal-zone')) {
            renderSealZones(container);
        }

        // Neue Punkte erstellen (DocumentFragment für Performance)
        const fragment = document.createDocumentFragment();

        scoredProviders.forEach((provider, index) => {
            const point = createPointElement(provider, index);
            fragment.appendChild(point);
        });

        container.appendChild(fragment);
    }

    // Global verfügbar machen
    window.ChartComponent = Object.freeze({
        CONFIG,
        calculatePosition,
        getPointSize,
        createPointElement,
        clearPoints,
        render
    });

})();
