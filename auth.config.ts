// auth.config.ts
import type { AuthConfig } from '@auth/core'; // Essa importação já está correta!

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  // A função authorized foi movida para fora de 'callbacks'
  authorized({ auth, request: { nextUrl } }) {
    const isLoggedIn = !!auth?.user;
    const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

    if (isOnDashboard) {
      if (isLoggedIn) return true;
      return false; // Redireciona usuários não autenticados para a página de login
    } else if (isLoggedIn) {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }
    return true;
  },
  // O objeto callbacks fica vazio se você não tiver outras funções como signIn, redirect, etc.
  callbacks: {
    // Você pode adicionar outras funções de callback aqui se necessário (ex: session, jwt)
  },
  providers: [], // Mantenha esta linha
} satisfies AuthConfig;