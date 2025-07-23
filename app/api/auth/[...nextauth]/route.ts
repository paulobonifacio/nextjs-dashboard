// app/api/auth/[...nextauth]/route.ts (VERSÃO FINAL E CORRIGIDA)

// Importa os handlers (GET, POST) do seu arquivo auth.ts principal.
// Esta é a forma correta de configurar a rota API para o NextAuth.js no App Router.
export { GET, POST } from '@/auth';