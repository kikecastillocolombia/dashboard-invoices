// app/lib/products.ts
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

const ProductSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser un número positivo."),
});

export type State = {
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
  };
  message?: string | null;
};

export async function createProduct(prevState: State, formData: FormData) {
  // Validar el formulario
  const parsed = ProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: Number(formData.get('price')),
  });

  if (!parsed.success) {
    return {
      ...prevState,
      errors: parsed.error.flatten().fieldErrors,
      message: 'Errores en el formulario.',
    };
  }

  const { name, description, price } = parsed.data;

  console.log('Datos a insertar:', { name, description, price }); // Verificar los datos

  // Insertar el producto en la base de datos
  try {
    await sql`
      INSERT INTO products (name, description, price)
      VALUES (${name}, ${description}, ${price})
    `;
    return {
      ...prevState,
      message: 'Producto creado con éxito.',
      errors: {},
    };
  } catch (error) {
    console.error('Error al insertar en la base de datos:', error); // Mostrar el error en la consola
    return {
      ...prevState,
      message: 'Error al crear el producto: ' + (error instanceof Error ? error.message : error),
      errors: {},
    };
  }
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