// app/lib/auth-server-actions.ts
// Este arquivo re-exporta as funções de autenticação do NextAuth.js
// que são seguras para serem usadas em Server Actions.

// Importa as funções signIn e signOut do seu arquivo central auth.ts.
// O caminho '@/auth' deve resolver para o seu auth.ts na raiz do projeto.
import { signIn as originalSignIn, signOut as originalSignOut } from '@/auth';

// Re-exporta as funções com os nomes que serão usados nos Server Actions.
export const signIn = originalSignIn;
export const signOut = originalSignOut;