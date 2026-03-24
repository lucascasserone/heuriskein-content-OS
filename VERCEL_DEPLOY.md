# Vercel Deploy

This project is ready to deploy on Vercel as a standard Next.js application.

## Runtime

- Framework preset: Next.js
- Node.js: 20.x or 22.x
- Install command: `npm install`
- Build command: `npm run build`
- Output setting: leave empty, Vercel detects Next.js automatically

## Environment Variables

No required environment variables are needed for the current version of the app.

If you add backend integrations later, use [.env.example](.env.example) as the reference for the variables to add in the Vercel project settings.

## Deploy Steps

1. Open Vercel and import the GitHub repository.
2. Confirm the detected framework is Next.js.
3. Keep the default install and build commands.
4. Select a Node.js version compatible with the app: 20.x or 22.x.
5. Deploy.

## Notes

- The project already passes `npm run build` locally.
- The app is currently static from Vercel's point of view and does not need extra server configuration.
- If you later add API secrets, define them in the Vercel dashboard instead of committing them to the repository.
