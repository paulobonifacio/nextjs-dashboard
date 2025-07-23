// auth.config.ts (VERSÃO FINAL E ABSOLUTAMENTE CORRIGIDA PARA TIPAGEM NO NEXTAUTH v4/v5+)
// Esta é a forma mais robusta de importar o tipo NextAuthConfig,
// compatível com diferentes versões e comportamentos de empacotamento.
import NextAuthConfig from 'next-auth/next'; // <-- CORREÇÃO AQUI! Removido 'type' e chaves '{}'

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
  providers: [],
};