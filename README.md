# Polling Application with QR Code Sharing

A full-stack web application that allows users to create polls, share them via unique links and QR codes, and collect votes. Built as part of the ALX AI for Developers program.

## Project Overview

This application provides a robust platform for creating and managing polls. Users can register, log in, create new polls with multiple options, and share these polls with others using unique links or generated QR codes. The system also displays real-time voting results, offering a comprehensive solution for interactive data collection.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Features

- **User Authentication**: Secure registration and login functionality using Supabase Auth.
- **Poll Management**: Create, view, and manage your polls.
- **Voting System**: Participate in polls and see real-time results.
- **Sharing Mechanism**: Generate unique shareable links and QR codes for each poll.
- **Results Display**: Visual presentation of vote counts and percentages.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or later)
- npm or yarn
- A Supabase project set up.

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd polling-alxdev
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Supabase**
    *   Create a new project on [Supabase](https://supabase.com/).
    *   Navigate to `Project Settings` -> `API` to find your `Project URL` and `Anon Key`.
    *   Set up your database schema. You will need tables for `users`, `polls`, `poll_options`, and `votes`. Refer to the `lib/db` directory for schema ideas or use the Supabase UI to create them.

4.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory of your project with the following variables, replacing the placeholders with your actual Supabase credentials:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_anon_key
    ```

### Running the Application Locally

1.  **Start the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

2.  **Open in browser**
    Open [http://localhost:3000](http://localhost:3000) in your web browser to access the application.

### Usage Examples

#### Creating a Poll

1.  **Register/Login**: Navigate to `/auth/register` or `/auth/login` to create an account or sign in.
2.  **Go to Create Poll**: Once logged in, click on the "Create New Poll" button or navigate to `/polls/create`.
3.  **Enter Details**: Provide a question for your poll and at least two options. You can add more options as needed.
4.  **Configure Settings (Optional)**: In the "Settings" tab, you can choose to allow multiple option selections, require users to be logged in to vote, or set an end date for the poll.
5.  **Create Poll**: Click "Create Poll" to finalize. You will be redirected to the poll's detail page.

#### Voting on a Poll

1.  **Access Poll**: Navigate to a poll's unique URL (e.g., `/polls/[id]`).
2.  **Select Option(s)**: Choose your preferred option(s). If the poll allows multiple selections, you can pick more than one.
3.  **Submit Vote**: Click the "Vote" button to cast your vote.
4.  **View Results**: After voting, the poll results will update in real-time, showing the distribution of votes.

### Running Tests

To run the unit and integration tests for the application, use the following command:

```bash
npm test
# or
yarn test
```

## AI Integration

This project demonstrates the integration of various AI tools throughout the development process:

- **Planning**: AI-assisted project structure and feature planning.
- **UI Generation**: AI-generated UI components and layouts.
- **Code Assistance**: AI-powered code completion and suggestions.
- **Debugging**: AI tools for error identification and resolution.

## Deployment

The application is deployed on Vercel. You can deploy your own instance by connecting your GitHub repository to Vercel and configuring the environment variables.

## License

This project is licensed under the MIT License - see the LICENSE file for details.