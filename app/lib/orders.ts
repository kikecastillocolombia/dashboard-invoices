import { sql } from '@vercel/postgres';
import {
  Order,
  Account,
} from './definitions'; // Asegúrate de que este archivo incluya tus tipos

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

export async function createOrder(order: Omit<Order, 'id'>) {
    try {
      const { user_id, table_id, product_ids, status, date } = order;
  
      // Convertir product_ids a formato JSON
      const result = await sql<Order>`
        INSERT INTO orders (user_id, table_id, product_ids, status, date)
        VALUES (${user_id}, ${table_id}, ${JSON.stringify(product_ids)}, ${status}, ${date})
        RETURNING *
      `;
      return result.rows[0]; // Retorna el nuevo pedido creado
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to create order.');
    }
  }
  
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
