// auth.config.ts
import type { AuthConfig } from '@auth/core';
// REMOVA: import type { Auth, RequestInternal } from '@auth/core/types';

// Adicione as importações de tipo necessárias de 'next-auth' e 'next/server'
import type { Session } from 'next-auth'; // O tipo para 'auth'
import type { NextRequest } from 'next/server'; // O tipo para 'request'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  // Agora especificamos os tipos para 'auth' (Session) e 'request' (NextRequest)
  // Certifique-se de que a desestruturação do 'request' inclua 'nextUrl'
  authorized({ auth, request }: { auth: Session | null; request: NextRequest }) {
    const isLoggedIn = !!auth?.user;
    const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');

    if (isOnDashboard) {
      if (isLoggedIn) return true;
      return false; // Redireciona usuários não autenticados para a página de login
    } else if (isLoggedIn) {
      return Response.redirect(new URL('/dashboard', request.nextUrl));
    }
    return true;
  },
  callbacks: {
    // Mantenha este objeto callbacks mesmo que vazio, se não estiver usando outros
  },
  providers: [],
};