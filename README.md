# TaskFlow

A full-stack project and task management application built with Next.js and TypeScript.

## Features

- Google authentication with Auth.js
- Create, update, and delete projects and tasks
- Assign tasks to project members
- Task status, priority, and due dates
- Search, filtering, and pagination
- Role-based access control (OWNER, ADMIN, MEMBER)

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL (Neon)
- Prisma ORM
- Auth.js
- Zod

## Getting Started

```bash
npm install
npx prisma generate
npm run dev
```

Configure the required environment variables in `.env` before running the application.

## Environment Variables

```env
DATABASE_URL=""
AUTH_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

## License

Built for learning and portfolio purposes.
