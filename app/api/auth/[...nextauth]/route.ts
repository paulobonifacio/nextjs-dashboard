// app/api/auth/[...nextauth]/route.ts (CÓDIGO FINAL E CORRIGIDO PARA ROTAS NEXTAUTH)

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import type { User } from '@/app/lib/definitions'; // Ajuste o caminho se necessário
import { authConfig } from '@/auth.config'; // Ajuste o caminho se necessário

// Conexão com o banco de dados
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Função para buscar usuário no banco de dados
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

// Inicializa o NextAuth.js.
// As configurações aqui são específicas para a rota da API de autenticação.
// É essencial que NextAuth() seja chamado e seu resultado seja exportado corretamente.
const handler = NextAuth({
  ...authConfig, // Inclui as configurações base do seu auth.config.ts
  providers: [
    Credentials({
      // Define o provedor de credenciais (email/senha)
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Valida as credenciais com Zod
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email); // Busca o usuário no DB
          if (!user) return null; // Se o usuário não existe, retorna null
          // Compara a senha fornecida com a senha hash do DB
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user; // Se as senhas combinam, retorna o usuário
        }
        console.log('Invalid credentials'); // Log para credenciais inválidas
        return null; // Retorna null se as credenciais forem inválidas
      },
    }),
  ],
  // Você não precisa de callbacks adicionais aqui se já estão em auth.config.ts
});

// ESSENCIAL: Exporta os handlers GET e POST do NextAuth para o Next.js App Router.
// O Next.js espera que você exporte explicitamente os métodos HTTP.
export { handler as GET, handler as POST };