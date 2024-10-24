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








export async function fetchUsers() {
  try {
    const data = await sql<User>`SELECT * FROM users ORDER BY name ASC`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}

export async function fetchTables() {
  try {
    const data = await sql<Table>`SELECT * FROM tables ORDER BY number ASC`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tables.');
  }
}

export async function fetchProducts() {
  try {
    const data = await sql<Product>`SELECT * FROM products ORDER BY name ASC`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
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
