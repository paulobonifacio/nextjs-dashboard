// app/api/auth/[...nextauth]/route.ts (VERSÃO FINAL E CORRIGIDA DEFINITIVAMENTE)

// Importa o objeto 'handlers' do seu arquivo auth.ts principal.
// O objeto 'handlers' contém as funções GET e POST para a rota API do NextAuth.js.
import { handlers } from '@/auth';

// Desestrutura e exporta as funções GET e POST do objeto 'handlers'.
// Esta é a forma correta de configurar a rota API para o NextAuth.js no App Router,
// conforme as exportações de seu auth.ts.
export const { GET, POST } = handlers;