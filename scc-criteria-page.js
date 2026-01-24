/**
 * SCC Bewertungskriterien Page Logic
 * Zeigt globale Provider-Bewertungen für Sovereign Cloud Compass
 */

// Cloud Provider Data (von SCC)
// IDs sind lowercase mit bindestrichen statt leerzeichen
const sccProviders = [
    { id: 'aws', name: 'AWS', control: 42, performance: 95, color: '#ef4444', category: 'hyperscaler',
      description: 'Umfangreichstes Portfolio an Infrastruktur- und Plattform-Services mit exzellenter Developer Experience.' },
    { id: 'microsoft-azure', name: 'Microsoft Azure', control: 42, performance: 95, color: '#ef4444', category: 'hyperscaler',
      description: 'Leistungsfähiges Cloud-Ökosystem mit umfangreichem IaaS/PaaS-Portfolio und größter Partner-Landschaft.' },
    { id: 'google-cloud', name: 'Google Cloud', control: 42, performance: 95, color: '#ef4444', category: 'hyperscaler',
      description: 'Überzeugend bei Container-Management, KI-Services und Workplace-Lösungen.' },
    { id: 'oracle-cloud', name: 'Oracle Cloud', control: 40, performance: 70, color: '#ef4444', category: 'hyperscaler',
      description: 'Besondere Stärken im Datenbank-Bereich mit umfangreichen Sicherheits- und Compliance-Möglichkeiten.' },
    { id: 'aws-european-sovereign-cloud', name: 'AWS European Sovereign Cloud', control: 80, performance: 90, color: '#3b82f6', category: 'sovereign',
      description: 'Auf hohe Überlebensfähigkeit in geopolitischen Krisen ausgerichtet mit voller europäischer Souveränität.' },
    { id: 'microsoft-delos-cloud', name: 'Microsoft DELOS Cloud', control: 85, performance: 65, color: '#3b82f6', category: 'sovereign',
      description: 'Speziell für deutsche Verwaltung mit vollständiger Datenhoheit ohne US-Zugriffsmöglichkeiten.' },
    { id: 'stackit', name: 'STACKIT', control: 90, performance: 75, color: '#10b981', category: 'eu',
      description: 'Cloud-Lösung der Schwarz Gruppe mit Fokus auf deutsche Mittelständler.' },
    { id: 'ionos-cloud', name: 'IONOS Cloud', control: 65, performance: 65, color: '#10b981', category: 'eu',
      description: 'Größter deutscher Cloud-Anbieter mit DSGVO-konformer Infrastruktur.' },
    { id: 'open-telekom-cloud', name: 'Open Telekom Cloud', control: 55, performance: 55, color: '#10b981', category: 'eu',
      description: 'Deutsche Telekom Cloud basierend auf OpenStack für regulierte Branchen.' },
    { id: 'openstack-private-cloud', name: 'OpenStack Private Cloud', control: 100, performance: 35, color: '#8b5cf6', category: 'private',
      description: 'Open-Source Private Cloud mit voller Transparenz und ohne Vendor-Lock-in.' },
    { id: 'vmware-private-cloud', name: 'VMware Private Cloud', control: 85, performance: 20, color: '#8b5cf6', category: 'private',
      description: 'Bewährte Enterprise-Virtualisierung mit voller Kontrolle.' },
    { id: 'google-dedicated-cloud', name: 'Google Dedicated Cloud', control: 85, performance: 70, color: '#f59e0b', category: 'hybrid',
      description: 'Vollständig isolierte Google Cloud ohne Internetverbindung für höchste Sicherheit.' },
    { id: 'azure-stack-hci', name: 'Azure Stack HCI', control: 55, performance: 60, color: '#f59e0b', category: 'hybrid',
      description: 'Hybrid-Cloud-Lösung mit Azure-Services on-premises.' },
    { id: 'aws-outpost', name: 'AWS Outpost', control: 50, performance: 65, color: '#f59e0b', category: 'hybrid',
      description: 'AWS-Services in Ihrem Rechenzentrum für konsistente Hybrid-Erfahrung.' }
];

class SCCCriteriaPage {
    constructor() {
        this.providers = sccProviders;
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
     */
    loadCustomScores() {
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
        try {
            localStorage.setItem('scc_custom_provider_scores', JSON.stringify(this.customScores));
            this.updateResetButtonVisibility();
        } catch (e) {
            console.error('Error saving custom scores:', e);
        }
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
