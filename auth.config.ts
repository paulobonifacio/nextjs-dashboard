// auth.config.ts
import type { AuthConfig } from '@auth/core';
// Adicione estas novas importações de tipos
import type { Auth, RequestInternal } from '@auth/core/types'; 

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  // Agora especificamos os tipos para 'auth' e 'request'
  authorized({ auth, request }: { auth: Auth | null; request: RequestInternal }) {
    const isLoggedIn = !!auth?.user;
    const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');

    if (isOnDashboard) {
      if (isLoggedIn) return true;
      return false; // Redireciona usuários não autenticados para a página de login
    } else if (isLoggedIn) {
      return Response.redirect(new URL('/dashboard', request.nextUrl)); // Use request.nextUrl aqui
    }
    return true;
  },
  callbacks: {
    // Mantenha este objeto callbacks mesmo que vazio, se não estiver usando outros
  },
  providers: [],
};