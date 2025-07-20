// auth.config.ts
import type { AuthConfig } from '@auth/core'; // MANTENHA esta importação

export const authConfig = {
  pages: {
    signIn: '/login',
  },
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
  callbacks: {
    // MANTENHA este objeto callbacks mesmo que vazio, se não estiver usando outros
  },
  providers: [],
}; // <-- FICA ASSIM, SEM 'satisfies AuthConfig' no final