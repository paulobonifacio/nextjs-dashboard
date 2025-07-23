// auth.ts (VERSÃO FINAL E CORRIGIDA)
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config'; // Importa a configuração base
import { z } from 'zod'; // Para validação de dados
import bcrypt from 'bcrypt'; // Para comparação de senhas
import postgres from 'postgres'; // Para interação com o banco de dados
import type { User } from '@/app/lib/definitions'; // Tipo de usuário

// Conexão com o banco de dados (pode ser aqui ou em um arquivo db.ts separado)
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

// Inicializa o NextAuth.js com a configuração e os provedores.
// EXPORTAÇÃO CRUCIAL: `handlers`, `auth`, `signIn`, `signOut`.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, // Espalha as configurações base de auth.config.ts
  providers: [
    // Define o provedor de credenciais (email/senha)
    Credentials({
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
  // Outras configurações como session, jwt, etc., podem ser adicionadas aqui ou em auth.config.ts
});