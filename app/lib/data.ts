import { QueryResultRow, sql } from '@vercel/postgres';
import { User, Table, Product, Order, Account } from './definitions';

export async function fetchCardData() {
  try {
    // Consultas SQL adaptadas a tus entidades
    const orderCountPromise = sql`SELECT COUNT(*) FROM orders`; // Pedidos totales
    const userCountPromise = sql`SELECT COUNT(*) FROM users`; // Usuarios totales
    const accountStatusPromise = sql`
      SELECT
        SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END) AS "paid",
        SUM(CASE WHEN status = 'pending' THEN total ELSE 0 END) AS "pending"
      FROM accounts
    `; // Cuentas pagadas y pendientes
    const tableCountPromise = sql`SELECT COUNT(*) FROM tables`; // Mesas totales
    const productCountPromise = sql`SELECT COUNT(*) FROM products`; // Productos totales
    const accountCountPromise = sql`SELECT COUNT(*) FROM accounts`; // Cuentas totales

    // Ejecutamos todas las consultas en paralelo
    const [
      orderCountResult,
      userCountResult,
      accountStatusResult,
      tableCountResult,
      productCountResult,
      accountCountResult,
    ] = await Promise.all([
      orderCountPromise,
      userCountPromise,
      accountStatusPromise,
      tableCountPromise,
      productCountPromise,
      accountCountPromise,
    ]);

    // Extraemos los resultados de las consultas usando `rows`
    const numberOfOrders = orderCountResult.rows[0]?.count || 0;
    const numberOfUsers = userCountResult.rows[0]?.count || 0;
    const totalPaidAccounts = accountStatusResult.rows[0]?.paid || 0;
    const totalPendingAccounts = accountStatusResult.rows[0]?.pending || 0;
    const totalTables = tableCountResult.rows[0]?.count || 0;
    const totalProducts = productCountResult.rows[0]?.count || 0;
    const totalAccounts = accountCountResult.rows[0]?.count || 0;

    return {
      numberOfOrders,
      numberOfUsers,
      totalPaidAccounts,
      totalPendingAccounts,
      totalTables,
      totalProducts,
      totalAccounts,
    };
  } catch (error) {
    console.error('Error fetching card data:', error);
    throw error;
  }
}

export async function fetchCardDataTable() {
  try {
    // Consulta SQL para obtener los datos de las mesas
    const tableDataResult = await sql`
      SELECT id, number, seats, status FROM tables
    `;

    // Accedemos a `rows` para obtener los datos y mapearlos al tipo `Table`
    const tables: Table[] = tableDataResult.rows.map((row: QueryResultRow) => ({
      id: row.id,
      number: row.number,
      seats: row.seats,
      status: row.status,
    }));

    // Retornamos el total de mesas y los datos de las mesas
    return {
      totalTables: tables.length,
      tables, // Devuelve los datos de las mesas
    };
  } catch (error) {
    console.error("Error fetching table data:", error);
    throw error;
  }
}

export async function fetchTables() {
  try {
    const data = await sql<Table>`SELECT id, number, seats, status FROM tables ORDER BY number ASC`;
    return data.rows; // Devuelve la lista de mesas
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tables.');
  }
}

export async function fetchCardDataUsers() {
  try {
    const userDataResult = await sql`
      SELECT id, name, role FROM users ORDER BY name ASC
    `;

    const users = userDataResult.rows.map((row: QueryResultRow) => ({
      id: row.id,
      name: row.name,
      role: row.role,
    }));

    return {
      users,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export async function fetchUsers() {
  try {
    const data = await sql<User>`SELECT id, name, role FROM users ORDER BY name ASC`;
    return data.rows; // Devuelve la lista de usuarios
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}

// En un archivo de servicios o utils
export async function fetchUserById(userId: string) {
  try {
    const data = await sql<User>`SELECT * FROM users WHERE id = ${userId}`;
    return data.rows[0]; // Retorna el primer usuario encontrado
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user by ID.');
  }
}


export async function fetchProducts() {
  try {
    const data = await sql<Product>`SELECT id, name FROM products ORDER BY name ASC`;
    return data.rows; // Devuelve la lista de productos
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    const data = await sql`
      SELECT 
        orders.id,
        orders.status,
        orders.date,
        orders.user_id,
        orders.table_id,
        tables.number AS table_number,
        array_agg(products.name) AS product_names
      FROM orders
      JOIN tables ON orders.table_id = tables.id
      JOIN LATERAL unnest(orders.product_ids) AS product_id ON true
      JOIN products ON products.id = product_id
      GROUP BY orders.id, tables.number
      ORDER BY orders.date DESC;
    `;

    // Mapeo de filas a la estructura de Order
    return data.rows.map((row: QueryResultRow) => ({
      id: row.id,
      status: row.status,
      date: row.date,
      user_id: row.user_id,
      table_id: row.table_id,
      table_number: row.table_number, // Asignando el número de mesa
      product_names: row.product_names || [],
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch orders.');
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

const ITEMS_PER_PAGE = 10;
export async function fetchFilteredProducts(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<Product>`
      SELECT * FROM products
      WHERE name ILIKE ${`%${query}%`} OR description ILIKE ${`%${query}%`}
      ORDER BY name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
    
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered products.');
  }
}

export async function fetchTotalPagesForProducts(query: string) {
  try {
    const count = await sql`SELECT COUNT(*) FROM products WHERE name ILIKE ${`%${query}%`} OR description ILIKE ${`%${query}%`}`;
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of pages for products.');
  }
}

export async function fetchOrderById(id: string) {
  try {
    const data = await sql<Order>`
      SELECT * FROM orders WHERE id = ${id}`;
    
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch order by ID.');
  }
}

export async function fetchAccountById(id: string) {
  try {
    const data = await sql<Account>`
      SELECT * FROM accounts WHERE id = ${id}`;
    
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch account by ID.');
  }
}
