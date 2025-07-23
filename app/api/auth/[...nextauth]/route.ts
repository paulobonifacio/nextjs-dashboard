// app/api/auth/[...nextauth]/route.ts (VERSÃO AUTOCONTIDA E FINAL - COM EXPORTAÇÃO CORRIGIDA)

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import type { User } from '@/app/lib/definitions'; // Ajuste o caminho se necessário
import { authConfig } from '@/auth.config'; // Ajuste o caminho se necessário

// Mantenha as funções de banco de dados e a conexão SQL aqui, pois elas serão usadas localmente.
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

// AQUI é a inicialização do NextAuth.js ESPECÍFICA para as rotas API.
const handler = NextAuth({
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
  // Não precisamos de callbacks aqui se authConfig já os define e não há específicos para a rota
});

// EXPORTAÇÃO CORRETA para o App Router:
// As funções GET e POST são acessadas diretamente do 'handler' retornado por NextAuth
// MUDANÇA AQUI: de 'export const { GET, POST } = handler;'
export { handler as GET, handler as POST }; // PARA ESTA SINTAXE!