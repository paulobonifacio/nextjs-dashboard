// app/api/auth/[...nextauth]/route.ts (VERSÃO FINAL E MAIS SIMPLES)

// Importa o objeto 'handlers' do seu arquivo auth.ts.
// O caminho '@/auth' deve funcionar se o seu tsconfig.json estiver configurado para o alias.
// Se não, use o caminho relativo correto, por exemplo:
// import { handlers } from '../../../../auth'; // Se auth.ts estiver na raiz do projeto
import { handlers } from '@/auth'; 

// Exporta o 'handlers' como a exportação padrão da rota.
// O Next.js vai mapear os métodos HTTP (GET, POST, etc.) para as funções correspondentes dentro de 'handlers'.
export default handlers;