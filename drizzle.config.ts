import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING!,
  },
  // The app only ever queries `public`. `private` is reached through the
  // entry-point functions, and roles/policies are owned by the Supabase CLI
  // migrations, so they must not be introspected into this package.
  schemaFilter: ["public"],
  entities: {
    roles: false,
  },
});
