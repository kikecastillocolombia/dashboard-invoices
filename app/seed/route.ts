import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { users, tables, products, orders, accounts } from '../lib/placeholder-data';

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(255) NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, password, role)
        VALUES (${user.id}, ${user.name}, ${hashedPassword}, ${user.role})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

async function seedTables() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS tables (
      id VARCHAR(255) PRIMARY KEY,
      number INT NOT NULL,
      seats INT NOT NULL,
      status VARCHAR(20) NOT NULL CHECK (status IN ('Disponible', 'Ocupada', 'Reservada'))  
    );
  `;

  const insertedTables = await Promise.all(
    tables.map(
      (table) => client.sql`
        INSERT INTO tables (id, number, seats, status)  
        VALUES (${table.id}, ${table.number}, ${table.seats}, ${table.status}) 
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedTables;
}


async function seedProducts() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price INT NOT NULL,
      image_url VARCHAR(255)
    );
  `;

  const insertedProducts = await Promise.all(
    products.map(
      (product) => client.sql`
        INSERT INTO products (id, name, description, price, image_url)
        VALUES (${product.id}, ${product.name}, ${product.description}, ${product.price}, ${product.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedProducts;
}

async function seedOrders() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      table_id VARCHAR(255) NOT NULL,
      product_ids VARCHAR(255)[] NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedOrders = await Promise.all(
    orders.map(
      (order) => client.sql`
        INSERT INTO orders (id, user_id, table_id, product_ids, status, date)
        VALUES (${order.id}, ${order.user_id}, ${order.table_id}, 
                ARRAY[${order.product_ids.map(id => `'${id}'`).join(', ')}], 
                ${order.status}, ${order.date}) 
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedOrders;
}



async function seedAccounts() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS accounts (
      id VARCHAR(255) PRIMARY KEY,
      order_id VARCHAR(255) NOT NULL,
      total INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedAccounts = await Promise.all(
    accounts.map(
      (account) => client.sql`
        INSERT INTO accounts (id, order_id, total, status, date)
        VALUES (${account.id}, ${account.order_id}, ${account.total}, ${account.status}, ${account.date})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedAccounts;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedTables();
    await seedProducts();
    await seedOrders();
    await seedAccounts();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    const message = (error instanceof Error) ? error.message : 'Error desconocido';
    return Response.json({ error: message }, { status: 500 });
  }
}
