# Sovereign Cloud Compass (SCC)

Ein interaktives Tool zur Bewertung und Auswahl von Cloud-Anbietern basierend auf der Balance zwischen Kontrolle/Souveränität und Leistungsfähigkeit.

## Highlights

- **Strategie-Slider**: Dynamische Gewichtung zwischen Kontrolle und Leistung
- **Matrix-Visualisierung**: Intuitive Darstellung aller Cloud-Anbieter in einem 2D-Koordinatensystem
- **Kategorie-Filter**: Filterung nach Hyperscaler, Souveräne Clouds, EU-Anbieter, Private Cloud und Hybrid-Lösungen
- **Transparente Bewertung**: Detaillierte Dokumentation der Bewertungskriterien und Scoring-Methodik
- **Public & Full Access Modus**: Anonymisierte Ansicht für öffentliche Nutzung oder Vollzugriff mit Anbieter-Namen
- **Editierbare Scores**: Bewertungen können individuell angepasst werden
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile mit Burger-Menü
- **Dark Mode**: Vollständige Unterstützung für helle und dunkle Darstellung
- **Mobile Navigation**: Modernes Slide-out Menü mit Touch-optimierter Bedienung

## Unterstützte Cloud-Anbieter

### Hyperscaler
- Amazon Web Services (AWS)
- Microsoft Azure
- Google Cloud Platform (GCP)
- Oracle Cloud

### Souveräne Clouds
- AWS European Sovereign Cloud (ESC)
- Microsoft DELOS Cloud

### EU-Anbieter
- STACKIT (Schwarz IT)
- IONOS Cloud (United Internet)
- Open Telekom Cloud (T-Systems)

### Private Cloud
- OpenStack Private Cloud
- VMware Private Cloud

### Hybrid-Lösungen
- Google Dedicated Cloud
- Azure Stack HCI
- AWS Outpost

## Funktionen

### 1. Strategie-Slider
- Kontinuierliche Anpassung der Gewichtung zwischen Kontrolle (0-100%) und Leistung (0-100%)
- Vordefinierte Labels: Kontrolle-fokussiert, Ausgewogen, Leistungs-fokussiert
- Echtzeit-Aktualisierung der Rankings und Visualisierung

### 2. Matrix-Visualisierung
- 2D-Darstellung aller Anbieter nach Kontrolle (Y-Achse) und Leistung (X-Achse)
- Farbcodierung nach Anbieter-Kategorie
- Größenbasiertes Ranking (größere Punkte = bessere Position)
- Hover-Tooltips mit Score-Details
- Quadranten-Labels: Souverän, Autarkiefokussiert, Starter, Leistungsfokussiert

### 3. Kategorie-Filter
- Selektive Anzeige nach Anbieter-Kategorien
- Multi-Select-Funktionalität
- Dynamische Zähler für sichtbare Anbieter
- Persistente Filtereinstellungen

### 4. Ranking & Ergebnisse
- Top 8 Anbieter basierend auf gewählter Strategie
- Detailkarten mit Beschreibung, Kontrolle, Leistung und Score
- Visueller Score-Balken
- Hervorhebung des Gewinners

### 5. Bewertungskriterien-Dokumentation
- Separate Seite (`evaluation-criteria.html`) mit vollständiger Dokumentation
- Detaillierte Erklärung aller Bewertungsfaktoren für Kontrolle und Leistung
- Transparente Darstellung der Scoring-Methodik und Berechnungsformel
- Editierbare Provider-Scores mit Echtzeit-Aktualisierung

### 6. Passwortschutz
- Public Access: Anonymisierte Anbieter-Namen (H1, H2, S1, E1, etc.)
- Full Access: Vollständige Anbieter-Namen nach Passwort-Eingabe
- Session-basierte Authentifizierung
- Beratungstermin-Buchung direkt aus dem Login

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 mit CSS Custom Properties und Glass-Morphism Design
- **Icons**: Font Awesome 6.5
- **Architektur**: Single-Page Application ohne Build-Prozess
- **Authentifizierung**: Client-seitige SHA-256-Hash-Validierung
- **Persistenz**: LocalStorage für Custom Scores und Theme-Präferenzen
- **Mobile**: Responsive Design mit Safe-Area-Support für moderne Smartphones

## Setup

### Voraussetzungen
- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- Keine Server-Installation erforderlich

### Lokale Nutzung
1. Repository klonen oder ZIP entpacken
2. `index.html` im Browser öffnen für das Haupt-Tool
3. Optional: `evaluation-criteria.html` öffnen für die Bewertungskriterien-Dokumentation
4. Fertig!

### Dateistruktur
```
SCC/
├── index.html                        # Haupt-HTML (Compass)
├── evaluation-criteria.html          # Bewertungskriterien-Seite
├── scc-criteria-page.js              # Bewertungskriterien-Logik
├── styles.css                        # Haupt-Styling (shared mit SAA)
├── favicon.svg                       # Favicon
├── btc-logo.png                      # BTC AG Logo
├── LICENSE                           # Lizenz
└── README.md                         # Diese Datei
```

## Verwendung

1. **Access-Modus wählen**: Public Mode (anonymisiert) oder Vollzugriff (mit Passwort)
2. **Strategie anpassen**: Slider zwischen Kontrolle und Leistung verschieben
3. **Kategorien filtern**: Gewünschte Anbieter-Typen ein-/ausblenden
4. **Ergebnisse analysieren**: Matrix und Ranking zeigen passende Anbieter
5. **Details erkunden**: Klick auf "Bewertungskriterien" für vollständige Dokumentation

## Bewertungsmethodik

### Berechnungsformel
```
Gesamt-Score = (Kontrolle × Gewicht_Kontrolle) + (Leistung × Gewicht_Leistung)
```

### Gewichtungsbeispiele
- **Maximale Souveränität**: 90% Kontrolle, 10% Leistung
- **Ausgewogen**: 50% Kontrolle, 50% Leistung
- **Performance First**: 10% Kontrolle, 90% Leistung

### Bewertungskriterien

**Kontrolle & Souveränität (0-100 Punkte)**
- Jurisdiktion & Rechtsraum
- DSGVO & Datenschutz
- Vendor Lock-in Risiko
- Eigentümerstruktur
- Infrastruktur-Standort
- Transparenz & Zugriffe

**Leistung & Performance (0-100 Punkte)**
- Service-Portfolio Umfang
- Service-Reife (Maturity)
- Skalierbarkeit & Verfügbarkeit
- Innovation & KI/ML
- Ökosystem & Integration
- Performance & Latenz

## Datenquellen

Die Bewertungen basieren auf:
- Umfassenden Experten-Einschätzungen der BTC AG (10+ Jahre Cloud-Erfahrung)
- Sovereign Cloud Benchmark 2025 von cloud ahead
- Öffentlich verfügbaren Dokumentationen der Cloud-Anbieter
- Eigenen Recherchen und Praxiserfahrungen
- Stand: Januar 2026

**Hinweis**: Die Bewertungen sind Experteneinschätzungen und können individuell in der Kriterien-Seite angepasst werden.

## Erweiterung

### Neue Anbieter hinzufügen
Im JavaScript-Bereich von `index.html` unter `baseFullProviders` einen neuen Eintrag anlegen:

```javascript
{
    name: 'Neuer Anbieter',
    control: 75,
    performance: 80,
    color: '#3b82f6',
    category: 'eu',
    description: 'Beschreibung des Anbieters und seiner Stärken.'
}
```

### Scores anpassen
- Öffne `evaluation-criteria.html`
- Klicke auf den Edit-Button bei einem Anbieter
- Passe Kontrolle- und Leistungs-Scores an
- Änderungen werden in LocalStorage gespeichert und im Compass übernommen

## Lizenz

Dieses Projekt steht unter einer **Dual-License** (AGPL v3 / Kommerziell). Details siehe [LICENSE](LICENSE).

- **AGPL v3**: Kostenlose Nutzung mit Quellcode-Offenlegungspflicht
- **Kommerzielle Lizenz**: Für proprietäre Nutzung ohne Offenlegungspflicht

## Kontakt & Support

Bei Fragen, Feedback oder Erweiterungswünschen:

**BTC Business Technology Consulting AG**
E-Mail: cloud@btc-ag.com

---

*Entwickelt mit Unterstützung von Claude (Anthropic)*
