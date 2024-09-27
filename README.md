# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## HR Administration System

This project is built using the T3 Stack (Next.js, Prisma, Supabase, Tailwind CSS, NextAuth, and tRPC) for managing employees and departments.

Setup Instructions

## 1. Install Dependencies

Run the following command to install all required dependencies:

bash
Copy code
npm install

## 2. Configure Environment Variables

Create a .env file in the root of your project with the following contents:

env
Copy code
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
NEXTAUTH_SECRET=your-nextauth-secret
DATABASE_URL=your-database-url
Replace the values with your actual Supabase and database details.

## 3. Prisma Setup

To initialize the database, you’ll need to apply the Prisma migrations the :

bash

## Copy code:

model Employee {
id Int @id @default(autoincrement())
firstName String
lastName String
telephoneNumber String
email String @unique
manager Employee? @relation("EmployeeManager", fields: [managerId], references: [id])
managerId Int?
subordinates Employee[] @relation("EmployeeManager")
status String
departments EmployeeDepartment[] // Use the join table for many-to-many relation
}

model Department {
id Int @id @default(autoincrement())
name String
status String
employees EmployeeDepartment[] // Use the join table for many-to-many relation
}

// Join table for Employee and Department many-to-many relation
model EmployeeDepartment {
employee Employee @relation(fields: [employeeId], references: [id])
employeeId Int
department Department @relation(fields: [departmentId], references: [id])
departmentId Int

    @@id([employeeId, departmentId]) // Composite primary key to avoid duplicates

}

npx prisma migrate dev --name init
This command will create the necessary tables in your database for employees and departments.

## 4. Supabase Authentication Setup

Make sure that your Supabase project is properly set up for authentication. You can enable email login or social login (e.g., Google). Ensure you have the following credentials in your .env file:

SUPABASE_URL:"Your Supabase project’s URL."
SUPABASE_ANON_KEY:"The public API key from Supabase."

## 5. Run the Development Server:

Once the environment variables and database are configured, start the development server by running:

bash

## Copy code:

npm run dev
This will start the server, and your app will be available at http://localhost:3000.

Authentication
You are using Supabase as your authentication backend. Ensure that Supabase Auth is configured with email or social logins (Google, GitHub, etc.).

## 6. NextAuth Configuration:

## In src/app/api/auth/[...nextauth]/route.ts:

typescript

## Copy code:

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter"; // Correct import
import { env } from "~/env";
import { db } from "~/server/db"; // Import Prisma db

export const authOptions: NextAuthOptions = {
adapter: PrismaAdapter(db),
secret: env.NEXTAUTH_SECRET,
providers: [
// Add OAuth providers here, like Google or GitHub
],
session: {
strategy: "jwt",
},
};

export const getServerAuthSession = () => getServerSession(authOptions);
Make sure Supabase is properly configured, and you have OAuth providers (e.g., Google, GitHub) set up if necessary.

## Managing Employees and Departments

## The system allows you to:

## View, Create, Edit, and Deactivate Employees.

## View, Create, Edit, and Deactivate Departments.

## 7.Employees List Page:

## Path: src/pages/employees.tsx

## Copy code:

import { useSession } from 'next-auth/react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Employees() {
const { data: session } = useSession();
const router = useRouter();
const { data: employees } = api.employee.getAll.useQuery();

useEffect(() => {
if (!session) router.push('/login');
}, [session, router]);

if (!session) return <p>Loading...</p>;

return (

<div>
<h1>Employee List</h1>
<Link href="/employees/create">
<button className="btn">Create Employee</button>
</Link>
<ul>
{employees?.map(employee => (
<li key={employee.id}>
{employee.firstName} {employee.lastName} - {employee.email}
<Link href={`/employees/edit/${employee.id}`}>
<button className="btn">Edit</button>
</Link>
</li>
))}
</ul>
</div>
);
}

## 8.Employee Create Page:

## Path: src/pages/employees/create.tsx

## Copy code

import { useRouter } from 'next/router';
import { api } from '~/trpc/react';
import { useState } from 'react';

export default function CreateEmployee() {
const router = useRouter();
const createMutation = api.employee.create.useMutation();

const [formData, setFormData] = useState({
firstName: '',
lastName: '',
phone: '',
email: '',
status: 'Active',
});

const handleSubmit = async (e) => {
e.preventDefault();
await createMutation.mutateAsync(formData);
router.push('/employees');
};

return (

<div>
<h1>Create Employee</h1>
<form onSubmit={handleSubmit}>
<input
type="text"
placeholder="First Name"
value={formData.firstName}
onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
/>
<input
type="text"
placeholder="Last Name"
value={formData.lastName}
onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
/>
<input
type="text"
placeholder="Phone"
value={formData.phone}
onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
/>
<input
type="email"
placeholder="Email"
value={formData.email}
onChange={(e) => setFormData({ ...formData, email: e.target.value })}
/>
<select
value={formData.status}
onChange={(e) => setFormData({ ...formData, status: e.target.value })} >
<option value="Active">Active</option>
<option value="Inactive">Inactive</option>
</select>
<button type="submit" className="btn">Create Employee</button>
</form>
</div>
);
}

## 9.Employee Edit Page and Create Page:

## Path: src/pages/employees/[id].tsx

## Copy code

import { useRouter } from 'next/router';
import { api } from '~/trpc/react';
import { useState, useEffect } from 'react';

export default function EditEmployee() {
const router = useRouter();
const { id } = router.query;
const { data: employee, isLoading } = api.employee.getById.useQuery(Number(id), { enabled: !!id });
const updateMutation = api.employee.update.useMutation();

const [formData, setFormData] = useState({
firstName: '',
lastName: '',
phone: '',
email: '',
status: 'Active',
});

useEffect(() => {
if (employee) {
setFormData({
firstName: employee.firstName,
lastName: employee.lastName,
phone: employee.phone,
email: employee.email,
status: employee.status,
});
}
}, [employee]);

const handleSubmit = async (e) => {
e.preventDefault();
await updateMutation.mutateAsync({ ...formData, id: Number(id) });
router.push('/employees');
};

if (isLoading) return <p>Loading...</p>;

return (

<div>
<h1>Edit Employee</h1>
<form onSubmit={handleSubmit}>
<input
type="text"
placeholder="First Name"
value={formData.firstName}
onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
/>
<input
type="text"
placeholder="Last Name"
value={formData.lastName}
onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
/>
<input
type="text"
placeholder="Phone"
value={formData.phone}
onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
/>
<input
type="email"
placeholder="Email"
value={formData.email}
onChange={(e) => setFormData({ ...formData, email: e.target.value })}
/>
<select
value={formData.status}
onChange={(e) => setFormData({ ...formData, status: e.target.value })} >
<option value="Active">Active</option>
<option value="Inactive">Inactive</option>
</select>
<button type="submit" className="btn">Update Employee</button>
</form>
</div>
);
}

## Path: src/pages/employees/create.tsx

## Copy code

import { useRouter } from 'next/router';
import { api } from '~/trpc/react';
import { useState } from 'react';
import Button from '~/app/\_components/Button';

export default function CreateDepartment() {
const router = useRouter();
const createMutation = api.department.create.useMutation();

const [formData, setFormData] = useState({
name: '',
status: 'Active',
});

const handleSubmit = async (e) => {
e.preventDefault();
await createMutation.mutateAsync(formData);
router.push('/departments'); // Redirect after creating
};

return (

<div>
<h1>Create Department</h1>
<form onSubmit={handleSubmit}>
<input
type="text"
placeholder="Department Name"
value={formData.name}
onChange={(e) => setFormData({ ...formData, name: e.target.value })}
/>
<select
value={formData.status}
onChange={(e) => setFormData({ ...formData, status: e.target.value })} >
<option value="Active">Active</option>
<option value="Inactive">Inactive</option>
</select>
<button type="submit" className="btn">Create Department</button>
<Button type="submit">Create Employee</Button>
</form>
</div>
);
}

## 10.Department List Page and Create Page:

## Path: src/pages/departments/[id].tsx

## Copy code

import { useRouter } from 'next/router';
import { api } from '~/trpc/react';
import { useState } from 'react';

export default function EditDepartment() {
const router = useRouter();
const { id } = router.query; // Get department id from URL
const { data: department } = api.department.getById.useQuery(Number(id), { enabled: !!id });
const updateMutation = api.department.update.useMutation();

const [formData, setFormData] = useState({
name: department?.name || '',
status: department?.status || 'Active',
});

const handleSubmit = async (e) => {
e.preventDefault();
await updateMutation.mutateAsync({ ...formData, id: Number(id) });
router.push('/departments'); // Redirect after updating
};

return (

<div>
<h1>Edit Department</h1>
<form onSubmit={handleSubmit}>
<input
type="text"
placeholder="Department Name"
value={formData.name}
onChange={(e) => setFormData({ ...formData, name: e.target.value })}
/>
<select
value={formData.status}
onChange={(e) => setFormData({ ...formData, status: e.target.value })} >
<option value="Active">Active</option>
<option value="Inactive">Inactive</option>
</select>
<button type="submit" className="btn">Update Department</button>
</form>
</div>
);
}

# Copy code

## Path: src/pages/departments/create.tsx

import { useRouter } from 'next/router';
import { api } from '~/trpc/react';
import { useState } from 'react';
import Button from '~/app/\_components/Button';

export default function CreateDepartment() {
const router = useRouter();
const createMutation = api.department.create.useMutation();

const [formData, setFormData] = useState({
name: '',
status: 'Active',
});

const handleSubmit = async (e) => {
e.preventDefault();
await createMutation.mutateAsync(formData);
router.push('/departments'); // Redirect after creating
};

return (

<div>
<h1>Create Department</h1>
<form onSubmit={handleSubmit}>
<input
type="text"
placeholder="Department Name"
value={formData.name}
onChange={(e) => setFormData({ ...formData, name: e.target.value })}
/>
<select
value={formData.status}
onChange={(e) => setFormData({ ...formData, status: e.target.value })} >
<option value="Active">Active</option>
<option value="Inactive">Inactive</option>
</select>
<button type="submit" className="btn">Create Department</button>
<Button type="submit">Create Employee</Button>
</form>
</div>
);
}

## 11.Login folder:

## Path src/app/login

## Copy code:

## Path src/app/login.tsx

import { signIn } from 'next-auth/react';
import React from 'react';
import { useState } from 'react';

export default function Login() {
const [loading, setLoading] = useState(false);

const handleLogin = async () => {
setLoading(true);
await signIn('supabase', { callbackUrl: 'your supabase URL code' }); // Redirect to home after login
setLoading(false);
};

return (

<div className="flex min-h-screen justify-center items-center bg-gray-100">
<div className="bg-white p-8 shadow-lg rounded-lg w-96">
<h2 className="text-2xl font-bold text-center mb-4">Login</h2>
<button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
{loading ? 'Logging in...' : 'Login with Discord'}
</button>
</div>
</div>
);
}

## Layout:

import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
title: "Create T3 App",
description: "Generated by create-t3-app",
icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
children,
}: Readonly<{ children: React.ReactNode }>) {
return (

<html lang="en" className={`${GeistSans.variable}`}>
<body>
<TRPCReactProvider>{children}</TRPCReactProvider>
</body>
</html>
);
}

## Login front page:

import { signIn } from "next-auth/react";

export default function LoginPage() {
return (

<div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
<h1 className="text-4xl font-bold mb-4">Login to the HR System</h1>
<button
onClick={() => signIn('supabase')}
className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition" >
Sign in with Supabase
</button>
</div>
);
}

## Login page design:

import Link from "next/link";

import { LatestPost } from "~/app/\_components/post";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
const hello = await api.post.hello({ text: "from tRPC" });
const session = await getServerAuthSession();

void api.post.getLatest.prefetch();

return (
<HydrateClient>

<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
<h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
</h1>
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
<Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
<h3 className="text-2xl font-bold">First Steps →</h3>
<div className="text-lg">
Just the basics - Everything you need to know to set up your
database and authentication.
</div>
</Link>
<Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
<h3 className="text-2xl font-bold">Documentation →</h3>
<div className="text-lg">
Learn more about Create T3 App, the libraries it uses, and how
to deploy it.
</div>
</Link>
</div>
<div className="flex flex-col items-center gap-2">
<p className="text-2xl text-white">
{hello ? hello.greeting : "Loading tRPC query..."}
</p>

            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>

          {session?.user && <LatestPost />}
        </div>
      </main>
    </HydrateClient>

);
}

## 12.Types page for Interfaces:

## Path src/types/interfaces.ts

export interface Employee {
id: string;
firstName: string;
lastName: string;
email: string;
telephoneNumber?: string;
manager?: {
firstName: string;
};
status?: 'Active' | 'Inactive';
}

## 13. The env.js Configuration:

## Path src/env.js

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
/\*\*

- Specify your server-side environment variables schema here. This way you can ensure the app
- isn't built with invalid env vars.
  \*/
  server: {
  DATABASE_URL: z.string().url(),
  NODE_ENV: z
  .enum(["development", "test", "production"])
  .default("development"),
  NEXTAUTH_SECRET:
  process.env.NODE_ENV === "production"
  ? z.string()
  : z.string().optional(),
  NEXTAUTH_URL: z.preprocess(
  // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
  // Since NextAuth.js automatically uses the VERCEL_URL if present.
  (str) => process.env.VERCEL_URL ?? str,
  // VERCEL_URL doesn't include `https`, so it can't be validated as a URL
  process.env.VERCEL ? z.string() : z.string().url(),
  ),
  SUPABASE_URL: z.string().url(), // Added Supabase URL
  SUPABASE_ANON_KEY: z.string(), // Added Supabase Anon Key
  },

/\*\*

- Specify your client-side environment variables schema here. This way you can ensure the app
- isn't built with invalid env vars. To expose them to the client, prefix them with
- `NEXT_PUBLIC_`.
  \*/
  client: {
  // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

/\*\*

- You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
- middlewares) or client-side so we need to destruct manually.
  \*/
  runtimeEnv: {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  SUPABASE_URL: process.env.SUPABASE_URL, // Added runtime for Supabase URL
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY, // Added runtime for Supabase Anon Key
  },

/\*\*

- Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
- useful for Docker builds.
  \*/
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

/\*\*

- Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
- `SOME_VAR=''` will throw an error.
  \*/
  emptyStringAsUndefined: true,
  });

## 14. Client for the tRPC:

## Path src/TRPC/client.ts

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "src/server/api/root";

// Create tRPC client without transformer or you could use a transformer if it will work with you code.
export const api = createTRPCReact<AppRouter>();

## 15 Authentication page:

## Path src/server/auth.ts

import { PrismaAdapter } from "@auth/prisma-adapter";
import {
getServerSession,
type DefaultSession,
type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "~/env";
import { db } from "~/server/db";

/\*\*

- Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
- object and keep type safety.
-
- @see https://next-auth.js.org/getting-started/typescript#module-augmentation
  \*/
  declare module "next-auth" {
  interface Session extends DefaultSession {
  user: {
  id: string;
  // ...other properties
  // role: UserRole;
  } & DefaultSession["user"];
  }

// interface User {
// // ...other properties
// // role: UserRole;
// }
}

/\*\*

- Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
-
- @see https://next-auth.js.org/configuration/options
  _/
  export const authOptions: NextAuthOptions = {
  callbacks: {
  session: ({ session, user }) => ({
  ...session,
  user: {
  ...session.user,
  id: user.id,
  },
  }),
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
  DiscordProvider({
  clientId: env.SUPABASE_URL,
  clientSecret: env.SUPABASE_ANON_KEY,
  }),
  /\*\*
  _ ...add more providers here. \*
  _ Most other providers require a bit more work than the Discord provider. For example, the
  _ GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
  _ model. Refer to the NextAuth.js docs for the provider you want to use. Example:
  _
  _ @see https://next-auth.js.org/providers/github
  _/
  ],
  };

/\*\*

- Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
-
- @see https://next-auth.js.org/configuration/nextjs
  \*/
  export const getServerAuthSession = () => getServerSession(authOptions);

## DB Page for the Prisma client:

## Path src/server/db.ts

import { PrismaClient } from "@prisma/client";

import { env } from "~/env";

const createPrismaClient = () =>
new PrismaClient({
log:
env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

const globalForPrisma = globalThis as unknown as {
prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

## 16. TRPC react Page:

## src/trpc/react.tsx

"use client";

import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import SuperJSON from "superjson";

import { type AppRouter } from "~/server/api/root";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
if (typeof window === "undefined") {
// Server: always make a new query client
return createQueryClient();
}
// Browser: use singleton pattern to keep the same query client
return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

/\*\*

- Inference helper for inputs.
-
- @example type HelloInput = RouterInputs['example']['hello']
  \*/
  export type RouterInputs = inferRouterInputs<AppRouter>;

/\*\*

- Inference helper for outputs.
-
- @example type HelloOutput = RouterOutputs['example']['hello']
  \*/
  export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
const queryClient = getQueryClient();

const [trpcClient] = useState(() =>
api.createClient({
links: [
loggerLink({
enabled: (op) =>
process.env.NODE_ENV === "development" ||
(op.direction === "down" && op.result instanceof Error),
}),
unstable_httpBatchStreamLink({
transformer: SuperJSON,
url: getBaseUrl() + "/api/trpc",
headers: () => {
const headers = new Headers();
headers.set("x-trpc-source", "nextjs-react");
return headers;
},
}),
],
})
);

return (
<QueryClientProvider client={queryClient}>
<api.Provider client={trpcClient} queryClient={queryClient}>
{props.children}
</api.Provider>
</QueryClientProvider>
);
}

function getBaseUrl() {
if (typeof window !== "undefined") return window.location.origin;
if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
return `http://localhost:${process.env.PORT ?? 3000}`;
}

## 17. Library for the DB and Prisma for linking the correct paths for prisma clients

## Path src/lib

## Copy code:

## db.ts

import { PrismaClient } from "@prisma/client";

import { env } from "src/env";

// const createPrismaClient = () =>
// new PrismaClient({
// log:
// env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
// });

// const globalForPrisma = globalThis as unknown as {
// prisma: ReturnType<typeof createPrismaClient> | undefined;
// };

// export const db = globalForPrisma.prisma ?? createPrismaClient();

// if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Create the Prisma Client with logging enabled in development mode
const createPrismaClient = () => new PrismaClient({
log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

// Ensure Prisma is cached globally to avoid multiple instances in development
const globalForPrisma = global as unknown as {
prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
globalForPrisma.prisma = db;
}

## prisma.ts

import { PrismaClient } from "@prisma/client";

// Declare global type to avoid unsafe assignments in development
declare global {
// Define a global variable with an explicit type
// eslint-disable-next-line no-var
var prisma: PrismaClient | undefined;
}

// Assign a type to the Prisma instance
const prisma: PrismaClient = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
global.prisma = prisma;
}

export default prisma;

## Buttons:

## Path src/components/Buttons.tsx

import React from 'react';

interface ButtonProps {
text: string;
onClick: () => void;
type?: "button" | "submit" | "reset";
className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, type = "button", className }) => {
return (
<button
type={type}
onClick={onClick}
className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`} >
{text}
</button>
);
};

export default Button;
