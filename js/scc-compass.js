/**
 * Sovereign Cloud Compass - Haupt-Controller
 *
 * @fileoverview Orchestriert alle Komponenten der Hauptanwendung
 * @module scc-compass
 */

(function() {
    'use strict';

    // Abhängigkeiten prüfen
    const { BASE_PROVIDERS, LEGEND_DATA, PROVIDER_CATEGORIES, anonymizeProviders } = window.SCC_DATA || {};

    /**
     * Strategie-Labels basierend auf Slider-Wert
     * @readonly
     */
    const STRATEGY_LABELS = Object.freeze({
        CONTROL_FOCUSED: 'Kontrolle-fokussiert',
        CONTROL_ORIENTED: 'Kontrolle-orientiert',
        BALANCED: 'Ausgewogen',
        PERFORMANCE_ORIENTED: 'Leistungs-orientiert',
        PERFORMANCE_FOCUSED: 'Leistungs-fokussiert'
    });

    /**
     * Schwellenwerte für Strategie-Labels
     * @readonly
     */
    const STRATEGY_THRESHOLDS = Object.freeze({
        CONTROL_FOCUSED: 20,
        CONTROL_ORIENTED: 40,
        BALANCED: 60,
        PERFORMANCE_ORIENTED: 80
    });

    // State
    let currentProviders = [];
    let isPublicAccess = false;
    let activeCategories = new Set(Object.values(PROVIDER_CATEGORIES));
    let rafId = null;

    // DOM-Element-Cache
    const elements = {};

    /**
     * Initialisiert DOM-Element-Cache
     * @private
     */
    function cacheElements() {
        elements.slider = document.getElementById('strategySlider');
        elements.sliderThumb = document.getElementById('sliderThumb');
        elements.valueDisplay = document.getElementById('valueDisplay');
        elements.chartCanvas = document.getElementById('chartCanvas');
        elements.resultsGrid = document.getElementById('resultsGrid');
        elements.legendGrid = document.getElementById('legendGrid');
        elements.passwordOverlay = document.getElementById('passwordOverlay');
        elements.protectedContent = document.getElementById('protectedContent');
        elements.accessBadge = document.getElementById('accessBadge');
        elements.passwordInput = document.getElementById('passwordInput');
        elements.passwordError = document.getElementById('passwordError');
        // Event-Handler Elemente
        elements.loginThemeToggle = document.getElementById('loginThemeToggle');
        elements.publicButton = document.getElementById('publicButton');
        elements.passwordButton = document.getElementById('passwordButton');
        elements.drawerThemeToggle = document.getElementById('drawerThemeToggle');
        elements.desktopThemeToggle = document.getElementById('desktopThemeToggle');
    }

    /**
     * Wendet Custom Scores auf Provider an
     * @param {Array} providers - Basis-Provider
     * @returns {Array} Provider mit angewendeten Custom Scores
     */
    function applyCustomScores(providers) {
        const customScores = StorageManager.loadCustomScores();

        return providers.map(provider => {
            // Versuche sowohl ID als auch Name-basierte Keys
            const custom = customScores[provider.id] ||
                          customScores[provider.name.toLowerCase().replace(/\s+/g, '-')];

            if (custom) {
                return {
                    ...provider,
                    control: custom.control !== undefined ? custom.control : provider.control,
                    performance: custom.performance !== undefined ? custom.performance : provider.performance
                };
            }
            return { ...provider };
        });
    }

    /**
     * Berechnet den gewichteten Score
     * @param {Object} provider
     * @param {number} sliderValue - 0 (Kontrolle) bis 100 (Leistung)
     * @returns {number}
     */
    function calculateScore(provider, sliderValue) {
        const controlWeight = (100 - sliderValue) / 100;
        const performanceWeight = sliderValue / 100;
        return (provider.control * controlWeight) + (provider.performance * performanceWeight);
    }

    /**
     * Gibt den Strategie-Text zurück
     * @param {number} value - Slider-Wert
     * @returns {string}
     */
    function getStrategyText(value) {
        const controlWeight = 100 - value;

        let label;
        if (value < STRATEGY_THRESHOLDS.CONTROL_FOCUSED) {
            label = STRATEGY_LABELS.CONTROL_FOCUSED;
        } else if (value < STRATEGY_THRESHOLDS.CONTROL_ORIENTED) {
            label = STRATEGY_LABELS.CONTROL_ORIENTED;
        } else if (value < STRATEGY_THRESHOLDS.BALANCED) {
            label = STRATEGY_LABELS.BALANCED;
        } else if (value < STRATEGY_THRESHOLDS.PERFORMANCE_ORIENTED) {
            label = STRATEGY_LABELS.PERFORMANCE_ORIENTED;
        } else {
            label = STRATEGY_LABELS.PERFORMANCE_FOCUSED;
        }

        return `${label} (${controlWeight}:${value})`;
    }

    /**
     * Aktualisiert die Visualisierung
     * @param {number} sliderValue
     */
    function updateVisualization(sliderValue) {
        // Thumb-Position aktualisieren
        if (elements.sliderThumb) {
            elements.sliderThumb.style.left = `${sliderValue}%`;
        }

        // Strategie-Text aktualisieren
        if (elements.valueDisplay) {
            elements.valueDisplay.textContent = getStrategyText(sliderValue);
        }

        // Scores berechnen und sortieren
        const scoredProviders = currentProviders
            .filter(p => activeCategories.has(p.category))
            .map(p => ({ ...p, score: calculateScore(p, sliderValue) }))
            .sort((a, b) => b.score - a.score);

        // Chart und Results aktualisieren
        ChartComponent.render(elements.chartCanvas, scoredProviders);
        renderResults(scoredProviders);
    }

    /**
     * Rendert die Ergebnis-Cards
     * @param {Array} scoredProviders
     */
    function renderResults(scoredProviders) {
        if (!elements.resultsGrid) return;

        const topProviders = scoredProviders.slice(0, 8);
        const rankings = [];

        // Rankings berechnen (mit Gleichstand)
        topProviders.forEach((provider, index) => {
            if (index === 0) {
                rankings.push(1);
            } else {
                const isTied = Math.abs(provider.score - topProviders[index - 1].score) < 0.01;
                rankings.push(isTied ? rankings[index - 1] : index + 1);
            }
        });

        // HTML generieren
        const fragment = document.createDocumentFragment();

        topProviders.forEach((provider, index) => {
            const card = document.createElement('div');
            card.className = 'result-card';
            if (rankings[index] === 1) card.classList.add('winner');

            card.innerHTML = `
                <div class="result-rank">#${rankings[index]}</div>
                <div class="result-name">${provider.name}</div>
                <div class="result-description">${provider.description}</div>
                <div class="result-metrics">
                    <span>Kontrolle: ${provider.control}</span>
                    <span>Leistung: ${provider.performance}</span>
                </div>
                <div class="result-score">Score: ${provider.score.toFixed(1)}</div>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${provider.score}%"></div>
                </div>
            `;

            fragment.appendChild(card);
        });

        elements.resultsGrid.innerHTML = '';
        elements.resultsGrid.appendChild(fragment);
    }

    /**
     * Initialisiert die Legende
     * @param {boolean} isPublic
     */
    function initializeLegend(isPublic) {
        if (!elements.legendGrid) return;

        const legends = isPublic ? LEGEND_DATA.anonymous : LEGEND_DATA.full;

        elements.legendGrid.innerHTML = legends.map(item => `
            <div class="legend-item">
                <div class="legend-dot" style="background: ${item.color};"></div>
                <span class="legend-text">${item.text}</span>
            </div>
        `).join('');
    }

    /**
     * Initialisiert Kategorie-Filter
     */
    function initializeFilters() {
        const filterOptions = document.querySelectorAll('.filter-option');

        filterOptions.forEach(option => {
            option.addEventListener('click', () => {
                const category = option.getAttribute('data-category');
                const checkbox = option.querySelector('.filter-checkbox');

                if (activeCategories.has(category)) {
                    activeCategories.delete(category);
                    checkbox.classList.remove('active');
                } else {
                    activeCategories.add(category);
                    checkbox.classList.add('active');
                }

                updateVisualization(parseInt(elements.slider.value));
            });
        });
    }

    /**
     * Entsperrt den geschützten Inhalt
     * @param {boolean} isPublicMode
     */
    function unlockContent(isPublicMode) {
        if (elements.passwordOverlay) {
            elements.passwordOverlay.classList.add('hidden');
        }
        if (elements.protectedContent) {
            elements.protectedContent.classList.add('unlocked');
        }

        if (elements.accessBadge) {
            if (isPublicMode) {
                elements.accessBadge.innerHTML = 'Public Access - Anonymisierte Ansicht';
                elements.accessBadge.style.background = 'var(--gray-100)';
                elements.accessBadge.style.borderColor = 'var(--gray-300)';
            } else {
                elements.accessBadge.innerHTML = 'Full Access - Vollständige Ansicht';
                elements.accessBadge.style.background = 'var(--gray-100)';
                elements.accessBadge.style.borderColor = 'var(--btc-primary)';
            }
        }

        initializeCompass(isPublicMode);
    }

    /**
     * Initialisiert den Compass
     * @param {boolean} isPublic
     */
    function initializeCompass(isPublic) {
        isPublicAccess = isPublic;

        const fullProviders = applyCustomScores(SCC_DATA.getProvidersCopy());
        currentProviders = isPublic ? anonymizeProviders(fullProviders) : fullProviders;

        initializeLegend(isPublic);
        initializeFilters();
        updateVisualization(50);
    }

    /**
     * Provider neu laden (nach Score-Änderung)
     */
    function reloadProviders() {
        const fullProviders = applyCustomScores(SCC_DATA.getProvidersCopy());
        currentProviders = isPublicAccess ? anonymizeProviders(fullProviders) : fullProviders;
        updateVisualization(parseInt(elements.slider?.value || 50));
    }

    /**
     * Passwort prüfen
     */
    async function checkPassword() {
        const password = elements.passwordInput?.value || '';
        const isValid = await AuthManager.authenticateWithPassword(password);

        if (isValid) {
            if (elements.passwordError) {
                elements.passwordError.classList.remove('show');
            }
            unlockContent(false);
        } else {
            if (elements.passwordError) {
                elements.passwordError.classList.add('show');
            }
            if (elements.passwordInput) {
                elements.passwordInput.value = '';
                elements.passwordInput.focus();
            }
            setTimeout(() => {
                if (elements.passwordError) {
                    elements.passwordError.classList.remove('show');
                }
            }, 3000);
        }
    }

    /**
     * Public Mode aktivieren
     */
    function skipPassword() {
        AuthManager.enablePublicMode();
        unlockContent(true);
    }

    /**
     * Session prüfen (beim Laden)
     */
    function checkSession() {
        const session = AuthManager.checkSession();

        if (session.authenticated) {
            unlockContent(false);
        } else if (session.publicMode) {
            unlockContent(true);
        }
    }

    /**
     * Event-Listener Setup
     */
    function setupEventListeners() {
        // Slider mit RAF-Throttling
        if (elements.slider) {
            elements.slider.addEventListener('input', (e) => {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    updateVisualization(parseInt(e.target.value));
                });
            });
        }

        // Passwort-Eingabe (Enter-Taste)
        if (elements.passwordInput) {
            elements.passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') checkPassword();
            });
        }

        // Storage-Events (für Sync zwischen Tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === StorageManager.KEYS.CUSTOM_SCORES) {
                reloadProviders();
            }
        });

        // === Login-Bereich ===
        // Theme-Toggle auf Login-Seite
        if (elements.loginThemeToggle) {
            elements.loginThemeToggle.addEventListener('click', () => ThemeManager.toggle());
            elements.loginThemeToggle.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    ThemeManager.toggle();
                }
            });
        }

        // Public-Button (Ohne Passwort starten)
        if (elements.publicButton) {
            elements.publicButton.addEventListener('click', skipPassword);
        }

        // Passwort-Button
        if (elements.passwordButton) {
            elements.passwordButton.addEventListener('click', checkPassword);
        }

        // === Geschützter Bereich ===
        // Theme-Toggle im Drawer
        if (elements.drawerThemeToggle) {
            elements.drawerThemeToggle.addEventListener('click', () => ThemeManager.toggle());
            elements.drawerThemeToggle.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    ThemeManager.toggle();
                }
            });
        }

        // Theme-Toggle Desktop
        if (elements.desktopThemeToggle) {
            elements.desktopThemeToggle.addEventListener('click', () => ThemeManager.toggle());
            elements.desktopThemeToggle.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    ThemeManager.toggle();
                }
            });
        }

        // Access-Badge (Logout)
        if (elements.accessBadge) {
            elements.accessBadge.addEventListener('click', logout);
            elements.accessBadge.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    logout();
                }
            });
        }
    }

    /**
     * Hauptinitialisierung
     */
    function init() {
        // Theme initialisieren
        ThemeManager.init();

        // Mobile Nav initialisieren
        MobileNav.init();

        // DOM-Elemente cachen
        cacheElements();

        // Event-Listener einrichten
        setupEventListeners();

        // Session prüfen
        checkSession();
    }

    /**
     * Logout - zurück zur Login-Seite
     */
    function logout() {
        AuthManager.logout();

        if (elements.passwordOverlay) {
            elements.passwordOverlay.classList.remove('hidden');
        }
        if (elements.protectedContent) {
            elements.protectedContent.classList.remove('unlocked');
        }
        if (elements.passwordInput) {
            elements.passwordInput.value = '';
        }
    }

    // Globale Funktionen für onclick-Handler (Rückwärtskompatibilität)
    window.checkPassword = checkPassword;
    window.skipPassword = skipPassword;
    window.logout = logout;

    // Auto-Init bei DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    window.SCCCompass = Object.freeze({
        init,
        updateVisualization,
        reloadProviders,
        checkPassword,
        skipPassword,
        logout
    });

})();
