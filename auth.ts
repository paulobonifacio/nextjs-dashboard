// auth.ts (NOVA VERSÃO - Removido 'handlers' da exportação)

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config'; // O auth.config.ts é essencial aqui
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { AuthError } from '@auth/core/errors'; 

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

// AQUI é a ÚNICA inicialização do NextAuth.js para 'auth', 'signIn', 'signOut'
// REMOVIDO 'handlers' da desestruturação aqui
export const { auth, signIn, signOut } = NextAuth({ 
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});

// A função 'authenticate' permanece aqui se ela estiver sendo usada
/*
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
*/