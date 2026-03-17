# PageForge Project Documentation

## 1. Project Overview
**PageForge** is an AI-powered website generator built with **Next.js 14+ (App Router)** and **MongoDB**. The platform allows users to input natural language prompts, and it leverages large language models (LLMs) to generate production-ready, multi-page HTML websites. 

These sites follow premium design principles (similar to Stripe or Vercel), utilizing a predefined system prompt to ensure high-quality typography, layouts, and aesthetics. The project is designed to generate complete, structured websites rather than just code snippets.

## 2. Architecture & Tech Stack
- **Framework:** Next.js (App Router)
- **Database:** MongoDB (via Mongoose)
- **Authentication:** NextAuth.js (v5 Beta)
- **Styling:** Tailwind CSS (PostCSS)
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
- `provider`: The LLM provider used to generate the site.

## 4. AI Generation Logic

### `prompts.ts` (lib/prompts.ts)
This file houses the `SYSTEM_PROMPT`, which acts as the instruction manual for the AI model. Key highlights include:
- **Design Philosophy:** Mandates high-quality visual hierarchy, consistent spacing (8px system), and depth through gradients and shadows.
- **Constraints:** Ensures the model outputs **Strict JSON** containing an array of pages with fully valid HTML. No markdown formatting is allowed. 
- **Component Rules:** Specifies how Navbars, Hero sections, Features, Pricing, and Footers should be constructed and styled. The CSS must be embedded in a single `<style>` tag, using predefined CSS variables for colors.

## 5. Routing and Rendering

### `app/p/[id]/page.tsx`
This dynamic Next.js route is responsible for rendering the generated user sites. 
- **Process:** It retrieves the `id` from the URL, queries the MongoDB database for the corresponding `Project`, and finds the correct page (defaulting to the home page `/`).
- **Rendering:** It injects the raw AI-generated HTML into the DOM via Next.js's `dangerouslySetInnerHTML`. 
- **Asset Links:** It dynamically modifies the `<head>` of the HTML to include a `<base href="/p/[id]/" />` tag, ensuring relative links within the AI-generated site work seamlessly within the PageForge platform's routing system.

## 6. Key Features
- **Authentication:** Secure user login and registration powered by NextAuth.
- **Multi-Paged AI Websites:** Capable of generating interconnected web pages from a single text prompt.
- **Dynamic Site Hosting:** Generated sites are instantly viewable and interactable via custom dynamic routes (`/p/[id]`).

## Conclusion
PageForge elegantly bridges the gap between natural language prompts and polished web applications by wrapping a strictly controlled LLM prompt system inside a modern Next.js + MongoDB stack.
