# Sovereign Cloud Compass (SCC)

Ein interaktives Tool zur Bewertung und Auswahl von Cloud-Anbietern basierend auf der Balance zwischen Kontrolle/Souveränität und Leistungsfähigkeit.

## Highlights

- **EU SEAL-Integration**: Souveränitätsbewertung nach EU Cloud Sovereignty Framework (SEAL-0 bis SEAL-4)
- **SOV-Kriterien**: 8 Souveränitätsziele (SOV-1 bis SOV-8) mit EU-konformer Gewichtung
- **Strategie-Slider**: Dynamische Gewichtung zwischen Kontrolle und Leistung
- **Matrix-Visualisierung**: Intuitive Darstellung aller Cloud-Anbieter mit SEAL-Zonen
- **SOV-Detail-Panel**: Detaillierte Aufschlüsselung der Souveränitätsbewertung pro Provider
- **Kategorie-Filter**: Filterung nach Hyperscaler, Souveräne Clouds, EU-Anbieter, Private Cloud und Hybrid-Lösungen
- **Transparente Bewertung**: Detaillierte Dokumentation der Bewertungskriterien und Scoring-Methodik
- **Public & Full Access Modus**: Anonymisierte Ansicht für öffentliche Nutzung oder Vollzugriff mit Anbieter-Namen
- **Editierbare Scores**: Bewertungen können individuell angepasst werden
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile mit Burger-Menü
- **Dark Mode**: Vollständige Unterstützung für helle und dunkle Darstellung

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
- **SEAL-Zonen**: Horizontale Bänder zeigen SEAL-Level-Bereiche (SEAL-0 bis SEAL-4)
- Farbcodierung nach Anbieter-Kategorie
- Größenbasiertes Ranking (größere Punkte = bessere Position)
- Hover-Tooltips mit Score-Details und SEAL-Level
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

### 6. EU SEAL-Integration
- **SEAL-Level (0-4)**: Basierend auf dem EU Cloud Sovereignty Framework
  - SEAL-4: Vollständige Souveränität (Kontrolle ≥90)
  - SEAL-3: Digital Resilience (Kontrolle 75-89)
  - SEAL-2: Data Sovereignty (Kontrolle 55-74)
  - SEAL-1: Basistransparenz (Kontrolle 40-54)
  - SEAL-0: Keine Souveränität (Kontrolle <40)
- **SOV-Kriterien (SOV-1 bis SOV-8)**: 8 Souveränitätsziele mit EU-Gewichtung
- **SOV-Panel**: Klick auf Provider-Card öffnet Detail-Ansicht mit allen SOV-Scores
- **SEAL-Badges**: Kompakte Level-Anzeige in Cards und Tooltips

### 7. Passwortschutz
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
├── styles.css                        # Haupt-Styling
├── js/
│   ├── scc-compass.js                # Haupt-Logik (Compass)
│   ├── data/
│   │   └── providers.js              # Provider-Daten, SOV-Scores, SEAL-Konfiguration
│   └── components/
│       └── chart.js                  # Matrix-Visualisierung mit SEAL-Zonen
├── scc-criteria-page.js              # Bewertungskriterien-Logik
├── favicon.svg                       # Favicon
├── btc-logo.png                      # BTC AG Logo
├── LICENSE                           # Lizenz
├── CHANGELOG.md                      # Änderungsprotokoll
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

Basierend auf dem [EU Cloud Sovereignty Framework](https://commission.europa.eu/document/09579818-64a6-4dd5-9577-446ab6219113_en) mit gewichteten SOV-Kriterien:

| SOV | Kriterium | Gewicht |
|-----|-----------|---------|
| SOV-1 | Strategische Souveränität | 15% |
| SOV-2 | Rechtliche Souveränität | 10% |
| SOV-3 | Daten- & KI-Souveränität | 10% |
| SOV-4 | Operative Souveränität | 15% |
| SOV-5 | Lieferketten-Souveränität | 20% |
| SOV-6 | Technologie-Souveränität | 15% |
| SOV-7 | Sicherheits-Souveränität | 10% |
| SOV-8 | Ökologische Nachhaltigkeit | 5% |

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
