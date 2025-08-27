# Polling Application with QR Code Sharing

A full-stack web application that allows users to create polls, share them via unique links and QR codes, and collect votes. Built as part of the ALX AI for Developers program.

## Features

- **User Authentication**: Register and login functionality using Supabase Auth
- **Poll Management**: Create, view, edit, and delete polls
- **Voting System**: Vote on polls with real-time results
- **Sharing Mechanism**: Generate unique shareable links and QR codes for each poll
- **Results Display**: Visual presentation of vote counts and percentages

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Project Structure

```
├── app/                  # Next.js App Router
│   ├── api/              # API Routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── polls/        # Poll management endpoints
│   │   └── share/        # Sharing functionality endpoints
│   ├── auth/             # Authentication pages
│   ├── polls/            # Poll management pages
│   └── share/            # Poll sharing pages
├── components/           # React components
│   ├── auth/             # Authentication components
│   ├── polls/            # Poll-related components
│   └── share/            # Sharing-related components
├── lib/                  # Utility functions and types
│   ├── db/               # Database client and helpers
│   ├── qrcode/           # QR code generation utilities
│   ├── types/            # TypeScript type definitions
│   └── utils/            # General utility functions
├── public/               # Static assets
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd polling-alxdev
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## AI Integration

This project demonstrates the integration of various AI tools throughout the development process:

- **Planning**: AI-assisted project structure and feature planning
- **UI Generation**: AI-generated UI components and layouts
- **Code Assistance**: AI-powered code completion and suggestions
- **Debugging**: AI tools for error identification and resolution

## Deployment

The application is deployed on Vercel. You can deploy your own instance by connecting your GitHub repository to Vercel and configuring the environment variables.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
