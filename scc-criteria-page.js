/**
 * SCC Bewertungskriterien Page Logic
 * Zeigt globale Provider-Bewertungen für Sovereign Cloud Compass
 *
 * @fileoverview Criteria Page Controller
 * @module scc-criteria-page
 * @requires js/data/providers.js
 */

class SCCCriteriaPage {
    constructor() {
        // Provider-Daten aus zentraler Quelle laden
        this.providers = window.SCC_DATA ? window.SCC_DATA.BASE_PROVIDERS : [];
        this.customScores = this.loadCustomScores();
        this.editingProvider = null;
        this.init();
    }

    init() {
        // Smooth Scrolling für Navigation
        this.initSmoothScrolling();

        // Event-Listener einrichten
        this.initEventListeners();

        // Tabellen rendern
        this.renderControlScoresTable();
        this.renderPerformanceScoresTable();
        this.renderProviderDetailsTable();

        // Active Link auf Scroll
        this.initScrollSpy();

        // Floating Reset Button anzeigen wenn Custom Scores vorhanden
        this.updateResetButtonVisibility();
    }

    /**
     * Initialisiert Event-Listener für Modals und Buttons
     */
    initEventListeners() {
        // Edit Modal
        const editModalClose = document.getElementById('editModalClose');
        const editModalCancel = document.getElementById('editModalCancel');
        const editModalSave = document.getElementById('editModalSave');

        if (editModalClose) {
            editModalClose.addEventListener('click', () => this.closeEditModal());
        }
        if (editModalCancel) {
            editModalCancel.addEventListener('click', () => this.closeEditModal());
        }
        if (editModalSave) {
            editModalSave.addEventListener('click', () => this.saveProviderScores());
        }

        // Reset Confirmation Modal
        const floatingResetButton = document.getElementById('floatingResetButton');
        const resetCancel = document.getElementById('resetCancel');
        const resetConfirm = document.getElementById('resetConfirm');

        if (floatingResetButton) {
            floatingResetButton.addEventListener('click', () => this.showResetConfirmation());
        }
        if (resetCancel) {
            resetCancel.addEventListener('click', () => this.closeResetConfirmation());
        }
        if (resetConfirm) {
            resetConfirm.addEventListener('click', () => this.confirmReset());
        }

        // Theme-Toggles
        const drawerThemeToggle = document.getElementById('drawerThemeToggle');
        const desktopThemeToggle = document.getElementById('desktopThemeToggle');

        const handleThemeToggle = () => {
            if (window.ThemeManager) {
                ThemeManager.toggle();
            } else if (typeof toggleTheme === 'function') {
                toggleTheme();
            }
        };

        if (drawerThemeToggle) {
            drawerThemeToggle.addEventListener('click', handleThemeToggle);
            drawerThemeToggle.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleThemeToggle();
                }
            });
        }
        if (desktopThemeToggle) {
            desktopThemeToggle.addEventListener('click', handleThemeToggle);
            desktopThemeToggle.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleThemeToggle();
                }
            });
        }
    }

    /**
     * Lädt Custom Scores aus LocalStorage
     * @returns {Object} Custom Scores
     */
    loadCustomScores() {
        let scores = {};

        // Nutze StorageManager wenn verfügbar, sonst Fallback
        if (window.StorageManager) {
            scores = StorageManager.loadCustomScores();
        } else {
            try {
                const stored = localStorage.getItem('scc_custom_provider_scores');
                scores = stored ? JSON.parse(stored) : {};
            } catch (e) {
                console.error('Error loading custom scores:', e);
                return {};
            }
        }

        // Validiere alle geladenen Scores
        return this.validateCustomScores(scores);
    }

    /**
     * Validiert Custom Scores Objekt
     * @param {Object} scores
     * @returns {Object} Validierte Scores
     */
    validateCustomScores(scores) {
        if (!scores || typeof scores !== 'object') return {};

        const validated = {};
        for (const [providerId, providerScores] of Object.entries(scores)) {
            if (providerScores && typeof providerScores === 'object') {
                validated[providerId] = {};
                if (providerScores.control !== undefined) {
                    validated[providerId].control = this.validateScore(providerScores.control);
                }
                if (providerScores.performance !== undefined) {
                    validated[providerId].performance = this.validateScore(providerScores.performance);
                }
            }
        }
        return validated;
    }

    /**
     * Speichert Custom Scores in LocalStorage
     */
    saveCustomScores() {
        // Nutze StorageManager wenn verfügbar, sonst Fallback
        if (window.StorageManager) {
            StorageManager.saveCustomScores(this.customScores);
        } else {
            try {
                localStorage.setItem('scc_custom_provider_scores', JSON.stringify(this.customScores));
            } catch (e) {
                console.error('Error saving custom scores:', e);
            }
        }
        this.updateResetButtonVisibility();
    }

    /**
     * Gibt den effektiven Score eines Providers zurück (custom oder original)
     */
    getEffectiveScore(providerId, scoreType) {
        if (this.customScores[providerId] && this.customScores[providerId][scoreType] !== undefined) {
            return this.customScores[providerId][scoreType];
        }
        const provider = this.providers.find(p => p.id === providerId);
        return provider ? provider[scoreType] : 0;
    }

    /**
     * Prüft ob ein Provider custom Scores hat
     */
    hasCustomScores(providerId) {
        return this.customScores[providerId] !== undefined;
    }

    /**
     * Zeigt/versteckt den Reset-Button
     */
    updateResetButtonVisibility() {
        const btn = document.getElementById('floatingResetBtn');
        if (btn) {
            btn.style.display = Object.keys(this.customScores).length > 0 ? 'block' : 'none';
        }
    }

    /**
     * Smooth Scrolling für Navigation
     */
    initSmoothScrolling() {
        document.querySelectorAll('.criteria-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    /**
     * Scroll Spy für aktive Navigation
     */
    initScrollSpy() {
        const sections = document.querySelectorAll('.criteria-section');
        const navLinks = document.querySelectorAll('.criteria-nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }

    /**
     * Rendert die Kontrolle-Scores-Tabelle
     */
    renderControlScoresTable() {
        const containerId = 'controlScoresTable';
        const container = document.getElementById(containerId);
        if (!container) return;

        const sortedProviders = [...this.providers].sort((a, b) =>
            this.getEffectiveScore(b.id, 'control') - this.getEffectiveScore(a.id, 'control')
        );

        const rows = sortedProviders.map(provider => {
            const score = this.getEffectiveScore(provider.id, 'control');
            const isCustom = this.hasCustomScores(provider.id);
            return `
                <div class="scores-table-row ${isCustom ? 'custom' : ''}">
                    <div class="scores-table-cell">${this.renderProviderNameCell(provider, isCustom)}</div>
                    <div class="scores-table-cell">${this.renderCategoryBadge(provider.category)}</div>
                    <div class="scores-table-cell">${this.renderScoreCell(score, provider.color)}</div>
                    <div class="scores-table-cell">${this.renderEditButton(provider.id)}</div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="scores-table">
                <div class="scores-table-header">
                    <div class="scores-table-cell">Provider</div>
                    <div class="scores-table-cell">Kategorie</div>
                    <div class="scores-table-cell">Kontrolle-Score</div>
                    <div class="scores-table-cell">Aktionen</div>
                </div>
                ${rows}
            </div>
        `;

        this.bindEditButtons(containerId);
    }

    /**
     * Rendert die Leistungs-Scores-Tabelle
     */
    renderPerformanceScoresTable() {
        const containerId = 'performanceScoresTable';
        const container = document.getElementById(containerId);
        if (!container) return;

        const sortedProviders = [...this.providers].sort((a, b) =>
            this.getEffectiveScore(b.id, 'performance') - this.getEffectiveScore(a.id, 'performance')
        );

        const rows = sortedProviders.map(provider => {
            const score = this.getEffectiveScore(provider.id, 'performance');
            const isCustom = this.hasCustomScores(provider.id);
            return `
                <div class="scores-table-row ${isCustom ? 'custom' : ''}">
                    <div class="scores-table-cell">${this.renderProviderNameCell(provider, isCustom)}</div>
                    <div class="scores-table-cell">${this.renderCategoryBadge(provider.category)}</div>
                    <div class="scores-table-cell">${this.renderScoreCell(score, provider.color)}</div>
                    <div class="scores-table-cell">${this.renderEditButton(provider.id)}</div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="scores-table">
                <div class="scores-table-header">
                    <div class="scores-table-cell">Provider</div>
                    <div class="scores-table-cell">Kategorie</div>
                    <div class="scores-table-cell">Leistungs-Score</div>
                    <div class="scores-table-cell">Aktionen</div>
                </div>
                ${rows}
            </div>
        `;

        this.bindEditButtons(containerId);
    }

    /**
     * Rendert die Provider-Details-Tabelle
     */
    renderProviderDetailsTable() {
        const containerId = 'providerDetailsTable';
        const container = document.getElementById(containerId);
        if (!container) return;

        const sortedProviders = [...this.providers].sort((a, b) => a.name.localeCompare(b.name));

        const rows = sortedProviders.map(provider => {
            const controlScore = this.getEffectiveScore(provider.id, 'control');
            const performanceScore = this.getEffectiveScore(provider.id, 'performance');
            const isCustom = this.hasCustomScores(provider.id);
            return `
                <div class="scores-table-row ${isCustom ? 'custom' : ''}">
                    <div class="scores-table-cell">${this.renderProviderNameCell(provider, isCustom, true)}</div>
                    <div class="scores-table-cell">${this.renderCategoryBadge(provider.category)}</div>
                    <div class="scores-table-cell">${this.renderScoreCell(controlScore, provider.color)}</div>
                    <div class="scores-table-cell">${this.renderScoreCell(performanceScore, provider.color)}</div>
                    <div class="scores-table-cell">${this.renderEditButton(provider.id)}</div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="scores-table">
                <div class="scores-table-header">
                    <div class="scores-table-cell">Provider</div>
                    <div class="scores-table-cell">Kategorie</div>
                    <div class="scores-table-cell">Kontrolle</div>
                    <div class="scores-table-cell">Leistung</div>
                    <div class="scores-table-cell">Aktionen</div>
                </div>
                ${rows}
            </div>
        `;

        this.bindEditButtons(containerId);
    }

    /**
     * Gibt das Kategorie-Label zurück
     * @param {string} category
     * @returns {string}
     */
    getCategoryLabel(category) {
        const labels = {
            'hyperscaler': 'Hyperscaler',
            'sovereign': 'Souverän',
            'eu': 'EU/Deutschland',
            'private': 'Private Cloud',
            'hybrid': 'Hybrid'
        };
        return labels[category] || category;
    }

    // ========================================
    // Table Rendering Helpers
    // ========================================

    /**
     * Rendert eine Provider-Name-Zelle
     * @param {Object} provider
     * @param {boolean} isCustom
     * @param {boolean} showDescription
     * @returns {string} HTML
     */
    renderProviderNameCell(provider, isCustom, showDescription = false) {
        if (showDescription) {
            return `
                <div class="provider-name-cell">
                    <div class="provider-color-dot" style="background: ${provider.color};"></div>
                    <div>
                        <div>${provider.name}</div>
                        <div class="provider-description">${provider.description}</div>
                        ${isCustom ? '<span class="custom-badge">Angepasst</span>' : ''}
                    </div>
                </div>
            `;
        }
        return `
            <div class="provider-name-cell">
                <div class="provider-color-dot" style="background: ${provider.color};"></div>
                <span>${provider.name}</span>
                ${isCustom ? '<span class="custom-badge">Angepasst</span>' : ''}
            </div>
        `;
    }

    /**
     * Rendert eine Score-Zelle mit Mini-Bar
     * @param {number} score
     * @param {string} color
     * @returns {string} HTML
     */
    renderScoreCell(score, color) {
        return `
            <div class="score-display">
                <span class="score-value">${score}</span>
                <div class="score-bar-mini">
                    <div class="score-bar-mini-fill" style="width: ${score}%; background: ${color};"></div>
                </div>
            </div>
        `;
    }

    /**
     * Rendert ein Kategorie-Badge
     * @param {string} category
     * @returns {string} HTML
     */
    renderCategoryBadge(category) {
        return `<span class="category-badge category-${category}">${this.getCategoryLabel(category)}</span>`;
    }

    /**
     * Rendert einen Edit-Button
     * @param {string} providerId
     * @returns {string} HTML
     */
    renderEditButton(providerId) {
        return `
            <button class="btn-edit-small" data-provider-id="${providerId}">
                <i class="fa-solid fa-pen"></i> Bearbeiten
            </button>
        `;
    }

    /**
     * Bindet Click-Events an Edit-Buttons in einer Tabelle
     * @param {string} containerId
     */
    bindEditButtons(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.querySelectorAll('.btn-edit-small[data-provider-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.openEditModal(btn.dataset.providerId);
            });
        });
    }

    /**
     * Öffnet das Edit-Modal für einen Provider
     */
    openEditModal(providerId) {
        this.editingProvider = providerId;
        const provider = this.providers.find(p => p.id === providerId);
        if (!provider) return;

        const controlScore = this.getEffectiveScore(providerId, 'control');
        const performanceScore = this.getEffectiveScore(providerId, 'performance');

        const modalTitle = document.getElementById('editModalTitle');
        const modalContent = document.getElementById('editModalContent');

        modalTitle.textContent = `${provider.name} bearbeiten`;

        modalContent.innerHTML = `
            <div class="edit-form">
                <div class="provider-info">
                    <div class="provider-color-dot" style="background: ${provider.color};"></div>
                    <div>
                        <h4>${provider.name}</h4>
                        <p>${provider.description}</p>
                    </div>
                </div>

                <div class="form-group">
                    <label for="editControlScore">
                        <i class="fa-solid fa-lock"></i> Kontrolle & Souveränität
                    </label>
                    <div class="slider-group">
                        <input type="range" id="editControlScore" min="0" max="100" value="${controlScore}">
                        <span class="slider-value" id="controlValue">${controlScore}</span>
                    </div>
                    <p class="form-hint">Datensouveränität, Jurisdiktion, DSGVO-Konformität</p>
                </div>

                <div class="form-group">
                    <label for="editPerformanceScore">
                        <i class="fa-solid fa-bolt"></i> Leistung & Performance
                    </label>
                    <div class="slider-group">
                        <input type="range" id="editPerformanceScore" min="0" max="100" value="${performanceScore}">
                        <span class="slider-value" id="performanceValue">${performanceScore}</span>
                    </div>
                    <p class="form-hint">Service-Portfolio, Innovation, Skalierbarkeit</p>
                </div>
            </div>
        `;

        // Slider Event-Listener binden
        const controlSlider = document.getElementById('editControlScore');
        const performanceSlider = document.getElementById('editPerformanceScore');
        const controlValue = document.getElementById('controlValue');
        const performanceValue = document.getElementById('performanceValue');

        if (controlSlider && controlValue) {
            controlSlider.addEventListener('input', () => {
                controlValue.textContent = controlSlider.value;
            });
        }
        if (performanceSlider && performanceValue) {
            performanceSlider.addEventListener('input', () => {
                performanceValue.textContent = performanceSlider.value;
            });
        }

        document.getElementById('editModalOverlay').classList.add('visible');
    }

    /**
     * Schließt das Edit-Modal
     */
    closeEditModal() {
        document.getElementById('editModalOverlay').classList.remove('visible');
        this.editingProvider = null;
    }

    /**
     * Score-Wert validieren und auf gültigen Bereich begrenzen
     * @param {number|string} value
     * @returns {number} Validierter Score (0-100)
     */
    validateScore(value) {
        const score = parseInt(value, 10);
        if (isNaN(score)) return 0;
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Speichert die bearbeiteten Provider-Scores
     */
    saveProviderScores() {
        if (!this.editingProvider) return;

        const controlInput = document.getElementById('editControlScore');
        const performanceInput = document.getElementById('editPerformanceScore');

        if (!controlInput || !performanceInput) {
            console.error('Score inputs not found');
            return;
        }

        const controlScore = this.validateScore(controlInput.value);
        const performanceScore = this.validateScore(performanceInput.value);

        if (!this.customScores[this.editingProvider]) {
            this.customScores[this.editingProvider] = {};
        }

        this.customScores[this.editingProvider].control = controlScore;
        this.customScores[this.editingProvider].performance = performanceScore;

        this.saveCustomScores();
        this.closeEditModal();

        // Tabellen neu rendern
        this.renderControlScoresTable();
        this.renderPerformanceScoresTable();
        this.renderProviderDetailsTable();

        // Success-Nachricht
        this.showSuccessMessage('Provider-Scores erfolgreich gespeichert!');
    }

    /**
     * Zeigt eine Erfolgs-Nachricht
     */
    showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Zeigt die Reset-Bestätigung
     */
    showResetConfirmation() {
        document.getElementById('resetConfirmationOverlay').classList.add('visible');
    }

    /**
     * Schließt die Reset-Bestätigung
     */
    closeResetConfirmation() {
        document.getElementById('resetConfirmationOverlay').classList.remove('visible');
    }

    /**
     * Bestätigt den Reset und setzt alle Custom Scores zurück
     */
    confirmReset() {
        this.customScores = {};
        localStorage.removeItem('scc_custom_provider_scores');

        // Tabellen neu rendern
        this.renderControlScoresTable();
        this.renderPerformanceScoresTable();
        this.renderProviderDetailsTable();

        this.updateResetButtonVisibility();
        this.closeResetConfirmation();
        this.showSuccessMessage('Alle Anpassungen wurden zurückgesetzt!');
    }
}

// Instanz erstellen wenn Seite geladen ist
const sccCriteriaPage = new SCCCriteriaPage();
