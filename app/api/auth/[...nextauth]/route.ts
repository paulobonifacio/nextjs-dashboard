// app/api/auth/[...nextauth]/route.ts (VERSÃO FINAL E CORRETA)

// Importa o objeto 'handlers' do seu arquivo auth.ts.
// O caminho '@/auth' deve funcionar se o seu tsconfig.json estiver configurado para o alias.
// Caso contrário, use o caminho relativo correto, por exemplo:
// import { handlers } from '../../../../auth'; // Se auth.ts estiver na raiz do projeto
import { handlers } from '@/auth'; 

// Exporta as funções GET e POST que estão DENTRO do objeto handlers.
// O Next.js espera que estas sejam as exportações nomeadas da rota.
export const GET = handlers.GET;
export const POST = handlers.POST;

// Você pode adicionar outros métodos se o NextAuth.js os expuser e você precisar:
// export const PUT = handlers.PUT;
// export const DELETE = handlers.DELETE;
// export const OPTIONS = handlers.OPTIONS;