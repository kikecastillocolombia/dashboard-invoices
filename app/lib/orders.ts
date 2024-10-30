"use server"
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import {
  Order,
  Account,
} from './definitions'; // Asegúrate de que este archivo incluya tus tipos

// Define tu esquema de validación

const OrderSchema = z.object({
  user_id: z.string().uuid(),
  table_id: z.string(),
  product_ids: z.array(z.object({
    id: z.string().uuid(), // Asegúrate de que aquí sea uuid
    quantity: z.number().nonnegative(),
  })),
  status: z.enum(['pending', 'completed']),
  date: z.string(),
});

export async function createOrder(orderData: unknown) {
  const validatedFields = OrderSchema.safeParse(orderData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Order.',
    };
  }

  const { user_id, table_id, product_ids, status, date } = validatedFields.data;

  // Convierte los IDs de los productos a un arreglo de UUID
  const productIdsArray = product_ids.map(product => product.id);

  // Crear placeholders para cada ID de producto
  const placeholders = productIdsArray.map((_, index) => `$${index + 3}`).join(', ');

  try {
    const query = `
      INSERT INTO orders (user_id, table_id, product_ids, status, date)
      VALUES (
        $1, 
        $2, 
        ARRAY[${placeholders}]::uuid[], 
        $${productIdsArray.length + 3}, 
        $${productIdsArray.length + 4}
      )
      RETURNING *
    `;

    // Ejecuta la consulta, asegurando que los IDs y el tipo de `date` son correctos
    const result = await sql.query(query, [
      user_id,
      table_id,
      ...productIdsArray, // Incluye los IDs como UUIDs
      status,
      date // Asegura que este valor sea un `timestamp`
    ]);

    return {
      message: 'Order created successfully.',
      order: result.rows[0],
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Order.',
    };
  }
}



export async function fetchOrders() {
  try {
    const data = await sql<Order>`SELECT * FROM orders ORDER BY date DESC`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch orders.');
  }
}

export async function fetchOrderById(id: string) {
  try {
    const data = await sql<Order>`
      SELECT * FROM orders WHERE id = ${id}
    `;
    return data.rows[0]; // Retorna el primer pedido encontrado
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch order by ID.');
  }
}


export type State = {
  message: string | null;
  errors: {
    table_id?: string[];
    product_ids?: string[];
    quantity?: string[];
  };
};

  
  // Función para actualizar un pedido
  export async function updateOrder(id: string, updatedFields: Partial<Omit<Order, 'id'>>) {
    try {
      // Asegúrate de que updatedFields no esté vacío
      if (Object.keys(updatedFields).length === 0) {
        throw new Error('No fields to update.');
      }
  
      // Construir la consulta de actualización
      const setFields = Object.entries(updatedFields)
        .map(([key, value]) => {
          // Escapar las comillas en los valores de tipo string
          if (typeof value === 'string') {
            return `${key} = '${value.replace(/'/g, "''")}'`; // Escapar comillas simples
          } else if (Array.isArray(value)) {
            // Si value es un array, convertir a formato JSON
            return `${key} = '${JSON.stringify(value).replace(/'/g, "''")}'`;
          }
          return `${key} = ${value}`; // Para otros tipos (números, booleanos)
        })
        .join(', ');
  
      const result = await sql<Order>`
        UPDATE orders
        SET ${setFields}  -- Consulta construida manualmente
        WHERE id = ${id}
        RETURNING *
      `;
      
      return result.rows[0]; // Retorna el pedido actualizado
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to update order.');
    }
  }
  

export async function deleteOrder(id: string) {
  try {
    await sql`DELETE FROM orders WHERE id = ${id}`;
    return { message: 'Order deleted successfully.' };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete order.');
  }
}

export async function fetchAccounts() {
  try {
    const data = await sql<Account>`SELECT * FROM accounts ORDER BY date DESC`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch accounts.');
  }
}

export async function createAccount(account: Omit<Account, 'id'>) {
  try {
    const { order_id, total, status, date } = account;
    const result = await sql<Account>`
      INSERT INTO accounts (order_id, total, status, date)
      VALUES (${order_id}, ${total}, ${status}, ${date})
      RETURNING *
    `;
    return result.rows[0]; // Retorna la nueva cuenta creada
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create account.');
  }
}
 