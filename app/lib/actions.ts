// app/lib/actions.ts (VERSÃO FINAL E CORRIGIDA - SEM FUNÇÃO AUTHENTICATE)
'use server'; // Indica que este é um Server Action

import { z } from 'zod'; // Para validação de dados
import postgres from 'postgres'; // Para interação com o banco de dados PostgreSQL
import { revalidatePath } from 'next/cache'; // Para revalidar o cache de rotas no Next.js
import { redirect } from 'next/navigation'; // Para redirecionamento de rotas

// Não precisamos de imports relacionados à autenticação aqui, pois a lógica foi movida.

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Define o tipo para o estado da Server Action, usado para mensagens de erro
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Define o schema de validação para o formulário de fatura
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }), // Garante que o valor seja maior que 0
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
 
// Schema para criação de fatura (omitindo id e data, que são gerados automaticamente)
const CreateInvoice = FormSchema.omit({ id: true, date: true });

/**
 * Cria uma nova fatura no banco de dados.
 * @param prevState O estado anterior da Server Action.
 * @param formData Os dados do formulário enviados.
 * @returns Um objeto com erros de validação ou mensagem de sucesso.
 */
export async function createInvoice(prevState: State, formData: FormData) {
  // Valida os campos do formulário usando o schema
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // Se a validação falhar, retorna os erros
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Extrai os dados validados
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100; // Converte o valor para centavos
  const date = new Date().toISOString().split('T')[0]; // Obtém a data atual

  // Tenta inserir a nova fatura no banco de dados
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // Em caso de erro no banco de dados, loga o erro e retorna uma mensagem
    console.error('Database Error: Failed to Create Invoice.', error);
    return { message: 'Database Error: Failed to Create Invoice.' };
  }
 
  // Revalida o cache da rota de faturas e redireciona
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Schema para atualização de fatura (omitindo id e data)
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

/**
 * Atualiza uma fatura existente no banco de dados.
 * @param id O ID da fatura a ser atualizada.
 * @param prevState O estado anterior da Server Action.
 * @param formData Os dados do formulário enviados.
 * @returns Um objeto com erros de validação ou mensagem de sucesso.
 */
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  // Valida os campos do formulário
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // Se a validação falhar, retorna os erros
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  // Extrai os dados validados
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100; // Converte o valor para centavos
 
  // Tenta atualizar a fatura no banco de dados
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    // Em caso de erro no banco de dados, retorna uma mensagem
    console.error('Database Error: Failed to Update Invoice.', error);
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/**
 * Exclui uma fatura do banco de dados.
 * @param id O ID da fatura a ser excluída.
 */
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices'); // Revalida o cache após a exclusão
  } catch (error) {
    console.error('Failed to delete invoice:', error);
    throw new Error('Failed to delete invoice: ' + (error as Error).message);
  }
}