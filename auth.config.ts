// auth.config.ts
import type { AuthConfig } from '@auth/core'; // <-- ALTERAÇÃO AQUI: Importa AuthConfig de @auth/core

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Mantenha esta linha se estiver usando um array vazio para provedores
} satisfies AuthConfig; // <-- ALTERAÇÃO AQUI: Garante que o objeto satisfaça o tipo AuthConfig