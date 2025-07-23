// app/api/auth/[...nextauth]/route.ts (NOVO CONTEÚDO - Simplificado)

// Importa apenas os handlers do seu arquivo auth.ts.
// O caminho '@/auth' deve funcionar se o seu tsconfig.json estiver configurado para o alias.
// Caso contrário, use o caminho relativo correto, por exemplo:
// import { handlers } from '../../../../auth'; // Se auth.ts estiver na raiz do projeto
import { handlers } from '@/auth'; 

// Exporta GET e POST dos handlers. Isso é o que o Next.js espera para a rota API.
export const { GET, POST } = handlers;