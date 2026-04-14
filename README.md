# ⚡ PageForge

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC)](https://tailwindcss.com/)

AI-powered landing page generator — describe your product, get a stunning, production-ready HTML page in seconds.

PageForge is built with Next.js 16 and powered by Gemini AI. Simply describe your product and get a complete, beautifully designed, responsive HTML landing page. Features a live preview, built-in code editor, and one-click download.

## Features

- 🤖 **AI-Powered Generation** — Describe your product in plain English and get a complete landing page
- 🔍 **Prompt Refinement** — AI-driven analysis to capture critical brand and product details
- 👁 **Live Preview** — See your generated page rendered in real-time with device toggles (Desktop/Tablet/Mobile)
- ✏️ **Code Editor** — View, edit, and tweak the generated HTML with line numbers and auto-sync
- 📋 **Copy & Download** — Copy code to clipboard or download as a standalone HTML file
- 🔄 **Regeneration** — Refine and update the entire design with a single click
- 📱 **Responsive Output** — Generated pages are mobile-friendly out of the box

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** HugeIcons
- **AI:** Google Gemini 2.0 / OpenAI GPT-4o
- **Database:** MongoDB (via Mongoose)

## Getting Started

### Prerequisites

- Node.js 18+
- A Gemini API key ([get one here](https://aistudio.google.com/apikey))
- Optionally, an OpenAI API key

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/Adebayo-jzs/pageforge.git
   cd pageforge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## How It Works

1. Enter a product description in the sidebar
2. Click **Generate Landing Page**
3. The AI creates a complete, self-contained HTML file with:
   - Sticky navbar, hero section, features grid, testimonials, pricing, CTA, and footer
   - Custom Google Font, CSS animations, responsive design
   - Inline SVG icons and gradient accents
4. Preview the result, edit the code, or download the HTML

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines and our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.