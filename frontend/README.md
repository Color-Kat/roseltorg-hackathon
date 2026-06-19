# Frontend microservice

**Tech stack**: Nextjs 15 with PPR, React 19, MobX, Tanstack Query, TailwindCSS 4, HeroUI, react-icons
**Architecture**: FSD (Feature-Sliced Design)

### Getting started
You can run the app using docker compose like it shown in the root [README.md](../../README.md).
Or for local development you can run it manually outside the docker:
- Run backend using docker compose
- `cd apps/web`
- `mv .env.example .env` and fill in the required environment variables
- `npm i`
- `npm run dev` or `npm run build && npm run build:sw && npm run start` for production build

### TODO: architecture overview