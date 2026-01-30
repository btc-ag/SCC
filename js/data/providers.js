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
     * EU SEAL-Level Definitionen (Sovereignty Effective Assurance Levels)
     * Basierend auf dem EU Cloud Sovereignty Framework
     * @readonly
     */
    const SEAL_LEVELS = Object.freeze({
        SEAL_4: { level: 4, min: 90, label: 'Vollständige Souveränität', shortLabel: 'SEAL-4', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.08)' },
        SEAL_3: { level: 3, min: 75, label: 'Digital Resilience', shortLabel: 'SEAL-3', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.08)' },
        SEAL_2: { level: 2, min: 55, label: 'Data Sovereignty', shortLabel: 'SEAL-2', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.08)' },
        SEAL_1: { level: 1, min: 40, label: 'Basistransparenz', shortLabel: 'SEAL-1', color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.08)' },
        SEAL_0: { level: 0, min: 0, label: 'Keine Souveränität', shortLabel: 'SEAL-0', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.05)' }
    });

    /**
     * SEAL-Zonen Konfiguration für Chart-Visualisierung
     * Berechnung: top = 90 - (maxControl * 0.8), height = (maxControl - minControl) * 0.8
     * @readonly
     */
    const SEAL_ZONES = Object.freeze([
        { level: 4, top: 10, height: 8, label: 'SEAL-4' },   // 90-100 Kontrolle
        { level: 3, top: 18, height: 12, label: 'SEAL-3' }, // 75-89 Kontrolle
        { level: 2, top: 30, height: 16, label: 'SEAL-2' }, // 55-74 Kontrolle
        { level: 1, top: 46, height: 12, label: 'SEAL-1' }, // 40-54 Kontrolle
        { level: 0, top: 58, height: 32, label: '' }        // 0-39 Kontrolle (kein Label)
    ]);

    /**
     * Ermittelt das SEAL-Level basierend auf dem Kontrolle-Score
     * @param {number} controlScore - Kontrolle-Score (0-100)
     * @returns {Object} SEAL-Level Objekt mit level, label, color, bgColor
     */
    function getSealLevel(controlScore) {
        if (controlScore >= 90) return SEAL_LEVELS.SEAL_4;
        if (controlScore >= 75) return SEAL_LEVELS.SEAL_3;
        if (controlScore >= 55) return SEAL_LEVELS.SEAL_2;
        if (controlScore >= 40) return SEAL_LEVELS.SEAL_1;
        return SEAL_LEVELS.SEAL_0;
    }

    /**
     * EU-spezifizierte Gewichtung der SOV-Kriterien
     * Basierend auf dem EU Cloud Sovereignty Framework (Version 1.2.1, Oktober 2025)
     * @readonly
     */
    const SOV_WEIGHTS = Object.freeze({
        sov1: 0.15,  // Strategische Souveränität - 15%
        sov2: 0.10,  // Rechtliche Souveränität - 10%
        sov3: 0.10,  // Daten- & KI-Souveränität - 10%
        sov4: 0.15,  // Operative Souveränität - 15%
        sov5: 0.20,  // Lieferketten-Souveränität - 20% (höchste)
        sov6: 0.15,  // Technologie-Souveränität - 15%
        sov7: 0.10,  // Sicherheits-Souveränität - 10%
        sov8: 0.05   // Ökologische Nachhaltigkeit - 5%
    });

    /**
     * Berechnet den Kontrolle-Score aus den SOV-Einzelwerten
     * gemäß EU Cloud Sovereignty Framework Gewichtung
     * @param {Object} sovScores - Objekt mit sov1-sov8 Scores (0-100)
     * @returns {number} Gewichteter Kontrolle-Score (0-100, normalisiert)
     */
    function calculateControlFromSov(sovScores) {
        if (!sovScores) return 0;

        // Summe der Gewichte berechnen (für Normalisierung)
        const totalWeight = Object.values(SOV_WEIGHTS).reduce((sum, w) => sum + w, 0);

        let weightedSum = 0;
        for (const [key, weight] of Object.entries(SOV_WEIGHTS)) {
            const score = sovScores[key] || 0;
            weightedSum += score * weight;
        }

        // Normalisieren auf 0-100 Skala
        return Math.round(weightedSum / totalWeight);
    }

    /**
     * SOV-Kriterien (Sovereignty Objectives) Definitionen
     * Basierend auf dem EU Cloud Sovereignty Framework
     * @readonly
     */
    const SOV_CRITERIA = Object.freeze({
        SOV1: {
            id: 'sov1',
            name: 'Strategische Souveränität',
            shortName: 'SOV-1',
            description: 'Sitz und Kontrolle der Entscheidungsorgane in der EU, Schutz vor Nicht-EU-Übernahmen',
            icon: 'fa-building-columns'
        },
        SOV2: {
            id: 'sov2',
            name: 'Rechtliche Souveränität',
            shortName: 'SOV-2',
            description: 'EU-Recht als maßgebliches Recht, Schutz vor extraterritorialen Zugriffen (CLOUD Act, FISA)',
            icon: 'fa-scale-balanced'
        },
        SOV3: {
            id: 'sov3',
            name: 'Daten- & KI-Souveränität',
            shortName: 'SOV-3',
            description: 'Kontrolle über Verschlüsselungsschlüssel (BYOK), EU-Datenresidenz, verifizierbare Löschung',
            icon: 'fa-database'
        },
        SOV4: {
            id: 'sov4',
            name: 'Operative Souveränität',
            shortName: 'SOV-4',
            description: 'Exit-Fähigkeit, EU-basierte Teams für Betrieb und Support',
            icon: 'fa-gears'
        },
        SOV5: {
            id: 'sov5',
            name: 'Lieferketten-Souveränität',
            shortName: 'SOV-5',
            description: 'Nachvollziehbarkeit von Hardware, Firmware und Code, SBOMs',
            icon: 'fa-link'
        },
        SOV6: {
            id: 'sov6',
            name: 'Technologie-Souveränität',
            shortName: 'SOV-6',
            description: 'Offene APIs, Open-Source-Komponenten, minimales Vendor Lock-in',
            icon: 'fa-code'
        },
        SOV7: {
            id: 'sov7',
            name: 'Sicherheits-Souveränität',
            shortName: 'SOV-7',
            description: 'EU-basierte Security Operations, DSGVO/NIS2-Compliance, Zertifizierungen',
            icon: 'fa-shield-halved'
        },
        SOV8: {
            id: 'sov8',
            name: 'Ökologische Nachhaltigkeit',
            shortName: 'SOV-8',
            description: 'Energieeffizienz (PUE), erneuerbare Energien, transparente Emissionsmetriken',
            icon: 'fa-leaf'
        }
    });

    /**
     * SOV-Scores pro Provider (0-100 pro Kriterium)
     * @readonly
     */
    const PROVIDER_SOV_SCORES = Object.freeze({
        'aws': {
            sov1: 15, sov2: 20, sov3: 55, sov4: 45, sov5: 30, sov6: 40, sov7: 70, sov8: 60
        },
        'microsoft-azure': {
            sov1: 15, sov2: 20, sov3: 55, sov4: 45, sov5: 30, sov6: 35, sov7: 70, sov8: 65
        },
        'google-cloud': {
            sov1: 15, sov2: 20, sov3: 55, sov4: 45, sov5: 30, sov6: 50, sov7: 65, sov8: 55
        },
        'oracle-cloud': {
            sov1: 15, sov2: 20, sov3: 50, sov4: 40, sov5: 25, sov6: 30, sov7: 65, sov8: 50
        },
        'aws-european-sovereign-cloud': {
            sov1: 60, sov2: 85, sov3: 90, sov4: 85, sov5: 50, sov6: 45, sov7: 90, sov8: 70
        },
        'microsoft-delos-cloud': {
            sov1: 75, sov2: 95, sov3: 95, sov4: 90, sov5: 55, sov6: 40, sov7: 95, sov8: 65
        },
        'stackit': {
            sov1: 100, sov2: 100, sov3: 95, sov4: 85, sov5: 70, sov6: 75, sov7: 90, sov8: 85
        },
        'ionos-cloud': {
            sov1: 90, sov2: 95, sov3: 90, sov4: 80, sov5: 60, sov6: 65, sov7: 90, sov8: 75
        },
        'open-telekom-cloud': {
            sov1: 70, sov2: 75, sov3: 65, sov4: 55, sov5: 35, sov6: 50, sov7: 65, sov8: 55
        },
        'openstack-private-cloud': {
            sov1: 100, sov2: 100, sov3: 100, sov4: 100, sov5: 70, sov6: 100, sov7: 75, sov8: 50
        },
        'vmware-private-cloud': {
            sov1: 100, sov2: 100, sov3: 95, sov4: 90, sov5: 40, sov6: 50, sov7: 80, sov8: 50
        },
        'google-dedicated-cloud': {
            sov1: 30, sov2: 70, sov3: 95, sov4: 90, sov5: 45, sov6: 55, sov7: 90, sov8: 60
        },
        'azure-stack-hci': {
            sov1: 30, sov2: 50, sov3: 70, sov4: 65, sov5: 35, sov6: 40, sov7: 70, sov8: 55
        },
        'aws-outpost': {
            sov1: 20, sov2: 40, sov3: 65, sov4: 55, sov5: 30, sov6: 35, sov7: 70, sov8: 55
        }
    });

    /**
     * Begründungen für SOV-Scores pro Provider
     * @readonly
     */
    const PROVIDER_SOV_EXPLANATIONS = Object.freeze({
        'aws': {
            sov1: 'US-Konzern, Entscheidungen in Seattle',
            sov2: 'Unterliegt CLOUD Act und FISA',
            sov3: 'EU-Regionen verfügbar, BYOK möglich',
            sov4: 'Globaler Support, keine EU-Garantie',
            sov5: 'Proprietäre Hardware, keine Transparenz',
            sov6: 'Stark proprietäre Services, hohes Lock-in',
            sov7: 'ISO 27001, SOC 2, C5-Testat',
            sov8: 'Renewable Energy Pledge, aber wenig Transparenz'
        },
        'microsoft-azure': {
            sov1: 'US-Konzern, Entscheidungen in Redmond',
            sov2: 'Unterliegt CLOUD Act und FISA',
            sov3: 'EU-Regionen, BYOK und CMK verfügbar',
            sov4: 'Globaler Support, keine EU-Garantie',
            sov5: 'Proprietäre Hardware, keine Transparenz',
            sov6: 'Proprietäres Ökosystem, .NET-zentriert',
            sov7: 'ISO 27001, SOC 2, C5-Testat',
            sov8: 'Carbon Negative Pledge 2030'
        },
        'google-cloud': {
            sov1: 'US-Konzern, Entscheidungen in Mountain View',
            sov2: 'Unterliegt CLOUD Act und FISA',
            sov3: 'EU-Regionen, starke Verschlüsselung',
            sov4: 'Globaler Support, keine EU-Garantie',
            sov5: 'Proprietäre Hardware (TPU), wenig Transparenz',
            sov6: 'Kubernetes-Ursprung, mehr Open-Source-Fokus',
            sov7: 'ISO 27001, SOC 2, aber weniger EU-Zertifizierungen',
            sov8: 'Carbon-neutral seit 2007'
        },
        'oracle-cloud': {
            sov1: 'US-Konzern, Entscheidungen in Austin',
            sov2: 'Unterliegt CLOUD Act und FISA',
            sov3: 'EU-Regionen, Autonomous DB Encryption',
            sov4: 'Eingeschränkter EU-Support',
            sov5: 'Stark proprietär, keine Transparenz',
            sov6: 'Sehr proprietär, starkes Lock-in',
            sov7: 'ISO 27001, SOC 2, Basis-Compliance',
            sov8: 'Begrenzte Nachhaltigkeitsinitiaven'
        },
        'aws-european-sovereign-cloud': {
            sov1: 'EU-Tochter, EU-Aufsichtsrat',
            sov2: 'Expliziter CLOUD Act-Schutz, EU-Recht',
            sov3: 'EU-only Keys, keine US-Zugriffe',
            sov4: 'EU-Personal für Betrieb und Support',
            sov5: 'AWS-Hardware, aber EU-Kontrolle',
            sov6: 'AWS-Services, proprietär',
            sov7: 'C5, ISO 27001, BSI-konform',
            sov8: 'EU-Rechenzentren, erneuerbare Energie'
        },
        'microsoft-delos-cloud': {
            sov1: 'Deutsche Treuhänderschaft (SAP/Arvato)',
            sov2: 'Kein US-Zugriff, deutsches Recht',
            sov3: 'Keys bei deutschem Treuhänder',
            sov4: 'Betrieb durch deutsche Partner',
            sov5: 'MS-Technologie, aber DE-Kontrolle',
            sov6: 'Azure-Stack, proprietär',
            sov7: 'C5, BSI-Grundschutz, VS-NfD',
            sov8: 'Deutsche RZs, Nachhaltigkeitsstandards'
        },
        'stackit': {
            sov1: '100% deutsche Eigentümer (Schwarz Gruppe)',
            sov2: 'Deutsches Recht, kein US-Zugriff',
            sov3: 'Vollständige Datenhoheit in DE',
            sov4: 'Deutscher Betrieb und Support',
            sov5: 'OpenStack-basiert, EU-Hardware-Fokus',
            sov6: 'OpenStack-APIs, offene Standards',
            sov7: 'C5, ISO 27001, BSI-konform',
            sov8: 'Eigene RZs, hoher Nachhaltigkeitsfokus'
        },
        'ionos-cloud': {
            sov1: 'Deutsche Eigentümer (United Internet AG, börsennotiert)',
            sov2: 'Deutsches Recht, DSGVO-nativ, kein US-Zugriff',
            sov3: 'Vollständige EU-Datenresidenz, Verschlüsselung, BYOK',
            sov4: 'Deutscher Support und Betrieb, etablierte Prozesse',
            sov5: 'EU-Lieferanten, etablierte Partnerschaften',
            sov6: 'Standard-APIs, OpenStack-kompatibel, offene Schnittstellen',
            sov7: 'ISO 27001, C5-Testat, BSI-konform (wie STACKIT)',
            sov8: 'Deutsche RZs, Nachhaltigkeitsinitiativen, erneuerbare Energie'
        },
        'open-telekom-cloud': {
            sov1: 'Deutsche Telekom (Staatsanteil)',
            sov2: 'Deutsches Recht, DSGVO',
            sov3: 'EU-Datenresidenz, BYOK',
            sov4: 'Telekom-Betrieb, Huawei-Technologie',
            sov5: 'Huawei-Hardware, kritisch bewertet',
            sov6: 'OpenStack-basiert, offene APIs',
            sov7: 'C5, ISO 27001, BSI',
            sov8: 'Telekom-Nachhaltigkeitsstandards'
        },
        'openstack-private-cloud': {
            sov1: 'Vollständige eigene Kontrolle',
            sov2: 'Eigenes Recht, volle Souveränität',
            sov3: 'Volle Datenhoheit, eigene Keys',
            sov4: 'Eigener Betrieb, volle Kontrolle',
            sov5: 'Hardware-Wahl frei, Open Source',
            sov6: '100% Open Source, keine Abhängigkeit',
            sov7: 'Eigene Sicherheit, Eigenverantwortung',
            sov8: 'Abhängig von eigener Infrastruktur'
        },
        'vmware-private-cloud': {
            sov1: 'Vollständige eigene Kontrolle',
            sov2: 'Eigenes Recht, volle Souveränität',
            sov3: 'Volle Datenhoheit, eigene Keys',
            sov4: 'Eigener Betrieb, VMware-Abhängigkeit',
            sov5: 'Broadcom-Lizenzabhängigkeit',
            sov6: 'Proprietäre VMware-Technologie',
            sov7: 'Bewährte Enterprise-Sicherheit',
            sov8: 'Abhängig von eigener Infrastruktur'
        },
        'google-dedicated-cloud': {
            sov1: 'US-Konzern, aber isolierte Instanz',
            sov2: 'Vertraglicher CLOUD Act-Schutz',
            sov3: 'Air-gapped, vollständige Isolation',
            sov4: 'Dediziertes Team, hohe Kontrolle',
            sov5: 'Google-Hardware, aber isoliert',
            sov6: 'GCP-Services, Kubernetes-nativ',
            sov7: 'Höchste Sicherheitsstufe, air-gapped',
            sov8: 'Google Nachhaltigkeitsstandards'
        },
        'azure-stack-hci': {
            sov1: 'US-Konzern, Hardware beim Kunden',
            sov2: 'MS-Lizenz, aber lokale Daten',
            sov3: 'Lokale Daten, MS-Abhängigkeit',
            sov4: 'Eigener Betrieb möglich',
            sov5: 'MS-Software auf eigener Hardware',
            sov6: 'Proprietäres Azure-Ökosystem',
            sov7: 'Lokale Sicherheit, MS-Updates',
            sov8: 'Eigene RZ-Nachhaltigkeit'
        },
        'aws-outpost': {
            sov1: 'US-Konzern, AWS-Hardware beim Kunden',
            sov2: 'AWS-Lizenz, CLOUD Act gilt',
            sov3: 'Lokale Daten, aber AWS-Kontrolle',
            sov4: 'AWS-Management, Remote-Zugriff',
            sov5: 'AWS-Hardware, keine Transparenz',
            sov6: 'Proprietäre AWS-Services',
            sov7: 'AWS-Sicherheitsstandards lokal',
            sov8: 'Eigene RZ-Nachhaltigkeit'
        }
    });

    /**
     * Gibt SOV-Scores für einen Provider zurück
     * @param {string} providerId - Provider-ID
     * @returns {Object|null} SOV-Scores oder null
     */
    function getProviderSovScores(providerId) {
        return PROVIDER_SOV_SCORES[providerId] || null;
    }

    /**
     * Gibt SOV-Erklärungen für einen Provider zurück
     * @param {string} providerId - Provider-ID
     * @returns {Object|null} SOV-Erklärungen oder null
     */
    function getProviderSovExplanations(providerId) {
        return PROVIDER_SOV_EXPLANATIONS[providerId] || null;
    }

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
     * Basis-Provider-Daten (ohne control - wird aus SOV berechnet)
     * @type {Array}
     */
    const BASE_PROVIDER_DATA = [
        {
            id: 'aws',
            name: 'AWS',
            performance: 95,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYPERSCALER],
            category: PROVIDER_CATEGORIES.HYPERSCALER,
            groupIndex: 0,
            description: 'Umfangreichstes Portfolio an Infrastruktur- und Plattform-Services mit exzellenter Developer Experience.'
        },
        {
            id: 'microsoft-azure',
            name: 'Microsoft Azure',
            performance: 95,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYPERSCALER],
            category: PROVIDER_CATEGORIES.HYPERSCALER,
            groupIndex: 1,
            description: 'Leistungsfähiges Cloud-Ökosystem mit umfangreichem IaaS/PaaS-Portfolio und größter Partner-Landschaft.'
        },
        {
            id: 'google-cloud',
            name: 'Google Cloud',
            performance: 95,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYPERSCALER],
            category: PROVIDER_CATEGORIES.HYPERSCALER,
            groupIndex: 2,
            description: 'Überzeugend bei Container-Management, KI-Services und Workplace-Lösungen.'
        },
        {
            id: 'oracle-cloud',
            name: 'Oracle Cloud',
            performance: 70,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYPERSCALER],
            category: PROVIDER_CATEGORIES.HYPERSCALER,
            description: 'Besondere Stärken im Datenbank-Bereich mit umfangreichen Sicherheits- und Compliance-Möglichkeiten.'
        },
        {
            id: 'aws-european-sovereign-cloud',
            name: 'AWS European Sovereign Cloud',
            performance: 90,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.SOVEREIGN],
            category: PROVIDER_CATEGORIES.SOVEREIGN,
            description: 'Auf hohe Überlebensfähigkeit in geopolitischen Krisen ausgerichtet mit voller europäischer Souveränität.'
        },
        {
            id: 'microsoft-delos-cloud',
            name: 'Microsoft DELOS Cloud',
            performance: 65,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.SOVEREIGN],
            category: PROVIDER_CATEGORIES.SOVEREIGN,
            description: 'Speziell für deutsche Verwaltung mit vollständiger Datenhoheit ohne US-Zugriffsmöglichkeiten.'
        },
        {
            id: 'stackit',
            name: 'STACKIT',
            performance: 75,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.EU],
            category: PROVIDER_CATEGORIES.EU,
            description: 'Cloud-Lösung der Schwarz Gruppe mit Fokus auf deutsche Mittelständler.'
        },
        {
            id: 'ionos-cloud',
            name: 'IONOS Cloud',
            performance: 65,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.EU],
            category: PROVIDER_CATEGORIES.EU,
            description: 'Größter deutscher Cloud-Anbieter mit DSGVO-konformer Infrastruktur.'
        },
        {
            id: 'open-telekom-cloud',
            name: 'Open Telekom Cloud',
            performance: 55,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.EU],
            category: PROVIDER_CATEGORIES.EU,
            description: 'Deutsche Telekom Cloud basierend auf OpenStack für regulierte Branchen.'
        },
        {
            id: 'openstack-private-cloud',
            name: 'OpenStack Private Cloud',
            performance: 35,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.PRIVATE],
            category: PROVIDER_CATEGORIES.PRIVATE,
            description: 'Open-Source Private Cloud mit voller Transparenz und ohne Vendor-Lock-in.'
        },
        {
            id: 'vmware-private-cloud',
            name: 'VMware Private Cloud',
            performance: 20,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.PRIVATE],
            category: PROVIDER_CATEGORIES.PRIVATE,
            description: 'Bewährte Enterprise-Virtualisierung mit voller Kontrolle.'
        },
        {
            id: 'google-dedicated-cloud',
            name: 'Google Dedicated Cloud',
            performance: 70,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYBRID],
            category: PROVIDER_CATEGORIES.HYBRID,
            description: 'Vollständig isolierte Google Cloud ohne Internetverbindung für höchste Sicherheit.'
        },
        {
            id: 'azure-stack-hci',
            name: 'Azure Stack HCI',
            performance: 60,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYBRID],
            category: PROVIDER_CATEGORIES.HYBRID,
            description: 'Hybrid-Cloud-Lösung mit Azure-Services on-premises.'
        },
        {
            id: 'aws-outpost',
            name: 'AWS Outpost',
            performance: 65,
            color: CATEGORY_COLORS[PROVIDER_CATEGORIES.HYBRID],
            category: PROVIDER_CATEGORIES.HYBRID,
            description: 'AWS-Services in Ihrem Rechenzentrum für konsistente Hybrid-Erfahrung.'
        }
    ];

    /**
     * Berechnet Kontrolle-Werte für alle Provider aus SOV-Scores
     * @returns {CloudProvider[]} Provider mit berechneten control-Werten
     */
    function buildProvidersWithControl() {
        return BASE_PROVIDER_DATA.map(provider => {
            const sovScores = PROVIDER_SOV_SCORES[provider.id];
            const control = calculateControlFromSov(sovScores);
            return Object.freeze({ ...provider, control });
        });
    }

    /**
     * Vollständige Provider-Daten mit berechnetem Kontrolle-Score
     * Kontrolle wird aus SOV-Scores gemäß EU-Gewichtung berechnet
     * @type {CloudProvider[]}
     */
    const BASE_PROVIDERS = Object.freeze(buildProvidersWithControl());

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
        SEAL_LEVELS,
        SEAL_ZONES,
        SOV_CRITERIA,
        SOV_WEIGHTS,
        PROVIDER_SOV_SCORES,
        PROVIDER_SOV_EXPLANATIONS,
        BASE_PROVIDERS,
        LEGEND_DATA,
        anonymizeProviders,
        getProviderById,
        getProvidersByCategory,
        getProvidersCopy,
        getSealLevel,
        getProviderSovScores,
        getProviderSovExplanations,
        calculateControlFromSov
    });

})();
