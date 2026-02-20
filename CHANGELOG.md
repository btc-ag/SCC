# Changelog

All notable changes to the Sovereign Cloud Compass project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.3] - 2026-02-20

### Fixed
- **CSS-Ladevorgang auf der Kriterienseite**: `criteria-styles.css` wird nun lokal aus dem SCC-Repo geladen statt über eine externe GitHub-Pages-URL des SAA-Repos (behebt 404-Fehler)

## [3.1.2] - 2026-02-18

### Changed
- **Framework-Bezeichnung präzisiert**: "gemäß EU-Spezifikation gewichtet" ersetzt durch "orientiert sich an diesem Referenz-Dokument der EU-Kommission"
- **SEAL-Legend-Hint aktualisiert**: Klarstellung, dass das EU Cloud Sovereignty Framework ein Referenz-Dokument ist, kein formeller Standard
- **Disclaimer ergänzt** (evaluation-criteria.html): Hinweis auf den ursprünglichen Ausschreibungskontext, laufende BSI/ANSSI-Interpretationen und Empfehlung zur eigenen Anforderungsdefinition bei Beschaffungen

## [3.1.1] - 2026-02-18

### Changed
- **Azure SOV-6 Begründung präzisiert**: `.NET-zentriert` ersetzt durch `Lock-in liegt im Ökosystem (M365, Entra, Power Platform), nicht der Runtime – .NET ist vollständig OSS`
- **STACKIT SOV-6 Begründung erweitert**: Hinweis ergänzt, dass bei einzelnen Managed Services (z.B. Dremio Enterprise statt Trino) das Potenzial für echte Souveränität noch ungenutzt bleibt
- **SOV-6 Kriteriendefinition geschärft**: Prinzip ergänzt – Technologie-Souveränität bedeutet nicht, proprietäre Software auf EU-Infrastruktur zu hosten; echte Souveränität entsteht durch offene Technologien ohne Vendor-Abhängigkeit

## [3.1.0] - 2026-02-18

### Added
- **SAP Cloud Infrastructure (SCI)**: Neuer Provider in der Kategorie EU/Deutsche Anbieter
  - Ehemals „SAP Converged Cloud" – OpenStack-basierte IaaS für hochsensible und hochskalierbare Workloads
  - Deutsche Rechenzentren (SAP-Eigentum), 3 Availability Zonen auf SAP-eigenen Leitungswegen
  - Multi-Tenant, offen für Non-SAP-Workloads
  - **Einschränkung**: Aktuell kein vollständiger NIST-Public-Cloud-Status (kein öffentlicher Service-Katalog, keine Preisliste, kein Self-Service) – in Bewertung entsprechend berücksichtigt
  - Kontrolle: 76 (SEAL-3), Leistung: 55
  - Zertifizierungen: C5 Typ II, KRITIS, Schutzziel HOCH, EN 50600 VK3, TSI3+, VS-NfD BSI-Komponentenzulassung in Bearbeitung
  - Quelle: Inoffizielle Produktinformationen (SAP SE); begrenzte öffentliche Dokumentation

### Changed
- **Open Telekom Cloud SOV-Scores korrigiert** – Konsistenzüberarbeitung:
  - SOV-1: 75 → 87 (KfW-Staatsanteil bietet strukturellen Übernahmeschutz – Huawei-Risiko betrifft Lieferkette/Betrieb, nicht strategisch-rechtliche Ebene)
  - SOV-2: 85 → 90 (kein US-Mutterkonzern, CLOUD Act nicht anwendbar – T-Mobile US als Restrisiko)
  - SOV-3: 80 → 83 (BYOK bestätigt; Huawei-Netzzugriff als Restrisiko für Datenisolation explizit dokumentiert)
  - SOV-8: 65 → 76 (100% Ökostrom in deutschen Betrieben seit 2021, starkes DAX-Nachhaltigkeitsreporting)
  - OTC Kontrolle: ~67 → 70 (bleibt SEAL-2)
- **Microsoft DELOS Cloud korrigiert**:
  - SOV-4: 90 → 82 (kein NIST-Public-Cloud-Zugang – nur für Verwaltung zugänglich, kein Self-Service, Exit-Planung außerhalb des Verwaltungskontexts eingeschränkt)
  - Leistung: 65 → 60 (eingeschränkte öffentliche Verfügbarkeit, analog zur SAP SCI-Bewertungslogik)
  - DELOS Kontrolle: ~74 → 72 (bleibt SEAL-2)

### Fixed
- OTC SOV-Erklärungen präzisiert: SOV-1/2 unterscheiden nun klar zwischen strategisch-rechtlicher und operativer Ebene; SOV-8 mit konkreten Nachhaltigkeitsdaten belegt
- DELOS SOV-4 Erklärung: Einschränkung durch fehlenden öffentlichen Zugang explizit dokumentiert

## [3.0.2] - 2026-01-30

### Changed
- **Kriterien-Seite Restrukturierung**: SOV-Sektion in Kontrolle-Sektion integriert
  - Separate SOV-Navigation entfernt (4 statt 5 Tabs)
  - **Neues SOV-Accordion**: Provider-Tabelle und SOV-Details in einer aufklappbaren Ansicht kombiniert
  - Jeder Provider-Eintrag zeigt: Name, Kategorie, Kontrolle-Score, SEAL-Badge
  - Klick auf Provider klappt SOV-Detail-Grid mit allen 8 Kriterien auf
  - 8 SOV-Kriterien als Factor-Cards mit EU-Gewichtungen dargestellt
  - Bewertungsfaktoren durch SOV-basierte Bewertungskriterien ersetzt
  - EU Framework Link in Kontrolle-Sektion integriert

## [3.0.1] - 2026-01-30

### Changed
- **Open Telekom Cloud SOV-Scores angepasst**: Konsistentere Bewertung im Vergleich zu IONOS und STACKIT
  - SOV-1: 70 → 75 (Staatsanteil schützt vor Übernahmen)
  - SOV-2: 75 → 85 (Deutsches Recht, DSGVO-konform)
  - SOV-3: 65 → 80 (EU-Datenresidenz, BYOK verfügbar)
  - SOV-4: 55 → 65 (Telekom-Betrieb, aber Huawei-Support)
  - SOV-5: 35 → 40 (Huawei bleibt kritisch für Lieferkette)
  - SOV-6: 50 → 65 (OpenStack-basiert, offene APIs)
  - SOV-7: 65 → 85 (C5-Testat, ISO 27001, BSI-konform)
  - SOV-8: 55 → 65 (Telekom-Nachhaltigkeitsstandards)
- **OTC Kontrolle-Score**: ~57 → ~67 (bleibt SEAL-2)
- **OTC SOV-Erklärungen**: Detailliertere Begründungen

## [3.0.0] - 2026-01-30

### Major Release - EU SEAL-Integration & SOV-Framework

Diese Version integriert die EU SEAL-Kriterien (Sovereignty Effective Assurance Levels) basierend auf dem EU Cloud Sovereignty Framework.

### Added
- **SEAL-Level System**: 5-stufige Souveränitätsbewertung (SEAL-0 bis SEAL-4) basierend auf Kontrolle-Score
- **SEAL-Zonen in Matrix**: Visuelle Hintergrundbänder zeigen SEAL-Level-Bereiche
- **SEAL-Badges**: Kompakte Level-Anzeige in Provider-Cards und Tooltips
- **SOV-Kriterien (SOV-1 bis SOV-8)**: Detaillierte Souveränitätsziele gem. EU Framework
- **SOV-Panel**: Slide-in Panel mit detaillierter SOV-Aufschlüsselung pro Provider
- **SOV-Gewichtung**: EU-konforme Gewichtung der 8 Souveränitätsziele
- **Provider SOV-Scores**: Individuelle SOV-Bewertungen für alle 14 Provider
- **Provider SOV-Erklärungen**: Begründungen für jeden SOV-Score pro Provider
- **Custom Scores Hinweis**: Anzeige auf Compass-Seite wenn individuelle Kriterien angewendet wurden
- **EU Framework Links**: Direktlinks zum offiziellen EU Cloud Sovereignty Framework Dokument

### Changed
- **Kontrolle-Berechnung**: Basiert nun auf gewichteten SOV-Scores statt statischen Werten
- **Tooltip-Design**: Erweitert um SEAL-Level Anzeige mit Icon
- **Result-Cards**: Header mit SEAL-Badge ergänzt
- **Kriterien-Seite**: SOV-Sektion mit Provider-Auswahl und Detail-Ansicht

### Technical
- Neue Datenstruktur: `SOV_WEIGHTS`, `SOV_CRITERIA`, `PROVIDER_SOV_SCORES`, `PROVIDER_SOV_EXPLANATIONS`
- `calculateControlFromSov()` Funktion für gewichtete Kontrolle-Berechnung
- `getSealLevel()` Funktion für SEAL-Level Ermittlung
- `renderSealZones()` in ChartComponent für Matrix-Visualisierung
- SOV-Panel mit `openSovPanel()` / `closeSovPanel()` Funktionen

## [2.4.0] - 2026-01-29

### Changed
- **Event-Handler Modernisierung**: Alle inline `onclick` Handler zu `addEventListener` migriert
- **Keyboard-Accessibility**: Enter/Space Support für alle interaktiven Elemente hinzugefügt
- **Tabellen-Rendering refactored**: Helper-Methoden für DRY-Prinzip (`renderProviderNameCell`, `renderScoreCell`, `renderCategoryBadge`, `renderEditButton`)
- **Input-Validierung**: Score-Werte werden auf Bereich 0-100 validiert und begrenzt

### Technical
- Inline Event-Handler aus HTML entfernt (24 onclick Handler)
- Event-Binding via `data-provider-id` Attribute statt globaler Funktionen
- `validateScore()` und `validateCustomScores()` für robuste Datenvalidierung
- Slider `oninput` Handler programmatisch gebunden
- Duplizierten Code in evaluation-criteria.html entfernt (~60 Zeilen)

### Fixed
- Mobile Navigation Event-Handler funktionieren jetzt korrekt
- Theme-Toggles reagieren auf Keyboard-Events (Accessibility)

## [2.3.1] - 2026-01-29

### Changed
- **Image Optimization**: Kontextspezifische Alt-Texte für alle Bilder
- **Layout Stability**: Width/Height Attribute zur Vermeidung von CLS (Cumulative Layout Shift)
- **Performance**: Lazy Loading für Footer-Logos hinzugefügt

## [2.3.0] - 2026-01-29

### Added
- **SEO Meta Tags**: Description, Keywords, Author, Robots
- **Open Graph**: Facebook/LinkedIn Sharing-Optimierung
- **Twitter Cards**: Twitter Sharing-Optimierung
- **Schema.org**: Strukturierte Daten (WebApplication, Organization, BreadcrumbList)
- **Critical CSS**: Above-the-fold Styles inline für schnelleres Rendering
- **Skip-Links**: Accessibility-Verbesserung für Screenreader
- **sitemap.xml**: Sitemap für Suchmaschinen
- **robots.txt**: Crawler-Anweisungen

### Changed
- Font Awesome async geladen für bessere Performance

## [2.2.0] - 2026-01-29

### Added
- Initiale SEO-Grundlagen implementiert
- Canonical URLs hinzugefügt
- Preconnect für CDN-Performance

## [2.1.0] - 2026-01-25

### Added
- **Mobile Burger Menu**: Modern hamburger menu with animated icon transition for mobile devices
- **Mobile Navigation Drawer**: Slide-out drawer with glass-morphism design and smooth animations
- **Mobile Criteria Navigation**: Tab-based navigation (tablet) and dropdown selector (phone) for criteria page sections
- **Scroll Spy**: Automatic navigation state updates based on scroll position
- **Safe Area Support**: Proper padding for iPhone notch and home indicator
- **Login Page Footer**: Standard footer with Impressum link and version number on login page
- **Impressum Link**: Added legal notice link to criteria page footer

### Changed
- Header navigation now responsive with burger menu on screens ≤992px
- Dark Mode toggle moved to drawer header for better accessibility
- Improved touch targets (min. 44px) for mobile usability
- Enhanced responsive breakpoints (992px, 768px, 480px)
- Login page now uses consistent footer layout with main pages

### Technical
- Added Font Awesome 6.5.1 for menu icons
- Implemented keyboard navigation (Escape to close menu)
- Auto-close drawer on window resize to desktop
- Flexbox column layout for login overlay with footer positioning

## [2.0.1] - 2026-01-24

### Added
- Added CHANGELOG.md file to track project changes
- Added version numbers to all HTML pages (footer, bottom right)

### Changed
- Improved project documentation with version tracking

## [2.0.0] - 2026-01-23

### Major Release - Editable Criteria & Design Optimization

This is a significant release with major improvements to functionality and user experience.

### Added
- **Editable Provider Scores**: Users can now customize control and performance scores for each provider
- **Custom Score Persistence**: All score adjustments are saved in localStorage and synchronized across pages
- **Score Reset Functionality**: Ability to reset all customizations back to default values
- **Enhanced Criteria Documentation**: Comprehensive evaluation criteria page with detailed methodology
- **Real-time Score Updates**: Changes in criteria page immediately reflect in the main compass
- **Provider Edit Modal**: User-friendly interface for adjusting individual provider scores
- **Floating Action Buttons**: Quick access to "Back to Compass" and "Reset to Default" functions

### Changed
- **Complete Design Overhaul**: Modernized UI with improved visual hierarchy and spacing
- **Enhanced Color Scheme**: Refined color palette for better contrast and accessibility
- **Optimized Layout**: Better responsive behavior and improved grid systems
- **Improved Typography**: Enhanced readability with better font sizing and line heights
- **Refined Animations**: Smoother transitions and hover effects throughout
- **Better Dark Mode**: Improved dark theme with better color balance

### Technical Improvements
- Updated cross-references to use GitHub Pages URLs
- Renamed main file to `index.html` for GitHub Pages support
- Fixed broken internal links and references
- Improved code organization and documentation

### Fixed
- Fixed broken internal links and references
- Resolved layout issues in mobile viewport
- Corrected color inconsistencies in dark mode

## [1.0.0] - Initial Release

### Added
- Initial release of Sovereign Cloud Compass v3.0
- Interactive strategy slider for balancing control vs. performance
- Matrix visualization with cloud provider positioning
- Category filtering (Hyperscaler, Sovereign Clouds, EU Providers, Private Cloud, Hybrid)
- Public access mode with anonymized provider names
- Full access mode with detailed provider information (password-protected)
- Evaluation criteria documentation page (`evaluation-criteria.html`)
- Editable provider scores with localStorage persistence
- Dark mode support
- Responsive design for desktop and tablet
- Support for 14 cloud providers across 5 categories:
  - Hyperscaler: AWS, Azure, Google Cloud, Oracle Cloud
  - Sovereign Clouds: AWS European Sovereign Cloud, Microsoft DELOS Cloud
  - EU Providers: STACKIT, IONOS Cloud, Open Telekom Cloud
  - Private Cloud: OpenStack, VMware
  - Hybrid Solutions: Google Dedicated Cloud, Azure Stack HCI, AWS Outpost

### Features
- Real-time score calculation based on control/performance weighting
- Top 8 provider ranking with detailed cards
- Transparent scoring methodology documentation
- Custom score adjustments via criteria page
- Session-based authentication
- Theme persistence (light/dark mode)

---

## Version History

- **3.1.1** (2026-02-18) - SOV-6 Begründungen präzisiert: Azure Runtime vs. Ökosystem; STACKIT Dremio-Hinweis; Prinzip in Kriterien-Seite
- **3.1.0** (2026-02-18) - SAP Cloud Infrastructure hinzugefügt; OTC + DELOS Scores korrigiert
- **3.0.2** (2026-01-30) - Kriterien-Seite: SOV-Sektion in Kontrolle integriert
- **3.0.1** (2026-01-30) - OTC SOV-Scores Anpassung: Konsistentere Bewertung
- **3.0.0** (2026-01-30) - EU SEAL-Integration: SOV-Framework, SEAL-Level, SOV-Panel
- **2.4.0** (2026-01-29) - Code-Modernisierung: Event-Handler, Tabellen-Refactoring, Input-Validierung
- **2.3.1** (2026-01-29) - Image Optimization: Alt-Texte, Width/Height, Lazy Loading
- **2.3.0** (2026-01-29) - SEO: Meta Tags, Open Graph, Schema.org, Critical CSS
- **2.2.0** (2026-01-29) - SEO-Grundlagen und Canonical URLs
- **2.1.0** (2026-01-25) - Mobile optimization with burger menu navigation
- **2.0.1** (2026-01-24) - Added changelog and version tracking
- **2.0.0** (2026-01-23) - GitHub Pages optimization and documentation updates
- **1.0.0** - Initial public release with full feature set
