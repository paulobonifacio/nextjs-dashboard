// app/api/auth/[...nextauth]/route.ts (Versão Com Caminho Relativo Explícito)

// IMPORTANTE: Ajuste este caminho relativo com base na localização exata do seu auth.ts
// Se auth.ts está na raiz do projeto, este caminho DEVE funcionar:
import { handlers } from '../../../../auth'; // Caminho relativo para auth.ts na raiz

// Exporta as funções GET e POST que estão DENTRO do objeto handlers.
export const GET = handlers.GET;
export const POST = handlers.POST;