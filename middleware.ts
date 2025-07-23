// middleware.ts
import { withAuth } from 'next-auth/middleware';

// O 'withAuth' é um HOC (Higher-Order Component) que envolve seu middleware.
// Ele injeta a sessão do usuário no objeto 'req.nextauth.token'
// e lida com redirecionamentos para a página de login se o usuário não estiver autenticado.
export default withAuth(
  // Esta função `middleware` será executada APÓS a verificação de autenticação do `withAuth`.
  function middleware(request) {
    // Você pode adicionar lógica adicional aqui se precisar,
    // por exemplo, verificar permissões baseadas em `request.nextauth.token`.
    // console.log("Middleware request:", request.nextUrl.pathname, request.nextauth.token);
  },
  {
    // O `callbacks.authorized` é a parte crucial que determina se o usuário está autorizado.
    // Ele é executado no Edge Runtime e verifica a existência de um token de sessão.
    callbacks: {
      authorized: ({ token }) => {
        // Se houver um token, o usuário está autenticado e autorizado.
        // Se não houver, o `withAuth` irá redirecionar para a página de login definida em `auth.config.ts`.
        return !!token;
      },
    },
    // Você pode adicionar uma página de login aqui se não estiver usando `authConfig.pages.signIn`
    // pages: {
    //   signIn: '/login',
    // },
  }
);

// O 'matcher' define quais rotas o middleware vai proteger.
// ATENÇÃO: A rota '/login' foi adicionada à exclusão para evitar o loop de redirecionamento.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};