import { fetchUsers, fetchTables, fetchProducts } from '@/app/lib/data';
import Form from '@/app/ui/orders/Form';

export default async function CreateOrderPage() {
  const users = await fetchUsers();
  const tables = await fetchTables();
  const products = await fetchProducts();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Create Order</h1>
      <Form users={users} tables={tables} products={products} />
    </div>
  );
}
