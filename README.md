# NOURIVA — Nutrition Recovery Resource & Knowledge Network

> **“Understand Nutrition. Support Better Recovery.”**

A production-quality digital knowledge network combining editorial wellness aesthetics, peer-informed nutrition documentation, video masterclasses, downloadable practical tools, and moderated community knowledge exchanges.

---

## 🌟 Key Features

1. **Editorial Wellness Design System**:
   - Palette: Warm Ivory (`#FAF8F5`), Deep Forest (`#1B382B`), Soft Sage (`#8FA89B`), Charcoal (`#1C2321`), Muted Sand (`#F5EFEB`), Restrained Amber (`#C97A3E`).
   - Typography: **DM Serif Display** for editorial headlines paired with **Inter** for crisp documentation and UI.
   - Restrained glassmorphic search/sticky navbar and smooth GSAP reveals.
   - Comprehensive Dark / Light mode switching with system preference detection and `localStorage` persistence.

2. **Searchable Knowledge & Documentation Hub**:
   - Multi-faceted filter system by Topic, Content Type, Difficulty, and Duration with live result counts.
   - Premium 3-column documentation reading experience with sticky table of contents (TOC) scrollspy, live reading-progress bar, callout alert boxes, and nutrition comparison tables.

3. **Video Learning Library & Masterclass Player**:
   - Interactive video player mockup with play/pause, seek scrubber, playback speed switcher (1.0x to 2.0x), and fullscreen toggle.
   - Clickable chapter index with active timestamp synchronization.
   - Searchable, interactive transcript with timestamp jump triggers.

4. **Downloadable Resources & Toolkits**:
   - Printable PDF worksheets, meal planning spreadsheets, hydration logs, and reference sheets.
   - Realistic download simulation engine generating summary text deliverables with live progress toasts.
   - Interactive preview modal with structured table layouts.

5. **Moderated Community Knowledge Exchanges**:
   - Discussion forum with topic filters and helpful upvote toggles.
   - Interactive "Start a Discussion" modal with `localStorage` persistence.
   - Thread view with verified responses and live reply composer.

6. **Global Search (`Cmd/Ctrl + K`)**:
   - Categorized live search modal indexing Knowledge, Videos, Resources, Discussions, and Glossary terms.
   - Real-time keyword highlight and recent search history tracking.

7. **A-Z Terminology Glossary**:
   - Sticky alphabetical bar (A-Z) with instant letter jump and live keyword filtering.

8. **Personalized Recommendations & Bookmarking**:
   - Interest topic selection during Signup dynamically re-ranks and highlights relevant knowledge cards with "Curated for You" badges.
   - Client-side bookmarking across all cards synced to the dedicated `saved.html` collection.

---

## 📁 Project Structure

```text
nouriva/
├── index.html                    # Editorial Homepage
├── explore.html                  # Searchable Knowledge & Documentation Library
├── knowledge-details.html        # Documentation Detail & Table of Contents
├── videos.html                   # Video Masterclass Library
├── video-details.html            # Video Player, Chapters & Searchable Transcript
├── resources.html                # Downloadable Toolkits & Preview Modals
├── community.html                # Discussion Board & New Thread Modal
├── discussion-details.html       # Thread Detail & Verified Response Stream
├── guides.html                   # Curated In-Depth Editorial Guides
├── saved.html                    # Saved Bookmarks Collection Hub
├── glossary.html                 # A-Z Nutrition & Recovery Terminology
├── about.html                    # Mission, Editorial Pillars & Advisory Board
├── contact.html                  # Contact Channels & FAQ Accordion
├── login.html                    # Account Login with Demo Presets
├── signup.html                   # Personalized Registration & Topic Chips
├── forgot-password.html          # Password Reset State Machine
├── 404.html                      # Custom Error Page
├── coming-soon.html              # Upcoming Features Page
│
├── assets/
│   ├── css/
│   │   ├── theme.css             # Light & Dark CSS Tokens & Color Palettes
│   │   ├── style.css             # Main Component & Typography Stylesheet
│   │   └── responsive.css        # Breakpoint Refinements & Mobile Drawer
│   │
│   └── js/
│       ├── theme.js              # Theme Controller (Light/Dark Mode)
│       ├── bookmarks.js          # Bookmarking System & Toasts
│       ├── search.js             # Global Search Modal (Cmd+K)
│       ├── knowledge.js          # Reading Progress & TOC Scrollspy
│       ├── video.js              # Video Player & Transcript Controller
│       ├── community.js          # Discussions, Upvotes & Reply Composer
│       ├── auth.js               # Demo Authentication & Interest Sync
│       └── main.js               # Mobile Drawer, GSAP Motion, Downloader
│
└── README.md
```

---

## 🛡️ Responsible Health Communication

> **Educational Notice:** NOURIVA provides evidence-informed educational resources and is not a substitute for professional medical evaluation, dietary prescription, or clinical treatment.

---

## 🚀 Running Locally

Open any of the `.html` files in a web browser or serve with a local development server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```
Navigate to `http://localhost:8000` in your browser.
