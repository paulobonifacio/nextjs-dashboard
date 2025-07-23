// app/api/auth/[...nextauth]/route.ts

// Importa os handlers que você exportou do seu arquivo auth.ts
// O '@' aqui geralmente mapeia para a raiz do seu projeto ou a pasta 'src' no tsconfig.json.
// Se o seu arquivo 'auth.ts' está na raiz do seu projeto (ao lado de 'app'), este caminho está correto.
import { handlers } from '@/auth'; 

// Exporta os métodos GET e POST. O Next.js usará isso para lidar com as requisições de autenticação.
export const { GET, POST } = handlers;