// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod'; // Para validação
import bcrypt from 'bcrypt'; // Para comparação de senhas
import postgres from 'postgres'; // Para conexão com o banco de dados

// Importe o tipo User (se ele estiver em '@/app/lib/definitions')
import type { User } from '@/app/lib/definitions'; 

// Importe authConfig se você decidir mantê-lo em um arquivo separado
import { authConfig } from '@/auth.config'; // Verifique o caminho real para auth.config.ts


// Função para buscar usuário (movida de auth.ts se ela não for usada em outro lugar)
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

// Configuração principal do NextAuth.js
const handler = NextAuth({
  // Use authConfig se o arquivo auth.config.ts for mantido e importado
  ...authConfig, 
  // Ou coloque o conteúdo de authConfig diretamente aqui:
  // pages: {
  //   signIn: '/login',
  // },
  // authorized({ auth, request: { nextUrl } }) {
  //   const isLoggedIn = !!auth?.user;
  //   const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
  //   if (isOnDashboard) {
  //     if (isLoggedIn) return true;
  //     return false;
  //   } else if (isLoggedIn) {
  //     return Response.redirect(new URL('/dashboard', nextUrl));
  //   }
  //   return true;
  // },
  // callbacks: {}, // Se tiver callbacks, coloque aqui

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

// EXPORTAÇÃO CORRETA para o App Router:
// As funções GET e POST são acessadas diretamente do 'handler' retornado por NextAuth
export const { GET, POST } = handler;