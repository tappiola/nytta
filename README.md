# Nytta

Dream of fresh hot croissants you can buy daily just round the corner? Or wish you didn't need to travel to city center every you need a barbershop?

Let businesses know what amenities you are missing in your local area!

Tech stack:
- React + Next.JS
- Prisma ORM
- Auth0 for authentication
- MapboxGL for map

## Live demo

Demo website: <https://nytta.tappiola.co.uk/>

## Running locally

Prerequisites:
1. Postgres DB instance. Docker could be used to create DB locally:
```bash
docker run --name nytta-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres 
```
2. Auth0 credentials (copy from the Auth0 portal)
3. MapboxGL token

Create `.env` file using `.env.example` as template.

Run frontend:
```bash
npm i
npm run dev
```

Open in browser: <http://localhost:3000>
