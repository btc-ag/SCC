/**
 * Zentrale Provider-Daten für den Sovereign Cloud Compass
 * Diese Datei ist die Single Source of Truth für alle Provider-Informationen.
 *
 * @fileoverview Cloud Provider Datenbasis
 * @module data/providers
 */

(function() {
    'use strict';

    /**
     * Kategorien der Cloud-Provider
     * @readonly
     * @enum {string}
     */
    const PROVIDER_CATEGORIES = Object.freeze({
        HYPERSCALER: 'hyperscaler',
        SOVEREIGN: 'sovereign',
        EU: 'eu',
        PRIVATE: 'private',
        HYBRID: 'hybrid'
    });

    /**
     * Farbzuordnung für Provider-Kategorien
     * @readonly
     */
    const CATEGORY_COLORS = Object.freeze({
        [PROVIDER_CATEGORIES.HYPERSCALER]: '#ef4444',
        [PROVIDER_CATEGORIES.SOVEREIGN]: '#3b82f6',
        [PROVIDER_CATEGORIES.EU]: '#10b981',
        [PROVIDER_CATEGORIES.PRIVATE]: '#8b5cf6',
        [PROVIDER_CATEGORIES.HYBRID]: '#f59e0b'
    });

    /**
     * Kategorie-Labels (Deutsch)
     * @readonly
     */
    const CATEGORY_LABELS = Object.freeze({
        [PROVIDER_CATEGORIES.HYPERSCALER]: 'Hyperscaler',
        [PROVIDER_CATEGORIES.SOVEREIGN]: 'Souveräne Clouds',
        [PROVIDER_CATEGORIES.EU]: 'EU/Deutsche Anbieter',
        [PROVIDER_CATEGORIES.PRIVATE]: 'Private Cloud',
        [PROVIDER_CATEGORIES.HYBRID]: 'Hybrid-Lösungen'
    });

    /**
     * Anonyme Präfixe für Public Mode
     * @readonly
     */
    const ANONYMOUS_PREFIXES = Object.freeze({
        [PROVIDER_CATEGORIES.HYPERSCALER]: 'H',
        [PROVIDER_CATEGORIES.SOVEREIGN]: 'S',
        [PROVIDER_CATEGORIES.EU]: 'E',
        [PROVIDER_CATEGORIES.PRIVATE]: 'P',
        [PROVIDER_CATEGORIES.HYBRID]: 'Y'
    });

    /**
     * @typedef {Object} CloudProvider
     * @property {string} id - Eindeutige ID (lowercase, bindestriche)
     * @property {string} name - Anzeigename
     * @property {number} control - Kontrolle-Score (0-100)
     * @property {number} performance - Leistungs-Score (0-100)
     * @property {string} color - Farbcode
     * @property {string} category - Kategorie-ID
     * @property {string} description - Beschreibung
     * @property {number} [groupIndex] - Optional: Index für Gruppenpositionierung
     */

    /**
     * Basis-Provider-Daten
     * @type {CloudProvider[]}
     */
    const BASE_PROVIDERS = Object.freeze([
        {
            id: 'aws',
            name: 'AWS',
            control: 42,
            performance: 95,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYPERSCALER],
            category: PROVIDER_CATEGORIES.HYPERSCALER,
            groupIndex: 0,
            description: 'Umfangreichstes Portfolio an Infrastruktur- und Plattform-Services mit exzellenter Developer Experience.'
        },
        {
            id: 'microsoft-azure',
            name: 'Microsoft Azure',
            control: 42,
            performance: 95,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYPERSCALER],
            category: PROVIDER_CATEGORIES.HYPERSCALER,
            groupIndex: 1,
            description: 'Leistungsfähiges Cloud-Ökosystem mit umfangreichem IaaS/PaaS-Portfolio und größter Partner-Landschaft.'
        },
        {
            id: 'google-cloud',
            name: 'Google Cloud',
            control: 42,
            performance: 95,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYPERSCALER],
            category: PROVIDER_CATEGORIES.HYPERSCALER,
            groupIndex: 2,
            description: 'Überzeugend bei Container-Management, KI-Services und Workplace-Lösungen.'
        },
        {
            id: 'oracle-cloud',
            name: 'Oracle Cloud',
            control: 40,
            performance: 70,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYPERSCALER],
            category: PROVIDER_CATEGORIES.HYPERSCALER,
            description: 'Besondere Stärken im Datenbank-Bereich mit umfangreichen Sicherheits- und Compliance-Möglichkeiten.'
        },
        {
            id: 'aws-european-sovereign-cloud',
            name: 'AWS European Sovereign Cloud',
            control: 80,
            performance: 90,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.SOVEREIGN],
            category: PROVIDER_CATEGORIES.SOVEREIGN,
            description: 'Auf hohe Überlebensfähigkeit in geopolitischen Krisen ausgerichtet mit voller europäischer Souveränität.'
        },
        {
            id: 'microsoft-delos-cloud',
            name: 'Microsoft DELOS Cloud',
            control: 85,
            performance: 65,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.SOVEREIGN],
            category: PROVIDER_CATEGORIES.SOVEREIGN,
            description: 'Speziell für deutsche Verwaltung mit vollständiger Datenhoheit ohne US-Zugriffsmöglichkeiten.'
        },
        {
            id: 'stackit',
            name: 'STACKIT',
            control: 90,
            performance: 75,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.EU],
            category: PROVIDER_CATEGORIES.EU,
            description: 'Cloud-Lösung der Schwarz Gruppe mit Fokus auf deutsche Mittelständler.'
        },
        {
            id: 'ionos-cloud',
            name: 'IONOS Cloud',
            control: 65,
            performance: 65,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.EU],
            category: PROVIDER_CATEGORIES.EU,
            description: 'Größter deutscher Cloud-Anbieter mit DSGVO-konformer Infrastruktur.'
        },
        {
            id: 'open-telekom-cloud',
            name: 'Open Telekom Cloud',
            control: 55,
            performance: 55,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.EU],
            category: PROVIDER_CATEGORIES.EU,
            description: 'Deutsche Telekom Cloud basierend auf OpenStack für regulierte Branchen.'
        },
        {
            id: 'openstack-private-cloud',
            name: 'OpenStack Private Cloud',
            control: 100,
            performance: 35,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.PRIVATE],
            category: PROVIDER_CATEGORIES.PRIVATE,
            description: 'Open-Source Private Cloud mit voller Transparenz und ohne Vendor-Lock-in.'
        },
        {
            id: 'vmware-private-cloud',
            name: 'VMware Private Cloud',
            control: 85,
            performance: 20,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.PRIVATE],
            category: PROVIDER_CATEGORIES.PRIVATE,
            description: 'Bewährte Enterprise-Virtualisierung mit voller Kontrolle.'
        },
        {
            id: 'google-dedicated-cloud',
            name: 'Google Dedicated Cloud',
            control: 85,
            performance: 70,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYBRID],
            category: PROVIDER_CATEGORIES.HYBRID,
            description: 'Vollständig isolierte Google Cloud ohne Internetverbindung für höchste Sicherheit.'
        },
        {
            id: 'azure-stack-hci',
            name: 'Azure Stack HCI',
            control: 55,
            performance: 60,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYBRID],
            category: PROVIDER_CATEGORIES.HYBRID,
            description: 'Hybrid-Cloud-Lösung mit Azure-Services on-premises.'
        },
        {
            id: 'aws-outpost',
            name: 'AWS Outpost',
            control: 50,
            performance: 65,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYBRID],
            category: PROVIDER_CATEGORIES.HYBRID,
            description: 'AWS-Services in Ihrem Rechenzentrum für konsistente Hybrid-Erfahrung.'
        }
    ]);

    /**
     * Legende-Daten für die Anzeige
     * @readonly
     */
    const LEGEND_DATA = Object.freeze({
        full: [
            { color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYPERSCALER], text: '<strong>Hyperscaler</strong> (AWS, Azure, GCP, Oracle)' },
            { color: CATEGORY_COLORS[PROVIDER_CATEGORIES.SOVEREIGN], text: '<strong>Souveräne Clouds</strong> (AWS European, DELOS)' },
            { color: CATEGORY_COLORS[PROVIDER_CATEGORIES.EU], text: '<strong>Deutsche/EU Anbieter</strong> (STACKIT, IONOS, OTC)' },
            { color: CATEGORY_COLORS[PROVIDER_CATEGORIES.PRIVATE], text: '<strong>Private Cloud</strong> (VMware, OpenStack)' },
            { color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYBRID], text: '<strong>Hybrid-Lösungen</strong> (Outposts, Stack HCI, Dedicated)' }
        ],
        anonymous: [
            { color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYPERSCALER], text: '<strong>Hyperscaler</strong> (H1, H2, H3, H4)' },
            { color: CATEGORY_COLORS[PROVIDER_CATEGORIES.SOVEREIGN], text: '<strong>Souveräne Clouds</strong> (S1, S2)' },
            { color: CATEGORY_COLORS[PROVIDER_CATEGORIES.EU], text: '<strong>Deutsche/EU Anbieter</strong> (E1, E2, E3)' },
            { color: CATEGORY_COLORS[PROVIDER_CATEGORIES.PRIVATE], text: '<strong>Private Cloud</strong> (P1, P2)' },
            { color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYBRID], text: '<strong>Hybrid-Lösungen</strong> (Y1, Y2, Y3)' }
        ]
    });

    /**
     * Generiert anonymisierte Provider-Namen
     * @param {CloudProvider[]} providers - Provider-Array
     * @returns {CloudProvider[]} Provider mit anonymen Namen
     */
    function anonymizeProviders(providers) {
        return providers.map((p, i) => {
            const prefix = ANONYMOUS_PREFIXES[p.category] || '?';
            const index = providers.filter((fp, fi) => fi <= i && fp.category === p.category).length;
            return { ...p, name: `${prefix}${index}` };
        });
    }

    /**
     * Findet Provider nach ID
     * @param {string} id - Provider-ID
     * @returns {CloudProvider|undefined}
     */
    function getProviderById(id) {
        return BASE_PROVIDERS.find(p => p.id === id);
    }

    /**
     * Gibt alle Provider einer Kategorie zurück
     * @param {string} category - Kategorie-ID
     * @returns {CloudProvider[]}
     */
    function getProvidersByCategory(category) {
        return BASE_PROVIDERS.filter(p => p.category === category);
    }

    /**
     * Erstellt eine tiefe Kopie der Provider (für Modifikationen)
     * @returns {CloudProvider[]}
     */
    function getProvidersCopy() {
        return BASE_PROVIDERS.map(p => ({ ...p }));
    }

    // Export für Browser (kein ES6 Module wegen No-Build)
    window.SCC_DATA = Object.freeze({
        PROVIDER_CATEGORIES,
        CATEGORY_COLORS,
        CATEGORY_LABELS,
        ANONYMOUS_PREFIXES,
        BASE_PROVIDERS,
        LEGEND_DATA,
        anonymizeProviders,
        getProviderById,
        getProvidersByCategory,
        getProvidersCopy
    });

})();
