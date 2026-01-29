# Changelog

All notable changes to the Sovereign Cloud Compass project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

- **2.4.0** (2026-01-29) - Code-Modernisierung: Event-Handler, Tabellen-Refactoring, Input-Validierung
- **2.3.1** (2026-01-29) - Image Optimization: Alt-Texte, Width/Height, Lazy Loading
- **2.3.0** (2026-01-29) - SEO: Meta Tags, Open Graph, Schema.org, Critical CSS
- **2.2.0** (2026-01-29) - SEO-Grundlagen und Canonical URLs
- **2.1.0** (2026-01-25) - Mobile optimization with burger menu navigation
- **2.0.1** (2026-01-24) - Added changelog and version tracking
- **2.0.0** (2026-01-23) - GitHub Pages optimization and documentation updates
- **1.0.0** - Initial public release with full feature set
