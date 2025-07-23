// app/ui/login-form.tsx (VERSÃO FINAL E CORRIGIDA)
'use client'; // ESSENCIAL: Este componente é um Client Component

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useFormStatus } from 'react-dom'; // Importa useFormStatus para o botão
import { useState } from 'react'; // Para gerenciar o estado local de erro

// IMPORTANTE: Importa signIn e AuthError do pacote cliente-side do NextAuth.js
import { signIn } from 'next-auth/react';
import { AuthError } from '@auth/core/errors';


export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  // useFormStatus é usado para mostrar o estado de 'pending' do formulário
  // (útil se você tivesse uma Server Action aqui, mas manteremos para compatibilidade)
  const { pending } = useFormStatus(); 

  // Função para lidar com a submissão do formulário
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)

    setErrorMessage(undefined); // Limpa mensagens de erro anteriores

    const formData = new FormData(event.currentTarget); // Obtém os dados do formulário
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Chama a função signIn do next-auth/react diretamente.
      // Esta função enviará uma requisição POST para /api/auth/callback/credentials
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // Importante: desabilita o redirecionamento automático do NextAuth.js
        // callbackUrl: '/dashboard', // Você pode definir uma URL de callback aqui, mas o redirecionamento manual é mais flexível
      });

      if (result?.error) {
        // Se houver um erro retornado pelo signIn (ex: credenciais inválidas)
        if (result.error === 'CredentialsSignin') {
          setErrorMessage('Invalid credentials.');
        } else {
          setErrorMessage('Something went wrong: ' + result.error);
        }
      } else if (result?.ok) {
        // Se o login for bem-sucedido, redireciona manualmente para o dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      // Captura erros que podem ser lançados (ex: problemas de rede, erros AuthError)
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            setErrorMessage('Invalid credentials.');
            break;
          default:
            setErrorMessage('Something went wrong.');
        }
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
      console.error('Login error:', error);
    }
  };

  return (
    // O formulário usa onSubmit para chamar handleSubmit
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl">
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email" // Mantenha o atributo 'name' para que FormData possa capturar o valor
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password" // Mantenha o atributo 'name' para que FormData possa capturar o valor
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <LoginButton />
        {/* Adiciona o display de erro usando o estado local */}
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

// Componente do botão de login (pode permanecer separado ou ser embutido)
function LoginButton() {
  const { pending } = useFormStatus(); // Obtém o estado de 'pending' do formulário

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}