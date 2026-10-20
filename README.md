# Kala Yatra: A Timeline of Indian Art

> **"Kala Yatra"** (The Journey of Art) is an interactive digital exhibition chronicling 5,000 years of Indian art, architecture, and visual culture. Built as a university course assignment submission, this project invites learners to travel through history from the lost-wax bronze foundries of Mohenjo-daro to the modernist canvases of post-colonial India.

---

## 🌟 Project Highlights

- **Zero-Dependency Architecture:** Pure HTML5, modern CSS3, and vanilla JavaScript. No build step, no bundler, no npm install required. Simply open `index.html` in any browser.
- **14 Masterpieces across 6 Historic Epochs:** Features 12 canonical syllabus works plus 2 bonus additions (Amrita Sher-Gil & Living Folk Traditions).
- **Stylized Virtual Replicas:** Hand-crafted, responsive vector illustrations (SVGs) capturing recognizable silhouettes, iconography, and textures of each original work.
- **Dual-View Modal Deep Dive:** Each artifact card opens an educational side-panel featuring:
  - Vector Replica vs Archival Photograph toggle (Wikimedia Commons public domain photos)
  - Quick Facts Matrix (Period, Origin, Medium, Artist/Culture)
  - Historical context written in simple, clear English
  - **"Why It Matters"** callout box highlighting historical significance
  - **"Did You Know?"** fun fact
  - Chronological Previous & Next navigation buttons
- **Dual Responsive Layouts:**
  - **Desktop:** Panoramic horizontal journey with alternating cards, central continuous gradient axis line, era markers, drag-to-scroll, and mouse-wheel support.
  - **Mobile / Tablet:** Fluid vertical thread layout with touch-friendly cards and clear chronological progression.
  - **Layout Switcher:** Users can toggle between Horizontal Pan and Vertical Story modes at any time.
- **Real-Time Filtering & Search:** Filter by epoch (*Ancient, Classical, Medieval, Mughal & Regional, Colonial, Modern, Living Traditions*) or search dynamically by keyword, artist, region, or medium.
- **Indian Ambiance Sound Drone:** Built-in acoustic drone synthesized dynamically via the Web Audio API (Tanpura-inspired *Sa-Pa* harmonic resonance at 136.1 Hz / 204.1 Hz) without requiring external audio files.
- **Accessibility & Motion Comfort:** Full keyboard support (`←` / `→` arrow keys, `Esc`, `Tab`, `Enter`), ARIA roles, semantic landmarks, high-contrast palette, and strict respect for `prefers-reduced-motion`.

---

## 📁 Project Directory Structure

```text
/
├── index.html               # Semantic layout, hero, filters, timeline & modal dialog
├── css/
│   └── style.css            # Museum design system, typography, animations & responsive media queries
├── js/
│   ├── data.js              # COMPLETE artifact database (14 curated objects)
│   └── main.js              # Timeline rendering, filter/search logic, modal interactions & audio
├── assets/
│   ├── svgs/                # 14 custom vector replicas
│   │   ├── 01-dancing-girl.svg
│   │   ├── 02-ashoka-capital.svg
│   │   ├── 03-sanchi-torana.svg
│   │   ├── 04-ajanta-padmapani.svg
│   │   ├── 05-sarnath-buddha.svg
│   │   ├── 06-kailasa-temple.svg
│   │   ├── 07-chola-nataraja.svg
│   │   ├── 08-konark-wheel.svg
│   │   ├── 09-mughal-miniature.svg
│   │   ├── 10-kangra-miniature.svg
│   │   ├── 11-ravi-varma-shakuntala.svg
│   │   ├── 12-bharat-mata.svg
│   │   ├── 13-amrita-three-girls.svg
│   │   └── 14-folk-warli-madhubani.svg
│   └── patterns/
│       └── mandala-bg.svg   # Subtle animated background mandala motif
└── README.md                # Comprehensive documentation, setup, and citations
```

---

## 🚀 How to Run the Project

### Option 1: Double-Click (Simplest)
Because the application uses classic zero-dependency script architecture (`window.ART_DATA`), you do **not** need a local web server:
1. Navigate to the project folder.
2. Double-click **`index.html`**.
3. It opens instantly in your default web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Run with a Local Web Server
If you prefer running through a local development server:
```bash
# Using Python 3:
python -m http.server 8000

# Using Node.js (npx):
npx serve .

# Or using VS Code:
Right-click index.html -> "Open with Live Server"
```
Then visit: `http://localhost:8000`

---

## ✍️ How to Add a New Artifact

All artifact data lives in **`js/data.js`**. Teammates can add new historical artifacts or modify existing text without touching any code in `index.html` or `main.js`.

### Step 1: Open `js/data.js`
Scroll to the end of the `window.ART_DATA` array and append a new object:

```javascript
{
  id: "chola-bronze-somaskanda",
  title: "Somaskanda Bronze",
  period: "Later Chola Dynasty",
  era: "Medieval", // Options: "Ancient", "Classical", "Medieval", "Mughal & Regional", "Colonial", "Modern", "Living Traditions"
  dateLabel: "c. 12th Century CE",
  sortYear: 1150,  // Numeric year for chronological ordering (negative for BCE)
  region: "Tiruvalangadu, Tamil Nadu",
  medium: "Lost-wax cast bronze",
  artistOrCulture: "Chola Sthapatis",
  shortSummary: "A compassionate portrayal of Shiva and Uma seated with infant Skanda.",
  fullDescription: "Paragraph 1 of historical context explaining the cultural and political milieu...\n\nParagraph 2 describing visual iconography, technique, and spiritual significance.",
  whyItMatters: "Exemplifies the intimate domestic grace within Chola temple iconography.",
  funFact: "Processional bronzes like this were paraded through temple towns so all devotees could receive darshan!",
  visual: "assets/svgs/your-new-image.svg",
  photoUrl: "https://upload.wikimedia.org/.../your_photo.jpg",
  imageCredit: "Stylized replica · Government Museum, Chennai"
}
```

### Step 2: Add your image asset
Place your `.svg` or `.png` into the `assets/svgs/` folder, matching the `visual` path you specified.

### Step 3: Refresh the browser
The timeline dynamically detects your new artifact, renders its card, adds it to the progress meter, updates filter counts, and includes it in the chronological navigation!

---

## 🌐 Free Deployment Guide

### Deploying to GitHub Pages (Recommended)
1. Initialize a git repository and push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Kala Yatra art timeline"
   git branch -M main
   git remote add origin https://github.com/<your-username>/kala-yatra.git
   git push -u origin main
   ```
2. On GitHub, go to your repository **Settings** > **Pages** (under Code and automation).
3. Under **Branch**, select `main` and folder `/ (root)`.
4. Click **Save**. Your site will be live within 60 seconds at:  
   `https://<your-username>.github.io/kala-yatra/`

### Deploying to Netlify (Drag-and-Drop)
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag the entire project folder directly into the browser window.
3. Your project is live with a free SSL custom URL in less than 10 seconds!

---

## 🎨 Design System & Palette

| Token | Hex Code | Visual Meaning |
| :--- | :--- | :--- |
| `--bg-primary` | `#FAF6EF` | Warm museum parchment ground |
| `--text-primary` | `#1F2A44` | Ajanta Indigo ink |
| `--brand-terracotta` | `#C65D3B` | Harappan kiln-fired terracotta |
| `--brand-gold` | `#E0A23A` | Sacred saffron & temple gold |
| `--brand-teal` | `#2F6F6B` | Mineral lapis lazuli & verdigris |
| `--era-medieval` | `#8C5E3C` | Antique Chola lost-wax bronze |
| `--era-mughal` | `#23496D` | Imperial court lapis lazuli |

- **Headings Font:** `Playfair Display` (Serif)
- **Body Font:** `Inter` (Sans-Serif)

---

## 🏛️ Artifact Index & Academic Citations

| # | Artifact | Epoch | Date | Current Location / Citation |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Dancing Girl** | Ancient | c. 2500 BCE | National Museum, New Delhi (Excavated Mohenjo-daro 1926) |
| **2** | **Lion Capital of Ashoka** | Ancient | c. 250 BCE | Sarnath Archaeological Museum (National Emblem of India) |
| **3** | **Sanchi Stupa Toranas** | Classical | c. 1st C. BCE | UNESCO World Heritage Site, Raisen, Madhya Pradesh |
| **4** | **Ajanta Cave Frescoes (Padmapani)** | Classical | c. 5th C. CE | UNESCO World Heritage Site, Ajanta Cave 1, Maharashtra |
| **5** | **Standing Buddha of Sarnath** | Classical | 5th C. CE | Sarnath Archaeological Museum, Uttar Pradesh |
| **6** | **Ellora Kailasa Temple** | Medieval | 8th C. CE | UNESCO World Heritage Site, Ellora Cave 16, Maharashtra |
| **7** | **Chola Nataraja Bronze** | Medieval | c. 11th C. CE | Government Museum, Chennai / LACMA Collection |
| **8** | **Konark Sun Temple Wheel** | Medieval | 13th C. CE | UNESCO World Heritage Site, Konark, Odisha |
| **9** | **Mughal Miniature Painting** | Mughal & Reg. | 16th C. CE | Victoria & Albert Museum / National Museum, New Delhi |
| **10** | **Kangra Miniature: Radha & Krishna** | Mughal & Reg. | 18th C. CE | Government Museum & Art Gallery, Chandigarh |
| **11** | **Raja Ravi Varma: Shakuntala** | Colonial | 1898 CE | Sri Chitra Art Gallery, Thiruvananthapuram, Kerala |
| **12** | **Abanindranath Tagore: Bharat Mata** | Modern | 1905 CE | Victoria Memorial Hall, Kolkata, West Bengal |
| **13** | **Amrita Sher-Gil: Three Girls** | Modern | 1935 CE | National Gallery of Modern Art (NGMA), New Delhi |
| **14** | **Living Traditions: Madhubani & Warli** | Folk | Living | Mithila (Bihar) & Warli Guilds (Maharashtra) |

---

## 👥 Course & Academic Submission Information

- **Course:** History of Indian Art, Architecture & Visual Culture
- **Project Title:** *Kala Yatra: An Interactive Digital Timeline of Indian Art*
- **Project Team:** Group 4
- **Group Members & Registration Numbers:**
  1. **Priyanshu Kumar** — Reg. No: `RA2411003010752` *(Historical Curation & Epoch Research)*
  2. **Muskan Kumari** — Reg. No: `RA2411003010756` *(Art History Analysis & Documentation)*
  3. **Abhishek Jaiswal** — Reg. No: `RA2411003010764` *(Front-End Architecture & UI/UX Design)*
  4. **Prakhar Pandey** — Reg. No: `RA2411003010737` *(Vector Replicas & Interactive Systems)*
- **Submission Date:** October 2026
- **License:** Educational Fair Use & Creative Commons Attribution (CC BY 4.0)
