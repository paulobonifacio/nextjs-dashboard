// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // Redireciona para sua página de login personalizada
  },
  callbacks: {
    // A função `authorized` é crucial para o middleware.
    // Ela decide se o usuário está autorizado a acessar uma rota protegida.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user; // Verifica se há um usuário logado
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard'); // Verifica se está no dashboard

      if (isOnDashboard) {
        if (isLoggedIn) return true; // Se logado e no dashboard, permite acesso
        return false; // Se não logado e no dashboard, redireciona para login
      } else if (isLoggedIn) {
        // Se logado e não no dashboard (ex: na página de login),
        // redireciona para o dashboard para evitar que o usuário logado veja a página de login.
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true; // Permite acesso a rotas públicas (não protegidas)
    },
    // Outros callbacks (jwt, session) podem ser definidos aqui ou em auth.ts se necessário.
  },
  providers: [], // IMPORTANT: Providers should be defined in auth.ts, not here.
};