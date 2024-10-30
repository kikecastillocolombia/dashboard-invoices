'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

// Define the schema for product validation
const ProductSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required.' }),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .gt(0, { message: 'Price must be greater than $0.' }),
});

// Define the type for the state
export type State = {
  errors?: {
    name?: string[];
    price?: string[];
  };
  message?: string | null;
};

// Cambia la función createProduct para que acepte el estado y los datos del formulario
export async function createProduct(state: State, formData: FormData) {
  const validatedFields = ProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
  });

  // Verifica los datos validados
  console.log('Validated Fields:', validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product.',
    };
  }

  const { name, description, price } = validatedFields.data;

  const newId = uuidv4();

  try {
    await sql`
      INSERT INTO products (id, name, description, price)
      VALUES (${newId}, ${name}, ${description || null}, ${price})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Product.',
    };
  }

  revalidatePath('/dashboard/products');
  return { message: 'Product created successfully.' };
}



export async function deleteProduct(id: string) {
    try {
      await sql`DELETE FROM products WHERE id = ${id}`; // Cambia 'products' por el nombre correcto de tu tabla
      revalidatePath('/dashboard/products'); // Cambia la ruta según corresponda
      return { message: 'Deleted Product.' };
    } catch {
      return { message: 'Database Error: Failed to Delete Product.' };
    }
  }