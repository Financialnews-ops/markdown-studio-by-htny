# Markdown Studio

**by HTNY Studios** · Electron · Windows · Offline

> 🇵🇱 Polski poniżej / 🇬🇧 Polish version below — [skocz do wersji polskiej](#-markdown-studio-pl)

---

## 🇬🇧 Markdown Studio (EN)

A modern desktop Markdown editor with live preview, high-quality exports and independent pane controls. Fully offline — your documents never leave your computer.

### Features

- **Live preview** — split editor / rendered view that updates as you type
- **Independent panes** — show or hide the editor and preview separately
- **Formatting toolbar** — headings, bold, italic, strikethrough, inline code, quotes, lists (bulleted & numbered), links, images and tables
- **Exports** — PDF, DOCX (Word) and Markdown for Obsidian
- **PDF import** — pull text from existing PDFs
- **Native menus & shortcuts** — New (`Ctrl+N`), Open (`Ctrl+O`), Save (`Ctrl+S`), Save As (`Ctrl+Shift+S`), Fullscreen (`F11`), Always-on-top
- **Local save folder** — documents are stored in `Documents/MarkdownStudio`
- **Safe by design** — context isolation on, no Node integration in the renderer, HTML sanitised with DOMPurify

### Tech stack

Electron 31 · vanilla JS renderer · [marked](https://github.com/markedjs/marked) (Markdown parsing) · [DOMPurify](https://github.com/cure53/DOMPurify) (sanitisation) · html2pdf.js · html-docx.js · pdf.js. Third-party libraries are vendored in `lib/`.

### Project structure

```
.
├── main.js          # Electron main process (windows, menus, IPC, file dialogs)
├── preload.js       # Secure bridge exposed to the renderer (window.studio)
├── src/
│   └── index.html   # Renderer: UI, editor, preview, export logic
├── lib/             # Vendored libraries (marked, DOMPurify, html2pdf, html-docx, pdf.js)
├── assets/          # App icons (icon.ico, icon.png, icon-source.jpg)
├── package.json
├── LICENSE
└── .gitignore
```

### Getting started

Requirements: [Node.js](https://nodejs.org/) 18+ and npm.

```bash
git clone https://github.com/Financialnews-ops/markdown-studio-by-htny.git
cd markdown-studio-by-htny
npm install
npm start
```

### Building a Windows executable

```bash
npm run package:win
```

The packaged app is written to a `Markdown Studio by HTNY Studios-win32-x64/` folder (ignored by Git).

### License

MIT © 2026 HTNY Studios — see [LICENSE](LICENSE).

---

## 🇵🇱 Markdown Studio (PL)

Nowoczesny edytor Markdown na komputery z podglądem na żywo, eksportem w wysokiej jakości i niezależnym sterowaniem panelami. Działa w pełni offline — Twoje dokumenty nigdy nie opuszczają komputera.

### Funkcje

- **Podgląd na żywo** — podzielony widok edytora i renderowanej treści, aktualizowany podczas pisania
- **Niezależne panele** — osobne pokazywanie i ukrywanie edytora oraz podglądu
- **Pasek formatowania** — nagłówki, pogrubienie, kursywa, przekreślenie, kod inline, cytaty, listy (wypunktowane i numerowane), linki, obrazy i tabele
- **Eksport** — PDF, DOCX (Word) oraz Markdown dla Obsidian
- **Import PDF** — pobieranie tekstu z istniejących plików PDF
- **Natywne menu i skróty** — Nowy (`Ctrl+N`), Otwórz (`Ctrl+O`), Zapisz (`Ctrl+S`), Zapisz jako (`Ctrl+Shift+S`), Pełny ekran (`F11`), Zawsze na wierzchu
- **Lokalny folder zapisów** — dokumenty trafiają do `Dokumenty/MarkdownStudio`
- **Bezpieczeństwo od podstaw** — włączona izolacja kontekstu, brak integracji Node w warstwie renderującej, treść HTML czyszczona przez DOMPurify

### Technologie

Electron 31 · czysty JavaScript po stronie renderera · [marked](https://github.com/markedjs/marked) (parsowanie Markdown) · [DOMPurify](https://github.com/cure53/DOMPurify) (sanityzacja) · html2pdf.js · html-docx.js · pdf.js. Biblioteki zewnętrzne są dołączone w katalogu `lib/`.

### Struktura projektu

```
.
├── main.js          # Proces główny Electrona (okna, menu, IPC, okna dialogowe plików)
├── preload.js       # Bezpieczny mostek udostępniany rendererowi (window.studio)
├── src/
│   └── index.html   # Renderer: interfejs, edytor, podgląd, logika eksportu
├── lib/             # Dołączone biblioteki (marked, DOMPurify, html2pdf, html-docx, pdf.js)
├── assets/          # Ikony aplikacji (icon.ico, icon.png, icon-source.jpg)
├── package.json
├── LICENSE
└── .gitignore
```

### Pierwsze kroki

Wymagania: [Node.js](https://nodejs.org/) 18+ oraz npm.

```bash
git clone https://github.com/Financialnews-ops/markdown-studio-by-htny.git
cd markdown-studio-by-htny
npm install
npm start
```

### Budowanie pliku wykonywalnego dla Windows

```bash
npm run package:win
```

Spakowana aplikacja trafi do folderu `Markdown Studio by HTNY Studios-win32-x64/` (pomijanego przez Git).

### Licencja

MIT © 2026 HTNY Studios — zobacz [LICENSE](LICENSE).
