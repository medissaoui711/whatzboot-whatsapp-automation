# WhatzBoot Frontend

This directory contains the Next.js frontend for the WhatzBoot application.

## Tech Stack

-   **Framework:** Next.js (with App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **State Management:** React Context API
-   **UI Components:** Custom reusable components
-   **Data Fetching:** Fetch API (in a dedicated service layer)

## Getting Started

### 1. Install Dependencies

Navigate to this directory and install the required npm packages.

```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Create a new file named `.env.local` in this (`frontend`) directory by copying the example file:

```bash
cp .env.example .env.local
```

Now, open `.env.local` and add the URL for your backend API server.

```env
# The full URL to your running backend API
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

### 3. Run the Development Server

Start the Next.js development server.

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `/src/app`: Contains all the pages and layouts, following the Next.js App Router convention.
    -   `/(auth)`: Routes for authentication (login, register).
    -   `/(dashboard)`: All protected routes and features of the application.
    -   `/(marketing)`: Public-facing pages like the homepage.
-   `/src/components`: Reusable React components.
    -   `/ui`: Core, unstyled UI elements (Button, Card, etc.).
    -   `/common`: Shared layout components (Sidebar, Header, etc.).
    -   `/features`: Components specific to a particular feature (e.g., a modal for the Team Inbox).
-   `/src/services`: Handles all API communication with the backend.
-   `/src/contexts`: Global state management using React Context.
-   `/src/hooks`: Custom reusable hooks.
-   `/src/types`: TypeScript type and interface definitions.
-   `/src/styles`: Global CSS styles.
-   `/public`: Static assets like images and fonts.

## Deployment

This application is optimized for deployment on [Vercel](https://vercel.com/), the creators of Next.js.
