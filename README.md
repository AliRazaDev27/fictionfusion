# FictionFusion

## A Personal Media Hub

FictionFusion is a personal media hub designed to keep track of all your favorite books, movies, music, and shows in one place. This is a personal project, and as such, there is no public registration.

## Live Demo

[Link to live demo](https://fictionfusion.vercel.app)

## Features

- **Dashboard:** A comprehensive overview of your media library.
- **Media Tracking:** Keep track of books, movies, music, and shows you've consumed or want to watch.
- **Watchlist:** A dedicated watchlist to manage your to-watch list.
- **Personal Lists:** Create and manage custom lists of your favorite media.
- **Search:** Easily search for new media to add to your library.
- **Rating System:** Rate your media to keep track of your favorites.
- **Music Player:** A built-in music player to listen to your favorite tracks.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Database:** [Vercel Postgres](https://vercel.com/storage/postgres)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/FictionFusion.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a `.env.local` file in the root of the project and add the following environment variables:

   ```env
   POSTGRES_URL=
   POSTGRES_PRISMA_URL=
   POSTGRES_URL_NO_SSL=
   POSTGRES_URL_NON_POOLING=
   POSTGRES_USER=
   POSTGRES_HOST=
   POSTGRES_PASSWORD=
   POSTGRES_DATABASE=

   NEXTAUTH_URL=
   NEXTAUTH_SECRET=

   UPLOAD_CARE_PUBLIC_KEY=
   UPLOAD_CARE_SECRET_KEY=

   TMDB_API_KEY=
   ```

4. Run the development server
   ```sh
   npm run dev
   ```

## License

Distributed under the MIT License. See `LICENSE` for more information.