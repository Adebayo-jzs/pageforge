# PageForge Project Documentation

## 1. Project Overview
**PageForge** is an AI-powered website generator built with **Next.js 16 (App Router)** and **MongoDB**. The platform allows users to input natural language prompts, which are then analyzed and enhanced to generate production-ready, multi-page HTML websites.

These sites follow premium design principles (inspired by Stripe, Linear, and Vercel), utilizing a sophisticated system prompt to ensure high-quality typography, layouts, and aesthetics. The project is designed to generate complete, structured websites rather than just code snippets.

## 2. Architecture & Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Database:** MongoDB (via Mongoose)
- **Authentication:** NextAuth.js (v5 Beta)
- **Styling:** Tailwind CSS v4
- **Icons:** Hugeicons
- **Language:** TypeScript 

## 3. Core Models (Database Schema)

### `Project.ts` (models/Project.ts)
This is the core schema that stores the generated websites.
- `userId`: Identifier linking the project to a specific user.
- `prompt`: The initial user input used to generate the site.
- `html`: Optional string for single-page legacy sites.
- `pages`: An array of objects for multi-page sites, each containing:
  - `name`: Name of the page (e.g., Home, About).
  - `path`: URL path (e.g., `/`, `/about`).
  - `html`: The raw HTML generated for that specific page.
- `provider`: The LLM provider used to generate the site (Gemini or OpenAI).

## 4. AI Generation & Refinement

### Prompt Refinement Flow (`app/new/page.tsx`)
When a user submits a prompt, PageForge doesn't just generate a site immediately. It first analyzes the prompt:
1. **Analysis:** The AI identifies missing details or areas where user input could improve the design.
2. **Dynamic Fields:** Users are presented with a series of refinement steps (e.g., "What is your brand color?", "List 3 key features") to provide more context.
3. **Enhanced Generation:** These details are appended to the original prompt, resulting in a more personalized and accurate website.

### `prompts.ts` (lib/prompts.ts)
This file houses the `SYSTEM_PROMPT`, which acts as the instruction manual for the AI model:
- **Design Philosophy:** Mandates high-quality visual hierarchy, consistent spacing (8px system), and depth through gradients and shadows.
- **Constraints:** Ensures the model outputs **Strict JSON** containing an array of pages with fully valid HTML.
- **Internal Navigation:** Specifies that navigation links must use relative paths (e.g., `href="about"`) to maintain routing integrity within the platform.

## 5. Workspace & Rendering

### The Workspace (`app/project/[id]/page.tsx`)
The project workspace provides a powerful environment for viewing and tweaking generated sites:
- **Multi-Device Preview:** Switch between Desktop, Tablet, and Mobile views to ensure responsiveness.
- **Live Code Editor:** View and edit the generated HTML directly. The preview syncs automatically when switching back from the code tab.
- **Regeneration:** Update the entire design with a single click if the first result isn't perfect.
- **Export & Share:** Copy the public link to share the project or export the site as a standalone HTML file.

### Rendering Engine (`app/p/[id]/page.tsx`)
- **Sandboxed Execution:** Sites are rendered within an iframe using `srcDoc` for security and isolation.
- **Navigation Handling:** The workspace uses a `postMessage` system to capture clicks on internal links within the iframe, allowing the parent PageForge app to switch pages in the preview seamlessly.

## 6. Key Features
- **Dashboard:** A centralized hub to manage projects, view recents, and start new concepts.
- **Authentication:** Secure user login and registration powered by NextAuth.
- **Multi-Paged AI Websites:** Capable of generating interconnected web pages from a single text prompt.
- **Dynamic Site Hosting:** Generated sites are instantly viewable via custom dynamic routes (`/p/[id]`).

## Conclusion
PageForge elegantly bridges the gap between natural language prompts and polished web applications by wrapping a strictly controlled LLM prompt system inside a modern Next.js + MongoDB stack.
