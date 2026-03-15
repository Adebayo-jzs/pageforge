# ⚡ PageForge

AI-powered landing page generator — describe your product, get a stunning, production-ready HTML page in seconds.

PageForge is built with Next.js and powered by Gemini AI. Simply describe your product and get a complete, beautifully designed, responsive HTML landing page. Features a live preview, built-in code editor, and one-click download.

## Features

- 🤖 **AI-Powered Generation** — Describe your product in plain English and get a complete landing page
- 👁 **Live Preview** — See your generated page rendered in real-time
- ✏️ **Code Editor** — View, edit, and tweak the generated HTML with line numbers
- 📋 **Copy & Download** — Copy code to clipboard or download as an HTML file
- 🔄 **Multi-Provider Fallback** — Gemini first, OpenAI as backup
- 📱 **Responsive Output** — Generated pages are mobile-friendly out of the box

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** HugeIcons
- **AI:** Google Gemini 2.5 Flash / OpenAI GPT-4o

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

3. Create a `.env.local` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here   # optional
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

## License

MIT