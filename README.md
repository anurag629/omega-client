# Omega Client

A Next.js frontend for the Codercops Omega platform, designed to generate mathematical animations using AI.

## Features

- User authentication with JWT tokens
- Waiting list system for new users
- Email verification
- AI-powered Manim script generation
- Script history and management
- Video rendering and playback

## Tech Stack

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Animations**: Framer Motion
- **API Client**: Axios
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Codercops Omega backend running

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Project Structure

- `src/pages/` - Next.js pages
- `src/components/` - React components
  - `ui/` - Reusable UI components
  - `layout/` - Layout components (Layout, Navbar, Footer)
- `src/styles/` - Global styles
- `src/lib/` - Utilities and API client
- `src/hooks/` - Custom React hooks
- `src/store/` - Zustand state stores

## Authentication Flow

1. Users sign up for the waiting list
2. Admin approves users and sends invitation emails
3. Users register with invitation codes
4. Users verify email addresses
5. Admin approves user accounts
6. Users can log in and use the platform

## License

Copyright © 2023 Codercops. All rights reserved. "# omega-client" 
