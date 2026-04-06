# CASSETTE

**A retro-modern music player that runs entirely in your browser.**

Upload your own audio files, sculpt the sound with real-time effects, manage your album art, and keep everything saved — no account, no server, no cloud.

---

## What it does

CASSETTE is a local-first media player built with Vue.js. Everything runs client-side. Your files stay on your machine.

- Upload and play **MP3, WAV, OGG, FLAC, and MP4** files from your device
- Apply real-time audio effects: **speed, bass boost, reverb, and pitch shift**
- Manage a gallery of **album art** and link covers to individual tracks
- Watch a live **EQ frequency visualizer** while music plays
- All tracks, metadata, and artwork **persist across sessions** via IndexedDB

---

## Getting started

### Requirements

- [Bun](https://bun.sh/) — recommended
- or [Node.js](https://nodejs.org/) with npm as a fallback

### Installation

```bash
git clone https://github.com/SaputraTanuwijaya/cassette.git
cd cassette
./start.sh
```

The script will detect whether you have Bun or npm, install dependencies automatically, and start the dev server.

Open your browser to **http://localhost:5173**

> **Windows users:** If `./start.sh` doesn't run, open Git Bash or WSL and try again. PowerShell may require `bash start.sh` instead.

### Optional: use a custom local domain

If you'd prefer `http://cassette.local:5173` instead of localhost:

1. Open Notepad as Administrator
2. Open `C:\Windows\System32\drivers\etc\hosts`
3. Add this line at the bottom: `127.0.0.1 cassette.local`
4. Save the file and restart your browser

---

## How to use it

**1. Add your music**
Go to the Media page and click **+ ADD ASSETS** to upload audio or video files from your device. Files are stored locally in your browser's IndexedDB — nothing is uploaded anywhere.

**2. Edit track details**
Click any track to open the Track Station. Edit the title, artist name, and description directly inline.

**3. Add album art**
Go to the Gallery page and upload your cover images. Once uploaded, open any track in the Track Station and click **CHANGE THUMBNAIL** to link a cover to that track.

**4. Shape the sound**
Use the Effects Panel sliders to adjust speed, bass, reverb, and pitch in real time. Hit **SNAPSHOT** to save those settings to the current track so they restore automatically next time.

**5. Come back anytime**
Your library, artwork, and effect settings are saved. Refresh the page, close the tab, restart the server — everything will be waiting for you.

---

## Tech stack

|              |                                                   |
| ------------ | ------------------------------------------------- |
| Framework    | Vue.js 3 (Composition API)                        |
| Styling      | Tailwind CSS v4                                   |
| Audio engine | Web Audio API + Tone.js                           |
| Storage      | IndexedDB (media files) + localStorage (metadata) |
| Bundler      | Vite                                              |

---

## Project Notice

This project is an **independent implementation** created by me
for learning and teaching purposes related to
courses at **Bina Nusantara University**.

The problem scenario is inspired by an academic case.
All source code, architecture, and implementation
are my original work.

This repository is public for **portfolio and educational viewing only**.
Reuse for academic submission or grading purposes
is **strongly discouraged**.

## - Saputra Tanuwijaya ( AT )
