# User List App

This is a user listing app for a test task for [camplight.net](https://camplight.net/). It has a basic CRUD functionality:
- Listing users with pagination
- Adding new users
- Deleting users
- Searching for users using name

https://github.com/user-attachments/assets/8f535f65-3463-4f3c-a46f-8328ea3f8c62

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Design Decisions
- I utilized Next.js for this project (a react framework) because I'm familiar with react but I haven't tried Next.js before and wanted to try it for this test. It allows things like SSR(server side rendering), although I'm not particularly using this feature now it might be useful in the future. Next.js works out of the box with Vercel and it was easy to deploy.
- I choose TypeScript because I wanted to get type safety right away and wanted to make the code safe.
- For styling I decided to use Tailwind css.
- I utilized Firebase for storing the data. I wanted to build this app quickly and I didn't want to build my own backend and deploy it somewhere.
- I utilized components to break down this simple app into manageable pieces, I have components for:
    * Listing
    * Form
    * Search Bar
- The project is deployed on Vercel and the public url is [this](https://user-list-app-one.vercel.app/). The good thing is that everytime I make change to this repository the code is automatically deployed. 
