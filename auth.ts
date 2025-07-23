// auth.ts (NOVO CONTEÚDO - Simplificado para re-exportar de route.ts)

// Importa as funções 'auth', 'signIn' e 'signOut' diretamente do seu arquivo route.ts.
// O caminho './app/api/auth/[...nextauth]/route' é o caminho relativo de auth.ts (na raiz)
// até o seu route.ts.
import { auth, signIn, signOut } from './app/api/auth/[...nextauth]/route';

// Re-exporta as funções para que outros arquivos no seu projeto possam usá-las.
export { auth, signIn, signOut };