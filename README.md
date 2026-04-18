# assignment-2-api

Here is the api extension required for running the expo todo app.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run server.ts
```
### To generate the database: 

bunx drizzle-kit generate

bunx drizzle-kit migrate

### To fully reset your local database:

Delete the database file:
sqlite.db

bunx drizzle-kit migrate

