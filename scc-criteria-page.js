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
     * Lädt Custom Scores aus LocalStorage
     * @returns {Object} Custom Scores
     */
    loadCustomScores() {
        // Nutze StorageManager wenn verfügbar, sonst Fallback
        if (window.StorageManager) {
            return StorageManager.loadCustomScores();
        }
        try {
            const stored = localStorage.getItem('scc_custom_provider_scores');
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Error loading custom scores:', e);
            return {};
        }
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
        const container = document.getElementById('controlScoresTable');
        if (!container) return;

        const sortedProviders = [...this.providers].sort((a, b) => {
            const aScore = this.getEffectiveScore(a.id, 'control');
            const bScore = this.getEffectiveScore(b.id, 'control');
            return bScore - aScore;
        });

        const html = `
            <div class="scores-table">
                <div class="scores-table-header">
                    <div class="scores-table-cell">Provider</div>
                    <div class="scores-table-cell">Kategorie</div>
                    <div class="scores-table-cell">Kontrolle-Score</div>
                    <div class="scores-table-cell">Aktionen</div>
                </div>
                ${sortedProviders.map(provider => {
                    const score = this.getEffectiveScore(provider.id, 'control');
                    const isCustom = this.hasCustomScores(provider.id);
                    return `
                        <div class="scores-table-row ${isCustom ? 'custom' : ''}">
                            <div class="scores-table-cell">
                                <div class="provider-name-cell">
                                    <div class="provider-color-dot" style="background: ${provider.color};"></div>
                                    <span>${provider.name}</span>
                                    ${isCustom ? '<span class="custom-badge">Angepasst</span>' : ''}
                                </div>
                            </div>
                            <div class="scores-table-cell">
                                <span class="category-badge category-${provider.category}">${this.getCategoryLabel(provider.category)}</span>
                            </div>
                            <div class="scores-table-cell">
                                <div class="score-display">
                                    <span class="score-value">${score}</span>
                                    <div class="score-bar-mini">
                                        <div class="score-bar-mini-fill" style="width: ${score}%; background: ${provider.color};"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="scores-table-cell">
                                <button class="btn-edit-small" onclick="sccCriteriaPage.openEditModal('${provider.id}')">
                                    <i class="fa-solid fa-pen"></i> Bearbeiten
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Rendert die Leistungs-Scores-Tabelle
     */
    renderPerformanceScoresTable() {
        const container = document.getElementById('performanceScoresTable');
        if (!container) return;

        const sortedProviders = [...this.providers].sort((a, b) => {
            const aScore = this.getEffectiveScore(a.id, 'performance');
            const bScore = this.getEffectiveScore(b.id, 'performance');
            return bScore - aScore;
        });

        const html = `
            <div class="scores-table">
                <div class="scores-table-header">
                    <div class="scores-table-cell">Provider</div>
                    <div class="scores-table-cell">Kategorie</div>
                    <div class="scores-table-cell">Leistungs-Score</div>
                    <div class="scores-table-cell">Aktionen</div>
                </div>
                ${sortedProviders.map(provider => {
                    const score = this.getEffectiveScore(provider.id, 'performance');
                    const isCustom = this.hasCustomScores(provider.id);
                    return `
                        <div class="scores-table-row ${isCustom ? 'custom' : ''}">
                            <div class="scores-table-cell">
                                <div class="provider-name-cell">
                                    <div class="provider-color-dot" style="background: ${provider.color};"></div>
                                    <span>${provider.name}</span>
                                    ${isCustom ? '<span class="custom-badge">Angepasst</span>' : ''}
                                </div>
                            </div>
                            <div class="scores-table-cell">
                                <span class="category-badge category-${provider.category}">${this.getCategoryLabel(provider.category)}</span>
                            </div>
                            <div class="scores-table-cell">
                                <div class="score-display">
                                    <span class="score-value">${score}</span>
                                    <div class="score-bar-mini">
                                        <div class="score-bar-mini-fill" style="width: ${score}%; background: ${provider.color};"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="scores-table-cell">
                                <button class="btn-edit-small" onclick="sccCriteriaPage.openEditModal('${provider.id}')">
                                    <i class="fa-solid fa-pen"></i> Bearbeiten
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Rendert die Provider-Details-Tabelle
     */
    renderProviderDetailsTable() {
        const container = document.getElementById('providerDetailsTable');
        if (!container) return;

        const sortedProviders = [...this.providers].sort((a, b) => a.name.localeCompare(b.name));

        const html = `
            <div class="scores-table">
                <div class="scores-table-header">
                    <div class="scores-table-cell">Provider</div>
                    <div class="scores-table-cell">Kategorie</div>
                    <div class="scores-table-cell">Kontrolle</div>
                    <div class="scores-table-cell">Leistung</div>
                    <div class="scores-table-cell">Aktionen</div>
                </div>
                ${sortedProviders.map(provider => {
                    const controlScore = this.getEffectiveScore(provider.id, 'control');
                    const performanceScore = this.getEffectiveScore(provider.id, 'performance');
                    const isCustom = this.hasCustomScores(provider.id);
                    return `
                        <div class="scores-table-row ${isCustom ? 'custom' : ''}">
                            <div class="scores-table-cell">
                                <div class="provider-name-cell">
                                    <div class="provider-color-dot" style="background: ${provider.color};"></div>
                                    <div>
                                        <div>${provider.name}</div>
                                        <div class="provider-description">${provider.description}</div>
                                        ${isCustom ? '<span class="custom-badge">Angepasst</span>' : ''}
                                    </div>
                                </div>
                            </div>
                            <div class="scores-table-cell">
                                <span class="category-badge category-${provider.category}">${this.getCategoryLabel(provider.category)}</span>
                            </div>
                            <div class="scores-table-cell">
                                <div class="score-display">
                                    <span class="score-value">${controlScore}</span>
                                    <div class="score-bar-mini">
                                        <div class="score-bar-mini-fill" style="width: ${controlScore}%; background: ${provider.color};"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="scores-table-cell">
                                <div class="score-display">
                                    <span class="score-value">${performanceScore}</span>
                                    <div class="score-bar-mini">
                                        <div class="score-bar-mini-fill" style="width: ${performanceScore}%; background: ${provider.color};"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="scores-table-cell">
                                <button class="btn-edit-small" onclick="sccCriteriaPage.openEditModal('${provider.id}')">
                                    <i class="fa-solid fa-pen"></i> Bearbeiten
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Gibt das Kategorie-Label zurück
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
                        <input type="range" id="editControlScore" min="0" max="100" value="${controlScore}"
                               oninput="document.getElementById('controlValue').textContent = this.value">
                        <span class="slider-value" id="controlValue">${controlScore}</span>
                    </div>
                    <p class="form-hint">Datensouveränität, Jurisdiktion, DSGVO-Konformität</p>
                </div>

                <div class="form-group">
                    <label for="editPerformanceScore">
                        <i class="fa-solid fa-bolt"></i> Leistung & Performance
                    </label>
                    <div class="slider-group">
                        <input type="range" id="editPerformanceScore" min="0" max="100" value="${performanceScore}"
                               oninput="document.getElementById('performanceValue').textContent = this.value">
                        <span class="slider-value" id="performanceValue">${performanceScore}</span>
                    </div>
                    <p class="form-hint">Service-Portfolio, Innovation, Skalierbarkeit</p>
                </div>
            </div>
        `;

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
     * Speichert die bearbeiteten Provider-Scores
     */
    saveProviderScores() {
        if (!this.editingProvider) return;

        const controlScore = parseInt(document.getElementById('editControlScore').value);
        const performanceScore = parseInt(document.getElementById('editPerformanceScore').value);

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
